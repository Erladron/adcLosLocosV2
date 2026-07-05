import { Injectable } from '@angular/core';
import { AppMessageCode } from '../constants/app-message-code.enum';
import { validateEmail } from '../utils/string.utils';

/**
 * @class UserDetailFormService
 * @description Servicio core especialista encargado de la validación sintáctica de formularios, 
 * control de equivalencias de dobles checks (emails/passwords) y detección de mutaciones en los inputs.
 */
@Injectable({
  providedIn: 'root'
})
export class UserDetailFormService {

  /**
   * @constructor
   * @description Inicializa el validador de lógica de formularios del detalle.
   */
  constructor() { }

  /**
   * @method validateEmails
   * @description Evalúa la coherencia y concordancia exacta de los correos primarios y espejos usando utilidades del core.
   * @param {string} email Cadena de texto correspondiente al correo electrónico primario.
   * @param {string} repeatEmail Cadena de texto correspondiente al correo de confirmación de la UI.
   * @returns {any} Descriptor estructurado con el booleano resultante y su código de error indexado si falla.
   */
  public validateEmails(
    email: string,
    repeatEmail: string
  ): { valid: boolean, error: AppMessageCode | null } {
    const valid = validateEmail(email || '', repeatEmail || '');

    return {
      valid,
      error: valid ? null : AppMessageCode.ADC_USER_ERR_0003
    };
  }

  /**
   * @method validatePasswords
   * @description Evalúa la equivalencia exacta de las cadenas de caracteres suministradas en los campos de claves de acceso.
   * @param {string} password Cadena de texto de la contraseña primaria.
   * @param {string} repeatPassword Cadena de texto de la contraseña espejo de confirmación.
   * @returns {any} Descriptor estructurado con el veredicto del doble check.
   */
  public validatePasswords(
    password: string,
    repeatPassword: string
  ): { valid: boolean, error: AppMessageCode | null } {
    const valid = password === repeatPassword;

    return {
      valid,
      error: valid ? null : AppMessageCode.ADC_USER_ERR_0004
    };
  }

  /**
   * @method passwordChanged
   * @description Detección síncrona preliminar para verificar si el operador ha introducido caracteres en las cajas de contraseñas.
   * @param {string} password Contraseña primaria.
   * @param {string} repeatPassword Contraseña espejo.
   * @returns {boolean} Retorna true si alguna de las variables presenta contenido de texto.
   */
  public passwordChanged(
    password: string,
    repeatPassword: string
  ): boolean {
    return (
      !!password ||
      !!repeatPassword
    );
  }

  /**
   * @method emailChanged
   * @description Compara el correo electrónico activo en el input frente al valor inmutable original descargado del servidor.
   * @param {string} currentEmail Email actual en edición en la caja de texto.
   * @param {string} originalEmail Email de respaldo original persistido en la base de datos.
   * @returns {boolean} Retorna true si el usuario ha alterado o editado la cadena del correo de acceso.
   */
  public emailChanged(
    currentEmail: string,
    originalEmail: string
  ): boolean {
    return (
      currentEmail?.trim()?.toLowerCase()
      !==
      originalEmail?.trim()?.toLowerCase()
    );
  }

  /**
   * @method validateCredentialsForm
   * @description Orquesta la validación integral multinivel combinada para el bloque de credenciales de seguridad.
   * Realiza el cortocircuito inmediato evaluando cambios en emails y contraseñas.
   * @param {any} params Objeto compuesto con las cadenas de texto en edición y sus respectivos respaldos de base de datos.
   * @returns {any} Descriptor analítico final con el veredicto de validación del formulario.
   */
  public validateCredentialsForm({
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
  }): { valid: boolean, error: AppMessageCode | null } {
    
    // 1. Evaluación dinámica del cambio de correo electrónico
    const emailChanged = this.emailChanged(email, originalEmail);

    if (emailChanged) {
      const emailValidation = this.validateEmails(email, repeatEmail);
      if (!emailValidation.valid) {
        return emailValidation;
      }
    }

    // 2. Evaluación dinámica del cambio de contraseñas de acceso
    const passwordChanged = this.passwordChanged(password, repeatPassword);

    if (passwordChanged) {
      const passwordValidation = this.validatePasswords(password, repeatPassword);
      if (!passwordValidation.valid) {
        return passwordValidation;
      }
    }

    // 3. Formulario verificado y solvente
    return {
      valid: true,
      error: null
    };
  }
}