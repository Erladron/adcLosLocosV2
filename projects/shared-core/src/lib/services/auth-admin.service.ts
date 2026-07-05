import { Injectable, inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Functions, httpsCallable } from '@angular/fire/functions';
import { ENVIRONMENT } from '../env.token';
import { AppMessageCode } from '../constants/app-message-code.enum';

/**
 * @class AuthAdminService
 * @description Servicio de soporte especializado en la ejecución de procedimientos privilegiados de administración.
 * Consume de forma exclusiva Cloud Functions de Firebase mediante el protocolo seguro HTTPS Callable del SDK,
 * abstrayendo la lógica de tokens e infraestructura tanto en local (emuladores) como en producción.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthAdminService {

  /** @description Instancia inyectada de los tokens de entorno globales de la aplicación. @private */
  private env = inject(ENVIRONMENT);

  /** @description Instancia inyectada del chasis de autenticación modular de Firebase. @private */
  private auth = inject(Auth);

  /** @description Instancia inyectada del módulo core de Firebase Cloud Functions. @private */
  private functions = inject(Functions);

  /**
   * @constructor
   * @description Inicializa el gestor de llamadas privilegiadas de la directiva.
   */
  constructor() { }

  /**
   * @method createUserAsAdmin
   * @description 🚀 REFACTORIZADO: Invoca la Cloud Function encargada de crear de forma síncrona un usuario en el servidor,
   * saltándose la pre-alta civil web. Refactorizado de Fetch manual a HTTPS Callable nativo para unificar el chasis.
   * @param {any} user Datos estructurados del nuevo socio o portero.
   * @returns {Promise<any>} Promesa asíncrona con el resultado emitido por el backend.
   */
  public async createUserAsAdmin(user: any): Promise<any> {
    if (!this.auth.currentUser) {
      throw new Error(AppMessageCode.ADC_AUTH_ERR_0001);
    }

    try {
      // Sustitución del Fetch manual por la abstracción homologada del SDK de Google
      const cloudFunctionCallable = httpsCallable(this.functions, 'createUserByAdmin');
      const response = await cloudFunctionCallable({ data: user });
      return response.data;
    } catch (error: any) {
      console.error('🚨 [AuthAdminService] Error en la ejecución de createUserByAdmin:', error);
      throw new Error(error.message || AppMessageCode.ADC_AUTH_ERR_0006);
    }
  }

  /**
   * @method hasValidAdminSession
   * @description Comprueba mediante doble check de refresco forzado si los tokens de la sesión activa del 
   * operador administrador siguen vigentes y autorizados frente al servidor de identidades.
   * @returns {Promise<boolean>} True si la sesión es solvente, false en caso de revocación o desatención.
   */
  public async hasValidAdminSession(): Promise<boolean> {
    try {
      if (!this.auth.currentUser) {
        return false;
      }

      // Fuerza la re-evaluación del JsonWebToken contra los servidores de Firebase Auth
      await this.auth.currentUser.getIdToken(true);
      return true;
    } catch (error) {
      console.error('🚨 [AuthAdminService] Error crítico validando la sesión de administración:', error);
      return false;
    }
  }

  /**
   * @method getToken
   * @description Extrae de forma asíncrona la cadena del token Bearer JWT activo del usuario logueado.
   * @returns {Promise<string>} Cadena alfanumérica del token de sesión.
   */
  public async getToken(): Promise<string> {
    if (!this.auth.currentUser) {
      throw new Error(AppMessageCode.ADC_AUTH_ERR_0001);
    }
    return await this.auth.currentUser.getIdToken();
  }

  /**
   * @method sendCustomResetPasswordEmail
   * @description Envía el enlace seguro y corporativo de reseteo de contraseñas a la dirección de correo indicada,
   * delegando el proceso en el disparador Cloud Function configurado.
   * @param {string} email Correo electrónico destino del socio aspirante.
   * @returns {Promise<any>} Promesa de resolución del canal de mensajería.
   */
  public async sendCustomResetPasswordEmail(email: string): Promise<any> {
    const sendCustomReset = httpsCallable(this.functions, 'sendCustomPasswordReset');
    return await sendCustomReset({ email });
  }
}