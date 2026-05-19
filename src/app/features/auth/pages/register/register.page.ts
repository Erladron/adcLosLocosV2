import { Component } from '@angular/core';

import { CommonModule }
from '@angular/common';

import { FormsModule }
from '@angular/forms';

import {

  IonContent,
  IonButton,
  IonInput,
  IonItem,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonIcon

} from '@ionic/angular/standalone';

import { Router }
from '@angular/router';

import { AuthService }
from '@auth/services/auth.service';

import { NotificationService }
from '@core/services/notification.service';

import { AppMessageCode }
from 'src/app/core/constants/messages/app-message-code.enum';

import { addIcons }
from 'ionicons';

import {

  eyeOutline,
  eyeOffOutline

} from 'ionicons/icons';

@Component({

  selector: 'app-register',

  templateUrl:
    './register.page.html',

  styleUrls:
    ['./register.page.scss'],

  standalone: true,

  imports: [

    CommonModule,
    FormsModule,

    IonContent,
    IonButton,
    IonInput,
    IonItem,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonBackButton,
    IonIcon

  ]

})

export class RegisterPage {

  // ============================================
  // USER FORM
  // ============================================

  user = {

    nombre: '',
    email: '',
    password: ''

  };

  passwordConfirm = '';

  // ============================================
  // UI
  // ============================================

  showPassword = false;

  showPasswordConfirm = false;

  cargando = false;

  // ============================================
  // CONSTRUCTOR
  // ============================================

  constructor(

    private authService: AuthService,

    private notification: NotificationService,

    private router: Router

  ) {

    // ============================================
    // REGISTER ICONS
    // ============================================

    addIcons({

      eyeOutline,
      eyeOffOutline

    });

  }

  // ============================================
  // REGISTER
  // ============================================

  async registrarse() {

    // ============================================
    // VALIDATE REQUIRED FIELDS
    // ============================================

    if (

      !this.user.nombre ||

      !this.user.email ||

      !this.user.password

    ) {

      await this.notification.error(

        AppMessageCode.ADC_USER_ERR_0005

      );

      return;

    }

    // ============================================
    // VALIDATE PASSWORD MATCH
    // ============================================

    if (

      this.user.password !==
      this.passwordConfirm

    ) {

      await this.notification.error(

        AppMessageCode.ADC_USER_ERR_0004

      );

      return;

    }

    // ============================================
    // VALIDATE PASSWORD LENGTH
    // ============================================

    if (

      this.user.password.length < 6

    ) {

      await this.notification.error(

        AppMessageCode.ADC_AUTH_ERR_0004

      );

      return;

    }

    try {

      // ============================================
      // LOADING
      // ============================================

      this.cargando = true;

      // ============================================
      // REGISTER USER
      // ============================================

      await this.authService.register(
        this.user
      );

      // ============================================
      // SUCCESS MESSAGE
      // ============================================

      await this.notification.success(

        AppMessageCode.ADC_AUTH_INF_0001

      );

      // ============================================
      // NAVIGATE LOGIN
      // ============================================

      this.router.navigate([
        '/login'
      ]);

    }

    catch (error: any) {

      console.error(
        'REGISTER ERROR',
        error
      );

      // ============================================
      // APP ERROR
      // ============================================

      if (error?.message) {

        await this.notification.error(

          error.message

        );

      }

      // ============================================
      // UNKNOWN ERROR
      // ============================================

      else {

        await this.notification.error(

          AppMessageCode.ADC_AUTH_ERR_0006

        );

      }

    }

    finally {

      // ============================================
      // LOADING OFF
      // ============================================

      this.cargando = false;

    }

  }

}