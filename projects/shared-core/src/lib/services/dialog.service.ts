import { Injectable, inject } from '@angular/core';
// 🚀 Saneado: Importación corregida al motor Standalone para evitar duplicación de bundles
import { AlertController } from '@ionic/angular/standalone';

/**
 * @class DialogService
 * @description Servicio core de UI encargado de abstraer e instanciar ventanas modales imperativas
 * nativas de Ionic (Alertas, Prompts de captura de datos y Diálogos de Confirmación).
 * Centraliza la inyección y simplifica el consumo mediante el uso de Promesas nativas de JavaScript.
 */
@Injectable({
  providedIn: 'root'
})
export class DialogService {

  /** @description Instancia inyectada del controlador standalone de alertas de Ionic. @private */
  private alertController = inject(AlertController);

  /**
   * @constructor
   * @description Inicializa el servicio de diálogos comunes.
   */
  constructor() { }

  /**
   * @method confirm
   * @description Despliega un diálogo de confirmación binario en pantalla.
   * Retorna una promesa que se resuelve con true si el operador presiona el botón afirmativo, o false en caso de cancelación.
   * @param {Object} params Parámetros de configuración del modal.
   * @param {string} [params.header='Confirmación'] Título superior del diálogo.
   * @param {string} [params.message='¿Deseas continuar?'] Texto descriptivo de la acción.
   * @param {string} [params.confirmText='Aceptar'] Etiqueta del botón de confirmación.
   * @param {string} [params.cancelText='Cancelar'] Etiqueta del botón de desestimación.
   * @returns {Promise<boolean>}
   */
  public async confirm({
    header = 'Confirmación',
    message = '¿Deseas continuar?',
    confirmText = 'Aceptar',
    cancelText = 'Cancelar'
  }: {
    header?: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
  }): Promise<boolean> {
    return new Promise(async (resolve) => {
      const alert = await this.alertController.create({
        header,
        message,
        cssClass: 'custom-alert',
        buttons: [
          {
            text: cancelText,
            role: 'cancel',
            handler: () => {
              resolve(false);
            }
          },
          {
            text: confirmText,
            role: 'confirm',
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
   * @description Renderiza un modal informativo unidireccional con un único botón de aceptación.
   * @param {Object} params Parámetros de configuración del modal.
   * @param {string} [params.header='Información'] Título del modal.
   * @param {string} [params.message=''] Mensaje informativo a imprimir.
   * @param {string} [params.buttonText='Aceptar'] Etiqueta del botón de cierre.
   * @returns {Promise<void>}
   */
  public async alert({
    header = 'Información',
    message = '',
    buttonText = 'Aceptar'
  }: {
    header?: string;
    message?: string;
    buttonText?: string;
  }): Promise<void> {
    const alert = await this.alertController.create({
      header,
      message,
      cssClass: 'custom-alert',
      buttons: [
        {
          text: buttonText
        }
      ]
    });

    await alert.present();
  }

  /**
   * @method prompt
   * @description Levanta un modal imperativo provisto de una caja de texto simple para la captura de entradas de usuario.
   * Retorna una promesa que resuelve con la cadena introducida por el operador, o null si la operación fue cancelada.
   * @param {Object} params Parámetros de configuración del prompt.
   * @param {string} [params.header='Introducir valor'] Cabecera del formulario.
   * @param {string} [params.message=''] Texto aclaratorio.
   * @param {string} [params.placeholder=''] Pista visual interna de la caja de entrada.
   * @param {string} [params.confirmText='Aceptar'] Texto del botón positivo.
   * @param {string} [params.cancelText='Cancelar'] Texto del botón negativo.
   * @returns {Promise<string | null>}
   */
  public async prompt({
    header = 'Introducir valor',
    message = '',
    placeholder = '',
    confirmText = 'Aceptar',
    cancelText = 'Cancelar'
  }: {
    header?: string;
    message?: string;
    placeholder?: string;
    confirmText?: string;
    cancelText?: string;
  }): Promise<string | null> {
    return new Promise(async (resolve) => {
      const alert = await this.alertController.create({
        header,
        message,
        cssClass: 'custom-alert',
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
            handler: () => {
              resolve(null);
            }
          },
          {
            text: confirmText,
            role: 'confirm',
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