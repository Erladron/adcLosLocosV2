import { Injectable } from '@angular/core';

import { AuthService }
  from '@auth/services/auth.service';

import { User }
  from '@users/models/users.models';

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

    // ADMIN

    if (isAdmin) {

      canEditMembership =

        this.authService.getUid()

        !==

        user.uid;

    }

    // DIRECTIVA

    else if (isDirectiva) {

      canEditMembership =

        user.tipo === 'socio'

        ||

        user.tipo === 'directiva';

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

      return (

        this.authService.getUid()

        !==

        user.uid

      );

    }

    // ============================================
    // DIRECTIVA
    // ============================================

    if (this.authService.isDirectiva()) {

      return (

        user.tipo === 'socio'

        ||

        user.tipo === 'directiva'

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