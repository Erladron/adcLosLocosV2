import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import cors from 'cors';
import { EmailTemplates } from './email-templates';
import { FcmTemplates } from './fcm-templates';

admin.initializeApp();

const db = admin.firestore();

const corsHandler = cors({
  origin: true
});

// ============================================================================
// 👥 1. CREACIÓN DE USUARIOS POR PARTE DEL ADMINISTRADOR (HTTP onRequest)
// ============================================================================
export const createUserByAdmin = functions.https.onRequest((request, response) => {
  corsHandler(request, response, async () => {
    let createdUid = '';
    try {
      const authHeader = request.headers.authorization;
      if (!authHeader) {
        response.status(401).send({ success: false, error: 'No autorizado: Falta cabecera Authorization' });
        return;
      }
      const token = authHeader.replace('Bearer ', '');
      const decodedToken = await admin.auth().verifyIdToken(token);
      const currentUid = decodedToken.uid;

      const adminDoc = await db.collection('users').doc(currentUid).get();
      if (!adminDoc.exists) {
        response.status(403).send({ success: false, error: 'Usuario ejecutor no válido o inexistente' });
        return;
      }
      const adminData = adminDoc.data();
      if (adminData?.tipo !== 'administrador' && adminData?.tipo !== 'directiva') {
        response.status(403).send({ success: false, error: 'Permisos insuficientes para crear usuarios' });
        return;
      }

      const { nombre, email, password, telefono, dni, direccion, numeroSocio, tipo, foto } = request.body.data;
      const userRecord = await admin.auth().createUser({ email, password });
      createdUid = userRecord.uid;

      const userData = {
        uid: createdUid,
        numeroSocio: numeroSocio || '',
        nombre: nombre || '',
        telefono: telefono || '',
        email,
        dni: dni || '',
        direccion: direccion || '',
        foto: foto || '',
        tipo: tipo || 'invitado',
        estado: 'active',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        creadoPorUid: currentUid,
        creadoPorNombre: adminData?.nombre || 'Administrador'
      };

      await db.collection('invitedUsers').doc(createdUid).set({
        email,
        invitedBy: currentUid,
        used: true,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });

      await db.collection('users').doc(createdUid).set(userData);
      response.status(200).send({ success: true, uid: createdUid });
    } catch (error: any) {
      console.error('🚨 Error crítico en createUserByAdmin:', error);
      try {
        if (createdUid) {
          await admin.auth().deleteUser(createdUid);
          console.log(`🔄 Rollback ejecutado: Usuario ${createdUid} eliminado de Auth con éxito.`);
        }
      } catch (rollbackError) {
        console.error('🚨 Error crítico durante el Rollback de Auth:', rollbackError);
      }
      response.status(500).send({ success: false, error: error.message });
    }
  });
});

// ============================================================================
// 🚫 2. DESACTIVACIÓN DE USUARIOS / BAJAS (HTTP onCall)
// ============================================================================
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
      deactivatedAt: admin.firestore.FieldValue.serverTimestamp(),
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

