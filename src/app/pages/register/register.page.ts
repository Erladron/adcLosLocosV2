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
  IonBackButton

} from '@ionic/angular/standalone';

import { Router }
  from '@angular/router';

import { AuthService }
  from 'src/app/services/auth.service';

@Component({

  selector: 'app-register',

  templateUrl: './register.page.html',

  styleUrls: ['./register.page.scss'],

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
    IonBackButton

  ]

})
export class RegisterPage {

  user = {

    nombre: '',
    email: '',
    password: ''

  };

  cargando = false;

  constructor(

    private authService:
      AuthService,

    private router:
      Router

  ) {

  }

  async registrarse() {

    try {

      this.cargando = true;

      // VALIDAR NOMBRE
      if (
        !this.user.nombre
      ) {

        alert(
          'Introduzca nombre'
        );

        return;

      }

      // VALIDAR EMAIL
      if (
        !this.user.email
      ) {

        alert(
          'Introduzca email'
        );

        return;

      }

      // VALIDAR PASSWORD
      if (
        !this.user.password
      ) {

        alert(
          'Introduzca contraseña'
        );

        return;

      }

      // REGISTER
      await this.authService
        .register(
          this.user
        );

      alert(

        'Cuenta creada correctamente'

      );

      this.router.navigate([
        '/login'
      ]);

    } catch (error: any) {

      console.error(error);

      alert(

        error?.message
        ||

        'Error registrando usuario'

      );

    } finally {

      this.cargando = false;

    }

  }

}