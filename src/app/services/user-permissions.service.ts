import { Injectable } from '@angular/core';
import { UserRole }
  from 'src/app/models/user-role.enum';

@Injectable({
  providedIn: 'root'
})
export class UserPermissionsService {

  constructor() { }

  // =========================================
  // ES ADMIN
  // =========================================

  isAdmin(user: any): boolean {

    if (!user) {
      return false;
    }

    return user.tipo === 'administrador';
  }

  // =========================================
  // ES DIRECTIVA
  // =========================================

  isDirectiva(user: any): boolean {

    if (!user) {
      return false;
    }

    return user.tipo === 'directiva';
  }

  // =========================================
  // ES SOCIO
  // =========================================

  isSocio(user: any): boolean {

    if (!user) {
      return false;
    }

    return user.tipo === 'socio';
  }

  // =========================================
  // ES INVITADO
  // =========================================

  isInvitado(user: any): boolean {

    if (!user) {
      return false;
    }

    return user.tipo === 'invitado';
  }

  // =========================================
  // PUEDE EDITAR USUARIO
  // =========================================

  canEditUser(
    currentUser: any,
    targetUser: any
  ): boolean {

    if (!currentUser || !targetUser) {
      return false;
    }

    // ADMIN PUEDE TODO

    if (this.isAdmin(currentUser)) {
      return true;
    }

    // DIRECTIVA NO PUEDE EDITAR ADMINS

    if (
      this.isDirectiva(currentUser) &&
      targetUser.tipo !== 'administrador'
    ) {
      return true;
    }

    // USUARIO EDITA SU PERFIL

    return currentUser.uid === targetUser.uid;
  }

  // =========================================
  // PUEDE BORRAR USUARIO
  // =========================================

  canDeleteUser(
    currentUser: any,
    targetUser: any
  ): boolean {

    if (!currentUser || !targetUser) {
      return false;
    }

    // SOLO ADMIN

    if (!this.isAdmin(currentUser)) {
      return false;
    }

    // NO PUEDE BORRARSE A SI MISMO

    return currentUser.uid !== targetUser.uid;
  }

  // =========================================
  // PUEDE APROBAR USUARIOS
  // =========================================

  canApproveUsers(user: any): boolean {

    if (!user) {
      return false;
    }

    return (
      this.isAdmin(user) ||
      this.isDirectiva(user)
    );
  }

  // =========================================
  // PUEDE CREAR USUARIOS
  // =========================================

  canCreateUsers(user: any): boolean {

    if (!user) {
      return false;
    }

    return (
      this.isAdmin(user) ||
      this.isDirectiva(user)
    );
  }

  // =========================================
  // TIPOS DISPONIBLES
  // =========================================

  getAvailableRoles(user: any): UserRole[] {

    if (!user) {
      return [];
    }

    // ADMIN

    if (this.isAdmin(user)) {

      return [

        UserRole.ADMINISTRADOR,

        UserRole.DIRECTIVA,

        UserRole.SOCIO,

        UserRole.INVITADO
      ];
    }

    // DIRECTIVA

    if (this.isDirectiva(user)) {

      return [

        UserRole.SOCIO,

        UserRole.INVITADO
      ];
    }

    // RESTO

    return [
      UserRole.INVITADO
    ];
  }

  // =========================================
  // PUEDE CAMBIAR ROL
  // =========================================

  canChangeRole(
    currentUser: any,
    targetUser: any
  ): boolean {

    if (!currentUser || !targetUser) {
      return false;
    }

    // SOLO ADMIN

    if (this.isAdmin(currentUser)) {
      return true;
    }

    // DIRECTIVA NO PUEDE CAMBIAR ADMINS

    if (
      this.isDirectiva(currentUser) &&
      targetUser.tipo !== 'administrador'
    ) {
      return true;
    }

    return false;
  }

  // =========================================
  // PUEDE VER PANTALLA GESTION
  // =========================================

  canAccessManagement(user: any): boolean {

    if (!user) {
      return false;
    }

    return (
      this.isAdmin(user) ||
      this.isDirectiva(user)
    );
  }

  // =========================================
  // PUEDE VER ESTADISTICAS
  // =========================================

  canAccessStats(user: any): boolean {

    if (!user) {
      return false;
    }

    return (
      this.isAdmin(user) ||
      this.isDirectiva(user)
    );
  }

  // =========================================
  // PUEDE GESTIONAR EVENTOS
  // =========================================

  canManageEvents(user: any): boolean {

    if (!user) {
      return false;
    }

    return (
      this.isAdmin(user) ||
      this.isDirectiva(user)
    );
  }

  // =========================================
  // PUEDE INVITAR
  // =========================================

  canInviteUsers(user: any): boolean {

    if (!user) {
      return false;
    }

    return (
      this.isAdmin(user) ||
      this.isDirectiva(user) ||
      this.isSocio(user)
    );
  }

  // =========================================
  // PUEDE VER CREDENCIALES
  // =========================================

  canEditCredentials(
    currentUser: any,
    targetUser: any
  ): boolean {

    if (!currentUser || !targetUser) {
      return false;
    }

    // SOLO EL PROPIO USUARIO O ADMIN

    if (this.isAdmin(currentUser)) {
      return true;
    }

    return currentUser.uid === targetUser.uid;
  }
}