// ============================================================================
// 🔄 3. REACTIVACIÓN DE USUARIOS / ALTAS DE NUEVO (HTTP onCall)
// ============================================================================
export const reactivateUser = functions.https.onCall(async (request) => {
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
    throw new functions.https.HttpsError('permission-denied', 'No tienes privilegios para reactivar usuarios.');
  }
  const { uid } = request.data;
  if (!uid) {
    throw new functions.https.HttpsError('invalid-argument', 'El UID del usuario a reactivar es obligatorio.');
  }
  try {
    await admin.auth().updateUser(uid, { disabled: false });
    await db.collection('users').doc(uid).update({
      estado: 'active',
      reactivatedAt: admin.firestore.FieldValue.serverTimestamp(),
      reactivadoPorUid: currentUid,
      reactivadoPorNombre: adminData?.nombre || 'Administrador'
    });
    return { success: true };
  } catch (error: any) {
    console.error('🚨 Error en reactivateUser:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

// ============================================================================
// ✅ 4. APROBACIÓN DE SOCIOS CON NOTIFICACIÓN PUSH NATIVA (HTTP onCall)
// ============================================================================
export const approveUser = functions.https.onCall(async (request) => {
  if (!request.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'El usuario debe estar autenticado en la plataforma.');
  }
  const currentUid = request.auth?.uid || 'ID_SIMULADO_ADMIN';
  const adminDoc = await db.collection('users').doc(currentUid).get();
  const adminData = adminDoc.exists ? adminDoc.data() : null;

  const { uid } = request.data;
  if (!uid) {
    throw new functions.https.HttpsError('invalid-argument', 'El UID del socio a aprobar es requerido.');
  }
  try {
    const socioDoc = await db.collection('users').doc(uid).get();
    const socioData = socioDoc.data();
    const nombreSocio = socioData?.nombre || 'Socio';

    await db.collection('users').doc(uid).update({
      estado: 'active',
      approvedAt: admin.firestore.FieldValue.serverTimestamp(),
      aprobadoPorUid: currentUid,
      aprobadoPorNombre: adminData?.nombre || 'Administrador'
    });

    try {
      const tokensSnapshot = await db.collection(`users/${uid}/tokens`).get();
      const tokensUsuario: string[] = [];
      tokensSnapshot.forEach(tokenDoc => {
        const tokenData = tokenDoc.data();
        if (tokenData.token) tokensUsuario.push(tokenData.token);
      });

      if (tokensUsuario.length > 0) {
        const messages = tokensUsuario.map(token => 
          FcmTemplates.getSocioAprobadoTemplate(token, nombreSocio)
        );
        await admin.messaging().sendEach(messages);
        console.log(`... Notificación push enviada con éxito al socio aprobado (UID: ${uid})`);
      } else {
        console.log(`ℹ️ El socio ${nombreSocio} no dispone de ningún token móvil en Firestore. Se omite el push.`);
      }
    } catch (pushError) {
      console.error('🚨 Alerta: El usuario fue aprobado pero falló el envío del push de FCM:', pushError);
    }
    return { success: true };
  } catch (error: any) {
    console.error('🚨 Error crítico en approveUser:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

// ============================================================================
// 🔑 5. RESTABLECIMIENTO DE CONTRASEÑA CORPORATIVO PERSONALIZADO (HTTP onCall)
// ============================================================================
export const sendCustomPasswordReset = functions.https.onCall(async (request) => {
  const { email } = request.data;
  if (!email) {
    throw new functions.https.HttpsError('invalid-argument', 'El correo electrónico es un parámetro obligatorio.');
  }
  try {
    const defaultFirebaseLink = await admin.auth().generatePasswordResetLink(email);
    const urlParams = new URL(defaultFirebaseLink).searchParams;
    const oobCode = urlParams.get('oobCode');
    if (!oobCode) {
      throw new functions.https.HttpsError('internal', 'No se pudo procesar el código de seguridad oobCode desde Firebase.');
    }
    const customResetLink = `https://adcloslocos-desa.web.app/reset-password?oobCode=${oobCode}`;
    const correoHtml = EmailTemplates.getPasswordResetTemplate(email, customResetLink);

    await db.collection('mail').add({
      to: email,
      message: {
        subject: '🔑 Cambio de contraseña - A.D.C. Los Locos',
        html: correoHtml
      }
    });
    return { success: true, message: 'Correo corporativo directo encolado con éxito.' };
  } catch (error: any) {
    console.error('Error generando el enlace premium de reseteo:', error);
    throw new functions.https.HttpsError('internal', 'No se pudo completar el flujo de reajuste de contraseña.');
  }
});

// ============================================================================
// 📌 6. SOLICITUD DE APROBACIÓN DE SOCIO A LA DIRECTIVA (HTTP onCall)
// ============================================================================
export const requestUserApproval = functions.https.onCall(async (request) => {
  if (!request.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Operación rechazada: Requiere autenticación de usuario.');
  }
  const applicantUid = request.auth.uid;
  try {
    const userDoc = await db.collection('users').doc(applicantUid).get();
    if (!userDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'El perfil de usuario asociado no fue localizado en Firestore.');
    }

    await db.collection('users').doc(applicantUid).update({
      estado: 'pending_approval',
      requestedApprovalAt: admin.firestore.FieldValue.serverTimestamp()
    });

    const pendientesSnapshot = await db.collection('users').where('estado', '==', 'pending_approval').get();
    const totalPendientes = pendientesSnapshot.size;

    const directivosSnapshot = await db.collection('users').where('tipo', 'in', ['administrador', 'directiva']).get();
    if (directivosSnapshot.empty) {
      return { success: true, message: 'Estado actualizado. No se pudo notificar a la junta por falta de cuentas directivas.' };
    }

    const tokensDirectiva: string[] = [];
    for (const doc of directivosSnapshot.docs) {
      const tokensSnapshot = await db.collection(`users/${doc.id}/tokens`).get();
      tokensSnapshot.forEach(tokenDoc => {
        const tokenData = tokenDoc.data();
        if (tokenData.token) tokensDirectiva.push(tokenData.token);
      });
    }

    if (tokensDirectiva.length > 0) {
      const messages = tokensDirectiva.map(token => 
        FcmTemplates.getAvisoDirectivaTemplate(token, totalPendientes, applicantUid)
      );
      await admin.messaging().sendEach(messages);
      console.log(`... Alerta distribuida a la directiva. Total pendientes en cola: ${totalPendientes}`);
    } else {
      console.log('ℹ️ Los miembros de la directiva no disponen de la app nativa instalada o sincronizada actualmente.');
    }
    return { success: true, message: 'Ficha guardada y aviso enviado con éxito a los miembros de la directiva.' };
  } catch (error: any) {
    console.error('🚨 Error crítico en requestUserApproval:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

// ============================================================================
// 📅 7. ESCUCHADOR AUTOMÁTICO DE EVENTOS PARA ENVÍO DE PUSH NATIVAS (v2 onDocumentWritten)
// ============================================================================
import { onDocumentWritten, FirestoreEvent, Change } from 'firebase-functions/v2/firestore';
import { DocumentSnapshot } from 'firebase-admin/firestore';

export const onEventTriggerNotification = onDocumentWritten({
  document: 'events/{eventId}',
  region: 'us-central1' // Forzado en us-central1 para unificar vuestras arquitecturas
}, async (event: FirestoreEvent<Change<DocumentSnapshot> | undefined>) => {
  const eventId = event.params.eventId;
  
  if (!event.data || !event.data.after.exists) {
    console.log(`ℹ️ Evento ${eventId} eliminado de la BD. Omitiendo disparador.`);
    return null;
  }

  const eventData = event.data.after.data();
  const trigger = eventData?._notificationTrigger;

  if (!trigger || !trigger.destinatarios || trigger.destinatarios.length === 0) {
    return null;
  }

  console.log(`📣 [BACKEND] Procesando orden de Push: [${trigger.tipoNotificacion}] para el evento: ${eventId}`);

  try {
    const usersSnapshot = await db.collection('users')
      .where('tipo', 'in', trigger.destinatarios)
      .where('estado', '==', 'active')
      .get();

    if (usersSnapshot.empty) {
      console.log('ℹ️ No se localizaron usuarios activos para notificar.');
      await event.data.after.ref.update({ _notificationTrigger: admin.firestore.FieldValue.delete() });
      return null;
    }

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
        if (trigger.tipoNotificacion === 'MODIFICACION_EVENTO') {
          return FcmTemplates.getModificacionEventoTemplate(token, trigger.titulo, trigger.descripcion, eventId);
        } else if (trigger.tipoNotificacion === 'ELIMINACION_EVENTO') {
          return FcmTemplates.getElimacionEventoTemplate(token, trigger.titulo, trigger.descripcion);
        } else {
          return FcmTemplates.getNuevoEventoTemplate(token, trigger.titulo, trigger.descripcion, eventId);
        }
      });

      await admin.messaging().sendEach(messages);
      console.log(`✅ Push distribuidas con éxito a ${tokensDestinatarios.length} terminales.`);
    }

  } catch (error) {
    console.error('🚨 Error crítico procesando la push masiva:', error);
  } finally {
    // 🧹 CONTROL DE FLUJO SÚPER INTELIGENTE: 
    // Si la orden era de eliminación, tras enviar los pushes borramos el documento entero
    if (trigger.tipoNotificacion === 'ELIMINACION_EVENTO') {
      console.log(`🗑️ [BACKEND] Destruyendo físicamente el evento ${eventId} de la base de datos...`);
      await event.data.after.ref.delete();
    } else {
      // Si era alta o edición, solo limpiamos el nodo temporal
      await event.data.after.ref.update({
        _notificationTrigger: admin.firestore.FieldValue.delete()
      });
    }
  }

  return null;
});