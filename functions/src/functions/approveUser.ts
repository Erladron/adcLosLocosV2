import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { FcmTemplates } from '../constants/fcm-templates';

const db = admin.firestore();

export const approveUser = functions.https.onCall(async (request) => {
  if (!request.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'El usuario debe estar autenticado en la plataforma.');
  }
  const currentUid = request.auth?.uid || 'ID_SIMULADO_ADMIN';
  const adminDoc = await db.collection('users').doc(currentUid).get();
  const adminData = adminDoc.exists ? adminDoc.data() : null;

  const { uid } = request.data;
  if (!uid) {
    throw new functions.https.HttpsError('invalid-argument', 'El UID del socio a aprobar es requerido.');
  }
  try {
    const socioDoc = await db.collection('users').doc(uid).get();
    const socioData = socioDoc.data();
    const nombreSocio = socioData?.nombre || 'Socio';

    await db.collection('users').doc(uid).update({
      estado: 'active',
      approvedAt: FieldValue.serverTimestamp(),
      aprobadoPorUid: currentUid,
      aprobadoPorNombre: adminData?.nombre || 'Administrador'
    });

    try {
      const tokensSnapshot = await db.collection(`users/${uid}/tokens`).get();
      const tokensUsuario: string[] = [];
      tokensSnapshot.forEach(tokenDoc => {
        const tokenData = tokenDoc.data();
        if (tokenData.token) tokensUsuario.push(tokenData.token);
      });

      if (tokensUsuario.length > 0) {
        const messages = tokensUsuario.map(token => 
          FcmTemplates.getSocioAprobadoTemplate(token, nombreSocio)
        );
        await admin.messaging().sendEach(messages);
        console.log(`... Notificación push enviada con éxito al socio aprobado (UID: ${uid})`);
      } else {
        console.log(`ℹ️ El socio ${nombreSocio} no dispone de ningún token móvil en Firestore. Se omite el push.`);
      }
    } catch (pushError) {
      console.error('🚨 Alerta: El usuario fue aprobado pero falló el envío del push de FCM:', pushError);
    }
    return { success: true };
  } catch (error: any) {
    console.error('🚨 Error crítico en approveUser:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});