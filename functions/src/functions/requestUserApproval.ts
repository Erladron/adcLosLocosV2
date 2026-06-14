import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { FcmTemplates } from '../constants/fcm-templates';

const db = admin.firestore();

export const requestUserApproval = functions.https.onCall(async (request) => {
  if (!request.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Operación rechazada: Requiere autenticación de usuario.');
  }
  const applicantUid = request.auth.uid;
  const { nombre, dni, telefono, profesion, direccion, croppedImage } = request.data;

  try {
    const userDoc = await db.collection('users').doc(applicantUid).get();
    if (!userDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'El perfil de usuario asociado no fue localizado en Firestore.');
    }

    await db.collection('users').doc(applicantUid).update({
      nombre: nombre || userDoc.data()?.nombre || '',
      dni: dni || userDoc.data()?.dni || '',
      telefono: telefono || userDoc.data()?.telefono || '',
      profesion: profesion || '',
      direccion: direccion || '',
      foto: croppedImage || userDoc.data()?.foto || '',
      estado: 'pending_approval',
      requestedApprovalAt: FieldValue.serverTimestamp()
    });

    const pendientesSnapshot = await db.collection('users').where('estado', '==', 'pending_approval').get();
    const totalPendientes = pendientesSnapshot.size;

    const directivosSnapshot = await db.collection('users').where('tipo', 'in', ['administrador', 'directiva']).get();
    if (directivosSnapshot.empty) {
      return { success: true, message: 'Estado guardado de forma segura. No se pudo alertar a la junta por falta de cuentas directivas.' };
    }

    const tokensDirectiva: string[] = [];
    for (const doc of directivosSnapshot.docs) {
      const tokensSnapshot = await db.collection(`users/${doc.id}/tokens`).get();
      tokensSnapshot.forEach(tokenDoc => {
        const tokenData = tokenDoc.data();
        if (tokenData.token) tokensDirectiva.push(tokenData.token);
      });
    }

    if (tokensDirectiva.length > 0) {
      const messages = tokensDirectiva.map(token => 
        FcmTemplates.getAvisoDirectivaTemplate(token, totalPendientes, applicantUid)
      );
      await admin.messaging().sendEach(messages);
      console.log(`... Alerta distribuida a la directiva. Total pendientes en cola: ${totalPendientes}`);
    } else {
      console.log('ℹ️ Los miembros de la directiva no disponen de la app nativa instalada o sincronizada actualmente.');
    }
    return { success: true, message: 'Ficha guardada y aviso enviado con éxito a los miembros de la directiva.' };
  } catch (error: any) {
    console.error('🚨 Error crítico en el proceso atómico de requestUserApproval:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});