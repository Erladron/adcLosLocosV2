import { onCall, HttpsError } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { FcmTemplates } from '../constants/fcm-templates';
import { enviarConAutoLimpieza, DispositivoToken } from './notification-helper';

/** @description Instancia de acceso directo al SDK administrativo de Cloud Firestore. */
const db = admin.firestore();

/**
 * @function deactivateUser
 * @description Cloud Function v2 (Callable) encargada de suspender o dar de baja a un usuario 
 * del sistema. El proceso deshabilita la cuenta en Firebase Authentication de forma proactiva, 
 * muta el estado del perfil a inactivo en Firestore registrando la traza de autoría y despacha 
 * una alerta push notificando los motivos al usuario afectado.
 * Hereda la región global 'europe-west1' configurada en el archivo de índice.
 * 
 * @param {CallableRequest<any>} request - Contexto de la petición HTTP síncrona provisto por Firebase v2.
 * @param {Object} request.data - Carga útil de datos estructurados enviada desde el front-end.
 * @param {string} request.data.uid - Identificador único de Firebase Auth del usuario a suspender.
 * @param {string} [request.data.motivo] - Texto justificativo o razón formal del cese de actividad.
 * @param {Object} request.auth - Contexto de autenticación del operador (administrador o junta directiva).
 * 
 * @returns {Promise<{ success: boolean }>} Retorno controlado confirmando el éxito del cese.
 * @throws {HttpsError} Excepciones de red y control de acceso estructuradas para el cliente.
 */
export const deactivateUser = onCall(async (request) => {
  // =========================================================================
  // 🔐 VALIDACIÓN DE IDENTIDAD Y SEGURIDAD OPERATIVA (ROLES INTERNOS)
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
    throw new HttpsError('permission-denied', 'No tienes los privilegios requeridos para esta acción.');
  }
  
  // =========================================================================
  // 📥 EXTRACCIÓN Y VALIDACIÓN DE PARÁMETROS MIGRADA A V2
  // =========================================================================
  const { uid, motivo } = request.data;
  if (!uid) {
    throw new HttpsError('invalid-argument', 'El UID del usuario a desactivar es obligatorio.');
  }

  try {
    // 1️⃣ SUSPENSIÓN DE CREDENCIALES EN FIREBASE AUTHENTICATION
    await admin.auth().updateUser(uid, { disabled: true });
    
    // 2️⃣ PERSISTENCIA Y TRAZABILIDAD AUDITABLE EN FIRESTORE
    await db.collection('users').doc(uid).update({
      estado: 'inactive',
      deactivatedAt: FieldValue.serverTimestamp(),
      bajaRealizadaPorUid: currentUid,
      bajaRealizadaPorNombre: adminData?.nombre || 'Administrador',
      motivoBaja: motivo || ''
    });

    // 3️⃣ DISPARO DEL PROTOCOLO DE ALERTA PUSH AL SOCIO CESADO
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
    if (error instanceof HttpsError) throw error;
    throw new HttpsError('internal', error.message);
  }
});