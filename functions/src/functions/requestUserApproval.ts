import { onCall, HttpsError } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { FcmTemplates } from '../constants/fcm-templates';
import { enviarConAutoLimpieza, DispositivoToken } from './notification-helper';

/** @description Instancia de acceso directo al SDK administrativo de Cloud Firestore. */
const db = admin.firestore();

/**
 * @function requestUserApproval
 * @description Cloud Function v2 (Callable) responsable de procesar la solicitud de onboarding 
 * de un nuevo usuario. Almacena de manera atómica el perfil civil ampliado en Firestore, cambia el estado 
 * del solicitante a 'pending_approval' y despacha notificaciones masivas automatizadas (FCM) a los tokens 
 * registrados de la junta directiva y administradores del sistema para avisar del trámite pendiente.
 * Hereda la región global 'europe-west1' configurada en el archivo de índice.
 * 
 * @param {CallableRequest<any>} request - Contexto de la petición HTTP síncrona provisto por Firebase v2.
 * @param {Object} request.data - Carga útil de datos estructurados enviada desde el front-end.
 * @param {string} [request.data.nombre] - Nombre completo del aspirante a registrar.
 * @param {string} [request.data.dni] - Documento Nacional de Identidad del solicitante.
 * @param {string} [request.data.telefono] - Número telefónico de contacto del usuario.
 * @param {string} [request.data.profesion] - Profesión u oficio del aspirante.
 * @param {string} [request.data.direccion] - Dirección postal validada del domicilio.
 * @param {string} [request.data.croppedImage] - Cadena codificada en Base64 o URL de la foto de perfil recortada.
 * @param {Object} request.auth - Contexto de autenticación del usuario solicitante que inicia el onboarding.
 * 
 * @returns {Promise<{ success: boolean, message: string }>} Objeto confirmatorio con la traza de alertas ejecutadas.
 * @throws {HttpsError} Excepciones de red y control de acceso estructuradas para el cliente web o móvil.
 */
export const requestUserApproval = onCall(async (request) => {
  // =========================================================================
  // 🔐 CONTROL DE ACCESO PREVENTIVO: AUTENTICACIÓN LEGÍTIMA
  // =========================================================================
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Operación rechazada: Requiere autenticación de usuario.');
  }
  const applicantUid = request.auth.uid;
  
  // =========================================================================
  // 📥 EXTRACCIÓN Y TRATAMIENTO DEL PAYLOAD UNIFICADO DE ONBOARDING
  // =========================================================================
  const { nombre, dni, telefono, profesion, direccion, croppedImage } = request.data;

  try {
    const userDoc = await db.collection('users').doc(applicantUid).get();
    if (!userDoc.exists) {
      throw new HttpsError('not-found', 'El perfil de usuario asociado no fue localizado en Firestore.');
    }

    // 1️⃣ MUTACIÓN DE DATOS DEL PERFIL CIVIL Y BLOQUEO EN RETENCIÓN
    await db.collection('users').doc(applicantUid).update({
      nombre: nombre || userDoc.data()?.nombre || '',
      dni: dni || userDoc.data()?.dni || '',
      telefono: telefono || userDoc.data()?.telefono || '',
      profesion: profesion || '',
      direccion: direccion || '',
      foto: croppedImage || userDoc.data()?.foto || '',
      estado: 'pending_approval',
      requestedApprovalAt: FieldValue.serverTimestamp()
    });

    // 2️⃣ CÓMPUTO DE SOLICITUDES EN COLA Y EXTRACCIÓN DE CANALES DIRECTIVOS
    const pendientesSnapshot = await db.collection('users').where('estado', '==', 'pending_approval').get();
    const totalPendientes = pendientesSnapshot.size;

    const directivosSnapshot = await db.collection('users').where('tipo', 'in', ['administrador', 'directiva']).get();
    if (directivosSnapshot.empty) {
      return { success: true, message: 'Estado guardado de forma segura. No se pudo alertar a la junta por falta de cuentas directivas.' };
    }

    // 3️⃣ MAPEO Y DIRECCIONAMIENTO DE DISPOSITIVOS ACTIVOS DE LA JUNTA
    const listaDispositivos: DispositivoToken[] = [];
    for (const doc of directivosSnapshot.docs) {
      const tokensSnapshot = await db.collection(`users/${doc.id}/tokens`).get();
      tokensSnapshot.forEach(tokenDoc => {
        const tokenData = tokenDoc.data();
        if (tokenData.token) {
          listaDispositivos.push({
            token: tokenData.token,
            uidUsuario: doc.id,
            tokenId: tokenDoc.id
          });
        }
      });
    }

    // =========================================================================
    // 🚀 ENVÍO MULTICAST DE ALERTA TRANSACCIONAL CON PURGA AUTOMÁTICA (FCM)
    // =========================================================================
    if (listaDispositivos.length > 0) {
      const messages = listaDispositivos.map(item => 
        FcmTemplates.getAvisoDirectivaTemplate(item.token, totalPendientes, applicantUid)
      );
      
      await enviarConAutoLimpieza(listaDispositivos, messages);
    } else {
      console.log('ℹ️ Los miembros de la directiva no disponen de la app nativa instalada o sincronizada actualmente.');
    }
    
    return { success: true, message: 'Ficha guardada y aviso enviado con éxito a los miembros de la directiva.' };
    
  } catch (error: any) {
    console.error('🚨 Error crítico en el proceso atómico de requestUserApproval:', error);
    if (error instanceof HttpsError) throw error;
    throw new HttpsError('internal', error.message);
  }
});