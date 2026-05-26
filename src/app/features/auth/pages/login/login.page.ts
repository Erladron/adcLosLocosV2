import { Component }
  from '@angular/core';

import { CommonModule }
  from '@angular/common';

import { FormsModule }
  from '@angular/forms';

import {

  IonContent,
  IonButton,
  IonInput,
  IonItem,
  IonSpinner,
  IonIcon

} from '@ionic/angular/standalone';

import {

  Router

} from '@angular/router';

import { addIcons }
  from 'ionicons';

import {

  eyeOutline,
  eyeOffOutline,
  lockClosedOutline,
  mailOutline

} from 'ionicons/icons';

import { AuthService }
  from '@auth/services/auth.service';

import { NotificationService }
  from '@core/services/notification.service';

import { LoadingService }
  from '@core/services/loading.service';

import { ErrorHandlerService }
  from '@core/services/error-handler.service';

import { AppMessageCode }
  from '@core/constants/messages/app-message-code.enum';

@Component({

  selector: 'app-login',

  templateUrl:
    './login.page.html',

  styleUrls:
    ['./login.page.scss'],

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

  // ============================================
  // FORM
  // ============================================

  email = '';

  password = '';

  // ============================================
  // UI
  // ============================================

  cargando = false;

  showPassword = false;

  // ============================================
  // CONSTRUCTOR
  // ============================================

  constructor(

    private authService:
      AuthService,

    private notification:
      NotificationService,

    private router:
      Router,

    private loading:
      LoadingService,

    private errorHandler:
      ErrorHandlerService

  ) {

    // ============================================
    // ICONS
    // ============================================

    addIcons({

      eyeOutline,
      eyeOffOutline,
      lockClosedOutline,
      mailOutline

    });

  }

  // ============================================
  // LOGIN
  // ============================================

  async ingresar() {

    // ============================================
    // VALIDATION
    // ============================================

    if (

      !this.email ||

      !this.password

    ) {

      await this.notification.error(

        AppMessageCode
          .ADC_AUTH_ERR_0008

      );

      return;

    }

    try {

      // ============================================
      // LOADING
      // ============================================

      this.cargando = true;

      // ============================================
      // LOGIN
      // ============================================

      await this.loading.wrap(

        async () => {

          await this.authService.login(

            this.email,

            this.password

          );

          console.log(
            'LOGIN OK'
          );

          // ============================================
          // NAVEGACION
          // ============================================

          await this.router.navigateByUrl(
            '/'
          );
        },

        'Iniciando sesión...'

      );

    }

    catch (error: any) {

      console.error(error);

      // ============================================
      // USER DISABLED
      // ============================================

      if (

        error?.code ===
        'auth/user-disabled'

      ) {

        await this.notification.error(

          'Tu cuenta ha sido desactivada. Contacta con la directiva para más información.'

        );

        return;

      }

      // ============================================
      // GLOBAL ERROR HANDLER
      // ============================================

      await this.errorHandler.handle(

        error,

        AppMessageCode
          .ADC_AUTH_ERR_0002

      );

    }

    finally {

      // ============================================
      // LOADING OFF
      // ============================================

      this.cargando = false;

    }

  }

  // ============================================
  // GO REGISTER
  // ============================================

  irARegistro() {

    this.router.navigate([

      '/register'

    ]);

  }

}