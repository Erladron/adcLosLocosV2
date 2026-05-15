import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormsModule
} from '@angular/forms';

import {
  IonicModule
} from '@ionic/angular';

import { addIcons } from 'ionicons';

import {
  eyeOutline,
  eyeOffOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-credentials-form',

  templateUrl:
    './credentials-form.component.html',

  styleUrls: [
    './credentials-form.component.scss'
  ],

  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ]
})

export class CredentialsFormComponent {

  // =====================================
  // INPUTS
  // =====================================

  @Input()
  user: any;

  @Input()
  repeatEmail = '';

  @Input()
  password = '';

  @Input()
  repeatPassword = '';

  // =====================================
  // OUTPUTS
  // =====================================

  @Output()
  repeatEmailChange =
    new EventEmitter<string>();

  @Output()
  passwordChange =
    new EventEmitter<string>();

  @Output()
  repeatPasswordChange =
    new EventEmitter<string>();

  // =====================================
  // LOCAL UI STATE
  // =====================================

  mostrarPassword = false;

  mostrarRepeatPassword = false;

  constructor() {

    addIcons({

      eyeOutline,
      eyeOffOutline

    });

  }
  // =====================================
  // TOGGLES
  // =====================================

  onTogglePassword(): void {

    this.mostrarPassword =

      !this.mostrarPassword;

  }

  onToggleRepeatPassword(): void {

    this.mostrarRepeatPassword =

      !this.mostrarRepeatPassword;

  }

  // =====================================
  // EMAILS MATCH
  // =====================================

  emailsMatch(): boolean {

    if (
      !this.user?.email ||
      !this.repeatEmail
    ) {

      return false;
    }

    return (

      this.user.email
        .trim()
        .toLowerCase()

      ===

      this.repeatEmail
        .trim()
        .toLowerCase()

    );

  }

  // =====================================
  // PASSWORDS MATCH
  // =====================================

  passwordsMatch(): boolean {

    if (
      !this.password ||
      !this.repeatPassword
    ) {

      return false;
    }

    return (

      this.password.trim()

      ===

      this.repeatPassword.trim()

    );

  }

  // =====================================
  // PASSWORD STRENGTH
  // =====================================

  getPasswordStrength(): string {

    const password =
      this.password || '';

    if (password.length < 6) {

      return 'Débil';
    }

    if (

      password.match(/[A-Z]/) &&
      password.match(/[0-9]/) &&
      password.length >= 8

    ) {

      return 'Fuerte';
    }

    return 'Media';

  }

}