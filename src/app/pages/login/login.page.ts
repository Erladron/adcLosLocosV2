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
  IonCard,
  IonCardContent

} from '@ionic/angular/standalone';

import { Router }
from '@angular/router';

import { RouterLink }
from '@angular/router';

import { AuthService }
from 'src/app/services/auth.service';

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
    IonCard,
    IonCardContent,

    RouterLink

  ]

})
export class LoginPage {

  email = '';

  password = '';

  cargando = false;

  error = '';

  constructor(

    private authService:
      AuthService,

    private router:
      Router

  ) {

  }

  async login() {

    try {

      this.cargando = true;

      this.error = '';

      await this.authService.login(

        this.email,

        this.password

      );

      // =========================
      // ESPERAR AUTH
      // =========================

      setTimeout(() => {

        this.router.navigate([
          '/home'
        ]);

      }, 1000);

    } catch (error) {

      console.error(error);

      this.error =
        'Login incorrecto';

    } finally {

      this.cargando = false;

    }

  }

}