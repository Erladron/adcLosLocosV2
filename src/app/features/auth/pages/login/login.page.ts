import { Component, inject, EnvironmentInjector, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  NavController,
  IonContent,
  IonButton,
  IonInput,
  IonItem,
  IonSpinner,
  IonIcon
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import { eyeOutline, eyeOffOutline, lockClosedOutline, mailOutline } from 'ionicons/icons';

import { AppMessageCode, AuthService, LoadingService, NotificationService, ErrorHandlerService } from 'shared-core';


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
  // INYECCIONES DE SINTAXIS MODERNA[cite: 1]
  private authService = inject(AuthService);;
  private injector = inject(EnvironmentInjector);
  private notification = inject(NotificationService);
  private navCtrl = inject(NavController);
  private errorHandler = inject(ErrorHandlerService);
  private ngZone = inject(NgZone);
  private loadingService = inject(LoadingService);
  private cdRef = inject(ChangeDetectorRef);
  private zone = inject(NgZone);


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
   * @method ionViewWillEnter
   * @description Ciclo de vida nativo de Ionic. Se ejecuta JUSTO ANTES de que la pantalla 
   * aparezca en primer plano. Forzamos el desbloqueo del botón dentro de la NgZone de Angular
   * para evitar que se quede congelado tras un logout asíncrono.
   */
  public ionViewWillEnter(): void {
    // 1. Forzamos a que todo se ejecute en la zona correcta de Angular
    this.zone.run(() => {
      console.log('[LoginPage] Forzando desbloqueo e inicialización limpia.');

      // 2. Limpiamos las variables de sesión anteriores de forma explícita
      this.email = '';
      this.password = '';
      this.cargando = false;

      // 3. Dejamos un microsegundo para que el DOM respire y forzamos la detección de cambios
      setTimeout(() => {
        this.cdRef.detectChanges();
        console.log('[LoginPage] Interfaz re-evaluada y desbloqueada con éxito.');
      }, 50);
    });
  }

  async ingresar() {
  if (!this.email || !this.password) {
    await this.notification.error(AppMessageCode.ADC_AUTH_ERR_0008);
    return;
  }

  await this.loadingService.wrap(async () => {
    try {
      this.cargando = true;
      console.log('⏳ [LOGIN] Autenticando mediante AuthService Facade...');

      // 1. Usar AuthService garantiza la carga de Firestore y validación de INACTIVE
      await this.authService.login(this.email.trim(), this.password);

      // 2. Esperar a que Firestore descargue los datos de perfil antes de navegar
      await this.authService.waitForUserData();

      console.log('✅ [LOGIN] Autenticación y datos cargados. Redirigiendo a Home...');

      // 3. Navegar en la NgZone rompiendo la pila de navegación previa
      this.ngZone.run(async () => {
        this.cargando = false;
        await this.navCtrl.navigateRoot('/home', { animated: false });
      });

    } catch (error: any) {
      console.error('❌ [LOGIN] Error capturado:', error);
      this.cargando = false;

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

      if (error?.code === 'auth/user-disabled' || error?.message?.includes('bloqueado')) {
        await this.notification.error(
          error?.message || 'Tu cuenta ha sido desactivada. Contacta con la directiva.'
        );
        return;
      }

      await this.errorHandler.handle(error, AppMessageCode.ADC_AUTH_ERR_0002);
    } finally {
      this.cargando = false;
    }
  }, 'Iniciando sesión...');
}
}