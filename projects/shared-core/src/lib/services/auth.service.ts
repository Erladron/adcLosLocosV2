import { Injectable } from '@angular/core';
import { AuthSessionService } from './auth-session.service';
import { AuthRegisterService } from './auth-register.service';
import { AuthCredentialsService } from './auth-credentials.service';
import { AuthPermissionsService } from './auth-permissions.service';
import { AuthAdminService } from './auth-admin.service';
import { UserStatus } from '../models/user-status.enum';
import { User } from '../models/users.models';

/**
 * @class AuthService
 * @description Fachada orquestadora central (Facade Pattern) para todo el ecosistema de autenticación,
 * control perimetral de sesiones y mapeo de roles jerárquicos de la peña.
 * No contiene lógica directa de infraestructura, delegando la operatividad de forma exclusiva en 
 * subservicios especialistas inyectados para mitigar ficheros monstruo.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  /**
   * @constructor
   * @description Inicializa la pasarela unificada e invoca el arranque inmediato del listener de Firebase Auth.
   * @param {AuthSessionService} sessionService Gestor de estados de la sesión activa y recargas de tokens.
   * @param {AuthRegisterService} registerService Orquestador de flujos de alta y canjes de invitaciones web.
   * @param {AuthCredentialsService} credentialsService Especialista en modificaciones críticas de correos y passwords.
   * @param {AuthPermissionsService} permissionsService Evaluador síncrono de matrices de políticas, roles y estados.
   * @param {AuthAdminService} adminService Pasarela de Cloud Functions administrativas y reseteos corporativos.
   */
  constructor(
    private sessionService: AuthSessionService,
    private registerService: AuthRegisterService,
    private credentialsService: AuthCredentialsService,
    private permissionsService: AuthPermissionsService,
    private adminService: AuthAdminService
  ) {
    // Inicialización atómica de la escucha del estado de autenticación remota
    this.sessionService.initAuthListener();
  }

  // =========================================================================
  // 🧭 GETTERS (Propiedades Reactivas del Chasis de Sesión)
  // =========================================================================

  /**
   * @description Obtiene la instancia cruda del usuario autenticado en el SDK de Firebase Auth.
   * @type {any}
   */
  get currentUser() {
    return this.sessionService.currentUser();
  }

  /**
   * @description Provee la proyección de datos del socio almacenada en la colección principal `/users` de Firestore.
   * @type {User | null}
   */
  get currentUserData(): User | null {
    return this.sessionService.currentUserData() as User | null;
  }

  /**
   * @description Informa si el motor interno de Firebase ha concluido el handshake de inicialización.
   * @type {boolean}
   */
  get authReady() {
    return this.sessionService.authReady();
  }

  // =========================================================================
  // ⏳ SYNCHRONIZATION LIFECYCLES (Control de Ciclo de Vida y Gracia)
  // =========================================================================

  /**
   * @method waitForAuthReady
   * @description Detiene el flujo de ejecución de forma asíncrona hasta que el canal de Auth esté listo.
   * @returns {Promise<void>}
   */
  public async waitForAuthReady(): Promise<void> {
    await this.sessionService.waitForAuthReady();
  }

  /**
   * @method waitForUserData
   * @description Implementa un bucle de reintentos controlados con gracia para asegurar la descarga del documento 
   * de Firestore del socio post-login, mitigando condiciones de carrera y loops infinitos en la UI.
   * @returns {Promise<void>}
   */
  public async waitForUserData(): Promise<void> {
    let retries = 0;
    const maxRetries = 50;

    while (
      this.currentUser &&
      !this.currentUserData &&
      retries < maxRetries
    ) {
      await new Promise(resolve => setTimeout(resolve, 100));
      retries++;
    }

    if (this.currentUser && !this.currentUserData) {
      console.warn('⚠️ [AuthService] Timeout excedido esperando la sincronización de Firestore.');
    }
  }

  // =========================================================================
  // 🔐 SESSION METHODS (Apertura y Cierre de Puertas)
  // =========================================================================

  /**
   * @method login
   * @description Autentica al operador, recarga el perfil y valida de forma inmediata si se encuentra en estado INACTIVE 
   * para denegar el acceso instantáneamente en caso de baja lógica por impago o expulsión.
   * @param {string} email Correo electrónico.
   * @param {string} password Contraseña plana.
   * @returns {Promise<any>} Resultado de la promesa de autenticación.
   */
  public async login(email: string, password: string): Promise<any> {
    const result = await this.sessionService.login(email, password);

    if (result?.user.uid) {
      await this.reloadUserData(result.user.uid);
    }

    // Interceptación de seguridad: Expulsión fulminante del chasis si la cuenta está dada de baja
    if (this.currentUserData?.estado === UserStatus.INACTIVE) {
      await this.logout();
      throw new Error('Acceso bloqueado: Tu perfil consta como inactivo en la base de datos de administración.');
    }

    return result;
  }

  /**
   * @method logout
   * @description Destruye los tokens y cierra la sesión activa en el cliente.
   * @returns {Promise<void>}
   */
  public async logout(): Promise<void> {
    return await this.sessionService.logout();
  }

  /**
   * @method reloadUserData
   * @description Sincroniza y fuerza la re-lectura del documento del socio desde Firestore hacia el chasis reactivo.
   * @param {string} uid Identificador único de usuario.
   * @returns {Promise<any>}
   */
  public async reloadUserData(uid: string): Promise<any> {
    return await this.sessionService.reloadUserData(uid);
  }

  // =========================================================================
  // 📝 ACCOUNT REGISTRATION (Módulos de Onboarding)
  // =========================================================================

  /**
   * @method register
   * @description Procesa las solicitudes de registro web, validando opcionalmente si el email ha sido sembrado previamente en invitaciones.
   * @param {any} user Datos del formulario de alta.
   * @param {boolean} checkPreRegister True si exige la presencia del token de invitación previa.
   * @returns {Promise<any>}
   */
  public async register(user: any, checkPreRegister: boolean = true): Promise<any> {
    console.log('📝 [AUTH] Iniciando flujo de registro estructurado para:', user);
    const result = await this.registerService.register(user, checkPreRegister);

    if (this.currentUser?.uid) {
      await this.reloadUserData(this.currentUser.uid);
    }

    return result;
  }

  // =========================================================================
  // 🛠️ SECURITY CREDENTIALS MUTATIONS (Gestión de Seguridad)
  // =========================================================================

  /**
   * @method updateCredentials
   * @description Ejecuta de forma segura cambios en el correo electrónico o contraseñas primarias delegando en el subservicio.
   * @param {string} uid UID del usuario afectado.
   * @param {string} currentEmail Email actual exigido para re-autenticación.
   * @param {string} currentPassword Password actual exigida para re-autenticación.
   * @param {string} newEmail Nuevo email de acceso.
   * @param {string} newPassword Nueva contraseña de acceso.
   * @returns {Promise<void>}
   */
  public async updateCredentials(
    uid: string,
    currentEmail: string,
    currentPassword: string,
    newEmail: string,
    newPassword: string
  ): Promise<void> {
    return await this.credentialsService.updateCredentials(
      currentEmail,
      currentPassword,
      newEmail,
      newPassword
    );
  }

  // =========================================================================
  // 🎪 ADMINISTRATIVE BYPASSES & FUNCTIONS (Pasarelas de Junta)
  // =========================================================================

  /**
   * @method createUserAsAdmin
   * @description Invoca el alta manual directa de un usuario a través del administrador saltándose el proceso de pre-alta web.
   * @param {any} user Instancia con los datos y contraseñas del socio.
   * @returns {Promise<any>}
   */
  public async createUserAsAdmin(user: any): Promise<any> {
    return await this.adminService.createUserAsAdmin(user);
  }

  /**
   * @method hasValidAdminSession
   * @description Verifica si la sesión del administrador posee los tokens vigentes requeridos por los interceptores.
   * @returns {Promise<boolean>}
   */
  public async hasValidAdminSession(): Promise<boolean> {
    return await this.adminService.hasValidAdminSession();
  }

  /**
   * @method getToken
   * @description Extrae el JsonWebToken (JWT) de Firebase Auth activo en la sesión del dispositivo.
   * @returns {Promise<string>}
   */
  public async getToken(): Promise<string> {
    return await this.adminService.getToken();
  }

  /**
   * @method refreshUserDataFromServer
   * @description Fuerza la recarga de datos inyectando el resultado directamente sobre los Guards de enrutamiento.
   * @returns {Promise<any>} Perfil del usuario actualizado.
   */
  public async refreshUserDataFromServer(): Promise<any> {
    if (this.currentUser?.uid) {
      return await this.reloadUserData(this.currentUser.uid);
    }
    return null;
  }

  /**
   * @method sendCustomResetPasswordEmail
   * @description Lanza el envío del enlace de configuración de contraseñas personalizado a través de la Cloud Function.
   * @param {string} email Correo destino.
   * @returns {Promise<any>}
   */
  public async sendCustomResetPasswordEmail(email: string): Promise<any> {
    return await this.adminService.sendCustomResetPasswordEmail(email);
  }

  // =========================================================================
  // 🔍 POLICIES & SYNC ROLE EVALUATORS (Ayudantes de Permisos)
  // =========================================================================

  /** @description Retorna true si consta un usuario autenticado activo en el chasis local. */
  public isLogged(): boolean {
    return this.permissionsService.isLogged(this.currentUser);
  }

  /** @description Recupera de forma síncrona el string del UID del canal de autenticación. */
  public getUid(): string {
    return this.permissionsService.getUid(this.currentUser);
  }

  /** @description Recupera de forma síncrona la cadena del rango de rol asignado al documento. */
  public getRole(): string {
    return this.permissionsService.getRole(this.currentUserData);
  }

  /** @description Retorna true si el operador ostenta privilegios totales de Administrador. */
  public isAdmin(): boolean {
    return this.permissionsService.isAdmin(this.currentUserData);
  }

  /** @description Retorna true si el operador pertenece al cuerpo de la Junta Directiva. */
  public isDirectiva(): boolean {
    return this.permissionsService.isDirectiva(this.currentUserData);
  }

  /** @description Retorna true si el operador posee la ficha ordinaria sujeta a cuotas de Socio. */
  public isSocio(): boolean {
    return this.permissionsService.isSocio(this.currentUserData);
  }

  /** @description Retorna true si la cuenta es un perfil externo o Invitado web. */
  public isInvitado(): boolean {
    return this.permissionsService.isInvitado(this.currentUserData);
  }

  /** @description Retorna true si el usuario se encuentra plenamente habilitado y activo en la app. */
  public isActivo(): boolean {
    return this.permissionsService.isActivo(this.currentUserData);
  }

  /** @description Retorna true si el alta civil del aspirante está en cola a la espera del veredicto de la directiva. */
  public isPendienteAprobacion(): boolean {
    return this.permissionsService.isPendienteAprobacion(this.currentUserData);
  }

  /** @description Retorna true si la cuenta presenta una baja lógica del sistema. */
  public isInactive(): boolean {
    return this.currentUserData?.estado === UserStatus.INACTIVE;
  }
}