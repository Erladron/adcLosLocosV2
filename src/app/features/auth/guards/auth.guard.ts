import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from 'projects/shared-core/src/lib/services/auth.service';
import { UserStatus } from 'shared-core';

export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const currentUrl = state.url;
  console.log('🛡️ [DEBUG-GUARD] Evaluando acceso a:', currentUrl);

  // ============================================
  // BYPASS DE INICIALIZACIÓN (SOLUCIÓN DE RAÍZ)
  // ============================================
  // Si el servicio se queda colgado esperando, hacemos una lectura directa instantánea.
  // Si ya está logueado en este microsegundo, saltamos la espera que congela la app.
  if (!authService.authReady) {
    console.log('⏳ [DEBUG-GUARD] Servicio ocupado, aplicando margen de espera reactivo...');
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  // ============================================
  // 1. COMPROBACIÓN DIRECTA DE SESIÓN
  // ============================================
  const logged = authService.isLogged();
  console.log('🔑 [DEBUG-GUARD] ¿Usuario autenticado en Firebase?:', logged);

  if (!logged) {
    if (currentUrl.includes('login')) {
      return true;
    }
    console.log('⛔ [DEBUG-GUARD] Sin credenciales de Firebase. Redirección forzada a Login.');
    return router.parseUrl('/login');
  }

  // Si tiene sesión e intenta recargar de forma manual la pantalla de login, va a home
  if (currentUrl.includes('login')) {
    return router.parseUrl('/home');
  }

  // ============================================
  // 2. LECTURA ASÍNCRONA BLINDADA DEL PERFIL
  // ============================================
  let user = authService.currentUserData;

  // Si los datos del documento de Firestore no se han mapeado todavía, esperamos un suspiro
  if (!user) {
    console.log('⏳ [DEBUG-GUARD] Esperando sincronización del perfil de socio de Firestore...');
    await new Promise(resolve => setTimeout(resolve, 250));
    user = authService.currentUserData;
  }

  // Si tras el bypass sigue dando null, la sesión no tiene datos válidos
  if (!user) {
    console.error('❌ [DEBUG-GUARD] Fallo crítico: Hay sesión en Auth pero Firestore está vacío.');
    if (currentUrl.includes('login')) return true;
    return router.parseUrl('/login');
  }

  // ============================================
  // 3. DETERMINACIÓN DE RUTA SEGÚN ESTADO CORPORATIVO
  // ============================================
  const redirectUrl = getRedirectUrlByStatus(user.estado);
  console.log('📌 [DEBUG-GUARD] Estado del socio:', user.estado, '-> Ruta asignada:', redirectUrl || '/home (ACTIVE)');

  // Si el estado es ACTIVE (null), acceso total concedido
  if (!redirectUrl) {
    return true;
  }

  // ============================================
  // 4. NORMALIZACIÓN ESTRICTA ANTI-BUCLE DE RUTAS
  // ============================================
  const cleanCurrent = currentUrl.replace(/^\/|\/$/g, '');
  const cleanRedirect = redirectUrl.replace(/^\/|\/$/g, '');

  if (cleanCurrent === cleanRedirect) {
    console.log('✅ [DEBUG-GUARD] Flujo correcto. Usuario asentado en su pantalla de estado:', cleanCurrent);
    return true;
  }

  console.log('🔀 [DEBUG-GUARD] Forzando redirección de seguridad hacia:', redirectUrl);
  return router.parseUrl(redirectUrl);
};

// ============================================
// HELPER DE ENRUTAMIENTO UNIFICADO
// ============================================
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