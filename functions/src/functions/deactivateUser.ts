import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { FcmTemplates } from '../constants/fcm-templates';
import { enviarConAutoLimpieza, DispositivoToken } from './notification-helper';

const db = admin.firestore();

export const deactivateUser = functions.https.onCall(async (request) => {
  if (!request.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'El usuario debe estar autenticado en la plataforma.');
  }
  const currentUid = request.auth.uid;
  const adminDoc = await db.collection('users').doc(currentUid).get();
  if (!adminDoc.exists) {
    throw new functions.https.HttpsError('permission-denied', 'Usuario ejecutor no válido.');
  }
  const adminData = adminDoc.data();
  if (adminData?.tipo !== 'administrador' && adminData?.tipo !== 'directiva') {
    throw new functions.https.HttpsError('permission-denied', 'No tienes los privilegios requeridos para esta acción.');
  }
  
  const { uid, motivo } = request.data;
  if (!uid) {
    throw new functions.https.HttpsError('invalid-argument', 'El UID del usuario a desactivar es obligatorio.');
  }

  try {
    // 1. Modificar el estado de autenticación y base de datos
    await admin.auth().updateUser(uid, { disabled: true });
    await db.collection('users').doc(uid).update({
      estado: 'inactive',
      deactivatedAt: FieldValue.serverTimestamp(),
      bajaRealizadaPorUid: currentUid,
      bajaRealizadaPorNombre: adminData?.nombre || 'Administrador',
      motivoBaja: motivo || ''
    });

    // 🚀 2. NOTIFICACIÓN PUSH DE AVISO DE BAJA (Adición recomendada profesional)
    try {
      const tokensSnapshot = await db.collection(`users/${uid}/tokens`).get();
      const listaDispositivos: DispositivoToken[] = [];
      
      tokensSnapshot.forEach(tokenDoc => {
        const tData = tokenDoc.data();
        if (tData.token) {
          listaDispositivos.push({
            token: tData.token,
            uidUsuario: uid,
            tokenId: tokenDoc.id
          });
        }
      });

      if (listaDispositivos.length > 0) {
        const messages = listaDispositivos.map(item => 
          FcmTemplates.getUsuarioDesactivadoTemplate(item.token, motivo || '')
        );
        await enviarConAutoLimpieza(listaDispositivos, messages);
        console.log(`✅ Push de desactivación enviado al usuario con UID: ${uid}`);
      }
    } catch (pushError) {
      console.error('⚠️ Falló el push informativo de la desactivación:', pushError);
    }

    return { success: true };
  } catch (error: any) {
    console.error('🚨 Error en deactivateUser:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});