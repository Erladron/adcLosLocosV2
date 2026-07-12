import { onCall, HttpsError } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';
import { EmailTemplates } from '../constants/email-templates';

/** @description Instancia de acceso directo al SDK administrativo de Cloud Firestore. */
const db = admin.firestore();

/**
 * @function sendCustomPasswordReset
 * @description Cloud Function v2 (Callable) encargada de interceptar y generar un enlace 
 * personalizado de restablecimiento de contraseña. Extrae de forma segura el código de operación 
 * único (oobCode) de Firebase Auth, ensambla una URL corporativa orientada al dominio del proyecto 
 * y encola un documento estructurado en la colección 'mail' para su distribución vía SMTP.
 * Hereda la región global 'europe-west1' configurada en el archivo de índice.
 * 
 * @param {CallableRequest<any>} request - Contexto de la petición HTTP síncrona provisto por Firebase v2.
 * @param {Object} request.data - Carga útil de datos estructurados enviada desde el front-end.
 * @param {string} request.data.email - Dirección de correo electrónico del usuario que solicita el cambio.
 * 
 * @returns {Promise<{ success: boolean, message: string }>} Objeto confirmatorio del encolamiento del correo.
 * @throws {HttpsError} Excepciones de red y argumentos inválidos formateadas para el cliente.
 */
export const sendCustomPasswordReset = onCall(async (request) => {
  // =========================================================================
  // 📥 EXTRACCIÓN Y VALIDACIÓN DE PARÁMETROS MIGRADA A V2
  // =========================================================================
  const { email } = request.data;
  if (!email) {
    throw new HttpsError('invalid-argument', 'El correo electrónico es un parámetro obligatorio.');
  }

  try {
    // 1️⃣ GENERACIÓN DEL ENLACE POR DEFECTO Y EXTRACCIÓN DEL TOKEN OOB
    const defaultFirebaseLink = await admin.auth().generatePasswordResetLink(email);
    const urlParams = new URL(defaultFirebaseLink).searchParams;
    const oobCode = urlParams.get('oobCode');
    
    if (!oobCode) {
      throw new HttpsError('internal', 'No se pudo procesar el código de seguridad oobCode desde Firebase.');
    }

    // 2️⃣ MAQUETACIÓN CORPORATIVA DE LA URL Y MAQUETA HTML
    const customResetLink = `https://adcloslocos-desa.web.app/reset-password?oobCode=${oobCode}`;
    const correoHtml = EmailTemplates.getPasswordResetTemplate(email, customResetLink);

    // 3️⃣ INSERCIÓN EN LA COLA DE DISTRIBUCIÓN (TRIGGER DE LA EXTENSIÓN SMTP)
    await db.collection('mail').add({
      to: email,
      message: {
        subject: '🔑 Cambio de contraseña - A.D.C. Los Locos',
        html: correoHtml
      }
    });

    return { success: true, message: 'Correo corporativo directo encolado con éxito.' };

  } catch (error: any) {
    console.error('🚨 Error generando el enlace premium de reseteo:', error);
    if (error instanceof HttpsError) throw error;
    throw new HttpsError('internal', 'No se pudo completar el flujo de reajuste de contraseña.');
  }
});