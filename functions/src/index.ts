import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import cors from 'cors';
import { EmailTemplates } from './email-templates';

admin.initializeApp();

const db = admin.firestore();

const corsHandler = cors({
  origin: true
});

// =================================
// CREATE USER BY ADMIN
// =================================

export const createUserByAdmin =
  functions.https.onRequest(

    (request, response) => {

      corsHandler(

        request,
        response,

        async () => {

          let createdUid = '';

          try {

            // =========================
            // TOKEN
            // =========================

            const authHeader =

              request.headers.authorization;

            if (!authHeader) {

              response.status(401).send({

                success: false,

                error: 'Unauthorized'

              });

              return;

            }

            const token =

              authHeader.replace(
                'Bearer ',
                ''
              );

            // =========================
            // VERIFY TOKEN
            // =========================

            const decodedToken =

              await admin.auth()
                .verifyIdToken(token);


            const currentUid =
              decodedToken.uid;
            // =========================
            // USER ROLE
            // =========================

            const adminDoc =

              await db
                .collection('users')
                .doc(decodedToken.uid)
                .get();

            if (!adminDoc.exists) {

              response.status(403).send({

                success: false,

                error:
                  'Usuario no válido'

              });

              return;

            }

            const adminData =
              adminDoc.data();

            // =========================
            // ROLE CHECK
            // =========================

            if (

              adminData?.tipo !==
              'administrador'

              &&

              adminData?.tipo !==
              'directiva'

            ) {

              response.status(403).send({

                success: false,

                error:
                  'Sin permisos'

              });

              return;

            }

            // =========================
            // BODY DATA
            // =========================

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

            // =========================
            // AUTH
            // =========================

            const userRecord =

              await admin.auth()
                .createUser({

                  email,
                  password

                });

            createdUid =
              userRecord.uid;

            // =========================
            // USER DATA
            // =========================

            const userData = {

              uid:
                createdUid,

              numeroSocio:
                numeroSocio || '',

              nombre:
                nombre || '',

              telefono:
                telefono || '',

              email,

              dni:
                dni || '',

              direccion:
                direccion || '',

              foto:
                foto || '',

              tipo:
                tipo || 'invitado',

              estado:
                'active',

              createdAt:

                admin.firestore
                  .FieldValue
                  .serverTimestamp(),

              creadoPorUid:
                currentUid,

              creadoPorNombre:
                adminData?.nombre || 'Administrador'

            };

            // =========================
            // INVITED USERS
            // =========================

            await db
              .collection(
                'invitedUsers'
              )
              .doc(createdUid)
              .set({

                email,

                invitedBy:
                  decodedToken.uid,

                used: true,

                createdAt:

                  admin.firestore
                    .FieldValue
                    .serverTimestamp()

              });

            // =========================
            // USERS
            // =========================

            await db
              .collection('users')
              .doc(createdUid)
              .set(userData);

            // =========================
            // RESPONSE OK
            // =========================

            response.status(200).send({

              success: true,

              uid:
                createdUid

            });

          }

          catch (error: any) {

            console.error(error);

            // =========================
            // ROLLBACK AUTH
            // =========================

            try {

              if (createdUid) {

                await admin
                  .auth()
                  .deleteUser(
                    createdUid
                  );

              }

            }

            catch (rollbackError) {

              console.error(

                'Rollback error',

                rollbackError

              );

            }

            // =========================
            // ERROR RESPONSE
            // =========================

            response.status(500).send({

              success: false,

              error:
                error.message

            });

          }

        }

      );

    }

  );

// =================================
// DEACTIVATE USER
// =================================

export const deactivateUser =
  functions.https.onCall(

    async (request) => {

      // =========================
      // AUTH
      // =========================

      if (!request.auth) {

        throw new functions
          .https
          .HttpsError(

            'unauthenticated',

            'Usuario no autenticado'

          );

      }

      const currentUid =
        request.auth.uid;

      // =========================
      // USER DATA
      // =========================

      const adminDoc =

        await db
          .collection('users')
          .doc(currentUid)
          .get();

      if (!adminDoc.exists) {

        throw new functions
          .https
          .HttpsError(

            'permission-denied',

            'Usuario no válido'

          );

      }

      const adminData =
        adminDoc.data();

      // =========================
      // ROLE CHECK
      // =========================

      if (

        adminData?.tipo !==
        'administrador'

        &&

        adminData?.tipo !==
        'directiva'

      ) {

        throw new functions
          .https
          .HttpsError(

            'permission-denied',

            'Sin permisos'

          );

      }

      // =========================
      // DATA
      // =========================

      const {

        uid,
        motivo

      } = request.data;

      if (!uid) {

        throw new functions
          .https
          .HttpsError(

            'invalid-argument',

            'UID requerido'

          );

      }

      try {

        // =========================
        // DISABLE FIREBASE AUTH
        // =========================

        await admin
          .auth()
          .updateUser(

            uid,

            {

              disabled: true

            }

          );

        // =========================
        // UPDATE FIRESTORE
        // =========================

        await db
          .collection('users')
          .doc(uid)
          .update({

            estado:
              'inactive',

            deactivatedAt:

              admin.firestore
                .FieldValue
                .serverTimestamp(),

            bajaRealizadaPorUid:
              currentUid,

            bajaRealizadaPorNombre:
              adminData?.nombre || 'Administrador',

            motivoBaja:
              motivo || ''

          });

        return {

          success: true

        };

      }

      catch (error: any) {

        console.error(error);

        throw new functions
          .https
          .HttpsError(

            'internal',

            error.message

          );

      }

    }

  );

