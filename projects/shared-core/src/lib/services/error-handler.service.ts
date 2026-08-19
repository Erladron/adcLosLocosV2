import { Injectable, inject } from '@angular/core';

import { NotificationService } from './notification.service';
import { AppMessageCode } from '../constants/app-message-code.enum';
import { FIREBASE_ERROR_MAP } from '../constants/firebase-error-map';
import { APP_MESSAGES } from '../constants/app-messages';

/**
 * @class ErrorHandlerService
 * @description Interceptor maestro y gestor centralizado de excepciones (Catch-All) del ecosistema.
 * Traduce de forma unificada errores de red, fallos NoSQL de Cloud Firestore, códigos nativos del SDK
 * de Firebase Auth o excepciones de Cloud Functions HTTP en Toasts corporativos amigables.
 */
@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  /** @description Instancia inyectada del despachador unificado de alertas y Toasts. @private */
  private notification = inject(NotificationService);

  /**
   * @constructor
   * @description Inicializa el gestor interceptor de excepciones.
   */
  constructor() { }

  /**
   * @method handle
   * @description Intercepta un error, determina de forma jerárquica el mensaje final traducido
   * que se renderizará de cara al socio y realiza un volcado en consola con formato enriquecido
   * que vincula el código `AppMessageCode`, su descripción oficial, el error técnico original y
   * el stack trace navegable para depuración rápida.
   * Desempaqueta objetos de respuesta complejos devueltos por Cloud Functions HTTP/Callable o
   * errores envueltos en instancias genéricas inspeccionando la matriz `FIREBASE_ERROR_MAP`.
   * 
   * @param {any} error Objeto de excepción capturado por los bloques try/catch de los servicios o componentes.
   * @param {AppMessageCode} [fallbackMessage=AppMessageCode.ACD_SYS_ERR_0001] Código de contingencia por defecto si el fallo no está catalogado.
   * @returns {Promise<void>}
   */
  public async handle(
    error: any,
    fallbackMessage: AppMessageCode = AppMessageCode.ACD_SYS_ERR_0001
  ): Promise<void> {
    
    // 1. Extracción primaria del código directo de Firebase
    let firebaseCode = 
      error?.code || 
      error?.data?.code || 
      error?.error?.code || 
      error?.error?.error || 
      null;

    // 💡 Inspección secundaria: Si no hay error.code explícito, busca la clave dentro del mensaje crudo
    if (!firebaseCode) {
      const rawMsg = error?.message || (typeof error === 'string' ? error : '');
      for (const key of Object.keys(FIREBASE_ERROR_MAP)) {
        if (rawMsg.includes(key)) {
          firebaseCode = key;
          break;
        }
      }
    }

    // Variable para almacenar el código de la app resuelto
    let resolvedCode: AppMessageCode | null = null;

    // 2. Jerarquía A: Resolución automática a través de la matriz oficial de Firebase
    if (firebaseCode && FIREBASE_ERROR_MAP[firebaseCode]) {
      resolvedCode = FIREBASE_ERROR_MAP[firebaseCode];
    } else {
      // 3. Jerarquía B: Validación de mensajes de negocio pre-configurados o claves ACD_
      const rawMessage = 
        error?.data?.error || 
        error?.error?.message || 
        error?.message || 
        (typeof error === 'string' ? error : null);

      if (rawMessage) {
        const errorStr = String(rawMessage);
        if (errorStr.startsWith('ACD_')) {
          resolvedCode = errorStr as AppMessageCode;
        }
      }
    }

    // 4. Si no coincide con ninguna regla, se asigna el mensaje de contingencia/fallback
    if (!resolvedCode) {
      resolvedCode = fallbackMessage;
    }

    // 5. Volcado en consola estructurado con Stack Trace
    const description = APP_MESSAGES[resolvedCode] || 'Sin descripción';
    const rawTechError = error?.message || error?.code || error;
    const stackTrace = error?.stack || error?.error?.stack || error;

    console.warn(
      `⚠️ [${resolvedCode}]: ${description} | Technical Error: ${rawTechError}\n📍 Stack Trace:`, 
      stackTrace
    );

    // 6. Emisión de la notificación visual (Toast/Píldora)
    await this.notification.error(resolvedCode);
  }
}