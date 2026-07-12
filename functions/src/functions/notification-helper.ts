import * as admin from 'firebase-admin';

/** @description Instancia de acceso directo al SDK administrativo de Cloud Firestore. */
const db = admin.firestore();

/**
 * @interface DispositivoToken
 * @description Estructura de datos unificada que vincula un token de mensajería FCM con su 
 * procedencia física y metadatos de almacenamiento dentro de la base de datos de la plataforma.
 */
export interface DispositivoToken {
  /** @property {string} token - Cadena física única del token de registro provisto por el dispositivo móvil o web. */
  token: string;
  /** @property {string} uidUsuario - Identificador unívoco del socio dueño del dispositivo en la colección 'users'. */
  uidUsuario: string;
  /** @property {string} tokenId - ID exclusivo del documento del token dentro del subdirectorio del perfil. */
  tokenId: string;
}

/**
 * @function enviarConAutoLimpieza
 * @description Despacha notificaciones push de forma masiva (multicast) a través de Firebase Cloud Messaging (FCM). 
 * Analiza de forma reactiva las respuestas de error devueltas por Google y ejecuta una purga atómica en lote (Batch) 
 * en Cloud Firestore para eliminar al instante todos los tokens revocados o inválidos (e.g., aplicaciones desinstaladas).
 * 
 * @param {DispositivoToken[]} dispositivos - Array estructurado con los metadatos de direccionamiento de los tokens.
 * @param {admin.messaging.Message[]} messages - Lote equivalente de payloads y plantillas formateadas de mensajes FCM.
 * 
 * @returns {Promise<{ successCount: number, failureCount: number }>} Métricas consolidadas del impacto del envío masivo.
 */
export async function enviarConAutoLimpieza(
  dispositivos: DispositivoToken[],
  messages: admin.messaging.Message[]
): Promise<{ successCount: number; failureCount: number }> {
  
  // =========================================================================
  // 🛡️ CONTROL PREVENTIVO: EVITAR OPERACIONES VACÍAS EN RED
  // =========================================================================
  if (dispositivos.length === 0 || messages.length === 0) {
    console.log('ℹ️ [Auto-Limpieza] No se registran mensajes o destinos válidos para procesar.');
    return { successCount: 0, failureCount: 0 };
  }

  // 1️⃣ DISPARO MASIVO MULTICAST AL SERVIDOR DE FIREBASE CLOUD MESSAGING
  const response = await admin.messaging().sendEach(messages);
  console.log(`📡 [FCM] Distribución finalizada. Éxito: ${response.successCount}, Fallos: ${response.failureCount}`);

  // 2️⃣ ANÁLISIS REACTIVO DE REBOTES Y GESTIÓN DE BASURA OBSOLETA
  if (response.failureCount > 0) {
    const batch = db.batch();
    let residuosEncontrados = false;

    response.responses.forEach((res, index) => {
      if (!res.success) {
        const errorCode = res.error?.code;
        
        // Códigos estándar de Firebase que indican que el token está muerto permanentemente
        if (
          errorCode === 'messaging/invalid-registration-token' || 
          errorCode === 'messaging/registration-token-not-registered'
        ) {
          const dispositivoMuerto = dispositivos[index];
          console.log(`🧹 [Auto-Limpieza] Eliminando token obsoleto del usuario: ${dispositivoMuerto.uidUsuario}`);
          
          // Mapeamos la referencia exacta del subdocumento huérfano
          const docRef = db.collection(`users/${dispositivoMuerto.uidUsuario}/tokens`).doc(dispositivoMuerto.tokenId);
          batch.delete(docRef);
          residuosEncontrados = true;
        }
      }
    });

    // 3️⃣ COMPROMISO ATÓMICO: LIMPIEZA SIMULTÁNEA EN UN SOLO VIAJE A FIRESTORE
    if (residuosEncontrados) {
      await batch.commit();
      console.log('✅ [Auto-Limpieza] Saneamiento en Firestore ejecutado correctamente.');
    }
  }

  return { successCount: response.successCount, failureCount: response.failureCount };
}