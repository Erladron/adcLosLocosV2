import { Injectable } from '@angular/core';

import { AuthSessionService }
  from './auth-session.service';

import { AuthRegisterService }
  from './auth-register.service';

import { AuthCredentialsService }
  from './auth-credentials.service';

import { AuthPermissionsService }
  from './auth-permissions.service';

import { AuthAdminService }
  from './auth-admin.service';

import { UserStatus }
  from '@users/models/user-status.enum';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  // ============================================
  // CONSTRUCTOR
  // ============================================

  constructor(

    // ============================================
    // SPECIALIZED SERVICES
    // ============================================

    private sessionService: AuthSessionService,

    private registerService: AuthRegisterService,

    private credentialsService: AuthCredentialsService,

    private permissionsService: AuthPermissionsService,

    private adminService: AuthAdminService

  ) {

    // ============================================
    // INIT AUTH LISTENER
    // ============================================

    this.sessionService
      .initAuthListener();

  }

  // ============================================
  // GETTERS
  // ============================================

  /**
   * Usuario Firebase actual.
   */
  get currentUser() {

    return this.sessionService
      .currentUser();

  }

  /**
   * Datos Firestore usuario actual.
   */
  get currentUserData() {

    return this.sessionService
      .currentUserData();

  }

  /**
   * Estado inicialización auth.
   */
  get authReady() {

    return this.sessionService
      .authReady();

  }

  // ============================================
  // AUTH READY
  // ============================================

  /**
   * Espera inicialización auth.
   */
  async waitForAuthReady():
    Promise<void> {

    await this.sessionService
      .waitForAuthReady();

  }

  /**
   * Espera carga datos Firestore usuario.
   * Evita loops infinitos.
   */
  async waitForUserData():
    Promise<void> {

    let retries = 0;

    const maxRetries = 50;

    while (

      this.currentUser
      &&

      !this.currentUserData
      &&

      retries < maxRetries

    ) {

      await new Promise(

        resolve =>

          setTimeout(
            resolve,
            100
          )

      );

      retries++;

    }

    // ============================================
    // TIMEOUT
    // ============================================

    if (

      this.currentUser
      &&

      !this.currentUserData

    ) {

      console.warn(
        'WAIT USER DATA TIMEOUT'
      );

    }

  }

  // ============================================
  // SESSION
  // ============================================

  /**
   * Login usuario.
   */
  async login(

    email: string,

    password: string

  ) {

    const result =

      await this.sessionService
        .login(
          email,
          password
        );

    // ============================================
    // RECARGA DATOS USUARIO
    // ============================================

    if (result?.user.uid) {

      await this.reloadUserData(
        result.user.uid
      );

    }

    // ============================================
    // VALIDACION USUARIO INACTIVO
    // ============================================

    if (

      this.currentUserData?.estado ===
      UserStatus.INACTIVE

    ) {

      await this.logout();

      throw new Error(
        'Usuario desactivado'
      );

    }

    return result;

  }

  /**
   * Logout usuario.
   */
  async logout() {

    return await this.sessionService
      .logout();

  }

  /**
   * Recarga datos usuario.
   */
  async reloadUserData(
    uid: string
  ) {

    return await this.sessionService
      .reloadUserData(uid);

  }

  // ============================================
  // REGISTER
  // ============================================

  /**
   * Registro principal usuarios.
   */
  async register(

    user: any,

    checkPreRegister:
      boolean = true

  ) {

    const result =

      await this.registerService
        .register(

          user,

          checkPreRegister

        );

    // ============================================
    // RELOAD USER DATA
    // ============================================

    if (this.currentUser?.uid) {

      await this.reloadUserData(
        this.currentUser.uid
      );

    }

    return result;

  }

  // ============================================
  // CREDENTIALS
  // ============================================

  /**
   * Actualiza credenciales usuario.
   */
  async updateCredentials(

    uid: string,

    currentEmail: string,

    currentPassword: string,

    newEmail: string,

    newPassword: string

  ) {

    return await this.credentialsService
      .updateCredentials(

        currentEmail,

        currentPassword,

        newEmail,

        newPassword

      );

  }

  // ============================================
  // ADMIN
  // ============================================

  /**
   * Crear usuario admin/directiva.
   */
  async createUserAsAdmin(
    user: any
  ) {

    return await this.adminService
      .createUserAsAdmin(user);

  }

  /**
   * Validar sesión admin.
   */
  async hasValidAdminSession() {

    return await this.adminService
      .hasValidAdminSession();

  }

  /**
   * Obtener token Firebase.
   */
  async getToken() {

    return await this.adminService
      .getToken();

  }

  // ============================================
  // HELPERS
  // ============================================

  /**
   * Usuario autenticado.
   */
  isLogged(): boolean {

    return this.permissionsService
      .isLogged(this.currentUser);

  }

  /**
   * UID usuario actual.
   */
  getUid(): string {

    return this.permissionsService
      .getUid(this.currentUser);

  }

  /**
   * Rol actual usuario.
   */
  getRole(): string {

    return this.permissionsService
      .getRole(this.currentUserData);

  }

  // ============================================
  // ROLES
  // ============================================

  isAdmin(): boolean {

    return this.permissionsService
      .isAdmin(this.currentUserData);

  }

  isDirectiva(): boolean {

    return this.permissionsService
      .isDirectiva(this.currentUserData);

  }

  isSocio(): boolean {

    return this.permissionsService
      .isSocio(this.currentUserData);

  }

  isInvitado(): boolean {

    return this.permissionsService
      .isInvitado(this.currentUserData);

  }

  // ============================================
  // STATUS
  // ============================================

  isActivo(): boolean {

    return this.permissionsService
      .isActivo(this.currentUserData);

  }

  isPendienteAprobacion(): boolean {

    return this.permissionsService
      .isPendienteAprobacion(
        this.currentUserData
      );

  }

  isInactive(): boolean {

    return this.currentUserData?.estado
      === UserStatus.INACTIVE;

  }

  isDisabled(): boolean {

    return this.currentUserData?.estado
      === 'disabled';

  }

}