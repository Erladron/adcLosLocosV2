import * as functions from 'firebase-functions';

import * as admin from 'firebase-admin';

import cors from 'cors';

admin.initializeApp();

const db = admin.firestore();

const corsHandler = cors({

  origin: true

});

export const createUser =
  functions.https.onRequest(

    (request, response) => {

      corsHandler(

        request,
        response,

        async () => {

          try {

            const {

              nombre,
              email,
              password,
              telefono,
              dni,
              tipo,
              foto

            } = request.body.data;

            // CREAR AUTH USER
            const userRecord =

              await admin.auth()
                .createUser({

                  email,
                  password

                });

            const uid =
              userRecord.uid;

            // CREAR FIRESTORE USER
            await db.collection('users')
              .doc(uid)
              .set({

                uid,

                nombre,

                email,

                telefono,

                dni,

                tipo,

                foto: foto || '',

                createdAt:

                  admin.firestore
                    .FieldValue
                    .serverTimestamp()

              });

            response.status(200).send({

              success: true,
              uid

            });

          } catch (error: any) {

            console.error(error);

            response.status(500).send({

              error: error.message

            });

          }

        }

      );

    }

  );