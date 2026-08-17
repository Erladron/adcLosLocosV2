import { Injectable, inject } from '@angular/core';
import { AlertController } from '@ionic/angular/standalone';

/**
 * @interface ConfirmDialogParams
 * @description Parámetros de entrada para la configuración de modales de confirmación binarios.
 */
export interface ConfirmDialogParams {
  /** Título superior explicativo del modal. */
  header?: string;
  /** Cuerpo del mensaje o texto descriptivo de la acción. */
  message?: string;
  /** Etiqueta del botón de confirmación o acción afirmativa. */
  confirmText?: string;
  /** Etiqueta del botón de desestimación o cancelación. */
  cancelText?: string;
  /** Clase o selector CSS personalizado para la personalización estética del contenedor. */
  cssClass?: string;
}

/**
 * @interface AlertDialogParams
 * @description Parámetros de entrada para la configuración de modales informativos simples.
 */
export interface AlertDialogParams {
  /** Título superior del modal informativo. */
  header?: string;
  /** Texto descriptivo que se imprimirá en el cuerpo del diálogo. */
  message?: string;
  /** Etiqueta del botón único de aceptación y cierre. */
  buttonText?: string;
  /** Clase CSS para aplicar reglas de estilo personalizadas al overlay. */
  cssClass?: string;
}

/**
 * @interface PromptDialogParams
 * @description Parámetros de entrada para la configuración de modales interativos con captura de datos de texto.
 */
export interface PromptDialogParams {
  /** Cabecera o enunciado del formulario de captura. */
  header?: string;
  /** Texto secundario aclaratorio. */
  message?: string;
  /** Marca de agua o hint visual dentro de la caja de texto. */
  placeholder?: string;
  /** Etiqueta del botón de envío de datos. */
  confirmText?: string;
  /** Etiqueta del botón para desestimar la entrada. */
  cancelText?: string;
  /** Clase CSS para la personalización de los elementos del cuadro emergente. */
  cssClass?: string;
}

/**
 * @class DialogService
 * @description Servicio core de UI encargado de abstraer e instanciar ventanas modales imperativas
 * nativas de Ionic (Alertas, Prompts de captura de datos y Diálogos de Confirmación)[cite: 7].
 * Centraliza la inyección del controlador de alertas, gestiona estilos personalizados vía CSS dinámico
 * y simplifica el consumo mediante el uso de Promesas nativas de JavaScript[cite: 7].
 */
@Injectable({
  providedIn: 'root'
})
export class DialogService {

  /** 
   * @description Instancia inyectada del controlador standalone de alertas de Ionic[cite: 7]. 
   * @private 
   */
  private alertController = inject(AlertController);

  /**
   * @constructor
   * @description Inicializa el servicio centralizado de diálogos e inyecciones de interfaz[cite: 7].
   */
  constructor() { }

  /**
   * @method confirm
   * @description Despliega un diálogo de confirmación binario en pantalla[cite: 7].
   * Permite inyectar una clase CSS personalizada (`cssClass`) para aplicar estilos corporativos (ej. verde WhatsApp).
   * Retorna una promesa que se resuelve con `true` si el operador presiona el botón afirmativo, o `false` en caso de cancelación[cite: 7].
   * 
   * @param {ConfirmDialogParams} params Objeto de configuración con las opciones del diálogo.
   * @returns {Promise<boolean>} Promesa booleana con el resultado de la interacción del usuario.
   */
  public async confirm({
    header = 'Confirmación',
    message = '¿Deseas continuar?',
    confirmText = 'Aceptar',
    cancelText = 'Cancelar',
    cssClass = 'custom-alert'
  }: ConfirmDialogParams): Promise<boolean> {
    return new Promise(async (resolve) => {
      const alert = await this.alertController.create({
        header,
        message,
        cssClass,
        buttons: [
          {
            text: cancelText,
            role: 'cancel',
            cssClass: 'alert-button-cancel',
            handler: () => {
              resolve(false);
            }
          },
          {
            text: confirmText,
            role: 'confirm',
            cssClass: 'alert-button-confirm',
            handler: () => {
              resolve(true);
            }
          }
        ]
      });

      await alert.present();
    });
  }

  /**
   * @method alert
   * @description Renderiza un modal informativo unidireccional con un único botón de aceptación[cite: 7].
   * 
   * @param {AlertDialogParams} params Objeto de configuración con las opciones del modal informativo.
   * @returns {Promise<void>} Promesa que se resuelve una vez aceptado o cerrado el diálogo.
   */
  public async alert({
    header = 'Información',
    message = '',
    buttonText = 'Aceptar',
    cssClass = 'custom-alert'
  }: AlertDialogParams): Promise<void> {
    const alert = await this.alertController.create({
      header,
      message,
      cssClass,
      buttons: [
        {
          text: buttonText,
          cssClass: 'alert-button-confirm'
        }
      ]
    });

    await alert.present();
  }

  /**
   * @method prompt
   * @description Levanta un modal imperativo provisto de una caja de texto simple para la captura de entradas de usuario[cite: 7].
   * Retorna una promesa que resuelve con la cadena introducida por el operador, o `null` si la operación fue cancelada[cite: 7].
   * 
   * @param {PromptDialogParams} params Objeto de configuración con las opciones del formulario flotante.
   * @returns {Promise<string | null>} Promesa con la cadena capturada o `null` si es cancelado.
   */
  public async prompt({
    header = 'Introducir valor',
    message = '',
    placeholder = '',
    confirmText = 'Aceptar',
    cancelText = 'Cancelar',
    cssClass = 'custom-alert'
  }: PromptDialogParams): Promise<string | null> {
    return new Promise(async (resolve) => {
      const alert = await this.alertController.create({
        header,
        message,
        cssClass,
        inputs: [
          {
            name: 'value',
            type: 'text',
            placeholder
          }
        ],
        buttons: [
          {
            text: cancelText,
            role: 'cancel',
            cssClass: 'alert-button-cancel',
            handler: () => {
              resolve(null);
            }
          },
          {
            text: confirmText,
            role: 'confirm',
            cssClass: 'alert-button-confirm',
            handler: (data) => {
              resolve(data.value || '');
            }
          }
        ]
      });

      await alert.present();
    });
  }
}