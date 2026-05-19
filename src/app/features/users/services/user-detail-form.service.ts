import { Injectable } from '@angular/core';

import { UserValidationService }
from '@users/services/user-validation.service';

import { AppMessageCode }
from '@core/constants/messages/app-message-code.enum';

@Injectable({
  providedIn: 'root'
})

export class UserDetailFormService {

  constructor(

    private validationService:
      UserValidationService

  ) { }

  // ============================================
  // NORMALIZE NAME
  // ============================================

  /**
   * Capitaliza nombre usuario.
   */
  normalizeName(
    name: string
  ): string {

    return this.validationService
      .capitalizeName(name || '');

  }

  // ============================================
  // VALIDATE EMAILS
  // ============================================

  /**
   * Validación emails.
   */
  validateEmails(

    email: string,

    repeatEmail: string

  ) {

    const valid =

      this.validationService
        .validateEmail(

          email || '',

          repeatEmail || ''

        );

    return {

      valid,

      error:

        valid

          ? null

          : AppMessageCode.ADC_USER_ERR_0003

    };

  }

  // ============================================
  // VALIDATE PASSWORDS
  // ============================================

  /**
   * Validación passwords.
   */
  validatePasswords(

    password: string,

    repeatPassword: string

  ) {

    // ============================================
    // PASSWORDS MATCH
    // ============================================

    const valid =

      password === repeatPassword;

    return {

      valid,

      error:

        valid

          ? null

          : AppMessageCode.ADC_USER_ERR_0004

    };

  }

  // ============================================
  // PASSWORD CHANGED
  // ============================================

  /**
   * Comprueba si password cambió.
   */
  passwordChanged(

    password: string,

    repeatPassword: string

  ): boolean {

    return (

      !!password ||

      !!repeatPassword

    );

  }

  // ============================================
  // EMAIL CHANGED
  // ============================================

  /**
   * Comprueba si email cambió.
   */
  emailChanged(

    currentEmail: string,

    originalEmail: string

  ): boolean {

    return (

      currentEmail?.trim()?.toLowerCase()

      !==

      originalEmail?.trim()?.toLowerCase()

    );

  }

  // ============================================
  // VALIDATE CREDENTIALS FORM
  // ============================================

  /**
   * Validación completa credenciales.
   */
  validateCredentialsForm({

    email,
    repeatEmail,
    password,
    repeatPassword,
    originalEmail

  }: {

    email: string,
    repeatEmail: string,
    password: string,
    repeatPassword: string,
    originalEmail: string

  }) {

    // ============================================
    // EMAIL VALIDATION
    // ============================================

    const emailChanged =

      this.emailChanged(

        email,

        originalEmail

      );

    if (emailChanged) {

      const emailValidation =

        this.validateEmails(

          email,

          repeatEmail

        );

      if (!emailValidation.valid) {

        return emailValidation;

      }

    }

    // ============================================
    // PASSWORD VALIDATION
    // ============================================

    const passwordChanged =

      this.passwordChanged(

        password,

        repeatPassword

      );

    if (passwordChanged) {

      const passwordValidation =

        this.validatePasswords(

          password,

          repeatPassword

        );

      if (!passwordValidation.valid) {

        return passwordValidation;

      }

    }

    // ============================================
    // SUCCESS
    // ============================================

    return {

      valid: true,

      error: null

    };

  }

}