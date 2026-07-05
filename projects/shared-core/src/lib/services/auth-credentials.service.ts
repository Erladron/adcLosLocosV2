import { Injectable, inject } from '@angular/core';
import { 
  Auth, 
  EmailAuthProvider, 
  reauthenticateWithCredential, 
  updatePassword, 
  verifyBeforeUpdateEmail 
} from '@angular/fire/auth';
import { AppMessageCode } from '../constants/app-message-code.enum';

/**
 * @class AuthCredentialsService
 * @description Servicio core de seguridad perimetral encargado de gestionar las mutaciones críticas
 * de credenciales de acceso (email y contraseñas). Implementa los protocolos obligatorios de
 * re-autenticación en caliente exigidos por el proveedor Firebase Auth.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthCredentialsService {

  /** @description Instancia inyectada del chasis de autenticación modular de Firebase. @private */
  private auth = inject(Auth);

  /**
   * @constructor
   * @description Inicializa el gestor especialista de credenciales de acceso.
   */
  constructor() { }

  /**
   * @method reauthenticate
   * @description Eleva los privilegios de la sesión actual validando la contraseña del socio contra el servidor de identidades.
   * Requisito de seguridad obligatorio antes de aplicar cambios en correos o claves de acceso.
   * @param {string} currentEmail Correo electrónico activo actual del usuario.
   * @param {string} currentPassword Contraseña plana actual introducida en el formulario.
   * @returns {Promise<void>}
   */
  public async reauthenticate(currentEmail: string, currentPassword: string): Promise<void> {
    if (!this.auth.currentUser) {
      throw new Error(AppMessageCode.ADC_AUTH_ERR_0001);
    }

    const credential = EmailAuthProvider.credential(currentEmail, currentPassword);
    await reauthenticateWithCredential(this.auth.currentUser, credential);
  }

  /**
   * @method updateEmail
   * @description Setea el idioma de mensajería en castellano e inicia el flujo seguro de pre-verificación de correo.
   * Envía un enlace de confirmación al nuevo email sin alterar el acceso original hasta que el socio lo valide.
   * @param {string} currentEmail Email actual.
   * @param {string} currentPassword Contraseña actual.
   * @param {string} newEmail Dirección del nuevo correo electrónico que se pretende asociar.
   * @param {boolean} bypassReauth Opcional; evita la duplicidad de re-autenticación en flujos transaccionales combinados.
   * @returns {Promise<void>}
   */
  public async updateEmail(
    currentEmail: string,
    currentPassword: string,
    newEmail: string,
    bypassReauth = false
  ): Promise<void> {
    if (!newEmail || !newEmail.trim()) return;
    if (!this.auth.currentUser) throw new Error(AppMessageCode.ADC_AUTH_ERR_0001);

    if (newEmail.trim().toLowerCase() === currentEmail.trim().toLowerCase()) return;

    if (!bypassReauth) {
      await this.reauthenticate(currentEmail, currentPassword);
    }

    // Aseguramos que la plantilla de correo de Google se despache en el idioma del club
    this.auth.languageCode = 'es';

    await verifyBeforeUpdateEmail(this.auth.currentUser, newEmail.trim().toLowerCase());
  }

  /**
   * @method updateUserPassword
   * @description Modifica de forma inmediata la contraseña plana de acceso del usuario autenticado.
   * @param {string} currentEmail Email actual.
   * @param {string} currentPassword Contraseña actual.
   * @param {string} newPassword Nueva contraseña de acceso.
   * @param {boolean} bypassReauth Opcional; anula re-autenticaciones redundantes en llamadas masivas.
   * @returns {Promise<void>}
   */
  public async updateUserPassword(
    currentEmail: string,
    currentPassword: string,
    newPassword: string,
    bypassReauth = false
  ): Promise<void> {
    if (!newPassword || !newPassword.trim()) return;
    if (!this.auth.currentUser) throw new Error(AppMessageCode.ADC_AUTH_ERR_0001);

    if (!bypassReauth) {
      await this.reauthenticate(currentEmail, currentPassword);
    }

    await updatePassword(this.auth.currentUser, newPassword);
  }

  /**
   * @method updateCredentials
   * @description 🚀 REFACTORIZACIÓN TRANSACCIONAL ATÓMICA: Orquesta el cambio simultáneo de email y contraseña.
   * Ejecuta una única re-autenticación inicial compartida para blindar el flujo contra excepciones de token expirado.
   * @param {string} currentEmail Email actual de la cuenta.
   * @param {string} currentPassword Contraseña actual verificadora.
   * @param {string} newEmail Nuevo email en edición.
   * @param {string} newPassword Nueva contraseña en edición.
   * @returns {Promise<void>}
   */
  public async updateCredentials(
    currentEmail: string,
    currentPassword: string,
    newEmail: string,
    newPassword: string
  ): Promise<void> {
    // 1. Levantamos una única sesión privilegiada válida para ambas mutaciones recurrentes
    const requiereMutacionEmail = newEmail && newEmail.trim().toLowerCase() !== currentEmail.trim().toLowerCase();
    const requiereMutacionPassword = newPassword && newPassword.trim() !== '';

    if (requiereMutacionEmail || requiereMutacionPassword) {
      await this.reauthenticate(currentEmail, currentPassword);
    }

    // 2. Despachamos las actualizaciones inyectando la bandera de bypass para reusar el mismo token de Auth
    if (requiereMutacionEmail) {
      await this.updateEmail(currentEmail, currentPassword, newEmail, true);
    }

    if (requiereMutacionPassword) {
      await this.updateUserPassword(currentEmail, currentPassword, newPassword, true);
    }
  }
}