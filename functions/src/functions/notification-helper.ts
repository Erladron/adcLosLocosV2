import * as admin from 'firebase-admin';

const db = admin.firestore();

// Interfaz para empaquetar el token con su procedencia física en base de datos
export interface DispositivoToken {
  token: string;
  uidUsuario: string;
  tokenId: string;
}

/**
 * Despacha notificaciones de forma masiva y limpia reactivamente en lote (batch) 
 * cualquier token que Google informe que ya no existe (aplicación desinstalada).
 */
export async function enviarConAutoLimpieza(
  dispositivos: DispositivoToken[],
  messages: admin.messaging.Message[]
): Promise<{ successCount: number; failureCount: number }> {
  
  if (dispositivos.length === 0 || messages.length === 0) {
    console.log('ℹ️ [Auto-Limpieza] No se registran mensajes o destinos válidos para procesar.');
    return { successCount: 0, failureCount: 0 };
  }

  // 1. Envío masivo a FCM
  const response = await admin.messaging().sendEach(messages);
  console.log(`📡 [FCM] Distribución finalizada. Éxito: ${response.successCount}, Fallos: ${response.failureCount}`);

  // 2. Si hay rebotes, analizamos cuáles son basura obsoleta
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
          
          const docRef = db.collection(`users/${dispositivoMuerto.uidUsuario}/tokens`).doc(dispositivoMuerto.tokenId);
          batch.delete(docRef);
          residuosEncontrados = true;
        }
      }
    });

    if (residuosEncontrados) {
      await batch.commit();
      console.log('✅ [Auto-Limpieza] Saneamiento en Firestore ejecutado correctamente.');
    }
  }

  return { successCount: response.successCount, failureCount: response.failureCount };
}