import { Injectable }
from '@angular/core';

import {

  AlertController

} from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})

export class DialogService {

  constructor(

    private alertController:
      AlertController

  ) { }

  // ============================================
  // CONFIRM
  // ============================================

  /**
   * Dialogo confirmación.
   */
  async confirm({

    header = 'Confirmación',

    message = '¿Deseas continuar?',

    confirmText = 'Aceptar',

    cancelText = 'Cancelar'

  }: {

    header?: string,

    message?: string,

    confirmText?: string,

    cancelText?: string

  }): Promise<boolean> {

    return new Promise(

      async (resolve) => {

        const alert =

          await this.alertController
            .create({

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

      }

    );

  }

  // ============================================
  // ALERT
  // ============================================

  /**
   * Dialogo información.
   */
  async alert({

    header = 'Información',

    message = '',

    buttonText = 'Aceptar'

  }: {

    header?: string,

    message?: string,

    buttonText?: string

  }) {

    const alert =

      await this.alertController
        .create({

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

}