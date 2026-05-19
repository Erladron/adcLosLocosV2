import { inject } from '@angular/core';

import {

  ActivatedRouteSnapshot,
  CanActivateFn,
  Router

} from '@angular/router';

import { AuthService }
from '@auth/services/auth.service';

import { AuthPoliciesService }
from '@auth/services/auth-policies.service';

export const roleGuard:
CanActivateFn = async (

  route: ActivatedRouteSnapshot

) => {

  // ============================================
  // INJECTIONS
  // ============================================

  const authService =
    inject(AuthService);

  const policies =
    inject(AuthPoliciesService);

  const router =
    inject(Router);

  // ============================================
  // WAIT AUTH
  // ============================================

  while (!authService.authReady) {

    await new Promise(

      resolve =>

        setTimeout(
          resolve,
          100
        )

    );

  }

  // ============================================
  // USER DATA
  // ============================================

  const currentUserData =

    authService.currentUserData;

  // ============================================
  // NO USER DATA
  // ============================================

  if (!currentUserData) {

    router.navigateByUrl('/login');

    return false;

  }

  // ============================================
  // ADMIN ACCESS
  // ============================================

  if (

    policies.isAdmin()

  ) {

    return true;

  }

  // ============================================
  // USER APPROVED
  // ============================================

  if (

    !policies.isApprovedUser()

  ) {

    // ========================================
    // EXCEPTION
    // ========================================

    if (

      route.routeConfig?.path ===
      'pending-approval'

    ) {

      return true;

    }

    router.navigateByUrl(
      '/pending-approval'
    );

    return false;

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

  router.navigateByUrl('/home');

  return false;

};