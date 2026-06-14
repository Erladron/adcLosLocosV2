import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { EmailTemplates } from '../constants/email-templates';

const db = admin.firestore();

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