// =================================
// REACTIVATE USER
// =================================

export const reactivateUser =
  functions.https.onCall(

    async (request) => {

      // =========================
      // AUTH
      // =========================

      if (!request.auth) {

        throw new functions
          .https
          .HttpsError(

            'unauthenticated',

            'Usuario no autenticado'

          );

      }

      const currentUid =
        request.auth.uid;

      // =========================
      // USER DATA
      // =========================

      const adminDoc =

        await db
          .collection('users')
          .doc(currentUid)
          .get();

      if (!adminDoc.exists) {

        throw new functions
          .https
          .HttpsError(

            'permission-denied',

            'Usuario no válido'

          );

      }

      const adminData =
        adminDoc.data();

      // =========================
      // ROLE CHECK
      // =========================

      if (

        adminData?.tipo !==
        'administrador'

        &&

        adminData?.tipo !==
        'directiva'

      ) {

        throw new functions
          .https
          .HttpsError(

            'permission-denied',

            'Sin permisos'

          );

      }

      // =========================
      // DATA
      // =========================

      const { uid } = request.data;

      if (!uid) {

        throw new functions
          .https
          .HttpsError(

            'invalid-argument',

            'UID requerido'

          );

      }

      try {

        // =========================
        // ENABLE FIREBASE AUTH
        // =========================

        await admin
          .auth()
          .updateUser(

            uid,

            {

              disabled: false

            }

          );

        // =========================
        // UPDATE FIRESTORE
        // =========================

        await db
          .collection('users')
          .doc(uid)
          .update({

            estado:
              'active',

            reactivatedAt:

              admin.firestore
                .FieldValue
                .serverTimestamp(),

            reactivadoPorUid:
              currentUid,

            reactivadoPorNombre:
              adminData?.nombre || 'Administrador'
          });

        return {

          success: true

        };

      }

      catch (error: any) {

        console.error(error);

        throw new functions
          .https
          .HttpsError(

            'internal',

            error.message

          );

      }

    }

  );

// =================================
// APPROVE USER
// =================================

export const approveUser =
  functions.https.onCall(

    async (request) => {

      // =========================
      // AUTH
      // =========================

      if (!request.auth) {

        throw new functions
          .https
          .HttpsError(

            'unauthenticated',

            'Usuario no autenticado'

          );

      }

      const currentUid =
        request.auth.uid;

      // =========================
      // ADMIN DATA
      // =========================

      const adminDoc =

        await db
          .collection('users')
          .doc(currentUid)
          .get();

      if (!adminDoc.exists) {

        throw new functions
          .https
          .HttpsError(

            'permission-denied',

            'Usuario no válido'

          );

      }

      const adminData =
        adminDoc.data();

      // =========================
      // ROLE CHECK
      // =========================

      if (

        adminData?.tipo !==
        'administrador'

        &&

        adminData?.tipo !==
        'directiva'

      ) {

        throw new functions
          .https
          .HttpsError(

            'permission-denied',

            'Sin permisos'

          );

      }

      // =========================
      // DATA
      // =========================

      const { uid } =
        request.data;

      if (!uid) {

        throw new functions
          .https
          .HttpsError(

            'invalid-argument',

            'UID requerido'

          );

      }

      try {

        // =========================
        // UPDATE USER
        // =========================

        await db
          .collection('users')
          .doc(uid)
          .update({

            estado: 'active',

            approvedAt:

              admin.firestore
                .FieldValue
                .serverTimestamp(),

            aprobadoPorUid:
              currentUid,

            aprobadoPorNombre:
              adminData?.nombre || 'Administrador'

          });

        return {

          success: true

        };

      }

      catch (error: any) {

        console.error(error);

        throw new functions
          .https
          .HttpsError(

            'internal',

            error.message

          );

      }

    }

  );

export const sendCustomPasswordReset = functions.https.onCall(async (request) => {
  const { email } = request.data;

  if (!email) {
      throw new functions.https.HttpsError('invalid-argument', 'El email es obligatorio');
  }

  try {
      // 1. Le pedimos a Firebase que genere el enlace estándar (el que va a su web fea)
      const defaultFirebaseLink = await admin.auth().generatePasswordResetLink(email);

      // 2. Extraemos el código secreto 'oobCode' usando una expresión regular o URLSearchParams
      const urlParams = new URL(defaultFirebaseLink).searchParams;
      const oobCode = urlParams.get('oobCode');

      if (!oobCode) {
          throw new functions.https.HttpsError('internal', 'No se pudo extraer el código de seguridad.');
      }

      // 3. 🚀 CONSTRUIMOS TU ENLACE PREMIUM PERSONALIZADO A MANO
      // Apuntamos directamente a tu Hosting saltándonos a Firebase por el camino
      const customResetLink = `https://adcloslocos-desa.web.app/reset-password?oobCode=${oobCode}`;

      // 4. Generamos el HTML con vuestro diseño y tu enlace directo
      const correoHtml = EmailTemplates.getPasswordResetTemplate(email, customResetLink);

      // 5. Lo metemos en la colección de correo para el Trigger
      await db.collection('mail').add({
          to: email,
          message: {
              subject: '🔑 Cambio de contraseña - A.D.C. Los Locos',
              html: correoHtml
          }
      });

      return { success: true, message: 'Correo corporativo directo enviado con éxito.' };

  } catch (error: any) {
      console.error("Error generando el link directo de reset:", error);
      throw new functions.https.HttpsError('internal', 'No se pudo procesar la solicitud de contraseña.');
  }
});