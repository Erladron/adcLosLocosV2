import { Injectable } from '@angular/core';
import { Router } from '@angular/router'; // 🚀 ¡AÑADIDO PARA LA REDIRECCIÓN!
import { PushNotifications, Token } from '@capacitor/push-notifications';
import { Platform } from '@ionic/angular/standalone';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';

// IMPORTACIÓN DIRECTA DE LA INSTANCIA DE GOOGLE AUTH
import { getAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class FcmService {

  constructor(
    private platform: Platform,
    private firestore: Firestore,
    private router: Router // 🚀 ¡INYECTAMOS EL ROUTER!
  ) {}

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
    
    // ÉXITO: Firebase nos devuelve el Token único del hardware del teléfono
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

    // 👇 ¡MODIFICADO CON LA REDIRECCIÓN INTELIGENTE!
    PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
      console.log('🎯 [FCM] El socio ha pulsado la notificación:', action);
      
      // Extraemos la carga útil de datos que envía tu backend v2
      const data = action.notification.data;
      
      if (data && data.tipoNotificacion === 'CUENTA_APROBADA') {
        console.log('🚀 [FCM] Detectado push de cuenta aprobada. Rompiendo bloqueo y redirigiendo a la Home...');
        
        // Forzamos al enrutador a viajar a la Home, saltándose el cartel de "solicitud enviada"
        this.router.navigate(['/home']);
      }
    });
  }

  // ============================================
  // 💾 GUARDAR TOKEN EN FIRESTORE (BYPASS DE INSTANCIA)
  // ============================================
  private async guardarTokenEnFirestore(tokenValue: string) {
    try {
      // 🚀 CAPTURA SEGURA: Leemos el usuario activo directo del motor de Google
      const auth = getAuth();
      const uid = auth.currentUser?.uid;

      // Si por un retardo de red extremo sigue sin estar, aplicamos un reintento de 300ms
      if (!uid) {
        console.log('⏳ [FCM] UID no detectado en el primer milisegundo, reintentando...');
        await new Promise(resolve => setTimeout(resolve, 300));
      }

      const finalUid = auth.currentUser?.uid;

      if (!finalUid) {
        console.error('❌ [FCM] Error crítico: Imposible recuperar el UID del usuario autenticado.');
        return;
      }

      console.log('💾 [FCM] Guardando token de forma síncrona para el UID:', finalUid);

      // Guardamos en la subcolección dinámica: /users/{uid}/tokens/{token}
      const tokenDocRef = doc(this.firestore, `users/${finalUid}/tokens`, tokenValue);
      
      await setDoc(tokenDocRef, {
        token: tokenValue,
        createdAt: new Date(),
        platform: this.platform.is('android') ? 'android' : 'ios'
      });

      console.log('✅ [FCM] ¡Token almacenado con éxito en Firestore para el socio!');

    } catch (error) {
      console.error('❌ [FCM] Excepción al almacenar el token en la base de datos:', error);
    }
  }
}