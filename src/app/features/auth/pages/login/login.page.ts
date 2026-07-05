import { Component, inject, EnvironmentInjector, runInInjectionContext } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent,
  IonButton,
  IonInput,
  IonItem,
  IonSpinner,
  IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { eyeOutline, eyeOffOutline, lockClosedOutline, mailOutline } from 'ionicons/icons';

// 🔥 CORRECCIÓN: Importamos el módulo de inyección Auth oficial en lugar de la función suelta getAuth
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';

import { NotificationService } from 'projects/shared-core/src/lib/services/notification.service';
import { ErrorHandlerService } from 'projects/shared-core/src/lib/services/error-handler.service';
import { AppMessageCode } from 'shared-core';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonButton,
    IonInput,
    IonItem,
    IonSpinner,
    IonIcon,
  ]
})
export class LoginPage {
  // 🔥 INYECCIONES DE SINTAXIS MODERNA (Evitan fugas de contexto asíncronas)
  private auth = inject(Auth);
  private injector = inject(EnvironmentInjector);
  private notification = inject(NotificationService);
  private router = inject(Router);
  private errorHandler = inject(ErrorHandlerService);

  email = '';
  password = '';
  cargando = false;
  showPassword = false;

  constructor() {
    addIcons({
      eyeOutline,
      eyeOffOutline,
      lockClosedOutline,
      mailOutline
    });
  }

  /**
   * @method ionViewDidEnter
   * @description Ciclo de vida nativo de Ionic. Se ejecuta SIEMPRE que la pantalla 
   * de login aparece en primer plano, solucionando el bloqueo de caché tras un logout.
   */
  public ionViewDidEnter(): void {
    console.log('🔄 [LoginPage] Reiniciando estado y limpiando bloqueos de la vista.');

    // 1. Forzamos el desbloqueo del botón por si se quedó colgado en true
    this.cargando = false;

    // 2. Reseteamos los campos del formulario para limpiar la memoria del DOM
    this.email = '';
    this.password = '';

    // 3. Pequeño hack profesional: Forzamos un evento de scroll mínimo e invisible 
    // en el contenedor nativo para obligar a Chrome/WebView a recalcular los PointerEvents del ratón.
    const content = document.querySelector('ion-content');
    if (content) {
      (content as any).getScrollElement().then((scrollEl: HTMLElement) => {
        if (scrollEl) {
          scrollEl.style.pointerEvents = 'auto';
        }
      });
    }
  }

  async ingresar() {
    if (!this.email || !this.password) {
      await this.notification.error(AppMessageCode.ADC_AUTH_ERR_0008);
      return;
    }

    // Envolvemos la ejecución asíncrona dentro de la cápsula de inyección del entorno
    return runInInjectionContext(this.injector, async () => {
      try {
        this.cargando = true;
        console.log('⏳ [BYPASS-LOGIN] Conectando directamente con Google Firebase Auth...');

        // 🔥 CORRECCIÓN: Usamos la instancia 'this.auth' inyectada en la clase de forma nativa
        const userCredential = await signInWithEmailAndPassword(this.auth, this.email.trim(), this.password);
        console.log('✅ [BYPASS-LOGIN] Autenticación exitosa en Firebase. User UID:', userCredential.user.uid);

        this.cargando = false;

        console.log('🔄 [BYPASS-LOGIN] Redirigiendo a la pantalla principal...');
        await this.router.navigateByUrl('/home');

      } catch (error: any) {
        console.error('❌ [BYPASS-LOGIN] Error capturado en el SDK:', error);
        this.cargando = false;

        // CONTROL DE CREDENCIALES INCORRECTAS DETECTADO EN TU CAPTURA
        if (
          error?.code === 'auth/invalid-credential' ||
          error?.message?.includes('auth/invalid-credential') ||
          error?.code === 'auth/user-not-found' ||
          error?.code === 'auth/wrong-password'
        ) {
          await this.notification.error(
            'El correo electrónico o la contraseña no son correctos. Por favor, compruébalos.'
          );
          return;
        }

        // CONTROL DE CUENTA DESACTIVADA
        if (error?.code === 'auth/user-disabled') {
          await this.notification.error(
            'Tu cuenta ha sido desactivada. Contacta con la directiva para más información.'
          );
          return;
        }

        await this.errorHandler.handle(error, AppMessageCode.ADC_AUTH_ERR_0002);
      } finally {
        this.cargando = false;
      }
    });
  }
}