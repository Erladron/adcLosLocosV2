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
            // ALTA ADMIN
            // =========================

            const autoAprobado = true;

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
                tipo || 'socio',

              aprobado:
                autoAprobado,

              estadoSolicitud:
                'aprobado',

              perfilCompleto: true,

              createdAt:

                admin.firestore
                  .FieldValue
                  .serverTimestamp()

            };

            // =========================
            // PREREGISTER
            // =========================

            await db
              .collection(
                'preRegister'
              )
              .doc(createdUid)
              .set({

                email,

                invitedBy:
                  decodedToken.uid,

                createdAt:

                  admin.firestore
                    .FieldValue
                    .serverTimestamp()

              });

            // =========================
            // REGISTERED USERS
            // =========================

            await db
              .collection(
                'registeredUsers'
              )
              .doc(createdUid)
              .set(userData);

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

          } catch (error: any) {

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

            } catch (rollbackError) {

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