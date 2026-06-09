import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router'; 
import { PushNotifications, Token } from '@capacitor/push-notifications';
import { Platform } from '@ionic/angular/standalone';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';

// IMPORTACIÓN DIRECTA DE LA INSTANCIA DE GOOGLE AUTH
import { getAuth } from '@angular/fire/auth';

import { NotificationService } from './notification.service'; // Ajusta la ruta a tu NotificationService
import { ErrorHandlerService } from './error-handler.service'; // Ajusta la ruta a tu ErrorHandlerService
import { AppMessageCode } from '../constants/app-message-code.enum'; // Ajusta la ruta a tus enums

@Injectable({
  providedIn: 'root'
})
export class FcmService {
  private platform = inject(Platform);
  private firestore = inject(Firestore);
  private router = inject(Router);
  private notification = inject(NotificationService);
  private errorHandler = inject(ErrorHandlerService);

  constructor() {}

  // ============================================
  // 🚀 INICIALIZAR NOTIFICACIONES PUSH
  // ============================================
  async inicializarFCM() {
    if (!this.platform.is('hybrid')) {
      console.log('ℹ️ [FCM] Ejecución en entorno web. Se omiten las notificaciones push nativas.');
      return;
    }

    console.log('⏳ [FCM] Inicializando escuchadores nativos...');
    this.configurarEscuchadores();

    let permStatus = await PushNotifications.checkPermissions();

    if (permStatus.receive === 'prompt') {
      permStatus = await PushNotifications.requestPermissions();
    }

    if (permStatus.receive === 'granted') {
      await PushNotifications.register();
      console.log('✅ [FCM] Permisos concedidos y dispositivo registrado.');
    } else {
      console.warn('❌ [FCM] El usuario ha denegado los permisos de notificación.');
    }
  }

  // ============================================
  // 🎧 CONFIGURAR ESCUCHADORES NATIVOS
  // ============================================
  private configurarEscuchadores() {
    
    // ÉXITO: Firebase nos devuelve el Token único del hardware del teléfono[cite: 6]
    PushNotifications.addListener('registration', async (token: Token) => {
      console.log('🔑 [FCM] Token de dispositivo generado con éxito:', token.value);
      await this.guardarTokenEnFirestore(token.value);
    });

    PushNotifications.addListener('registrationError', (error: any) => {
      console.error('🚨 [FCM] Error crítico en el registro nativo:', error);
    });

    PushNotifications.addListener('pushNotificationReceived', (notification) => {
      console.log('🔔 [FCM] Notificación recibida con la app abierta:', notification);
    });

    // 🎯 REDIRECCIÓN INTELIGENTE PROTEGIDA CONTRA ERRORES[cite: 6]
    PushNotifications.addListener('pushNotificationActionPerformed', async (action) => {
      console.log('🎯 [FCM] El socio ha pulsado la notificación:', action);
      
      const data = action.notification.data;
      
      if (!data) return;

      if (data.tipoNotificacion === 'CUENTA_APROBADA') {
        console.log('🚀 [FCM] Detectado push de cuenta aprobada. Redirigiendo a la Home...[cite: 6]');
        this.router.navigate(['/home']);
        return;
      }

      // 📅 Captura inteligente de Push de Eventos (Creación o Modificación)
      if ((data.tipoNotificacion === 'NUEVO_EVENTO' || data.tipoNotificacion === 'MODIFICACION_EVENTO') && data.eventId) {
        try {
          console.log(`🔍 [FCM] Verificando existencia previa del evento en Firestore: ${data.eventId}`);
          const eventDocRef = doc(this.firestore, `events/${data.eventId}`);
          const eventSnap = await getDoc(eventDocRef);

          // 🛡️ CONTROL DE ERROR: El evento fue eliminado por la directiva tras enviarse el push
          if (!eventSnap.exists()) {
            console.warn('⚠️ [FCM] El evento ya no existe en el servidor.');
            await this.notification.error('El evento al que intentas acceder ha sido cancelado o eliminado.');
            this.router.navigate(['/events']);
            return;
          }

          // Si el evento existe, la navegación es 100% segura
          console.log(`🚀 [FCM] Redirección validada con éxito. Viajando al detalle: ${data.eventId}`);
          this.router.navigate(['/events', data.eventId]);

        } catch (error) {
          // 🛡️ CONTROL DE EXCEPCIÓN INTEGRADO: Fallo de red o cobertura en el móvil[cite: 7]
          console.error('🚨 [FCM] Error en la consulta de enrutamiento por Push:', error);
          await this.errorHandler.handle(error, AppMessageCode.ADC_SYS_ERR_0001); // Utiliza tu manejador corporativo[cite: 7]
          this.router.navigate(['/events']);
        }
      }
    });
  }

  // ============================================
  // 💾 GUARDAR TOKEN EN FIRESTORE
  // ============================================
  private async guardarTokenEnFirestore(tokenValue: string) {
    try {
      const auth = getAuth();
      const uid = auth.currentUser?.uid;

      if (!uid) {
        console.log('⏳ [FCM] UID no detectado en el primer milisegundo, reintentando...[cite: 6]');
        await new Promise(resolve => setTimeout(resolve, 300));
      }

      const finalUid = auth.currentUser?.uid;

      if (!finalUid) {
        console.error('❌ [FCM] Error crítico: Imposible recuperar el UID del usuario autenticado.[cite: 6]');
        return;
      }

      console.log('💾 [FCM] Guardando token de forma síncrona para el UID:[cite: 6]', finalUid);

      // Guardamos en la subcolección dinámica: /users/{uid}/tokens/{token}[cite: 6]
      const tokenDocRef = doc(this.firestore, `users/${finalUid}/tokens`, tokenValue);
      
      await setDoc(tokenDocRef, {
        token: tokenValue,
        createdAt: new Date(),
        platform: this.platform.is('android') ? 'android' : 'ios'
      });

      console.log('✅ [FCM] ¡Token almacenado con éxito en Firestore para el socio![cite: 6]');

    } catch (error) {
      console.error('❌ [FCM] Excepción al almacenar el token en la base de datos:', error);
    }
  }
}