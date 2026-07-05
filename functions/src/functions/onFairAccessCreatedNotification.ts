import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import * as admin from 'firebase-admin';
import { FcmTemplates } from '../constants/fcm-templates';
import { enviarConAutoLimpieza, DispositivoToken } from './notification-helper';

const db = admin.firestore();

export const onFairAccessCreatedNotification = onDocumentCreated({
  document: 'fair-access/{accessId}',
  region: 'us-central1'
}, async (event) => {
  if (!event.data) return null;

  const accessData = event.data.data();
  const receptorUid = accessData?.userId;
  const eventId = accessData?.eventId;
  const nombreSocioAnfitrion = accessData?.invitedByName || 'Un socio';
  const esInvitado = accessData?.userType === 'invitado';

  if (!receptorUid || !eventId) {
    console.log('⚠️ [PASES] El documento no contiene userId o eventId válidos. Cancelando push.');
    return null;
  }

  try {
    // 🚀 OBTENER NOMBRE REAL DEL EVENTO EN CALIENTE
    const eventDoc = await db.collection('events').doc(eventId).get();
    if (!eventDoc.exists) {
      console.log(`⚠️ [PASES] No se localizó el evento ${eventId} en Firestore. Se aborta push.`);
      return null;
    }
    const eventData = eventDoc.data();
    const nombreEvento = eventData?.title || 'Convocatoria Oficial';

    console.log(`📡 [PASES] Evaluando credencial para el evento "${nombreEvento}". Destinatario UID: ${receptorUid}`);

    // Buscamos dispositivos activos del usuario receptor
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

    if (listaDispositivos.length > 0) {
      const messages = listaDispositivos.map(item => {
        // 🚀 CRITERIO GLOBALIZADO: Bifurcamos la plantilla según el tipo de acceso
        if (esInvitado) {
          return FcmTemplates.getInvitacionExternoTemplate(item.token, nombreSocioAnfitrion, nombreEvento);
        } else {
          return FcmTemplates.getCredencialSocioTemplate(item.token, nombreEvento);
        }
      });

      await enviarConAutoLimpieza(listaDispositivos, messages);
      console.log(`✅ [PASES] Notificación de credencial distribuida con éxito.`);
    }

  } catch (error) {
    console.error('🚨 Error crítico en el despachador globalizado de pases:', error);
  }

  return null;
});