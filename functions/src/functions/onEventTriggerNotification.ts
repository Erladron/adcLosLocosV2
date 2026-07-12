import { onDocumentWritten, FirestoreEvent, Change } from 'firebase-functions/v2/firestore';
import { DocumentSnapshot } from 'firebase-admin/firestore';
import * as admin from 'firebase-admin';
import { FcmTemplates } from '../constants/fcm-templates';
import { enviarConAutoLimpieza, DispositivoToken } from './notification-helper';

/** @description Instancia de acceso directo al SDK administrativo de Cloud Firestore. */
const db = admin.firestore();

/**
 * @type {string}
 * @description Tipado estricto para discriminar el ciclo de vida mutacional del evento detectado.
 */
type TipoNotificacion = 'NUEVO_EVENTO' | 'MODIFICACION_EVENTO' | 'ELIMINACION_EVENTO';

/**
 * @function onEventTriggerNotification
 * @description Cloud Function v2 (Firestore Trigger) que intercepta cualquier tipo de escritura 
 * (creación, edición o purga) en la colección raíz de eventos. Realiza una segmentación perimetral 
 * estricta basada en roles y solvencia de tesorería del socio antes de delegar el envío masivo en 
 * el motor de Firebase Cloud Messaging (FCM). Aplica criterios de optimización industrial omitiendo 
 * alertas automáticas ante meros incrementos de asistencia.
 * Hereda la región global 'europe-west1' configurada en el archivo de índice.
 * 
 * @param {FirestoreEvent<Change<DocumentSnapshot> | undefined>} event - Contexto del evento de base de datos Firestore v2.
 * 
 * @returns {Promise<null>} Retorno síncrono controlado para liberar hilos de ejecución en el entorno cloud.
 */
