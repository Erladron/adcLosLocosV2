import { Injectable } from '@angular/core';

import { UserRole }
  from '@users/els/user-role.enum';

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
  // PUEDE EDITAR DATOS PERSONALES
  // =========================================

  canEditPersonalData(
    currentUser: any,
    targetUser: any
  ): boolean {

    if (!currentUser || !targetUser) {

      return false;

    }

    // =====================================
    // TODOS SOLO SU PERFIL
    // =====================================

    return (

      currentUser.uid ===
      targetUser.uid

    );

  }

  // =========================================
  // PUEDE EDITAR MEMBRESIA
  // =========================================

  canEditMembership(
    currentUser: any,
    targetUser: any
  ): boolean {

    if (!currentUser || !targetUser) {

      return false;

    }

    // =====================================
    // ADMIN
    // =====================================

    if (this.isAdmin(currentUser)) {

      return (

        currentUser.uid !==
        targetUser.uid

      );

    }

    // =====================================
    // DIRECTIVA
    // =====================================

    if (this.isDirectiva(currentUser)) {

      return (

        targetUser.tipo === 'socio'

        ||

        targetUser.tipo === 'directiva'

      );

    }

    return false;

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

    // =====================================
    // SOLO ADMIN
    // =====================================

    if (!this.isAdmin(currentUser)) {

      return false;

    }

    // =====================================
    // NO BORRARSE A SI MISMO
    // =====================================

    return (

      currentUser.uid !==
      targetUser.uid

    );

  }

  // =========================================
  // PUEDE APROBAR USUARIOS
  // =========================================

  canApproveUsers(user: any): boolean {

    if (!user) {

      return false;

    }

    return (

      this.isAdmin(user)

      ||

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

      this.isAdmin(user)

      ||

      this.isDirectiva(user)

    );

  }

  // =========================================
  // TIPOS DISPONIBLES
  // =========================================

  getAvailableRoles(
    user: any
  ): UserRole[] {

    if (!user) {

      return [];

    }

    // =====================================
    // ADMIN
    // =====================================

    if (this.isAdmin(user)) {

      return [

        UserRole.ADMINISTRADOR,

        UserRole.DIRECTIVA,

        UserRole.SOCIO,

        UserRole.INVITADO

      ];

    }

    // =====================================
    // DIRECTIVA
    // =====================================

    if (this.isDirectiva(user)) {

      return [

        UserRole.SOCIO,

        UserRole.INVITADO

      ];

    }

    // =====================================
    // RESTO
    // =====================================

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

    // =====================================
    // ADMIN
    // =====================================

    if (this.isAdmin(currentUser)) {

      return (

        currentUser.uid !==
        targetUser.uid

      );

    }

    // =====================================
    // DIRECTIVA
    // =====================================

    if (this.isDirectiva(currentUser)) {

      return (

        targetUser.tipo === 'socio'

        ||

        targetUser.tipo === 'invitado'

      );

    }

    return false;

  }

  // =========================================
  // PUEDE VER PANTALLA GESTION
  // =========================================

  canAccessManagement(
    user: any
  ): boolean {

    if (!user) {

      return false;

    }

    return (

      this.isAdmin(user)

      ||

      this.isDirectiva(user)

    );

  }

  // =========================================
  // PUEDE VER ESTADISTICAS
  // =========================================

  canAccessStats(
    user: any
  ): boolean {

    if (!user) {

      return false;

    }

    return (

      this.isAdmin(user)

      ||

      this.isDirectiva(user)

    );

  }

  // =========================================
  // PUEDE GESTIONAR EVENTOS
  // =========================================

  canManageEvents(
    user: any
  ): boolean {

    if (!user) {

      return false;

    }

    return (

      this.isAdmin(user)

      ||

      this.isDirectiva(user)

    );

  }

  // =========================================
  // PUEDE INVITAR
  // =========================================

  canInviteUsers(
    user: any
  ): boolean {

    if (!user) {

      return false;

    }

    return (

      this.isAdmin(user)

      ||

      this.isDirectiva(user)

      ||

      this.isSocio(user)

    );

  }

  // =========================================
  // PUEDE EDITAR CREDENCIALES
  // =========================================

  canEditCredentials(
    currentUser: any,
    targetUser: any
  ): boolean {

    if (!currentUser || !targetUser) {

      return false;

    }

    // =====================================
    // SOLO SUS CREDENCIALES
    // =====================================

    return (

      currentUser.uid ===
      targetUser.uid

    );

  }

}