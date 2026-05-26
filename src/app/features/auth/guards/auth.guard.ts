import { inject } from '@angular/core';

import {
  CanActivateFn,
  Router,
  UrlTree
} from '@angular/router';

import { AuthService }
  from '@auth/services/auth.service';

import { UserStatus }
  from '@users/models/user-status.enum';

export const authGuard:
  CanActivateFn = async (

    route,
    state

  ) => {

    const authService =
      inject(AuthService);

    const router =
      inject(Router);

    // ============================================
    // CURRENT URL
    // ============================================

    const currentUrl =
      state.url;

    console.log(
      'AUTH GUARD START',
      currentUrl
    );

    // ============================================
    // WAIT AUTH READY
    // ============================================

    await authService
      .waitForAuthReady();

    // ============================================
    // NO FIREBASE SESSION
    // ============================================

    if (!authService.isLogged()) {

      console.log(
        'AUTH GUARD -> LOGIN'
      );

      return router.parseUrl(
        '/login'
      );

    }

    // ============================================
    // WAIT USER DATA
    // ============================================

    await authService
      .waitForUserData();

    // ============================================
    // USER DATA
    // ============================================

    const user =
      authService.currentUserData;

    console.log(
      'AUTH GUARD USER',
      user
    );

    // ============================================
    // USER DATA NOT AVAILABLE
    // ============================================

    if (!user) {

      console.warn(
        'AUTH GUARD USER DATA NULL'
      );

      await authService.logout();

      return router.parseUrl(
        '/login'
      );

    }

    // ============================================
    // STATUS REDIRECTION
    // ============================================

    const redirectUrl =
      getRedirectUrlByStatus(
        user.estado
      );

    // ============================================
    // ACTIVE USER
    // ============================================

    if (!redirectUrl) {

      return true;

    }

    // ============================================
    // AVOID NAVIGATION LOOP
    // ============================================

    if (

      currentUrl ===
      redirectUrl

    ) {

      return true;

    }

    console.log(
      'AUTH GUARD REDIRECT',
      redirectUrl
    );

    return router.parseUrl(
      redirectUrl
    );

  };

// ============================================
// REDIRECT STATUS HELPER
// ============================================

function getRedirectUrlByStatus(
  status: UserStatus
): string | null {

  switch (status) {

    // ============================================
    // ACTIVE
    // ============================================

    case UserStatus.ACTIVE:

      return null;

    // ============================================
    // PENDING DATA
    // ============================================

    case UserStatus.PENDING_DATA:

      return '/complete-profile';

    // ============================================
    // PENDING APPROVAL
    // ============================================

    case UserStatus.PENDING_APPROVAL:

      return '/pending-approval';

    // ============================================
    // INACTIVE
    // ============================================

    case UserStatus.INACTIVE:

      return '/login';

    // ============================================
    // REJECTED
    // ============================================

    case UserStatus.REJECTED:

      return '/login';

    // ============================================
    // DEFAULT
    // ============================================

    default:

      return '/login';

  }

}