export const onEventTriggerNotification = onDocumentWritten({
  document: 'events/{eventId}'
}, async (event: FirestoreEvent<Change<DocumentSnapshot> | undefined>): Promise<null> => {
  const eventId = event.params.eventId;
  
  if (!event.data) return null;

  const beforeDoc = event.data.before;
  const afterDoc = event.data.after;

  const beforeData = beforeDoc.exists ? beforeDoc.data() : null;
  const afterData = afterDoc.exists ? afterDoc.data() : null;

  let tipoNotificacion: TipoNotificacion;
  let dataParaPush: any = null;
  let esPrivado = false;

  // =========================================================================
  // 🔍 EVALUACIÓN MUTACIONAL DEL DOCUMENTO (ESTADOS DE BASE DE DATOS)
  // =========================================================================
  if (beforeDoc.exists && !afterDoc.exists) {
    tipoNotificacion = 'ELIMINACION_EVENTO';
    esPrivado = beforeData?.isPrivate || false;
    dataParaPush = {
      titulo: '🛑 Evento Cancelado',
      descripcion: `Atención: El evento "${beforeData?.title || 'Convocatoria'}" ha sido cancelado definitivamente por la directiva.`
    };
    console.log(`🗑️ [BACKEND] Detectada eliminación del evento: ${eventId}. Preparando exclusión de segmentos...`);
  } 
  else if (!beforeDoc.exists && afterDoc.exists) {
    tipoNotificacion = 'NUEVO_EVENTO';
    esPrivado = afterData?.isPrivate || false;
    dataParaPush = {
      titulo: '📅 ¡Nueva Convocatoria!',
      descripcion: `Nuevo evento en ACD Los Locos: "${afterData?.title || 'Sin título'}"`
    };
    console.log(`🎯 [BACKEND] Detectado alta de nuevo evento: ${eventId}. Evaluando restricciones feriales...`);
  } 
  else if (beforeDoc.exists && afterDoc.exists) {
    const keys = Object.keys({ ...beforeData, ...afterData });
    const camposModificados = keys.filter(key => JSON.stringify(beforeData?.[key]) !== JSON.stringify(afterData?.[key]));

    // 💡 OPTIMIZACIÓN EN COSTES Y BATERÍA: Si el único cambio es el aforo atómico, ignoramos el push masivo
    if (camposModificados.length === 1 && camposModificados[0] === 'attendeeCount') {
      console.log(`ℹ️ [BACKEND] Incremento atómico de asistencia detectado (${beforeData?.attendeeCount} -> ${afterData?.attendeeCount}). Omitiendo proceso de mensajería.`);
      return null;
    }

    tipoNotificacion = 'MODIFICACION_EVENTO';
    esPrivado = afterData?.isPrivate || false;
    dataParaPush = {
      titulo: '⚠️ Cambio en el Evento',
      descripcion: `El evento "${afterData?.title || 'Informativo'}" ha sufrido modificaciones estructurales por parte de la directiva.`
    };
    console.log(`🔄 [BACKEND] Detectada mutación en evento activo: ${eventId}. Recalculando destinatarios...`);
  } 
  else {
    return null;
  }

  // =========================================================================
  // 🔐 SEGMENTACIÓN PERIMETRAL Y FILTRADO RADICAL DE TESORERÍA
  // =========================================================================
  try {
    const rolesDestinatarios = esPrivado 
      ? ['directiva', 'socio'] 
      : ['directiva', 'socio', 'invitado'];

    const usersSnapshot = await db.collection('users')
      .where('tipo', 'in', rolesDestinatarios)
      .where('estado', '==', 'active')
      .get();

    if (usersSnapshot.empty) {
      console.log('ℹ️ [SEGMENTACIÓN PUSH] No se han localizado usuarios activos que cumplan con los perfiles del evento.');
    } else {
      
      // 🚀 BLINDAJE INDUSTRIAL: Filtramos en memoria los socios morosos si el evento es privado
      const docsFiltrados = usersSnapshot.docs.filter(userDoc => {
        const uData = userDoc.data();
        
        if (esPrivado) {
          // Los roles de control jerárquico saltan el control de cuotas por defecto
          if (uData.tipo === 'directiva') return true;
          
          // CRÍTICO: Si el socio debe dinero en tesorería, le denegamos de forma proactiva la alerta push
          if (uData.cuotaAlCorriente === false) {
            console.log(`🔒 [SEGMENTACIÓN PUSH] Socio moroso detectado. Excluyendo del envío masivo: UID: ${userDoc.id}`);
            return false;
          }
        }
        return true;
      });

      if (docsFiltrados.length === 0) {
        console.log('ℹ️ [SEGMENTACIÓN PUSH] Proceso abortado. Ningún socio solvente califica para recibir la alerta.');
        return null;
      }

      const listaDispositivos: DispositivoToken[] = [];
      
      // Extracción limpia de tokens únicamente de los usuarios validados
      for (const userDoc of docsFiltrados) {
        const tokensSnapshot = await db.collection(`users/${userDoc.id}/tokens`).get();
        tokensSnapshot.forEach(tDoc => {
          const tData = tDoc.data();
          if (tData.token) {
            listaDispositivos.push({
              token: tData.token,
              uidUsuario: userDoc.id,
              tokenId: tDoc.id
            });
          }
        });
      }

      // =========================================================================
      // 🚀 DESPACHO CONTROLADO EN PLATAFORMA FCM (FIREBASE CLOUD MESSAGING)
      // =========================================================================
      if (listaDispositivos.length > 0) {
        const messages = listaDispositivos.map(item => {
          if (tipoNotificacion === 'MODIFICACION_EVENTO') {
            return FcmTemplates.getModificacionEventoTemplate(item.token, dataParaPush.titulo, dataParaPush.descripcion, eventId);
          } else if (tipoNotificacion === 'ELIMINACION_EVENTO') {
            return FcmTemplates.getElimacionEventoTemplate(item.token, dataParaPush.titulo, dataParaPush.descripcion);
          } else {
            return FcmTemplates.getNuevoEventoTemplate(item.token, dataParaPush.titulo, dataParaPush.descripcion, eventId);
          }
        });

        // Envía masivamente limpiando los tokens obsoletos del servidor
        await enviarConAutoLimpieza(listaDispositivos, messages);
        console.log(`✅ [MOTORES DE ALERTA] Despachados con éxito ${listaDispositivos.length} pushes segmentados.`);
      }
    }

    // Purgado automático de cascadas en base de datos si el evento ha sido borrado
    if (tipoNotificacion === 'ELIMINACION_EVENTO') {
      console.log(`🧹 [BACKEND] Limpiando en lote subcolección /attendance del ID: ${eventId}...`);
      const attendanceSnapshot = await db.collection(`events/${eventId}/attendance`).get();
      
      if (!attendanceSnapshot.empty) {
        const batch = db.batch();
        attendanceSnapshot.docs.forEach(docSnapshot => batch.delete(docSnapshot.ref));
        await batch.commit();
        console.log(`✅ [PURGA] Subcolección interna /attendance eliminada por completo (${attendanceSnapshot.size} documentos).`);
      }
    }

  } catch (error) {
    console.error('🚨 [ERROR CRÍTICO] Colapso en el motor distribuidor de Cloud Functions backend:', error);
  }

  return null;
});