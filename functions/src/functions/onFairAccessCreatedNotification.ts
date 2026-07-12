import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import * as admin from 'firebase-admin';
import { FcmTemplates } from '../constants/fcm-templates';
import { enviarConAutoLimpieza, DispositivoToken } from './notification-helper';

/** @description Instancia de acceso directo al SDK administrativo de Cloud Firestore. */
const db = admin.firestore();

/**
 * @function onFairAccessCreatedNotification
 * @description Cloud Function v2 (Firestore Trigger) que intercepta la creación de nuevos 
 * accesos o credenciales de feria en la colección 'fair-access'. Resuelve de forma asíncrona en 
 * caliente los metadatos del evento asociado y despacha una alerta push personalizada a través 
 * de FCM discriminando el flujo si el receptor es un socio o un invitado externo.
 * Hereda la región global 'europe-west1' configurada en el archivo de índice.
 * 
 * @param {FirestoreEvent<QueryDocumentSnapshot | undefined>} event - Contexto del ciclo de vida de la creación del documento Firestore v2.
 * 
 * @returns {Promise<null>} Retorno síncrono controlado para liberar hilos de ejecución en el entorno cloud.
 */
export const onFairAccessCreatedNotification = onDocumentCreated({
  document: 'fair-access/{accessId}'
}, async (event): Promise<null> => {
  if (!event.data) return null;

  const accessData = event.data.data();
  const receptorUid = accessData?.userId;
  const eventId = accessData?.eventId;
  const nombreSocioAnfitrion = accessData?.invitedByName || 'Un socio';
  const esInvitado = accessData?.userType === 'invitado';

  // =========================================================================
  // 🛡️ CONTROL PREVENTIVO: VALIDACIÓN DE INTEGRIDAD DE DATOS
  // =========================================================================
  if (!receptorUid || !eventId) {
    console.log('⚠️ [PASES] El documento no contiene userId o eventId válidos. Cancelando push.');
    return null;
  }

  try {
    // 1️⃣ RESOLUCIÓN EN CALIENTE DEL NOMBRE REAL DEL EVENTO ASOCIADO
    const eventDoc = await db.collection('events').doc(eventId).get();
    if (!eventDoc.exists) {
      console.log(`⚠️ [PASES] No se localizó el evento ${eventId} en Firestore. Se aborta push.`);
      return null;
    }
    const eventData = eventDoc.data();
    const nombreEvento = eventData?.title || 'Convocatoria Oficial';

    console.log(`📡 [PASES] Evaluando credencial para el evento "${nombreEvento}". Destinatario UID: ${receptorUid}`);

    // 2️⃣ EXTRACCIÓN Y DIRECCIONAMIENTO DE TOKENS ACTIVOS DEL RECEPTOR
    const tokensSnapshot = await db.collection(`users/${receptorUid}/tokens`).get();
    
    if (tokensSnapshot.empty) {
      console.log(`ℹ️ [PASES] El usuario con UID ${receptorUid} no tiene tokens registrados móviles.`);
      return null;
    }

    const listaDispositivos: DispositivoToken[] = [];
    tokensSnapshot.forEach(tokenDoc => {
      const tData = tokenDoc.data();
      if (tData.token) {
        listaDispositivos.push({
          token: tData.token,
          uidUsuario: receptorUid,
          tokenId: tokenDoc.id
        });
      }
    });

    // =========================================================================
    // 🚀 BIFURCACIÓN DE PLANTILLAS Y DISTRIBUCIÓN PUSH EN LA PLATAFORMA FCM
    // =========================================================================
    if (listaDispositivos.length > 0) {
      const messages = listaDispositivos.map(item => {
        // Criterio globalizado: Mapeamos la plantilla idónea según el rol asignado al pase
        if (esInvitado) {
          return FcmTemplates.getInvitacionExternoTemplate(item.token, nombreSocioAnfitrion, nombreEvento);
        } else {
          return FcmTemplates.getCredencialSocioTemplate(item.token, nombreEvento);
        }
      });

      // Envía masivamente purgando reactivamente tokens inválidos o huérfanos
      await enviarConAutoLimpieza(listaDispositivos, messages);
      console.log(`✅ [PASES] Notificación de credencial distribuida con éxito.`);
    }

  } catch (error) {
    console.error('🚨 Error crítico en el despachador globalizado de pases:', error);
  }

  return null;
});