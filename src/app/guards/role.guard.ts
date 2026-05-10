import { inject } from '@angular/core';

import {

  ActivatedRouteSnapshot,
  CanActivateFn,
  Router

} from '@angular/router';

import { AuthService }
from '../services/auth.service';

export const roleGuard:
CanActivateFn = async (

  route: ActivatedRouteSnapshot

) => {

  const authService =
    inject(AuthService);

  const router =
    inject(Router);

  // ESPERAR AUTH
  while (!authService.authReady) {

    await new Promise(
      resolve =>
        setTimeout(resolve, 100)
    );

  }

  const role =
    authService.getRole();

  const allowedRoles =
    route.data?.['roles'];

  // SIN ROLES
  if (!allowedRoles) {

    return true;

  }

  // ROL AUTORIZADO
  if (

    allowedRoles.includes(role)

  ) {

    return true;

  }

  // DENEGADO
  router.navigateByUrl('/home');

  return false;

};