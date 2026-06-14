import { onDocumentWritten, FirestoreEvent, Change } from 'firebase-functions/v2/firestore';
import { DocumentSnapshot } from 'firebase-admin/firestore';
import * as admin from 'firebase-admin';
import { FcmTemplates } from '../constants/fcm-templates';

const db = admin.firestore();

export const onEventTriggerNotification = onDocumentWritten({
  document: 'events/{eventId}',
  region: 'us-central1'
}, async (event: FirestoreEvent<Change<DocumentSnapshot> | undefined>) => {
  const eventId = event.params.eventId;
  
  if (!event.data) return null;

  const beforeDoc = event.data.before;
  const afterDoc = event.data.after;

  const beforeData = beforeDoc.exists ? beforeDoc.data() : null;
  const afterData = afterDoc.exists ? afterDoc.data() : null;

  let tipoNotificacion: 'NUEVO_EVENTO' | 'MODIFICACION_EVENTO' | 'ELIMINACION_EVENTO';
  let dataParaPush: any = null;
  let esPrivado = false;

  if (beforeDoc.exists && !afterDoc.exists) {
    tipoNotificacion = 'ELIMINACION_EVENTO';
    esPrivado = beforeData?.isPrivate || false;
    dataParaPush = {
      titulo: '🛑 Evento Cancelado',
      descripcion: `Atención: El evento "${beforeData?.title || 'Convocatoria'}" ha sido cancelado definitivamente por la directiva.`
    };
    console.log(`🗑️ [BACKEND] Detectada eliminación del evento: ${eventId}. Despachando alertas...`);
  } 
  else if (!beforeDoc.exists && afterDoc.exists) {
    tipoNotificacion = 'NUEVO_EVENTO';
    esPrivado = afterData?.isPrivate || false;
    dataParaPush = {
      titulo: '📅 ¡Nueva Convocatoria!',
      descripcion: `Nuevo evento en ACD Los Locos: "${afterData?.title || 'Sin título'}"`
    };
    console.log(`🎯 [BACKEND] Detectado nuevo evento: ${eventId}. Despachando alertas...`);
  } 
  else if (beforeDoc.exists && afterDoc.exists) {
    const keys = Object.keys({ ...beforeData, ...afterData });
    const camposModificados = keys.filter(key => JSON.stringify(beforeData?.[key]) !== JSON.stringify(afterData?.[key]));

    if (camposModificados.length === 1 && camposModificados[0] === 'attendeeCount') {
      console.log(`ℹ️ [BACKEND] Incremento de asistencia detectado (${beforeData?.attendeeCount} -> ${afterData?.attendeeCount}). Omitiendo push masiva.`);
      return null;
    }

    tipoNotificacion = 'MODIFICACION_EVENTO';
    esPrivado = afterData?.isPrivate || false;
    dataParaPush = {
      titulo: '⚠️ Cambio en el Evento',
      descripcion: `El evento "${afterData?.title || 'Informativo'}" ha sufrido modificaciones por parte de la directiva.`
    };
    console.log(`🔄 [BACKEND] Detectada modificación estructural en evento: ${eventId}. Despachando alertas...`);
  } 
  else {
    return null;
  }

  try {
    const rolesDestinatarios = esPrivado 
      ? ['admin', 'directiva', 'socio'] 
      : ['admin', 'directiva', 'socio', 'invitado'];

    const usersSnapshot = await db.collection('users')
      .where('tipo', 'in', rolesDestinatarios)
      .where('estado', '==', 'active')
      .get();

    if (usersSnapshot.empty) {
      console.log('ℹ️ No hay usuarios activos en los segmentos objetivo para notificar.');
    } else {
      const tokensDestinatarios: string[] = [];
      
      for (const userDoc of usersSnapshot.docs) {
        const tokensSnapshot = await db.collection(`users/${userDoc.id}/tokens`).get();
        tokensSnapshot.forEach(tDoc => {
          const tData = tDoc.data();
          if (tData.token && !tokensDestinatarios.includes(tData.token)) {
            tokensDestinatarios.push(tData.token);
          }
        });
      }

      if (tokensDestinatarios.length > 0) {
        const messages = tokensDestinatarios.map(token => {
          if (tipoNotificacion === 'MODIFICACION_EVENTO') {
            return FcmTemplates.getModificacionEventoTemplate(token, dataParaPush.titulo, dataParaPush.descripcion, eventId);
          } else if (tipoNotificacion === 'ELIMINACION_EVENTO') {
            return FcmTemplates.getElimacionEventoTemplate(token, dataParaPush.titulo, dataParaPush.descripcion);
          } else {
            return FcmTemplates.getNuevoEventoTemplate(token, dataParaPush.titulo, dataParaPush.descripcion, eventId);
          }
        });

        await admin.messaging().sendEach(messages);
        console.log(`✅ Pushes distribuidas con éxito a ${tokensDestinatarios.length} terminales móviles.`);
      }
    }

    if (tipoNotificacion === 'ELIMINACION_EVENTO') {
      console.log(`🧹 [BACKEND] Limpiando en bloque la subcolección de asistencias de ${eventId}...`);
      const attendanceSnapshot = await db.collection(`events/${eventId}/attendance`).get();
      
      if (!attendanceSnapshot.empty) {
        const batch = db.batch();
        attendanceSnapshot.docs.forEach(docSnapshot => batch.delete(docSnapshot.ref));
        await batch.commit();
        console.log(`✅ Subcolección /attendance eliminada por completo (${attendanceSnapshot.size} registros).`);
      }
    }

  } catch (error) {
    console.error('🚨 Error crítico en el motor distribuidor de Cloud Functions:', error);
  }

  return null;
});