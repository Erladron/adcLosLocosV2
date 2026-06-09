import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from 'projects/shared-core/src/lib/services/auth.service';
import { UserStatus, UserRole } from 'shared-core';

export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const currentUrl = state.url;
  console.log('🛡️ [DEBUG-GUARD] Evaluando acceso a:', currentUrl);

  if (!authService.authReady) {
    console.log('⏳ [DEBUG-GUARD] Servicio ocupado, aplicando margen de espera reactivo...');
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  const logged = authService.isLogged();
  console.log('🔑 [DEBUG-GUARD] ¿Usuario autenticado en Firebase?:', logged);

  if (!logged) {
    if (currentUrl.includes('login')) {
      return true;
    }
    console.log('⛔ [DEBUG-GUARD] Sin credenciales de Firebase. Redirección forzada a Login.');
    return router.parseUrl('/login');
  }

  if (currentUrl.includes('login')) {
    const esPortero = authService.currentUserData?.tipo === UserRole.PORTERO;
    return router.parseUrl(esPortero ? '/fair-scan' : '/home');
  }

  if (typeof (authService as any).waitForUserData === 'function') {
    console.log('⏳ [DEBUG-GUARD] Esperando activamente la sincronización del perfil con Firestore...');
    await (authService as any).waitForUserData();
  } else {
    await new Promise(resolve => setTimeout(resolve, 250));
  }

  let user = authService.currentUserData;

  if (user && user.estado === UserStatus.PENDING_APPROVAL) {
    console.log('🔄 [DEBUG-GUARD] Estado local "PENDING_APPROVAL" detectado. Forzando validación en tiempo real con el servidor...');
    try {
      const freshUser = await authService.refreshUserDataFromServer();
      if (freshUser) {
        user = freshUser;
        console.log('🆕 [DEBUG-GUARD] Servidor consultado con éxito. Estado real verificado:', user.estado);
      }
    } catch (error) {
      console.error('⚠️ [DEBUG-GUARD] Error al forzar refresco de datos desde el Guard, manteniendo caché local:', error);
    }
  }

  if (!user) {
    console.error('❌ [DEBUG-GUARD] Fallo crítico: Hay sesión en Auth pero Firestore está vacío.');
    if (currentUrl.includes('login')) return true;
    return router.parseUrl('/login');
  }

  if (user.estado === UserStatus.ACTIVE && user.tipo === UserRole.PORTERO) {
    if (!currentUrl.includes('fair-scan')) {
      console.log('🔄 [DEBUG-GUARD] Perfil de Portería detectado. Enrutando hacia zona de Control de Accesos.');
      return router.parseUrl('/fair-scan');
    }
    return true;
  }

  const redirectUrl = getRedirectUrlByStatus(user.estado);
  console.log('📌 [DEBUG-GUARD] Estado del socio:', user.estado, '-> Ruta asignada:', redirectUrl || '/home (ACTIVE)');

  if (!redirectUrl) {
    return true;
  }

  const cleanCurrent = currentUrl.replace(/^\/|\/$/g, '');
  const cleanRedirect = redirectUrl.replace(/^\/|\/$/g, '');

  if (cleanCurrent === cleanRedirect) {
    console.log('✅ [DEBUG-GUARD] Flujo correcto. Usuario asentado en su pantalla de estado:', cleanCurrent);
    return true;
  }

  console.log('🔀 [DEBUG-GUARD] Forzando redirección de seguridad hacia:', redirectUrl);
  return router.parseUrl(redirectUrl);
};

function getRedirectUrlByStatus(status: UserStatus): string | null {
  switch (status) {
    case UserStatus.ACTIVE:
      return null;
    case UserStatus.PENDING_DATA:
      return '/complete-profile';
    case UserStatus.PENDING_APPROVAL:
      return '/pending-approval';
    case UserStatus.INACTIVE:
    case UserStatus.REJECTED:
    default:
      return '/login';
  }
}