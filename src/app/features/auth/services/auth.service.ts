import { Injectable } from '@angular/core';

import { Auth }
from '@angular/fire/auth';

import { Router }
from '@angular/router';

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

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  // ============================================
  // CONSTRUCTOR
  // ============================================

  constructor(

    private auth: Auth,

    private router: Router,

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
      .currentUser;

  }

  /**
   * Datos Firestore usuario actual.
   */
  get currentUserData() {

    return this.sessionService
      .currentUserData;

  }

  /**
   * Estado inicialización auth.
   */
  get authReady() {

    return this.sessionService
      .authReady;

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

    return await this.sessionService
      .login(
        email,
        password
      );

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
  // ESTADOS
  // ============================================

  isActivo(): boolean {

    return this.permissionsService
      .isActivo(this.currentUserData);

  }

  isPendienteAprobacion(): boolean {

    return this.permissionsService
      .isPendienteAprobacion(this.currentUserData);

  }

  isCancelado(): boolean {

    return this.permissionsService
      .isCancelado(this.currentUserData);

  }

  // ============================================
  // HELPERS LEGACY
  // ============================================

  /**
   * Compatibilidad antigua.
   */
  isRegisteredUser(): boolean {

    return this.permissionsService
      .isRegisteredUser(this.currentUserData);

  }

  /**
   * Usuario colección users.
   */
  isAssociationUser(): boolean {

    return this.permissionsService
      .isAssociationUser(this.currentUserData);

  }

}