import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import cors from 'cors';
import { EmailTemplates } from './email-templates';
import { FcmTemplates } from './fcm-templates'; // 🚀 ¡IMPORTACIÓN DE TUS PLANTILLAS AZULES Y BLANCAS!

// Inicializamos el SDK de Administración de Firebase para tener acceso a Auth, Firestore y Messaging
admin.initializeApp();

const db = admin.firestore();

// Configuración del manejador de CORS para permitir peticiones HTTP seguras desde tu aplicación web/móvil
const corsHandler = cors({
  origin: true
});

// ============================================================================
// 👥 1. CREACIÓN DE USUARIOS POR PARTE DEL ADMINISTRADOR (HTTP onRequest)
// ============================================================================
export const createUserByAdmin = functions.https.onRequest((request, response) => {
  // Envolvemos la ejecución en el manejador de CORS para evitar bloqueos del navegador
  corsHandler(request, response, async () => {
    let createdUid = '';

    try {
      // ----------------------------------------------------------------------
      // EXTRAER Y VALIDAR EL TOKEN DE AUTENTICACIÓN (JWT)
      // ----------------------------------------------------------------------
      const authHeader = request.headers.authorization;
      if (!authHeader) {
        response.status(401).send({ success: false, error: 'No autorizado: Falta cabecera Authorization' });
        return;
      }

      // Limpiamos el prefijo 'Bearer ' para quedarnos únicamente con el string del Token
      const token = authHeader.replace('Bearer ', '');

      // Verificamos la firma del token con los servidores de Google Auth
      const decodedToken = await admin.auth().verifyIdToken(token);
      const currentUid = decodedToken.uid;

      // ----------------------------------------------------------------------
      // COMPROBACIÓN DE ROL EN FIRESTORE
      // ----------------------------------------------------------------------
      // Buscamos el perfil del usuario que está ejecutando la acción
      const adminDoc = await db.collection('users').doc(currentUid).get();
      if (!adminDoc.exists) {
        response.status(403).send({ success: false, error: 'Usuario ejecutor no válido o inexistente' });
        return;
      }

      const adminData = adminDoc.data();

      // Restringimos la función para que solo administradores o directivos puedan continuar
      if (adminData?.tipo !== 'administrador' && adminData?.tipo !== 'directiva') {
        response.status(403).send({ success: false, error: 'Permisos insuficientes para crear usuarios' });
        return;
      }

      // ----------------------------------------------------------------------
      // CAPTURA Y PROCESAMIENTO DEL CUERPO DE LA PETICIÓN
      // ----------------------------------------------------------------------
      const {
        nombre,
        email,
        password,
        telefono,
        dni,
        direccion,
        numeroSocio,
        tipo,
        foto
      } = request.body.data;

      // ----------------------------------------------------------------------
      // REGISTRO EN FIREBASE AUTHENTICATION
      // ----------------------------------------------------------------------
      // Creamos las credenciales de acceso del nuevo usuario (Email y Contraseña)
      const userRecord = await admin.auth().createUser({ email, password });
      createdUid = userRecord.uid; // Guardamos el UID generado por Firebase para el Rollback si algo falla

      // ----------------------------------------------------------------------
      // PREPARACIÓN DE DATOS PARA FIRESTORE
      // ----------------------------------------------------------------------
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
        estado: 'active', // Al ser creado por administración, el usuario se activa directamente
        createdAt: admin.firestore.FieldValue.serverTimestamp(), // Marca de tiempo del servidor de Google
        creadoPorUid: currentUid,
        creadoPorNombre: adminData?.nombre || 'Administrador'
      };

      // ----------------------------------------------------------------------
      // ESCRITURA EN FIRESTORE (Colecciones: invitedUsers y users)
      // ----------------------------------------------------------------------
      // Registramos la vinculación de la invitación
      await db.collection('invitedUsers').doc(createdUid).set({
        email,
        invitedBy: currentUid,
        used: true,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });

      // Insertamos el documento de perfil del nuevo socio
      await db.collection('users').doc(createdUid).set(userData);

      // Respuesta exitosa devolviendo el UID del nuevo usuario
      response.status(200).send({ success: true, uid: createdUid });

    } catch (error: any) {
      console.error('🚨 Error crítico en createUserByAdmin:', error);

      // ----------------------------------------------------------------------
      // MECANISMO DE ATOMICIDAD (ROLLBACK)
      // ----------------------------------------------------------------------
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

  // Verificamos los permisos del administrador ejecutor
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
    // Deshabilitamos al usuario en el módulo de Firebase Auth
    await admin.auth().updateUser(uid, { disabled: true });

    // Actualizamos su ficha en Firestore reflejando la baja y los datos de auditoría
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

  // Verificamos los privilegios del ejecutor
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
    // Volvemos a habilitar la cuenta en el panel de Firebase Auth
    await admin.auth().updateUser(uid, { disabled: false });

    // Devolvemos el estado a activo en Firestore y registramos la auditoría
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

  // Verificamos la identidad y permisos de la directiva
  const adminDoc = await db.collection('users').doc(currentUid).get();
  const adminData = adminDoc.exists ? adminDoc.data() : null;

  const { uid } = request.data;
  if (!uid) {
    throw new functions.https.HttpsError('invalid-argument', 'El UID del socio a aprobar es requerido.');
  }

  try {
    // Consultamos los datos actuales del socio antes del cambio para poder personalizar el mensaje de alerta
    const socioDoc = await db.collection('users').doc(uid).get();
    const socioData = socioDoc.data();
    const nombreSocio = socioData?.nombre || 'Socio';

    // ----------------------------------------------------------------------
    // ACTUALIZAR ESTADO DEL SOCIO
    // ----------------------------------------------------------------------
    await db.collection('users').doc(uid).update({
      estado: 'active',
      approvedAt: admin.firestore.FieldValue.serverTimestamp(),
      aprobadoPorUid: currentUid,
      aprobadoPorNombre: adminData?.nombre || 'Administrador'
    });

    // ----------------------------------------------------------------------
    // TRANSMISIÓN DE NOTIFICACIÓN PUSH MEDIANTE ENTORNO SEGURO
    // ----------------------------------------------------------------------
    try {
      // Extraemos la colección de tokens de dispositivo asociados a este socio concreto
      const tokensSnapshot = await db.collection(`users/${uid}/tokens`).get();
      const tokensUsuario: string[] = [];

      tokensSnapshot.forEach(tokenDoc => {
        const tokenData = tokenDoc.data();
        if (tokenData.token) tokensUsuario.push(tokenData.token);
      });

      // Si el usuario tiene terminales móviles vinculados, disparamos el envío masivo usando el Template
      if (tokensUsuario.length > 0) {
        // 🚀 LIMPIEZA ABSOLUTA: Delegamos la estructura visual en FcmTemplates
        const messages = tokensUsuario.map(token => 
          FcmTemplates.getSocioAprobadoTemplate(token, nombreSocio)
        );

        await admin.messaging().sendEach(messages); //
        console.log(`... Notificación push enviada con éxito al socio aprobado (UID: ${uid})`); //
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
    // 1. Solicitamos a Google Auth que genere un enlace estándar temporal de recuperación
    const defaultFirebaseLink = await admin.auth().generatePasswordResetLink(email);

    // 2. Extraemos el parámetro seguro 'oobCode' de la URL generada
    const urlParams = new URL(defaultFirebaseLink).searchParams;
    const oobCode = urlParams.get('oobCode');

    if (!oobCode) {
      throw new functions.https.HttpsError('internal', 'No se pudo procesar el código de seguridad oobCode desde Firebase.');
    }

    // 3. Modificamos el destino final apuntando directamente a tu dominio corporativo de desarrollo
    const customResetLink = `https://adcloslocos-desa.web.app/reset-password?oobCode=${oobCode}`;

    // 4. Inyectamos el link personalizado dentro de tu plantilla corporativa HTML
    const correoHtml = EmailTemplates.getPasswordResetTemplate(email, customResetLink);

    // 5. Insertamos la tarea de envío dentro de tu colección 'mail' (para el Trigger del sistema de correo)
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
    // 1. Validamos que el documento del socio realmente exista en Firestore
    const userDoc = await db.collection('users').doc(applicantUid).get();
    if (!userDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'El perfil de usuario asociado no fue localizado en Firestore.');
    }

    // 2. Actualizamos el estado del socio a 'pending_approval' y guardamos la fecha de la solicitud
    await db.collection('users').doc(applicantUid).update({
      estado: 'pending_approval',
      requestedApprovalAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // 3. CONSULTA EN TIEMPO REAL: Contamos el número exacto de solicitudes pendientes en cola
    const pendientesSnapshot = await db.collection('users')
      .where('estado', '==', 'pending_approval')
      .get();
    
    const totalPendientes = pendientesSnapshot.size;

    // 4. Buscamos a toda la directiva y administradores de la peña
    const directivosSnapshot = await db.collection('users')
      .where('tipo', 'in', ['administrador', 'directiva'])
      .get();

    if (directivosSnapshot.empty) {
      console.log('⚠️ Aviso: No se detectaron cuentas de directivos registradas en el sistema.');
      return { success: true, message: 'Estado actualizado. No se pudo notificar a la junta por falta de cuentas directivas.' };
    }

    // 5. Recorremos los directivos localizados y consolidamos todos sus tokens de hardware en un array único
    const tokensDirectiva: string[] = [];

    for (const doc of directivosSnapshot.docs) {
      const tokensSnapshot = await db.collection(`users/${doc.id}/tokens`).get();
      tokensSnapshot.forEach(tokenDoc => {
        const tokenData = tokenDoc.data();
        if (tokenData.token) tokensDirectiva.push(tokenData.token);
      });
    }

    // 6. Si la directiva posee terminales móviles vinculados, realizamos el envío masivo usando el Template dinámico
    if (tokensDirectiva.length > 0) {
      // 🚀 LIMPIEZA ABSOLUTA: Delegamos la estructura del aviso administrativo en FcmTemplates
      const messages = tokensDirectiva.map(token => 
        FcmTemplates.getAvisoDirectivaTemplate(token, totalPendientes, applicantUid)
      );

      await admin.messaging().sendEach(messages); //
      console.log(`... Alerta distribuida a la directiva. Total pendientes en cola: ${totalPendientes}`); //
    } else {
      console.log('ℹ️ Los miembros de la directiva no disponen de la app nativa instalada o sincronizada actualmente.');
    }

    return { success: true, message: 'Ficha guardada y aviso enviado con éxito a los miembros de la directiva.' };

  } catch (error: any) {
    console.error('🚨 Error crítico en requestUserApproval:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});