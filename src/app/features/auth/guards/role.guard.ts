import { inject } from '@angular/core';

import {

  ActivatedRouteSnapshot,
  CanActivateFn,
  Router

} from '@angular/router';

import { AuthService }
from '@auth/services/auth.service';

export const roleGuard:
CanActivateFn = async (

  route: ActivatedRouteSnapshot

) => {

  // ============================================
  // INJECTIONS
  // ============================================

  const authService =
    inject(AuthService);

  const router =
    inject(Router);

  // ============================================
  // WAIT AUTH
  // ============================================

  await authService
    .waitForAuthReady();

  // ============================================
  // USER DATA
  // ============================================

  const currentUserData =

    authService.currentUserData;

  // ============================================
  // NO USER
  // ============================================

  if (!currentUserData) {

    return router.parseUrl(
      '/login'
    );

  }

  // ============================================
  // ALLOWED ROLES
  // ============================================

  const allowedRoles =
    route.data?.['roles'];

  // ============================================
  // NO ROLES
  // ============================================

  if (!allowedRoles) {

    return true;

  }

  // ============================================
  // CURRENT ROLE
  // ============================================

  const role =
    authService.getRole();

  // ============================================
  // ROLE AUTHORIZED
  // ============================================

  if (

    allowedRoles.includes(role)

  ) {

    return true;

  }

  // ============================================
  // ACCESS DENIED
  // ============================================

  return router.parseUrl(
    '/home'
  );

};