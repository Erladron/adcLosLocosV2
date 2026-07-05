import { Injectable, inject } from '@angular/core';

// 🚀 Saneado: Uso de importación relativa interna de la librería compartida
import { NotificationService } from './notification.service';
import { AppMessageCode } from '../constants/app-message-code.enum';
import { FIREBASE_ERROR_MAP } from '../constants/firebase-error-map';

/**
 * @class ErrorHandlerService
 * @description Interceptor maestro y gestor centralizado de excepciones (Catch-All) del ecosistema.
 * Traduce de forma unificada errores de red, fallos NoSQL de Cloud Firestore, códigos nativos del SDK
 * de Firebase Auth o errores imprevistos del hilo de ejecución en Toasts corporativos amigables.
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
   * @description Intercepta un error, realiza un volcado de traza limpio en la consola para depuración
   * y determina de forma jerárquica el mensaje final que se renderizará de cara al socio.
   * Previene fugas de información técnica o strings de depuración crudas en producción.
   * @param {any} error Objeto de excepción capturado por los bloques try/catch de los servicios o componentes.
   * @param {AppMessageCode} [fallbackMessage=AppMessageCode.ADC_SYS_ERR_0001] Código de contingencia por defecto si el fallo no está catalogado.
   * @returns {Promise<void>}
   */
  public async handle(
    error: any,
    fallbackMessage: AppMessageCode = AppMessageCode.ADC_SYS_ERR_0001
  ): Promise<void> {
    
    // 1. Volcado cronológico en la consola del terminal para auditorías de depuración
    console.error('🚨 [ErrorHandlerService] Traza de excepción interceptada:', error);

    // 2. Jerarquía A: Resolución automática a través de la matriz oficial de Firebase
    const firebaseCode = error?.code;
    if (firebaseCode && FIREBASE_ERROR_MAP[firebaseCode]) {
      await this.notification.error(FIREBASE_ERROR_MAP[firebaseCode]);
      return;
    }

    // 3. Jerarquía B: Validación segura de mensajes de negocio pre-configurados
    if (error?.message) {
      const errorStr = String(error.message);
      
      // 🛡️ Filtro de seguridad: Si el mensaje contiene un código tipado de la app o un texto controlado, lo exponemos
      if (errorStr.startsWith('ADC_') || errorStr.length < 120 && !errorStr.includes('http') && !errorStr.includes('Error:')) {
        await this.notification.error(errorStr as AppMessageCode);
        return;
      }
    }

    // 4. Jerarquía C: Activación de la red de seguridad con el mensaje de contingencia unificado
    await this.notification.error(fallbackMessage);
  }
}