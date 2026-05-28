import { Injectable }
from '@angular/core';

import {

  ToastController

} from '@ionic/angular';

import { addIcons }
from 'ionicons';

import {

  checkmarkCircleOutline,
  warningOutline,
  closeCircleOutline,
  informationCircleOutline,
  closeOutline

} from 'ionicons/icons';

import { APP_MESSAGES }
from '../constants/app-messages';

@Injectable({
  providedIn: 'root'
})

export class NotificationService {

  constructor(

    private toastController:
      ToastController

  ) {

    // ============================================
    // ICONS
    // ============================================

    addIcons({

      checkmarkCircleOutline,
      warningOutline,
      closeCircleOutline,
      informationCircleOutline,
      closeOutline

    });

  }

  // ============================================
  // SUCCESS
  // ============================================

  async success(message: string) {

    await this.showToast(

      APP_MESSAGES[message]
      || message,

      'success-toast',

      'checkmark-circle-outline'

    );

  }

  // ============================================
  // ERROR
  // ============================================

  async error(message: string) {

    await this.showToast(

      APP_MESSAGES[message]
      || message,

      'error-toast',

      'close-circle-outline'

    );

  }

  // ============================================
  // WARNING
  // ============================================

  async warning(message: string) {

    await this.showToast(

      APP_MESSAGES[message]
      || message,

      'warning-toast',

      'warning-outline'

    );

  }

  // ============================================
  // INFO
  // ============================================

  async info(message: string) {

    await this.showToast(

      APP_MESSAGES[message]
      || message,

      'info-toast',

      'information-circle-outline'

    );

  }

  // ============================================
  // SHOW TOAST
  // ============================================

  private async showToast(

    message: string,

    cssClass: string,

    icon: string

  ) {

    const toast =

      await this.toastController
        .create({

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