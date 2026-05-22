import { inject } from '@angular/core';

import {
  CanActivateFn,
  Router
} from '@angular/router';

import { AuthService }
  from '@auth/services/auth.service';

import { UserStatus }
  from '@users/models/user-status.enum';

export const authGuard:
  CanActivateFn = async () => {

    const authService =
      inject(AuthService);

    const router =
      inject(Router);

    // ============================================
    // ESPERAR AUTH
    // ============================================

    await authService
      .waitForAuthReady();

    // ============================================
    // NO LOGIN FIREBASE
    // ============================================

    if (!authService.isLogged()) {

      return router.parseUrl(
        '/login'
      );

    }

    // ============================================
    // USER FIRESTORE
    // ============================================

    const user =
      authService.currentUserData;

    // ============================================
    // USER INVALIDO
    // ============================================

    if (!user) {

      await authService.logout();

      return router.parseUrl(
        '/login'
      );

    }

    // ============================================
    // CONTROL ESTADOS
    // ============================================

    console.log(
      'AUTH GUARD USER',
      user
    );

    switch (user.estado) {

      case UserStatus.ACTIVE:

        return true;

      case UserStatus.PENDING_DATA:

        return router.parseUrl(
          '/complete-profile'
        );

      case UserStatus.PENDING_APPROVAL:

        return router.parseUrl(
          '/pending-approval'
        );

      case UserStatus.DISABLED:

        await authService.logout();

        return router.parseUrl(
          '/login'
        );

      case UserStatus.REJECTED:

        await authService.logout();

        return router.parseUrl(
          '/login'
        );

      default:

        await authService.logout();

        return router.parseUrl(
          '/login'
        );

    }

  };