import { onCall, HttpsError } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { FcmTemplates } from '../constants/fcm-templates';
import { enviarConAutoLimpieza, DispositivoToken } from './notification-helper';

/** @description Instancia de acceso directo al SDK administrativo de Cloud Firestore. */
const db = admin.firestore();

/**
 * @function reactivateUser
 * @description Cloud Function v2 (Callable) responsable de reincorporar o reactivar a un usuario 
 * previamente suspendido en el sistema. Habilita de nuevo la cuenta en Firebase Authentication, 
 * muta su estado a activo en Firestore registrando la traza detallada del administrador 
 * ejecutor, y dispara una notificación push informativa de bienvenida al socio.
 * Hereda la región global 'europe-west1' configurada en el archivo de índice.
 * 
 * @param {CallableRequest<any>} request - Contexto de la petición HTTP síncrona provisto por Firebase v2.
 * @param {Object} request.data - Carga útil de datos estructurados enviada desde el front-end.
 * @param {string} request.data.uid - Identificador único de Firebase Auth del usuario que se va a reactivar.
 * @param {Object} request.auth - Contexto de autenticación del operador (administrador o junta directiva).
 * 
 * @returns {Promise<{ success: boolean }>} Retorno controlado confirmando el éxito de la restauración.
 * @throws {HttpsError} Excepciones de red y control de accesos mapeadas para su renderizado en el cliente.
 */
export const reactivateUser = onCall(async (request) => {
  // =========================================================================
  // 🔐 CONTROL DE ACCESO JERÁRQUICO (ROLES ADMINISTRATIVOS)
  // =========================================================================
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'El usuario debe estar autenticado en la plataforma.');
  }
  
  const currentUid = request.auth.uid;
  const adminDoc = await db.collection('users').doc(currentUid).get();
  if (!adminDoc.exists) {
    throw new HttpsError('permission-denied', 'Usuario ejecutor no válido.');
  }
  
  const adminData = adminDoc.data();
  if (adminData?.tipo !== 'administrador' && adminData?.tipo !== 'directiva') {
    throw new HttpsError('permission-denied', 'No tienes privilegios para reactivar usuarios.');
  }
  
  // =========================================================================
  // 📥 EXTRACCIÓN Y VALIDACIÓN DE PARÁMETROS MIGRADA A V2
  // =========================================================================
  const { uid } = request.data;
  if (!uid) {
    throw new HttpsError('invalid-argument', 'El UID del usuario a reactivar es obligatorio.');
  }

  try {
    // 1️⃣ RESTAURACIÓN DE CREDENCIALES EN FIREBASE AUTHENTICATION
    await admin.auth().updateUser(uid, { disabled: false });
    
    // 2️⃣ ACTUALIZACIÓN DE ESTADO Y TRAZABILIDAD DE AUDITORÍA EN FIRESTORE
    await db.collection('users').doc(uid).update({
      estado: 'active',
      reactivatedAt: FieldValue.serverTimestamp(),
      reactivadoPorUid: currentUid,
      reactivadoPorNombre: adminData?.nombre || 'Administrador'
    });

    // 3️⃣ NOTIFICACIÓN PUSH INFORMATIVA DE RETORNO A LA PLATAFORMA (FCM)
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
    if (error instanceof HttpsError) throw error;
    throw new HttpsError('internal', error.message);
  }
});