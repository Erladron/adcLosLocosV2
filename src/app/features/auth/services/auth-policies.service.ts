import { Injectable } from '@angular/core';

import { AuthService }
from '@auth/services/auth.service';

import { RequestStatus }
from '@users/models/request-status.enum';

@Injectable({
  providedIn: 'root'
})

export class AuthPoliciesService {

  constructor(

    private authService:
      AuthService

  ) { }

  // ============================================
  // LOGGED
  // ============================================

  isLogged(): boolean {

    return this.authService
      .isLogged();

  }

  // ============================================
  // ROLES
  // ============================================

  isAdmin(): boolean {

    return (

      this.authService.getRole()

      ===

      'administrador'

    );

  }

  isDirectiva(): boolean {

    return (

      this.authService.getRole()

      ===

      'directiva'

    );

  }

  isSocio(): boolean {

    return (

      this.authService.getRole()

      ===

      'socio'

    );

  }

  isInvitado(): boolean {

    return (

      this.authService.getRole()

      ===

      'invitado'

    );

  }

  // ============================================
  // ADMIN AREA
  // ============================================

  canAccessAdminArea(): boolean {

    return (

      this.isAdmin()

      ||

      this.isDirectiva()

    );

  }

  // ============================================
  // USERS MANAGEMENT
  // ============================================

  canManageUsers(): boolean {

    return (

      this.isAdmin()

      ||

      this.isDirectiva()

    );

  }

  // ============================================
  // APPROVED USER
  // ============================================

  isApprovedUser(): boolean {

    const currentUserData =

      this.authService
        .currentUserData;

    // ============================================
    // NO DATA
    // ============================================

    if (!currentUserData) {

      return false;

    }

    // ============================================
    // APPROVED
    // ============================================

    return (

      currentUserData.aprobado === true

      &&

      currentUserData.estadoSolicitud

      ===

      RequestStatus.APROBADO

    );

  }

  // ============================================
  // PENDING APPROVAL
  // ============================================

  isPendingApproval(): boolean {

    return !this.isApprovedUser();

  }

}