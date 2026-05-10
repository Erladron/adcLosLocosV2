import { Component } from '@angular/core';

import {

  IonContent,
  IonButton,
  IonInput,
  IonItem,
  IonLabel,
  IonCard,
  IonCardContent

} from '@ionic/angular/standalone';

import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import { Router } from '@angular/router';

import { AuthService } from 'src/app/services/auth.service';

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
    IonLabel,
    IonCard,
    IonCardContent

  ]

})
export class LoginPage {

  email = '';

  password = '';

  error = '';

  constructor(

    private authService: AuthService,

    private router: Router

  ) {}

  async login() {

    try {

      await this.authService.login(
        this.email,
        this.password
      );

      this.router.navigateByUrl('/home');

    } catch (e: any) {

      this.error =
        'Usuario o contraseña incorrectos';

    }

  }

}