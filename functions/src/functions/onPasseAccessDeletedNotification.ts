
import { onDocumentDeleted } from 'firebase-functions/v2/firestore';
import { FcmTemplates } from '../constants/fcm-templates';
import { enviarConAutoLimpieza, DispositivoToken } from './notification-helper';
import { getFirestore } from 'firebase-admin/firestore';

/** @description Instancia de acceso directo al SDK administrativo de Cloud Firestore. */
const db = getFirestore();

/**
 * @function onPasseAccessDeletedNotification
 * @description Cloud Function v2 (Firestore Trigger) que intercepta la eliminación o revocación 
 * de un documento de pase en la colección 'event-access'. Recupera de forma síncrona los metadatos 
 * del evento asociado y distribuye una notificación push a través de FCM al usuario afectado.
 * Hereda la región global 'europe-west1' configurada en el archivo de índice.
 * 
 * @param {FirestoreEvent<QueryDocumentSnapshot | undefined>} event - Contexto del ciclo de vida de la eliminación del documento Firestore v2.
 * 
 * @returns {Promise<null>} Retorno síncrono controlado para liberar hilos de ejecución en el entorno Cloud.
 */
export const onPasseAccessDeletedNotification = onDocumentDeleted({
  document: 'event-access/{accessId}'
}, async (event): Promise<null> => {
  if (!event.data) return null;

  const accessData = event.data.data();
  const receptorUid = accessData?.userId;
  const eventId = accessData?.eventId;
  const passId = event.params.accessId;

  // =========================================================================
  // 🛡️ CONTROL PREVENTIVO: VALIDACIÓN DE INTEGRIDAD DE DATOS
  // =========================================================================
  if (!receptorUid || !eventId) {
    console.log('⚠️ [PASES-DELETE] El documento eliminado no contiene userId o eventId válidos. Cancelando push.');
    return null;
  }

  try {
    // 1️⃣ RESOLUCIÓN EN CALIENTE DEL NOMBRE REAL DEL EVENTO ASOCIADO
    const eventDoc = await db.collection('events').doc(eventId).get();
    const nombreEvento = eventDoc.exists ? (eventDoc.data()?.title || 'Convocatoria Oficial') : 'Convocatoria Oficial';

    console.log(`📡 [PASES-DELETE] Procesando revocación de pase para el evento "${nombreEvento}". Destinatario UID: ${receptorUid}`);

    // 2️⃣ EXTRACCIÓN Y DIRECCIONAMIENTO DE TOKENS ACTIVOS DEL RECEPTOR
    const tokensSnapshot = await db.collection(`users/${receptorUid}/tokens`).get();
    
    if (tokensSnapshot.empty) {
      console.log(`ℹ️ [PASES-DELETE] El usuario con UID ${receptorUid} no tiene tokens móviles registrados.`);
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
    // 🚀 DISTRIBUCIÓN PUSH Y AUTO-LIMPIEZA DE TOKENS EN LA PLATAFORMA FCM
    // =========================================================================
    if (listaDispositivos.length > 0) {
      const messages = listaDispositivos.map(item =>
        FcmTemplates.getPaseRevocadoTemplate(item.token, nombreEvento, passId)
      );

      // Despacha masivamente purgando reactivamente tokens inválidos o huérfanos
      await enviarConAutoLimpieza(listaDispositivos, messages);
      console.log(`✅ [PASES-DELETE] Notificación de revocación de pase distribuida con éxito.`);
    }

  } catch (error) {
    console.error('🚨 Error crítico en el despachador globalizado de revocación de pases:', error);
  }

  return null;
});

