import { inject } from '@angular/core';

import {

  ActivatedRouteSnapshot,
  CanActivateFn,
  Router

} from '@angular/router';

import { AuthService }
  from '../services/auth.service';

import { RequestStatus }
  from '../models/request-status.enum';

export const roleGuard:
  CanActivateFn = async (

    route: ActivatedRouteSnapshot

  ) => {

    const authService =
      inject(AuthService);

    const router =
      inject(Router);

    // =================================
    // ESPERAR AUTH
    // =================================

    while (!authService.authReady) {

      await new Promise(

        resolve =>

          setTimeout(
            resolve,
            100
          )

      );

    }

    // =================================
    // DATOS
    // =================================

    const role =
      authService.getRole();

    // =================================
    // ADMINISTRADOR
    // ACCESO TOTAL
    // =================================

    if (role === 'administrador') {

      return true;

    }

    const allowedRoles =
      route.data?.['roles'];

    const currentUserData =
      authService.currentUserData;

    // =================================
    // SIN DATOS USER
    // =================================

    if (!currentUserData) {

      router.navigateByUrl('/login');

      return false;

    }

    // =================================
    // PENDIENTE / RECHAZADO
    // =================================

    const estadoSolicitud =
      currentUserData.estadoSolicitud;

    const aprobado =
      currentUserData.aprobado;

    // =================================
    // BLOQUEAR ACCESO
    // =================================

    if (

      aprobado !== true

      ||

      estadoSolicitud !==
      RequestStatus.APROBADO

    ) {

      // =============================
      // EXCEPCION
      // =============================

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

    // =================================
    // SIN ROLES
    // =================================

    if (!allowedRoles) {

      return true;

    }

    // =================================
    // ROL AUTORIZADO
    // =================================

    if (

      allowedRoles.includes(role)

    ) {

      return true;

    }

    // =================================
    // DENEGADO
    // =================================

    router.navigateByUrl('/home');

    return false;

  };