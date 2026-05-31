import { Injectable, inject } from '@angular/core';

import { Auth }
from '@angular/fire/auth';

// 🔥 IMPORTACIÓN NATIVA DE ANGULARFIRE FUNCTIONS
import { Functions, httpsCallable } from '@angular/fire/functions';

import { ENVIRONMENT } from '../env.token'; // Ajusta los puntos según donde hayas guardado el env.token.ts

import { AppMessageCode }
from '../constants/app-message-code.enum';

@Injectable({
  providedIn: 'root'
})

export class AuthAdminService {

  private env = inject(ENVIRONMENT);

  constructor(

    private auth: Auth,

    // 🔥 INYECTAMOS EL MÓDULO DE FUNCTIONS AQUÍ
    private functions: Functions

  ) { }

  // ============================================
  // CREATE USER AS ADMIN
  // ============================================

  /**
   * Crea usuario desde backend seguro.
   *
   * Flujo:
   * - obtiene token Firebase
   * - llama backend/cloud function
   * - backend crea usuario
   */
  async createUserAsAdmin(
    user: any
  ) {

    // ============================================
    // CHECK AUTH
    // ============================================

    if (!this.auth.currentUser) {

      throw new Error(

        AppMessageCode.ADC_AUTH_ERR_0001

      );

    }

    // ============================================
    // GET TOKEN
    // ============================================

    const token =

      await this.auth
        .currentUser
        ?.getIdToken();

    // ============================================
    // CALL BACKEND
    // ============================================

    const response =

      await fetch(

        this.env.api.createUserByAdmin,

        {

          method: 'POST',

          headers: {

            'Content-Type':
              'application/json',

            Authorization:
              `Bearer ${token}`

          },

          body: JSON.stringify({

            data: user

          })

        }

      );

    // ============================================
    // RESPONSE JSON
    // ============================================

    const result =
      await response.json();

    // ============================================
    // ERROR RESPONSE
    // ============================================

    if (!response.ok) {

      throw new Error(

        result.error ||

        AppMessageCode.ADC_AUTH_ERR_0006

      );

    }

    // ============================================
    // SUCCESS
    // ============================================

    return result;

  }

  // ============================================
  // CHECK ADMIN SESSION
  // ============================================

  /**
   * Comprueba si sesión admin
   * sigue siendo válida.
   */
  async hasValidAdminSession(): Promise<boolean> {

    try {

      // ============================================
      // CHECK USER
      // ============================================

      if (!this.auth.currentUser) {

        return false;

      }

      // ============================================
      // REFRESH TOKEN
      // ============================================

      await this.auth.currentUser
        .getIdToken(true);

      return true;

    }

    catch (error) {

      console.error(
        'ADMIN SESSION ERROR',
        error
      );

      return false;

    }

  }

  // ============================================
  // GET TOKEN
  // ============================================

  /**
   * Devuelve token Firebase actual.
   */
  async getToken(): Promise<string> {

    // ============================================
    // CHECK AUTH
    // ============================================

    if (!this.auth.currentUser) {

      throw new Error(

        AppMessageCode.ADC_AUTH_ERR_0001

      );

    }

    // ============================================
    // RETURN TOKEN
    // ============================================

    return await this.auth
      .currentUser
      .getIdToken();

  }

  // ============================================
  // CUSTOM PASSWORD RESET
  // ============================================

  /**
   * 🔥 NUEVO MÉTODO ESPECIALIZADO
   * Llama a la Cloud Function encargada de generar el enlace seguro de contraseña
   */
  async sendCustomResetPasswordEmail(
    email: string
  ): Promise<any> {

    const sendCustomReset = 
      httpsCallable(
        this.functions, 
        'sendCustomPasswordReset'
      );

    return await sendCustomReset({ 
      email 
    });

  }

}