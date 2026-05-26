import * as functions from 'firebase-functions';

import * as admin from 'firebase-admin';

import cors from 'cors';

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
                adminData?.nombre || ''

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
              adminData?.nombre || '',

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
              adminData?.nombre || ''
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
              adminData?.nombre || ''

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