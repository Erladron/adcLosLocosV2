import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import * as admin from 'firebase-admin';
import { FcmTemplates } from '../constants/fcm-templates';

const db = admin.firestore();

export const onFairAccessCreatedNotification = onDocumentCreated({
  document: 'fair-access/{accessId}',
  region: 'us-central1'
}, async (event) => {
  if (!event.data) return null;

  const accessData = event.data.data();
  const invitadoUid = accessData?.userId;
  const nombreSocio = accessData?.senderName || 'Un socio';

  console.log('⚠️ [PASES] Creado por: ', accessData);

  if (!invitadoUid) {
    console.log('⚠️ [PASES] El documento de acceso creado no contiene un userId válido. Cancelando push.');
    return null;
  }

  try {
    console.log(`📡 [PASES] Detectado nuevo pase de feria para el usuario: ${invitadoUid}. Buscando dispositivos activos...`);

    const tokensSnapshot = await db.collection(`users/${invitadoUid}/tokens`).get();
    
    if (tokensSnapshot.empty) {
      console.log(`ℹ️ [PASES] El invitado con UID ${invitadoUid} no tiene ningún dispositivo registrado. Se aborta el envío.`);
      return null;
    }

    const tokensInvitado: string[] = [];
    tokensSnapshot.forEach(tokenDoc => {
      const tData = tokenDoc.data();
      if (tData.token && !tokensInvitado.includes(tData.token)) {
        tokensInvitado.push(tData.token);
      }
    });

    if (tokensInvitado.length > 0) {
      const messages = tokensInvitado.map(token => 
        FcmTemplates.getNuevoPaseFeriaTemplate(token, nombreSocio)
      );

      await admin.messaging().sendEach(messages);
      console.log(`✅ [PASES] Push de invitación enviada correctamente a los ${tokensInvitado.length} terminales del invitado.`);
    }

  } catch (error) {
    console.error('🚨 Error crítico en el despachador de notificaciones de pases de feria:', error);
  }

  return null;
});