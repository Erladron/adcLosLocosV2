import { Injectable, inject, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { PushNotifications, Token, PermissionStatus } from '@capacitor/push-notifications';
import { Platform } from '@ionic/angular/standalone';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { Messaging, getToken, onMessage } from '@angular/fire/messaging';

import { AuthService } from './auth.service';
import { NotificationService } from './notification.service';
import { ErrorHandlerService } from './error-handler.service';
import { AppMessageCode } from '../constants/app-message-code.enum';

/**
 * @class FcmService
 * @description Servicio core de infraestructura encargado de gobernar el ecosistema de notificaciones push
 * a través de Firebase Cloud Messaging (FCM). Inicializa los componentes nativos de Capacitor en móviles,
 * orquesta el registro nativo delegando la gestión de alertas al sistema operativo y gestiona el enrutamiento 
 * y deep-linking en segundo y primer plano.
 */
@Injectable({
  providedIn: 'root'
})
export class FcmService {
  /** @description Instancia inyectada para evaluar la naturaleza del hardware de ejecución. @private */
  private platform = inject(Platform);
  /** @description Instancia inyectada del SDK modular de Cloud Firestore. @private */
  private firestore = inject(Firestore);
  /** @description Instancia inyectada del orquestador de rutas de Angular. @private */
  private router = inject(Router);
  /** @description Instancia inyectada del despachador de notificaciones visuales. @private */
  private notification = inject(NotificationService);
  /** @description Instancia inyectada del interceptor central de excepciones. @private */
  private errorHandler = inject(ErrorHandlerService);
  /** @description Instancia inyectada de la fachada de autenticación del monorrepo. @private */
  private authService = inject(AuthService);
  /** @description Instancia inyectada para forzar la detección de cambios dentro de Angular. @private */
  private zone = inject(NgZone);
  /** @description Instancia inyectada de mensajería web de AngularFire. Se marca opcional para entornos híbridos. @private */
  private messaging = inject(Messaging, { optional: true });
  /** @description Almacena dinámicamente la configuración del environment activo. @private */
  private environmentConfig: any;
  /** @description Flag de control para bloquear solicitudes web duplicadas concurrentes. @private */
  private solicitandoTokenWeb = false;  
  /** @description Flag de control para evitar inicializaciones dobles o concurrentes en la APK. @private */
  private inicializandoNativo = false;

  constructor() { }

  /**
   * @method inicializarFCM
   * @public
   * @async
   * @param {any} [env] - Configuración opcional del entorno activo de la aplicación.
   * @returns {Promise<void>}
   * @description Punto de entrada principal para orquestar la mensajería nativa en la APK o Web Push en navegadores.
   */
  public async inicializarFCM(env?: any): Promise<void> {
    if (env) {
      this.environmentConfig = env;
    }

    if (!this.platform.is('hybrid')) {
      console.warn('⚠️ [DEBUG FCM] Entorno Web detectado. Inicializando Web Push Dinámico...');
      await this.configurarWebPushDinamico();
      return;
    }

    if (this.inicializandoNativo) {
      console.log('⏳ [DEBUG FCM] Inicialización nativa ya en curso. Omitiendo llamada duplicada.');
      return;
    }
    this.inicializandoNativo = true;

    console.log('🚀 [DEBUG FCM] Iniciando secuencia FCM en APK Nativa...');

    try {
      await this.configurarEscuchadoresNativos();

      let permStatus: PermissionStatus = await PushNotifications.checkPermissions();
      console.log('📊 [DEBUG FCM] Estado inicial de permisos:', permStatus.receive);

      // 1️⃣ Si aún no se han pedido, solicitamos permisos al SO
      if (permStatus.receive === 'prompt' || permStatus.receive === 'prompt-with-rationale') {
        console.log('💬 [DEBUG FCM] Ventana emergente activada en la pantalla del móvil...');
        permStatus = await PushNotifications.requestPermissions();
      }

      // 2️⃣ EVALUACIÓN TRIPLE (Manejo correcto del estado 'prompt' de Capacitor)
      if (permStatus.receive === 'granted' || permStatus.receive === 'prompt') {
        console.log('✅ [DEBUG FCM] Permisos concedidos. Registrando dispositivo en FCM nativo...');
        await PushNotifications.register();
      } else {
        console.warn('⛔ [DEBUG FCM] El usuario ha bloqueado explícitamente los permisos en los ajustes.');
      }

    } catch (error) {
      console.error('🚨 [DEBUG FCM] Excepción durante la inicialización:', error);
    } finally {
      this.inicializandoNativo = false;
    }
  }

  /**
   * @method configurarWebPushDinamico
   * @private
   * @async
   * @returns {Promise<void>}
   * @description Registra el Service Worker en la raíz para navegadores de escritorio y solicita tokens web.
   */
  private async configurarWebPushDinamico(): Promise<void> {
    if (!this.messaging || !this.environmentConfig?.firebase) {
      console.warn('⚠️ [FcmService] Módulo de mensajería web o configuración de Firebase ausente.');
      return;
    }

    if (typeof window === 'undefined' || !('serviceWorker' in navigator) || !navigator.serviceWorker) {
      console.warn('⚠️ [FcmService] El entorno no soporta Service Worker.');
      await this.errorHandler.handle(
        new Error(AppMessageCode.ADC_FCM_ERR_0005),
        AppMessageCode.ADC_FCM_ERR_0005
      );
      return;
    }

    try {
      const permiso = await Notification.requestPermission();
      if (permiso !== 'granted') {
        console.warn('❌ [FcmService] El usuario ha bloqueado las notificaciones push en el navegador.');
        await this.errorHandler.handle(
          new Error(AppMessageCode.ADC_FCM_ERR_0001),
          AppMessageCode.ADC_FCM_ERR_0001
        );
        return;
      }

      if (this.solicitandoTokenWeb) {
        console.log('⏳ [FcmService] Solicitud Web Push ya en proceso. Abortando llamada duplicada.');
        return;
      }
      this.solicitandoTokenWeb = true;

      const envConfig = this.environmentConfig.firebase;
      const swUrl = '/firebase-messaging-sw.js?v=2';

      const activeRegistration = await navigator.serviceWorker.register(swUrl).catch(async (regError) => {
        console.error('🚨 [FcmService] Fallo crítico al registrar el Service Worker:', regError);
        throw new Error(AppMessageCode.ADC_FCM_ERR_0002);
      });

      console.log('✅ [FcmService] Service Worker plano enlazado con éxito:', activeRegistration.scope);

      await this.esperarInstalacionWorker(activeRegistration);

      if (activeRegistration.active) {
        activeRegistration.active.postMessage({
          tipo: 'CONFIGURAR_ENTORNO',
          firebaseConfig: envConfig
        });
        console.log('🍏 [FcmService] Contexto transferido con éxito al Service Worker.');
      }

      const tokenWeb = await getToken(this.messaging, {
        vapidKey: this.environmentConfig.firebase.vapidKey || '',
        serviceWorkerRegistration: activeRegistration
      }).catch(async (tokenErr) => {
        console.warn('⚠️ [FcmService] Firebase no pudo recuperar el token Web:', tokenErr);
        throw new Error(AppMessageCode.ADC_FCM_ERR_0003);
      });

      if (tokenWeb) {
        console.log('🔑 [FcmService] Token Web Push generado con éxito para el PC:', tokenWeb);
        const currentUid = this.authService.getUid();

        if (currentUid) {
          await this.guardarTokenEnFirestore(currentUid, tokenWeb);
        } else {
          console.warn('⚠️ [FcmService] Token web generado pero se pospone por falta de sesión activa.');
        }
      }

      this.solicitandoTokenWeb = false;

      onMessage(this.messaging, (payload) => {
        console.log('🔔 [FcmService] Alerta push capturada en vivo en Angular (Web):', payload);
      });

    } catch (error) {
      this.solicitandoTokenWeb = false;
      await this.errorHandler.handle(error, AppMessageCode.ADC_FCM_ERR_0002);
    }
  }

  /**
   * @method esperarInstalacionWorker
   * @private
   * @param {ServiceWorkerRegistration} registration - Objeto de registro del Service Worker en el navegador.
   * @returns {Promise<void>}
   * @description Espera de forma asíncrona a que el Service Worker pase al estado 'activated'.
   */
  private esperarInstalacionWorker(registration: ServiceWorkerRegistration): Promise<void> {
    return new Promise((resolve) => {
      const worker = registration.installing || registration.waiting || registration.active;
      if (!worker) {
        resolve();
        return;
      }
      if (registration.active && worker.state === 'activated') {
        resolve();
        return;
      }
      worker.addEventListener('statechange', () => {
        if (worker.state === 'activated') {
          resolve();
        }
      });
      setTimeout(resolve, 2000);
    });
  }

  /**
   * @method configurarEscuchadoresNativos
   * @private
   * @async
   * @returns {Promise<void>}
   * @description Acopla escuchadores nativos con trazabilidad avanzada de logs para depuración de recepción y clics.
   */
  private async configurarEscuchadoresNativos(): Promise<void> {
    try {
      await PushNotifications.removeAllListeners();

      // 1️⃣ LOG DE REGISTRO / TOKEN
      PushNotifications.addListener('registration', async (token: Token) => {
        console.log('📌 [DEBUG FCM] 1. Token de dispositivo recibido:', token.value);
        const currentUid = this.authService.getUid();
        if (currentUid) {
          await this.guardarTokenEnFirestore(currentUid, token.value);
        }
      });

      PushNotifications.addListener('registrationError', async (error: any) => {
        console.error('🚨 [DEBUG FCM] Error en registro nativo:', error);
      });

      // 2️⃣ LOG CUANDO LLEGA LA NOTIFICACIÓN (Foreground / Abierta)
      PushNotifications.addListener('pushNotificationReceived', (notification) => {
        console.group('📌 [DEBUG FCM] 2. Evento recibido (pushNotificationReceived)');
        console.log('📄 Notificación completa:', notification);
        console.log('🔑 Datos (data):', JSON.stringify(notification.data));
        console.log('🎯 targetUrl detectado:', notification.data?.targetUrl);
        console.groupEnd();

        const data = notification.data;
        if (data?.targetUrl) {
          console.log('🚀 [DEBUG FCM] Intentando navegar en primer plano a:', data.targetUrl);
          this.zone.run(() => {
            this.ejecutarNavegacion(data.targetUrl, data);
          });
        }
      });

      // 3️⃣ LOG CUANDO EL USUARIO HACE CLICK (Background / App cerrada / Cortina)
      PushNotifications.addListener('pushNotificationActionPerformed', async (action) => {
        console.group('📌 [DEBUG FCM] 3. Evento de Clic (pushNotificationActionPerformed)');
        console.log('👆 Acción realizada:', action.actionId);
        console.log('📄 Notificación asociada:', action.notification);
        console.log('🔑 Datos recibidos (data):', JSON.stringify(action.notification?.data));
        console.log('🎯 targetUrl detectado:', action.notification?.data?.targetUrl);
        console.groupEnd();

        const data = action.notification?.data;
        if (!data) {
          console.warn('⚠️ [DEBUG FCM] El payload de la notificación no traía el objeto "data".');
          return;
        }

        this.zone.run(() => {
          if (data.targetUrl) {
            console.log('🚀 [DEBUG FCM] Ejecutando navegación directa a:', data.targetUrl);
            this.ejecutarNavegacion(data.targetUrl, data);
          } else {
            console.log('🔄 [DEBUG FCM] No hay targetUrl, ejecutando fallback según tipoNotificacion:', data.tipoNotificacion);
            this.ejecutarFallbackNavegacion(data);
          }
        });
      });

      console.log('✅ [DEBUG FCM] Escuchadores nativos de Capacitor registrados correctamente.');

    } catch (error) {
      console.error('🚨 [DEBUG FCM] Error al configurar escuchadores:', error);
      await this.errorHandler.handle(error, AppMessageCode.ADC_SYS_ERR_0001);
    }
  }

  /**
   * @method ejecutarNavegacion
   * @private
   * @param {string} targetUrl - URL o ruta enviada en el payload FCM.
   * @param {any} data - Carga útil completa de datos de la notificación.
   * @description Parsea la URL de destino procesando posibles Query Parameters y redirige con el Router de Angular.
   */
  private ejecutarNavegacion(targetUrl: string, data: any): void {
    const [path, queryString] = targetUrl.split('?');
    if (queryString) {
      const params = new URLSearchParams(queryString);
      const queryParams: Record<string, string> = {};
      params.forEach((value, key) => {
        queryParams[key] = value;
      });
      this.router.navigate([path], { queryParams });
    } else {
      this.router.navigateByUrl(targetUrl);
    }
  }

  /**
   * @method ejecutarFallbackNavegacion
   * @private
   * @param {any} data - Objeto con la carga útil del payload.
   * @description Reglas de respaldo para redirigir si no se especificó un targetUrl explícito.
   */
  private ejecutarFallbackNavegacion(data: any): void {
    if (data.tipoNotificacion === 'CUENTA_APROBADA' || data.tipoNotificacion === 'CUENTA_REACTIVADA') {
      this.router.navigate(['/home']);
    } else if (data.tipoNotificacion === 'CUENTA_DESACTIVADA') {
      this.router.navigate(['/login']);
    } else if (data.tipoNotificacion === 'NUEVA_CREDENCIAL' || data.tipoNotificacion === 'INVITACION_CANCELADA') {
      this.router.navigate(['/user-passes']);
    } else if ((data.tipoNotificacion === 'NUEVO_EVENTO' || data.tipoNotificacion === 'MODIFICACION_EVENTO') && data.eventId) {
      this.router.navigate(['/events', data.eventId]);
    } else if (data.tipoNotificacion === 'NUEVO_REGISTRO') {
      this.router.navigate(['/gest-user'], { queryParams: { tab: 'pendientes' } });
    }
  }

  /**
   * @method guardarTokenEnFirestore
   * @public
   * @async
   * @param {string} userId - UID del usuario autenticado.
   * @param {string} nuevoToken - Token alfanumérico generado por FCM.
   * @returns {Promise<void>}
   * @description Registra el token FCM del dispositivo móvil o web en Firestore de manera idempotente.
   * Sanea el string del token para usarlo como ID de documento, eliminando la necesidad de lecturas previas.
   */
  public async guardarTokenEnFirestore(userId: string, nuevoToken: string): Promise<void> {
    if (!userId || !nuevoToken) return;

    try {
      const tokenDocId = encodeURIComponent(nuevoToken).replace(/\./g, '%2E');
      const tokenDocRef = doc(this.firestore, `users/${userId}/tokens/${tokenDocId}`);

      await setDoc(tokenDocRef, {
        token: nuevoToken,
        createdAt: new Date()
      });

      console.log('✅ [FcmService] Token guardado en Firestore de manera idempotente.');
    } catch (error: any) {
      await this.errorHandler.handle(error, AppMessageCode.ADC_FCM_ERR_0004);
    }
  }
}