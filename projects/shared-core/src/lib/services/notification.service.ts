import { Injectable, inject } from '@angular/core';
// 🚀 Saneado: Uso del canal standalone para evitar duplicados en el bundle distributivo
import { ToastController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  checkmarkCircleOutline,
  warningOutline,
  closeCircleOutline,
  informationCircleOutline,
  closeOutline
} from 'ionicons/icons';

import { AppMessageCode } from '../constants/app-message-code.enum';
import { APP_MESSAGES } from '../constants/app-messages';

/**
 * @class NotificationService
 * @description Servicio core de UI especialista en la emisión, maquetación y renderizado
 * de notificaciones flotantes (Toasts contextuales) en la parte superior de la interfaz.
 * Centraliza el diccionario de traducción de códigos de error y el registro atómico de iconos nativos.
 */
@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  /** @description Instancia inyectada del controlador standalone de Toasts de Ionic. @private */
  private toastController = inject(ToastController);

  /**
   * @constructor
   * @description Registra de forma inmediata la matriz de iconos vectoriales requeridos por los Toasts corporativos.
   */
  constructor() {
    addIcons({
      checkmarkCircleOutline,
      warningOutline,
      closeCircleOutline,
      informationCircleOutline,
      closeOutline
    });
  }

  /**
   * @method success
   * @description Despacha una notificación flotante de éxito con temática verdosa e icono de verificación.
   * @param {AppMessageCode | string} message Código oficial de la app o cadena textual explícita a traducir.
   * @returns {Promise<void>}
   */
  public async success(message: AppMessageCode | string): Promise<void> {
    await this.showToast(
      APP_MESSAGES[message as AppMessageCode] || message,
      'success-toast',
      'checkmark-circle-outline'
    );
  }

  /**
   * @method error
   * @description Despacha una notificación flotante de error crítico con temática rojiza e icono de cierre.
   * @param {AppMessageCode | string} message Código oficial de la app o cadena textual explícita a traducir.
   * @returns {Promise<void>}
   */
  public async error(message: AppMessageCode | string): Promise<void> {
    await this.showToast(
      APP_MESSAGES[message as AppMessageCode] || message,
      'error-toast',
      'close-circle-outline'
    );
  }

  /**
   * @method warning
   * @description Despacha una notificación flotante de advertencia preventiva con temática anaranjada.
   * @param {AppMessageCode | string} message Código oficial de la app o cadena textual explícita a traducir.
   * @returns {Promise<void>}
   */
  public async warning(message: AppMessageCode | string): Promise<void> {
    await this.showToast(
      APP_MESSAGES[message as AppMessageCode] || message,
      'warning-toast',
      'warning-outline'
    );
  }

  /**
   * @method info
   * @description Despacha una notificación flotante informativa o neutral con temática azulada.
   * @param {AppMessageCode | string} message Código oficial de la app o cadena textual explícita a traducir.
   * @returns {Promise<void>}
   */
  public async info(message: AppMessageCode | string): Promise<void> {
    await this.showToast(
      APP_MESSAGES[message as AppMessageCode] || message,
      'info-toast',
      'information-circle-outline'
    );
  }

  /**
   * @method showToast
   * @description Instancia de forma imperativa y presenta el componente overlay Toast de Ionic en pantalla.
   * Configura una duración estándar de 3.5 segundos con descarte manual mediante botón tipo "close".
   * @param {string} message Contenido de texto ya procesado y traducido.
   * @param {string} cssClass Nombre de la clase CSS declarada en los estilos globales.
   * @param {string} icon Identificador del icono asignado.
   * @private
   * @returns {Promise<void>}
   */
  private async showToast(message: string, cssClass: string, icon: string): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 3500,
      position: 'top',
      icon,
      cssClass,
      buttons: [
        {
          icon: 'close-outline',
          role: 'cancel'
        }
      ]
    });

    await toast.present();
  }
}