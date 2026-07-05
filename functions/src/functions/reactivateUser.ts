import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { FcmTemplates } from '../constants/fcm-templates';
import { enviarConAutoLimpieza, DispositivoToken } from './notification-helper';

const db = admin.firestore();

export const reactivateUser = functions.https.onCall(async (request) => {
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
    throw new functions.https.HttpsError('permission-denied', 'No tienes privilegios para reactivar usuarios.');
  }
  
  const { uid } = request.data;
  if (!uid) {
    throw new functions.https.HttpsError('invalid-argument', 'El UID del usuario a reactivar es obligatorio.');
  }

  try {
    // 1. Reactivar en Authentication y Firestore
    await admin.auth().updateUser(uid, { disabled: false });
    await db.collection('users').doc(uid).update({
      estado: 'active',
      reactivatedAt: FieldValue.serverTimestamp(),
      reactivadoPorUid: currentUid,
      reactivadoPorNombre: adminData?.nombre || 'Administrador'
    });

    // 🚀 2. NOTIFICACIÓN PUSH DE BIENVENIDA DE NUEVO (Adición recomendada profesional)
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
          FcmTemplates.getUsuarioReactivadoTemplate(item.token)
        );
        await enviarConAutoLimpieza(listaDispositivos, messages);
        console.log(`✅ Push de reactivación despachado al usuario con UID: ${uid}`);
      }
    } catch (pushError) {
      console.error('⚠️ Falló el push informativo de la reactivación:', pushError);
    }

    return { success: true };
  } catch (error: any) {
    console.error('🚨 Error en reactivateUser:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});