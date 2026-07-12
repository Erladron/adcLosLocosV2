import { onRequest } from 'firebase-functions/v2/https';
import { getFirestore } from 'firebase-admin/firestore';
import * as admin from 'firebase-admin';

/**
 * @typedef {Object} InvitedDataMock
 * @property {string} id - Identificador único de la invitación, correlativo al UID.
 * @property {string} email - Correo electrónico del usuario invitado.
 * @property {string} invitadoPor - Nombre descriptivo del administrador que expide el pase.
 * @property {string} invitadoPorUid - UID del administrador que genera la invitación.
 * @property {string} nombre - Nombre del invitado (inicialmente vacío hasta el onboarding).
 * @property {string} telefono - Teléfono del invitado (inicialmente vacío).
 * @property {boolean} usado - Flag que determina si el código de invitación ya ha sido consumido.
 */

/**
 * @typedef {Object} FirestoreDataMock
 * @property {string} detallesDireccion - Información complementaria del domicilio (piso, puerta).
 * @property {string} direccion - Dirección postal completa y validada.
 * @property {string} dni - Documento Nacional de Identidad con letra calculada.
 * @property {string} email - Correo electrónico institucional del registro.
 * @property {('active'|'inactive'|'pending_approval'|'pending_data')} estado - Estado del flujo del ciclo de vida del socio.
 * @property {string} foto - URL o avatar dinámico del perfil.
 * @property {string} nombre - Nombre completo del socio.
 * @property {string} [numeroSocio] - Código secuencial de socio (exclusivo para directiva y socios activos).
 * @property {string} profesion - Ocupación u oficio del usuario.
 * @property {boolean} publicarEmail - Flag de privacidad para visibilidad de correo entre miembros.
 * @property {boolean} publicarTelefono - Flag de privacidad para visibilidad de teléfono entre miembros.
 * @property {string} telefono - Número de contacto telefónico.
 * @property {('administrador'|'directiva'|'socio'|'portero'|'invitado')} tipo - Rol jerárquico asignado en la plataforma.
 */

/**
 * @typedef {Object} UsuarioSemilla
 * @property {string} uid - Identificador único global (UID) generado para Firebase Authentication.
 * @property {string} email - Correo electrónico maestro utilizado para las credenciales de Login.
 * @property {string} nombre - Nombre descriptivo del perfil de pruebas.
 * @property {FirestoreDataMock} firestoreData - Objeto con la réplica exacta de datos para la colección 'users'.
 * @property {InvitedDataMock} [invitedData] - Metadatos opcionales de invitación para la colección 'invitedUsers'.
 */

// 🚀 AHORA LE ASIGNAMOS EL TIPO AL REQUIRE PARA QUE TU IDE TENGA INTELLISENSE COMPLETO:
/** @type {UsuarioSemilla[]} */
const usuariosSemilla = require('../constants/usuarios_test.json');

/**
 * @function inicializarTest
 * @description Cloud Function v2 (HTTP Request) exclusiva para el entorno de emuladores locales. 
 * Se encarga de sembrar la base de datos de desarrollo de forma determinista inyectando las identidades 
 * del archivo JSON JSON tanto en Firebase Authentication como en las colecciones correspondientes de Firestore.
 * Hereda la región global 'europe-west1' configurada en el archivo de índice.
 * 
 * @param {Request} req - Objeto de petición HTTP nativo de Express provisto por Firebase v2.
 * @param {Response} res - Objeto de respuesta HTTP nativo de Express provisto por Firebase v2.
 * 
 * @returns {Promise<void>} Despacha la respuesta HTTP de éxito o denegación al cliente de pruebas.
 */
export const inicializarTest = onRequest({ cors: true }, async (req, res): Promise<void> => {
  // 🛡️ BARRERA DE SEGURIDAD ABSOLUTA: Evitamos ejecuciones accidentales en entornos de staging o producción
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
      // 🎯 REPARACIÓN SÉNIOR: Apuntamos la lectura al documento correcto de la colección de invitaciones
      const docInv = await invitedUsersRef.get(); 

      console.log(`🌱 [INICIALIZAR-TEST] Se va a evaluar la inserción de: ${u.nombre}`);
      
      // Si el emulador se ha reiniciado o el usuario no existe, lo sembramos de cero
      if (!doc.exists) {
        // A. Alta en el registro centralizado de Firebase Authentication nativo
        await admin.auth().createUser({
          uid: u.uid,
          email: u.email,
          password: 'PasswordSegura123!', // Contraseña maestra estándar unificada para Cypress
          displayName: u.nombre
        });

        // B. Alta en invitedUsers conservando tipos, booleanos y strings vacíos del JSON original
        if (!docInv.exists && u.invitedData) {
          await invitedUsersRef.set({
            ...u.invitedData,
            fechaInvitacion: new Date()
          });
        }

        // C. Alta en la colección de perfiles de usuario conservando metadatos feriales
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

/**
 * @function borrarUsuarioPorEmailDev
 * @description Cloud Function v2 (HTTP Request) exclusiva para el entorno de emuladores locales. 
 * Actúa como un limpiador atómico de base de datos entre ejecuciones de Cypress. Busca y purga 
 * por completo un correo electrónico de Firebase Authentication y remueve en cascada sus documentos 
 * vinculados mediante operaciones Batch en las colecciones 'users' e 'invitedUsers'.
 * Hereda la región global 'europe-west1' configurada en el archivo de índice.
 * 
 * @param {Request} req - Objeto de petición HTTP conteniendo el payload en el body.
 * @param {string} req.body.email - Correo electrónico del usuario objetivo que será fulminado.
 * @param {Response} res - Objeto de respuesta HTTP nativo de Express provisto por Firebase v2.
 * 
 * @returns {Promise<void>} Confirma la purga radical del usuario al runner del test.
 */
export const borrarUsuarioPorEmailDev = onRequest({ cors: true }, async (req, res): Promise<void> => {
  // 🔒 Seguridad de entorno: Solo permitir ejecuciones destructivas en el emulador local
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
    // 1️⃣ LOCALIZACIÓN Y ELIMINACIÓN DE LA CREDENCIAL EN FIREBASE AUTHENTICATION
    try {
      const userRecord = await admin.auth().getUserByEmail(email);
      await admin.auth().deleteUser(userRecord.uid);
      console.log(`✅ Usuario ${email} eliminado de Authentication.`);
    } catch (authError: any) {
      // Si el usuario ya fue limpiado previamente de Auth, ignoramos para no interrumpir el flujo en Firestore
      console.log(`ℹ️ El usuario ${email} no existía en Auth. Continuando con Firestore...`);
    }

    // 2️⃣ PURGA MEDIANTE COMPROMISO BATCH EN LA COLECCIÓN DE INVITACIONES (invitedUsers)
    const invitedUserSnapshot = await admin.firestore()
      .collection('invitedUsers')
      .where('email', '==', email)
      .get();

    const batch1 = admin.firestore().batch();
    invitedUserSnapshot.docs.forEach((doc) => {
      batch1.delete(doc.ref);
    });
    await batch1.commit();

    // 3️⃣ PURGA MEDIANTE COMPROMISO BATCH EN LA COLECCIÓN DE PERFILES ACTIVOS (users)
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