import { Injectable } from '@angular/core';

import { AuthService }
  from '@auth/services/auth.service';

import { User }
  from '@users/models/users.models';

import { UserRole }
from '@users/models/user-role.enum';

@Injectable({
  providedIn: 'root'
})

export class UserDetailPermissionsService {

  constructor(

    private authService:
      AuthService

  ) { }

  // ============================================
  // GET ALL PERMISSIONS
  // ============================================

  getPermissions(
    user: User
  ) {

    // ============================================
    // ROLES
    // ============================================

    const isAdmin =

      this.authService.isAdmin();

    const isDirectiva =

      this.authService.isDirectiva();

    const isSocio =

      this.authService.isSocio();

    const isInvitado =

      this.authService.isInvitado();

    // ============================================
    // OWN PROFILE
    // ============================================

    const isOwnProfile =

      this.authService.getUid()

      ===

      user.uid;

    const isNewUser =

      !user.uid;

    // ============================================
    // PERSONAL DATA
    // ============================================

    const canEditPersonalData =

      isAdmin

      ||

      isDirectiva

      ||

      isNewUser

      ||

      isOwnProfile;

    // ============================================
    // MEMBERSHIP
    // ============================================

    let canEditMembership =
      false;

    // ============================================
    // ADMIN
    // ============================================

    if (isAdmin) {

      canEditMembership = true;

    }

    // ============================================
    // DIRECTIVA
    // ============================================

    else if (isDirectiva) {

      canEditMembership =

        user.tipo === UserRole.INVITADO

        ||

        user.tipo === UserRole.SOCIO

        ||

        user.tipo === UserRole.DIRECTIVA

        ||

        isOwnProfile;

    }

    // ============================================
    // CREDENTIALS
    // ============================================

    const canEditCredentials =

      isOwnProfile;

    // ============================================
    // PASSWORD
    // ============================================

    const canEditPassword =

      isOwnProfile;

    // ============================================
    // RETURN
    // ============================================

    return {

      isAdmin,
      isDirectiva,
      isSocio,
      isInvitado,

      isOwnProfile,

      canEditPersonalData,
      canEditMembership,
      canEditCredentials,
      canEditPassword

    };

  }

  // ============================================
  // IS OWN PROFILE
  // ============================================

  isOwnProfile(
    user: User
  ): boolean {

    return (

      this.authService.getUid()

      ===

      user.uid

    );

  }

  // ============================================
  // CAN EDIT PERSONAL DATA
  // ============================================

  canEditPersonalData(
    user: User
  ): boolean {

    return (

      !user.uid

      ||

      this.authService.isAdmin()

      ||

      this.authService.isDirectiva()

      ||

      this.isOwnProfile(user)

    );

  }

  // ============================================
  // CAN EDIT MEMBERSHIP
  // ============================================

  canEditMembership(
    user: User
  ): boolean {

    // ============================================
    // ADMIN
    // ============================================

    if (this.authService.isAdmin()) {

      return true;

    }

    // ============================================
    // DIRECTIVA
    // ============================================

    if (this.authService.isDirectiva()) {

      return (

        user.tipo === UserRole.INVITADO

        ||

        user.tipo === UserRole.SOCIO

        ||
        
        user.tipo === UserRole.DIRECTIVA

        ||

        this.isOwnProfile(user)

      );

    }

    return false;

  }

  // ============================================
  // CAN EDIT CREDENTIALS
  // ============================================

  canEditCredentials(
    user: User
  ): boolean {

    return this.isOwnProfile(user);

  }

  // ============================================
  // CAN EDIT PASSWORD
  // ============================================

  canEditPassword(
    user: User
  ): boolean {

    return this.isOwnProfile(user);

  }

}