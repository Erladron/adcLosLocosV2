import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { PushNotifications, Token } from '@capacitor/push-notifications';
import { Platform } from '@ionic/angular/standalone';
import { Firestore, collection, query, where, getDocs, doc, setDoc, onSnapshot } from '@angular/fire/firestore';

import { Messaging, getToken, onMessage } from '@angular/fire/messaging';

import { AuthService } from './auth.service';
import { NotificationService } from './notification.service';
import { ErrorHandlerService } from './error-handler.service';
import { AppMessageCode } from '../constants/app-message-code.enum';

/**
 * @class FcmService
 * @description Servicio core de infraestructura encargado de gobernar el ecosistema de notificaciones push
 * a través de Firebase Cloud Messaging (FCM). Inicializa los componentes nativos de Capacitor en móviles,
 * y orquesta de forma asíncrona la inicialización segura del Service Worker en entornos web de escritorio.
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
  /** @description Instancia inyectada de mensajería web de AngularFire. Se marca opcional para entornos híbridos. @private */
  private messaging = inject(Messaging, { optional: true });

  /** @description Almacena dinámicamente la configuración del environment activo. @private */
  private environmentConfig: any;
  /** @description Flag de control para bloquear solicitudes web duplicadas concurrentes. @private */
  private solicitandoTokenWeb = false;

  /**
   * @constructor
   * @description Inicializa la estructura base del servicio de mensajería push.
   */
  constructor() { }

  /**
   * @method inicializarFCM
   * @description Dispara la secuencia de arranque de notificaciones push nativas si se ejecuta
   * en un hardware móvil híbrido (iOS / Android). Si detecta navegador web de escritorio, inicializa Web Push.
   * @param {any} currentEnvironment - El archivo de entorno activo.
   * @returns {Promise<void>}
   */
  public async inicializarFCM(currentEnvironment: any): Promise<void> {
    this.environmentConfig = currentEnvironment;

    // 🛡️ REPARACIÓN INTELIGENTE: Detectamos si el navegador está bajo el control de Cypress.
    // Si es un test automático, apagamos FCM para que no congele la red local en las ráfagas.
    // Si estás tú programando en localhost normalmente, continuará hacia abajo y funcionará.
    if (typeof window !== 'undefined' && (window as any).Cypress) {
      console.warn('⚠️ [FcmService] Ejecución automatizada de Cypress detectada. Se omiten las notificaciones Push para optimizar la red del test.');
      return; // 🛑 Abortamos limpiamente solo en los tests
    }

    if (this.platform.is('hybrid')) {
      console.log('⏳ [FcmService] Inicializando escuchadores nativos de Capacitor...');
      this.configurarEscuchadores();

      let permStatus = await PushNotifications.checkPermissions();

      if (permStatus.receive === 'prompt') {
        permStatus = await PushNotifications.requestPermissions();
      }

      if (permStatus.receive === 'granted') {
        await PushNotifications.register();
        console.log('✅ [FcmService] Permisos concedidos y dispositivo móvil registrado.');
      } else {
        console.warn('❌ [FcmService] El usuario ha denegado los permisos de notificación en el móvil.');
      }
      return;
    }

    console.log('ℹ️ [FcmService] Entorno web de escritorio detectado. Levantando pasarela Web Push...');
    await this.configurarWebPushDinamico();
  }

  /**
   * @method configurarWebPushDinamico
   * @private
   * @async
   * @description Registra el Service Worker en la raíz, le transfiere de forma segura las credenciales 
   * del entorno activo para evitar fallos de inicialización en frío y solicita el token a Firebase.
   */
  private async configurarWebPushDinamico(): Promise<void> {
    if (!this.messaging || !this.environmentConfig?.firebase) {
      console.warn('⚠️ [FcmService] Módulo de mensajería web o configuración de Firebase ausente.');
      return;
    }

    try {
      const permiso = await Notification.requestPermission();
      if (permiso !== 'granted') {
        console.warn('❌ [FcmService] El usuario ha bloqueado las notificaciones push en el navegador.');
        return;
      }

      let activeRegistration: ServiceWorkerRegistration | undefined;

      if (typeof window !== 'undefined' && 'serviceWorker' in navigator && navigator.serviceWorker) {
        const envConfig = this.environmentConfig.firebase;
        const swUrl = '/firebase-messaging-sw.js?v=2';

        activeRegistration = await navigator.serviceWorker.register(swUrl);
        console.log('✅ [FcmService] Service Worker plano enlazado con éxito:', activeRegistration.scope);

        const workerActivo = activeRegistration.installing || activeRegistration.waiting || activeRegistration.active;

        if (workerActivo) {
          if (activeRegistration.active) {
            activeRegistration.active.postMessage({
              tipo: 'CONFIGURAR_ENTORNO',
              firebaseConfig: envConfig
            });
            console.log('🍏 [FcmService] Contexto transferido con éxito al Service Worker Activo.');
          } else {
            workerActivo.addEventListener('statechange', () => {
              if (workerActivo.state === 'activated' && activeRegistration?.active) {
                activeRegistration.active.postMessage({
                  tipo: 'CONFIGURAR_ENTORNO',
                  firebaseConfig: envConfig
                });
                console.log('🍏 [FcmService] Contexto transferido tras activación diferida.');
              }
            });
          }
        }
      }

      if (this.solicitandoTokenWeb) {
        console.log('⏳ [FcmService] Solicitud Web Push ya en proceso. Abortando llamada duplicada.');
        return;
      }
      this.solicitandoTokenWeb = true;

      const tokenWeb = await getToken(this.messaging, {
        vapidKey: this.environmentConfig.firebase.vapidKey || '',
        serviceWorkerRegistration: activeRegistration
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
        console.log('🔔 [FcmService] Alerta push capturada en vivo y en primer plano (Web):', payload);
      });

    } catch (error) {
      this.solicitandoTokenWeb = false;
      console.error('🚨 [FcmService] Error fatal configurando el entorno Web Push:', error);
    }
  }

  /**
   * @method configurarEscuchadores
   * @description Acopla y expone los manejadores de eventos nativos del hardware a nivel de sistema operativo.
   * @private
   */
  private async configurarEscuchadores(): Promise<void> {
    await PushNotifications.removeAllListeners();

    PushNotifications.addListener('registration', async (token: Token) => {
      console.log('🔑 [FcmService] Token de dispositivo móvil generado con éxito:', token.value);
      const currentUid = this.authService.getUid();
      if (currentUid) {
        await this.guardarTokenEnFirestore(currentUid, token.value);
      }
    });

    PushNotifications.addListener('registrationError', (error: any) => {
      console.error('🚨 [FcmService] Error crítico en el registro nativo:', error);
    });

    PushNotifications.addListener('pushNotificationReceived', (notification) => {
      console.log('🔔 [FcmService] Notificación recibida con la app abierta:', notification);
    });

    PushNotifications.addListener('pushNotificationActionPerformed', async (action) => {
      const data = action.notification.data;
      if (!data) return;

      if (data.tipoNotificacion === 'CUENTA_APROBADA' || data.tipoNotificacion === 'CUENTA_REACTIVADA') {
        this.router.navigate(['/home']);
        return;
      }
      if (data.tipoNotificacion === 'CUENTA_DESACTIVADA') {
        this.router.navigate(['/login']);
        return;
      }
      if (data.tipoNotificacion === 'NUEVA_CREDENCIAL') {
        this.router.navigate(['/user-passes']);
        return;
      }
      if ((data.tipoNotificacion === 'NUEVO_EVENTO' || data.tipoNotificacion === 'MODIFICACION_EVENTO') && data.eventId) {
        this.router.navigate(['/events', data.eventId]);
        return;
      }
      if (data.tipoNotificacion === 'NUEVO_REGISTRO') {
        this.router.navigate(['/gest-user'], { queryParams: { tab: 'pendientes' } });
        return;
      }
    });
  }

  /**
   * @method guardarTokenEnFirestore
   * @description 🚀 OPTIMIZACIÓN DE IDEMPOTENCIA NATIVA: Registra el token del dispositivo móvil o web.
   * Utiliza el propio string del token saneado como ID del documento en la colección NoSQL.
   * Al mapearlo de esta manera, se elimina por completo la necesidad de hacer lecturas previas (getDocs),
   * garantizando que no existan duplicados por concurrencia y optimizando drásticamente la velocidad de carga.
   * @param {string} userId UID único del usuario dueño del dispositivo.
   * @param {string} nuevoToken Token alfanumérico generado por FCM.
   * @returns {Promise<void>} Promesa asíncrona de guardado.
   */
  public async guardarTokenEnFirestore(userId: string, nuevoToken: string): Promise<void> {
    if (!userId || !nuevoToken) return;

    try {
      // Saneamos la cadena del token para que no contenga caracteres prohibidos en IDs de Firestore
      const tokenDocId = encodeURIComponent(nuevoToken).replace(/\./g, '%2E');

      // Apuntamos de manera determinista e idempotente al documento unívoco del token
      const tokenDocRef = doc(this.firestore, `users/${userId}/tokens/${tokenDocId}`);

      // setDoc guarda el registro de forma atómica; si el token ya existía, simplemente lo actualiza
      await setDoc(tokenDocRef, {
        token: nuevoToken,
        createdAt: new Date()
      });

      console.log('✅ [FcmService] Token guardado en Firestore de manera idempotente.');
    } catch (error: any) {
      console.error('🚨 [FcmService] Error gestionando el token de dispositivo en Firestore:', error);
    }
  }
}