import { onRequest } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

/** @description Instancia de acceso directo al SDK administrativo de Cloud Firestore. */
const db = admin.firestore();

/**
 * @function createUserByAdmin
 * @description Cloud Function v2 (HTTP Request) que permite a miembros autorizados de la directiva
 * o administradores crear cuentas de usuarios de forma directa. Registra la credencial en Firebase Auth,
 * inicializa el registro en la colecci車n de usuarios y asienta un batch at車mico en Firestore. Incluye 
 * un mecanismo autom芍tico de rollback en Auth si la persistencia de datos falla.
 * Hereda la regi車n global 'europe-west1' configurada en el archivo de 赤ndice.
 * 
 * @param {Request} request - Objeto de petici車n HTTP nativo de Express provisto por Firebase v2.
 * @param {Response} response - Objeto de respuesta HTTP nativo de Express provisto por Firebase v2.
 * 
 * @returns {Promise<void>} Despacha la respuesta HTTP controlada directamente al cliente.
 */
export const createUserByAdmin = onRequest({
  // ??? REPARACI車N S谷NIOR: Habilitamos CORS nativo de la v2. Eliminamos el middleware manual.
  cors: true
}, async (request, response): Promise<void> => {
  let createdUid = '';
  
  try {
    // =========================================================================
    // ?? EXTRACCI車N Y VERIFICACI車N DE TOKENS DE AUTORIZACI車N
    // =========================================================================
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
      response.status(403).send({ success: false, error: 'Usuario ejecutor no v芍lido o nonexistent' });
      return;
    }
    const adminData = adminDoc.data();
    if (adminData?.tipo !== 'administrador' && adminData?.tipo !== 'directiva') {
      response.status(403).send({ success: false, error: 'Permisos insuficientes para crear usuarios' });
      return;
    }

    // =========================================================================
    // ?? EXTRACCI車N Y VALIDACI車N DE LA CARGA 迆TIL (PAYLOAD)
    // =========================================================================
    const userDataPayload = request.body.data?.data || {};

    console.log('====== ?? RADIOGRAF赤A COMPLETA DEL REQUEST REBODIED ======');
    console.log('Objeto completo user:', JSON.stringify(userDataPayload, null, 2));
    console.log('===========================================================');

    const { nombre, email, password, telefono, dni, direccion, numeroSocio, tipo, foto } = userDataPayload;

    console.log('--- ?? [DEBUG BACKEND] DATOS RECIBIDOS EN LA CLOUD FUNCTION ---');
    console.log('Variables desestructuradas para Firebase:', { nombre, email, password, telefono, dni, tipo });
    console.log('--------------------------------------------------------------');

    if (!email || !password) {
      response.status(400).send({
        success: false,
        error: `Campos cr赤ticos ausentes. Email: ${email ? 'OK' : 'FALTA'}, Password: ${password ? 'OK' : 'FALTA'}`
      });
      return;
    }

    // 1?? ALTA DE LA CREDENCIAL DE ACCESO EN FIREBASE AUTHENTICATION
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

    // 2?? BATCH TRANSACCIONAL AS赤NCRONO: PERSISTENCIA EN FIRESTORE
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

    console.debug('?? [PERF] Ejecutando Commit at車mico del Batch...');
    await batch.commit();
    console.debug('? [PERF] Batch asentado con 谷xito en la base de datos.');
    
    // ?? IMPORTANTE: Mantenemos la envoltura en 'data' para compatibilidad con el front-end
    response.status(200).send({
      data: {
        success: true,
        uid: createdUid
      }
    });

  } catch (error: any) {
    console.error('?? Error cr赤tico en createUserByAdmin:', error);
    
    // ?? MECANISMO DE LIQUIDACI車N Y ROLLBACK DE SEGURIDAD
    try {
      if (createdUid) {
        await admin.auth().deleteUser(createdUid);
        console.log(`?? Rollback ejecutado: Usuario ${createdUid} eliminado de Auth con 谷xito.`);
      }
    } catch (rollbackError) {
      console.error('?? Error cr赤tico durante el Rollback de Auth:', rollbackError);
    }
    
    response.status(500).send({
      data: {
        success: false,
        error: error.message
      }
    });
  }
});