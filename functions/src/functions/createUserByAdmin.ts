import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { EmailTemplates } from '../constants/email-templates';

/** @description Instancia de acceso directo al SDK administrativo de Cloud Firestore. */
const db = getFirestore();

/** @description Instancia de acceso directo al SDK administrativo de Firebase Authentication[cite: 8]. */
const auth = getAuth();

/**
 * @function createUserByAdmin
 * @description Cloud Function v2 (HTTPS Callable) que permite a miembros autorizados de la directiva
 * o administradores crear cuentas de usuarios de forma directa[cite: 8]. Registra la credencial en Firebase Auth
 * utilizando la clave temporal provista por el cliente para el flujo de notificación por WhatsApp[cite: 8], 
 * inicializa el registro en la colección de usuarios asentando la bandera 'requiereCambioClave: true'[cite: 8]
 * y ejecuta un batch atómico en Firestore[cite: 8]. 
 * Incluye un mecanismo automático de rollback en Auth si la persistencia de datos falla[cite: 8].
 * Hereda la región global 'europe-west1' configurada en el archivo de índice[cite: 8].
 * 
 * @param {CallableRequest} request - Objeto de petición estructurado nativo de Firebase Callable v2[cite: 8, 10].
 * 
 * @returns {Promise<{ success: boolean; uid: string }>} Objeto JSON con el estado de la operación y el UID generado[cite: 8].
 * @throws {HttpsError} Reenvía la excepción nativa capturada para su posterior procesamiento en el frontend[cite: 8].
 */
export const createUserByAdmin = onCall({
  cors: true
}, async (request) => {
  let createdUid = '';

  try {
    // =========================================================================
    // 🔐 EXTRACCIÓN Y VERIFICACIÓN DE AUTENTICACIÓN
    // =========================================================================
    if (!request.auth) {
      console.warn('⚠️ Intento de ejecución no autenticado en createUserByAdmin.');
      throw new HttpsError('unauthenticated', 'auth/unauthenticated');
    }

    const currentUid = request.auth.uid;
    const adminDoc = await db.collection('users').doc(currentUid).get();

    if (!adminDoc.exists) {
      console.warn(`⚠️ Usuario ejecutor inexistente en Firestore: ${currentUid}`);
      throw new HttpsError('permission-denied', 'permission-denied');
    }

    const adminData = adminDoc.data();
    if (adminData?.tipo !== 'administrador' && adminData?.tipo !== 'directiva') {
      console.warn(`⚠️ Intento de alta sin permisos por parte del usuario: ${currentUid}`);
      throw new HttpsError('permission-denied', 'permission-denied');
    }

    // =========================================================================
    // 📥 EXTRACCIÓN Y VALIDACIÓN DE LA CARGA ÚTIL (PAYLOAD)
    // =========================================================================
    const userDataPayload = request.data?.data || request.data || {};

    console.log('====== 📥 RADIOGRAFÍA COMPLETA DEL REQUEST CALLABLE ======');
    console.log('Objeto completo user:', JSON.stringify(userDataPayload, null, 2));
    console.log('===========================================================');

    const { nombre, email, password, telefono, dni, direccion, numeroSocio, tipo, foto } = userDataPayload;

    console.log('--- 🔍 [DEBUG BACKEND] DATOS RECIBIDOS EN LA CLOUD FUNCTION ---');
    console.log('Variables desestructuradas para Firebase:', { nombre, email, password, telefono, dni, tipo });
    console.log('--------------------------------------------------------------');

    if (!email || !password) {
      console.error('❌ Validación fallida: Email o password ausentes.');
      throw new HttpsError('invalid-argument', 'auth/invalid-email');
    }

    // =========================================================================
    // 1️⃣ ALTA DE LA CREDENCIAL EN FIREBASE AUTHENTICATION
    // =========================================================================
    const userRecord = await auth.createUser({ email, password });
    createdUid = userRecord.uid;
    console.log(`✅ Credencial creada en Firebase Auth con UID: ${createdUid}`);

    // =========================================================================
    // 2️⃣ CONSTRUCCIÓN DEL MODELO Y BATCH TRANSACCIONAL EN FIRESTORE
    // =========================================================================
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
      createdAt: FieldValue.serverTimestamp(),
      creadoPorUid: currentUid,
      creadoPorNombre: adminData?.nombre || 'Administrador',
      requiereCambioClave: true
    };

    const batch = db.batch();

    const invitedRef = db.collection('invitedUsers').doc(createdUid);
    batch.set(invitedRef, {
      email,
      invitedBy: currentUid,
      used: true,
      createdAt: FieldValue.serverTimestamp()
    });

    const userRef = db.collection('users').doc(createdUid);
    batch.set(userRef, userData);

    console.debug('🚀 [PERF] Ejecutando Commit atómico del Batch...');
    await batch.commit();
    console.debug('✅ [PERF] Batch asentado con éxito en la base de datos.');

    // =========================================================================
    // 3️⃣ RESPUESTA DE ÉXITO RETORNANDO EL PAYLOAD TIPADO
    // =========================================================================
    const onboardingUrl = 'https://acdloslocos-onboarding-desa.web.app/welcome';

    const correoHtml = EmailTemplates.getWelcomeCredentialsTemplate(
      userData.nombre || 'Socio',
      userData.email,
      password,
      onboardingUrl
    );

    // Encolar mensaje para el trigger de envío SMTP
    await db.collection('mail').add({
      to: userData.email,
      message: {
        subject: '🎉 Bienvenido a A.D.C. Los Locos - Tus credenciales de acceso',
        html: correoHtml
      }
    });

    return {
      success: true,
      uid: createdUid
    };

  } catch (error: any) {
    console.error('🚨 Error crítico en createUserByAdmin:', error);

    // 🛡️ MECANISMO DE LIQUIDACIÓN Y ROLLBACK DE SEGURIDAD
    try {
      if (createdUid) {
        await auth.deleteUser(createdUid);
        console.log(`🧹 Rollback ejecutado: Usuario ${createdUid} eliminado de Auth con éxito.`);
      }
    } catch (rollbackError) {
      console.error('🚨 Error crítico durante el Rollback de Auth:', rollbackError);
    }

    // Si la excepción ya es de tipo HttpsError, la relanzamos tal cual
    if (error instanceof HttpsError) {
      throw error;
    }

    // Reenviamos el código de error nativo original de Firebase Auth (ej: 'auth/email-already-exists')
    // para que sea el FIREBASE_ERROR_MAP del frontend quien lo traduzca.
    const rawCode = error.code || 'internal';
    const rawMessage = error.message || 'Error en el servidor';

    throw new HttpsError('internal', rawCode, rawMessage);
  }
});