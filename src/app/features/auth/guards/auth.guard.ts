import { inject } from '@angular/core';

import {

  CanActivateFn,
  Router

} from '@angular/router';

import { AuthService }
from '@auth/services/auth.service';

export const authGuard:
CanActivateFn = async () => {

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

  // HAY LOGIN
  if (authService.isLogged()) {

    return true;

  }

  // NO LOGIN
  router.navigateByUrl('/login');

  return false;

};