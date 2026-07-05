import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';

// Importaciones unificadas del dominio compartido de shared-core
import { AuthService, UserRole } from 'shared-core';

/**
 * @function roleGuard
 * @description Guardián funcional encargado de evaluar los roles jerárquicos de la sesión activa
 * contra la matriz de privilegios requerida por la ruta de navegación.
 */
export const roleGuard: CanActivateFn = async (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Espera activa a que la pasarela de Firebase esté lista
  await authService.waitForAuthReady();

  const currentUserData = authService.currentUserData;

  if (!currentUserData) {
    return router.parseUrl('/login');
  }

  const allowedRoles = route.data?.['roles'];

  if (!allowedRoles) {
    return true;
  }

  const role = authService.getRole();

  if (allowedRoles.includes(role)) {
    return true;
  }

  // =========================================================================
  // 🚀 REDIRECCIÓN INTELIGENTE ANTI-BUCLE
  // =========================================================================
  console.log('🔄 [ROLE-GUARD] Privilegios insuficientes. Evaluando redirección por rol:', role);
  
  if (role === UserRole.PORTERO) {
    return router.parseUrl('/fair-scan'); // El portero a trabajar
  }

  return router.parseUrl('/home'); // Los socios a la sección de inicio
};