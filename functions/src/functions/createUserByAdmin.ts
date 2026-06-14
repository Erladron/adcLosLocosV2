import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import cors from 'cors';
import { FieldValue } from 'firebase-admin/firestore';

const db = admin.firestore();
const corsHandler = cors({ origin: true });

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
        response.status(403).send({ success: false, error: 'Usuario ejecutor no válido o nonexistent' });
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
        createdAt: FieldValue.serverTimestamp(),
        creadoPorUid: currentUid,
        creadoPorNombre: adminData?.nombre || 'Administrador'
      };

      await db.collection('invitedUsers').doc(createdUid).set({
        email,
        invitedBy: currentUid,
        used: true,
        createdAt: FieldValue.serverTimestamp()
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