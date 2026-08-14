import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { filter, firstValueFrom, timer, race, defer } from 'rxjs';
import { map } from 'rxjs/operators';

// Importaciones unificadas del dominio y utilidades compartidas de shared-core
import { 
  AuthService, 
  NotificationService, 
  UserStatus, 
  UserRole, 
  User 
} from 'shared-core';

/**
 * @function authGuard
 * @description Guardián de enrutamiento funcional asíncrono encargado de interceptar y asegurar
 * los accesos a las rutas de la aplicación. Gestiona de manera reactiva el ciclo de vida 
 * de la sesión en Firebase, mitiga condiciones de carrera (deadlocks) en logins rápidos y
 * coordina las redirecciones automáticas basadas en el rol y estado civil del socio en Firestore.
 * 
 * @param {ActivatedRouteSnapshot} route - Instantánea de la ruta que se intenta activar.
 * @param {RouterStateSnapshot} state - Estado actual del enrutador que contiene la URL de destino.
 * @returns {Promise<boolean | UrlTree>} Una promesa que resuelve a `true` si el acceso está permitido,
 * o a un `UrlTree` de redirección de seguridad en caso contrario.
 */
export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService); 
  const router = inject(Router); 
  const notificationService = inject(NotificationService); 

  const currentUrl = state.url; 
  console.log('🛡️ [DEBUG-GUARD] Evaluando acceso a:', currentUrl);

  /**
   * @section Sincronización Inicial Reactiva (Getter Adaptado)
   * @description Si el servicio de autenticación global no se ha inicializado (por ejemplo, en cambios rápidos
   * de sesión o ejecuciones automáticas en pruebas E2E), se establece una carrera reactiva (race).
   * Se utiliza `defer` y un intervalo iterativo para evaluar de forma segura el getter sincrónico `authReady` 
   * expuesto por el AuthService, mitigando bloqueos totales del Router mediante un timeout de 2000ms.
   */
  if (!authService.authReady) { 
    console.log('⏳ [DEBUG-GUARD] Servicio ocupado, esperando inicialización reactiva de Auth...');
    
    // Evaluamos el getter de forma reactiva cada 50ms hasta que sea true
    const authReadyStream$ = defer(() => {
      return new Promise<boolean>((resolve) => {
        const interval = setInterval(() => {
          if (authService.authReady) {
            clearInterval(interval);
            resolve(true);
          }
        }, 50);
      });
    });

    await firstValueFrom(
      race([
        authReadyStream$,
        timer(2000).pipe(map(() => true)) // Temporizador de seguridad (Salvavidas)
      ])
    );
  }

  /** @type {boolean} logged - Flag que indica si existe un token de sesión activo en Firebase Auth. */
  const logged = authService.isLogged(); 
  console.log('🔑 [DEBUG-GUARD] ¿Usuario autenticado en Firebase?:', logged);

  // Control de acceso para usuarios anónimos o desautenticados
  if (!logged) { 
    if (currentUrl.includes('login')) {
      return true;
    }
    console.log('⛔ [DEBUG-GUARD] Sin credenciales de Firebase. Redirección forzada a Login.');
    return router.parseUrl('/login');
  }

  // Evitar que usuarios ya autenticados entren deliberadamente a la pantalla de Login
  if (currentUrl.includes('login')) {
    const esPortero = authService.currentUserData?.tipo === UserRole.PORTERO;
    return router.parseUrl(esPortero ? '/event-scan' : '/home');
  }

  /**
   * @section Sincronización del Perfil de Firestore
   * @description Garantiza que el documento NoSQL correspondiente al usuario autenticado se encuentre
   * completamente descargado en la memoria local del cliente antes de segmentar las reglas de negocio.
   */
  if ('waitForUserData' in authService && typeof (authService as any).waitForUserData === 'function') { 
    console.log('⏳ [DEBUG-GUARD] Esperando activamente la sincronización del perfil con Firestore...');
    await (authService as any).waitForUserData();
  }

  /** @type {User | null} user - Almacén del perfil tipado del usuario extraído de Firestore. */
  let user: User | null = authService.currentUserData; 

  /**
   * @section Validación de Nuevos Socios
   * @description Si el usuario se encuentra marcado localmente como "pendiente de aprobación", se realiza una
   * consulta transaccional directa al servidor para verificar si la Junta Directiva ya ha modificado su estado.
   */
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

  // Salvaguarda crítica ante corrupciones de datos en Firestore
  if (!user) {
    console.error('❌ [DEBUG-GUARD] Fallo crítico: Hay sesión en Auth pero Firestore está vacío.');
    return router.parseUrl('/login');
  }

  /**
   * @section Control de Portería y Control de Accesos
   * @description Los usuarios con rol de Portero operativo y estado activo son redirigidos de forma
   * exclusiva y obligatoria a la suite de escaneo `event-scan`.
   */
  if (user.estado === UserStatus.ACTIVE && user.tipo === UserRole.PORTERO) {
    if (!currentUrl.includes('event-scan')) {
      console.log('🔄 [DEBUG-GUARD] Perfil de Portería detectado. Enrutando hacia zona de Control de Accesos.');
      return router.parseUrl('/event-scan');
    }
    return true;
  }

  /** @type {string | null} redirectUrl - Destino obligatorio según las reglas fidedignas del censo. */
  const redirectUrl = getRedirectUrlByStatus(user.estado);

  // Si no requiere redirección (Socio activo y regular), se otorga paso libre
  if (!redirectUrl) {
    console.log('✅ [DEBUG-GUARD] Socio activo. Acceso permitido directamente a:', currentUrl);
    return true;
  }

  const cleanCurrent = currentUrl.replace(/^\/|\/$/g, '');
  const cleanRedirect = redirectUrl.replace(/^\/|\/$/g, '');

  // Si el usuario ya está asentado en su ruta correspondiente, liberamos la navegación
  if (cleanCurrent === cleanRedirect) {
    console.log('✅ [DEBUG-GUARD] Flujo correcto. Usuario asentado en su pantalla de estado:', cleanCurrent);
    return true;
  }

  /**
   * @section Canal Informativo de Redirecciones (No Bloqueante)
   * @description Dispara alertas visuales asíncronas para notificar los motivos de la restricción de acceso.
   * Se omiten los operadores imperativos `await` para que la navegación de Angular no sufra deadlocks visuales
   * y mantenga la interactividad total del DOM nativo (Menú Hamburguesa, botones e Ionic Lifecycle).
   */
  switch (user.estado) {
    case UserStatus.PENDING_DATA:
      notificationService.info('¡Bienvenido a la Peña! Por favor, completa tus datos de perfil para continuar.');
      break;
    case UserStatus.PENDING_APPROVAL:
      notificationService.info('Tu documentación está bajo revisión por la Junta Directiva. Te avisaremos muy pronto.');
      break;
    case UserStatus.INACTIVE:
    case UserStatus.REJECTED:
    default:
      notificationService.error('Esta cuenta de socio se encuentra desactivada o dada de baja. Contacta con secretaría.');
      break;
  }

  console.log('🔀 [DEBUG-GUARD] Forzando redirección de seguridad hacia:', redirectUrl);
  return router.parseUrl(redirectUrl);
};

/**
 * @function getRedirectUrlByStatus
 * @description Mapeador auxiliar estricto encargado de asociar cada uno de los estados posibles
 * de la membresía con su correspondiente pantalla fija de destino del sistema.
 * 
 * @param {UserStatus} status - Estado civil del socio en los registros de la peña.
 * @returns {string | null} Ruta absoluta del módulo de destino o `null` si pertenece a la zona común activa.
 */
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