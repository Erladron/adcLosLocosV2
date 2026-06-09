import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { AuthService } from 'projects/shared-core/src/lib/services/auth.service';
import { UserRole } from 'shared-core'; // 🚀 Usamos Enums

export const roleGuard: CanActivateFn = async (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

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

  // ============================================
  // 🚀 REDIRECCIÓN INTELIGENTE ANTI-BUCLE
  // ============================================
  console.log('🔄 [ROLE-GUARD] Perfil de Portería detectado. Enrutando hacia zona de Control de Accesos.');
  
  if (role === UserRole.PORTERO) {
    return router.parseUrl('/fair-scan'); // El portero a trabajar
  }

  return router.parseUrl('/home'); // Los socios a la de inicio
};