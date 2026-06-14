import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

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
    await admin.auth().updateUser(uid, { disabled: true });
    await db.collection('users').doc(uid).update({
      estado: 'inactive',
      deactivatedAt: FieldValue.serverTimestamp(),
      bajaRealizadaPorUid: currentUid,
      bajaRealizadaPorNombre: adminData?.nombre || 'Administrador',
      motivoBaja: motivo || ''
    });
    return { success: true };
  } catch (error: any) {
    console.error('🚨 Error en deactivateUser:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});