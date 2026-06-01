import { Component } from '@angular/core';
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

// SDK OFICIAL DE FIREBASE
import { getAuth, signInWithEmailAndPassword } from '@angular/fire/auth';

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

  email = '';
  password = '';
  cargando = false;
  showPassword = false;

  constructor(
    private notification: NotificationService,
    private router: Router,
    private errorHandler: ErrorHandlerService
  ) {
    addIcons({
      eyeOutline,
      eyeOffOutline,
      lockClosedOutline,
      mailOutline
    });
  }

  async ingresar() {
    if (!this.email || !this.password) {
      await this.notification.error(AppMessageCode.ADC_AUTH_ERR_0008);
      return;
    }

    try {
      this.cargando = true;
      console.log('⏳ [BYPASS-LOGIN] Conectando directamente con Google Firebase Auth...');

      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(auth, this.email.trim(), this.password);
      console.log('✅ [BYPASS-LOGIN] Autenticación exitosa en Firebase. User UID:', userCredential.user.uid);

      this.cargando = false;

      console.log('🔄 [BYPASS-LOGIN] Redirigiendo a la pantalla principal...');
      await this.router.navigateByUrl('/home');

    } catch (error: any) {
      console.error('❌ [BYPASS-LOGIN] Error capturado en el SDK:', error);
      this.cargando = false;

      // 🎯 CONTROL DE CREDENCIALES INCORRECTAS DETECTADO EN TU CAPTURA
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
  }
}