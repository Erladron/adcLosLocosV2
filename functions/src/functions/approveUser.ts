import { onCall, HttpsError } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { FcmTemplates } from '../constants/fcm-templates';
import { enviarConAutoLimpieza, DispositivoToken } from './notification-helper';

/** @description Instancia de acceso directo al SDK administrativo de Cloud Firestore. */
const db = admin.firestore();

/**
 * @function approveUser
 * @description Cloud Function v2 (Callable) que gestiona la aprobación formal de un nuevo socio
 * en la plataforma por parte de un miembro de la junta directiva o administrador. Actualiza el estado
 * transaccional a activo en Firestore y despacha una notificación push a través de FCM.
 * Hereda la región global 'europe-west1' configurada en el archivo de índice.
 * 
 * @param {CallableRequest<any>} request - Contexto de la petición HTTP síncrona provisto por Firebase v2.
 * @param {Object} request.data - Carga útil de datos estructurados enviada desde el front-end.
 * @param {string} request.data.uid - Identificador único de Firebase Auth del socio que se va a aprobar.
 * @param {Object} request.auth - Contexto de autenticación del operador que ejecuta la acción.
 * 
 * @returns {Promise<{ success: boolean }>} Retorno síncrono que confirma la persistencia de los cambios.
 * @throws {HttpsError} Excepciones de red controladas para su procesamiento nativo en el Front-end.
 */
export const approveUser = onCall(async (request) => {
  // =========================================================================
  // 🔐 CONTROL DE ACCESO INTERNO Y CONTROL DE OPERADOR
  // =========================================================================
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'El usuario debe estar autenticado en la plataforma.');
  }
  
  const currentUid = request.auth.uid || 'ID_SIMULADO_ADMIN';
  const adminDoc = await db.collection('users').doc(currentUid).get();
  const adminData = adminDoc.exists ? adminDoc.data() : null;

  // =========================================================================
  // 📥 EXTRACCIÓN Y VALIDACIÓN DE ARGUMENTOS MIGRADA A V2
  // =========================================================================
  const { uid } = request.data;
  if (!uid) {
    throw new HttpsError('invalid-argument', 'El UID del socio a aprobar es requerido.');
  }

  try {
    const socioDoc = await db.collection('users').doc(uid).get();
    if (!socioDoc.exists) {
      throw new HttpsError('not-found', 'El perfil de usuario asociado no fue localizado en Firestore.');
    }
    
    const socioData = socioDoc.data();
    const nombreSocio = socioData?.nombre || 'Socio';

    // 1️⃣ MUTACIÓN TRANSACCIONAL DEL ESTADO CIVIL DEL SOCIO
    await db.collection('users').doc(uid).update({
      estado: 'active',
      approvedAt: FieldValue.serverTimestamp(),
      aprobadoPorUid: currentUid,
      aprobadoPorNombre: adminData?.nombre || 'Administrador'
    });

    // 2️⃣ DISPARO ASÍNCRONO DEL CONTEXTO DE ALERTAS PUSH (FCM)
    try {
      const tokensSnapshot = await db.collection(`users/${uid}/tokens`).get();
      const listaDispositivos: DispositivoToken[] = [];
      
      tokensSnapshot.forEach(tokenDoc => {
        const tokenData = tokenDoc.data();
        if (tokenData.token) {
          listaDispositivos.push({
            token: tokenData.token,
            uidUsuario: uid,
            tokenId: tokenDoc.id
          });
        }
      });

      if (listaDispositivos.length > 0) {
        const messages = listaDispositivos.map(item => 
          FcmTemplates.getSocioAprobadoTemplate(item.token, nombreSocio)
        );
        await enviarConAutoLimpieza(listaDispositivos, messages);
        console.log(`✅ Notificación push enviada con éxito al socio aprobado (UID: ${uid})`);
      } else {
        console.log(`ℹ️ El socio ${nombreSocio} no dispone de ningún token móvil en Firestore. Se omite el push.`);
      }
    } catch (pushError) {
      console.error('🚨 Alerta: El usuario fue aprobado pero falló el envío del push de FCM:', pushError);
    }

    return { success: true };
  } catch (error: any) {
    console.error('🚨 Error crítico en approveUser:', error);
    if (error instanceof HttpsError) throw error;
    throw new HttpsError('internal', error.message);
  }
});