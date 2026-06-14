import { onRequest } from 'firebase-functions/v2/https';
import { getFirestore } from 'firebase-admin/firestore';
import * as admin from 'firebase-admin';

// Cambia el antiguo import por este require directo:
const usuariosSemilla = require('../constants/usuarios_test.json');

// ==========================================
// 2️⃣ ENDPOINT: INICIALIZACIÓN DE ALTAS MAESTRAS
// ==========================================
export const inicializarTest = onRequest({ cors: true }, async (req, res) => {
  // 🛡️ Barrera de seguridad para el entorno local
  if (process.env.FUNCTIONS_EMULATOR !== 'true') {
    res.status(403).send('Acción denegada: Este endpoint es exclusivo del entorno de emuladores.');
    return;
  }

  const db = getFirestore();

  try {
    // Recorremos secuencialmente el array importado del JSON
    for (const u of usuariosSemilla) {
      const userRef = db.collection('users').doc(u.uid);
      const invitedUsersRef = db.collection('invitedUsers').doc(u.uid);
      const doc = await userRef.get();
      const docInv = await userRef.get();


      console.log(`🌱 [INICIALIZAR-TEST] SE va a insertar: ${u.nombre}`);
      // Si el emulador se ha reiniciado o el usuario no existe, lo sembramos
      if (!doc.exists) {
        // A. Alta en Firebase Authentication nativo
        await admin.auth().createUser({
          uid: u.uid,
          email: u.email,
          password: 'PasswordSegura123!', // Contraseña maestra estándar para tus tests
          displayName: u.nombre
        });

        if (!docInv.exists && u.invitedData) {
          // B. Alta en invitedUsers conservando tipos, booleanos y strings vacíos del JSON
          await invitedUsersRef.set({
            ...u.invitedData,
            fechaInvitacion: new Date()
          });
        }

        // C. Alta en users conservando tipos, booleanos y strings vacíos del JSON
        await userRef.set({
          ...u.firestoreData,
          createdAt: new Date().toISOString()
        });

        console.log(`🌱 [INICIALIZAR-TEST] Usuario creado por completo: ${u.nombre}`);
      }
    }

    res.status(200).send({ success: true, message: 'Siembra de usuarios de prueba completada con éxito.' });
  } catch (error: any) {
    console.error('🚨 Error al inicializar usuarios semilla:', error);
    res.status(500).send({ success: false, error: error.message });
  }
});


export const borrarUsuarioPorEmailDev = onRequest({ cors: true }, async (req, res) => {
  // 🔒 Seguridad básica de entorno: Solo permitir ejecuciones en el emulador local
  if (process.env.FUNCTIONS_EMULATOR !== 'true') {
    res.status(403).send('Operación solo permitida en entorno de desarrollo/emuladores');
    return;
  }

  const email = req.body.email;
  if (!email) {
    res.status(400).send('Falta el parámetro email en el cuerpo de la petición');
    return;
  }

  try {
    // 1️⃣ Buscar y borrar en Firebase Authentication
    try {
      const userRecord = await admin.auth().getUserByEmail(email);
      await admin.auth().deleteUser(userRecord.uid);
      console.log(`✅ Usuario ${email} eliminado de Authentication.`);
    } catch (authError: any) {
      // Si el usuario no existe en Auth, ignoramos el error para que continúe limpiando Firestore
      console.log(`ℹ️ El usuario ${email} no existía en Auth.`);
    }

    // 2️⃣ Buscar y borrar el documento en Firestore (en tu colección de invitedUsers)
    // Cambia 'usuarios' por el nombre exacto de tu colección (ej. 'users') si fuese diferente
    const invitedUserSnapshot = await admin.firestore()
      .collection('invitedUsers')
      .where('email', '==', email)
      .get();

    const batch1 = admin.firestore().batch();
    invitedUserSnapshot.docs.forEach((doc) => {
      batch1.delete(doc.ref);
    });
    await batch1.commit();

    // 2️⃣ Buscar y borrar el documento en Firestore (en tu colección de usuarios)
    // Cambia 'usuarios' por el nombre exacto de tu colección (ej. 'users') si fuese diferente
    const usuariosSnapshot = await admin.firestore()
      .collection('users')
      .where('email', '==', email)
      .get();

    const batch2 = admin.firestore().batch();
    usuariosSnapshot.docs.forEach((doc) => {
      batch2.delete(doc.ref);
    });
    await batch2.commit();
    console.log(`✅ Documentos de ${email} eliminados de Firestore.`);

    res.status(200).send({ message: `Usuario ${email} fulminado con éxito de Auth y Firestore.` });
  } catch (error: any) {
    console.error('❌ Error al borrar el usuario:', error);
    res.status(500).send({ error: error.message });
  }
});