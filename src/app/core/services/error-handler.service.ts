import { Injectable }
  from '@angular/core';

import { NotificationService }
  from '@core/services/notification.service';

import { AppMessageCode }
  from '@core/constants/messages/app-message-code.enum';

import { FIREBASE_ERROR_MAP }
  from '@core/constants/firebase-error-map';

@Injectable({
  providedIn: 'root'
})

export class ErrorHandlerService {

  constructor(

    private notification:
      NotificationService

  ) { }

  // ============================================
  // HANDLE
  // ============================================

  /**
   * Gestionar error global.
   */
  async handle(

    error: any,

    fallbackMessage =

      AppMessageCode
        .ADC_SYS_ERR_0001

  ) {

    // ============================================
    // LOG
    // ============================================

    console.error(error);

    const firebaseCode =

      error?.code;

    if (

      firebaseCode

      &&

      FIREBASE_ERROR_MAP[firebaseCode]

    ) {

      await this.notification.error(

        FIREBASE_ERROR_MAP[
        firebaseCode
        ]

      );

      return;

    }

    // ============================================
    // CUSTOM MESSAGE
    // ============================================

    if (error?.message) {

      await this.notification.error(

        error.message

      );

      return;

    }

    // ============================================
    // FALLBACK
    // ============================================

    await this.notification.error(

      fallbackMessage

    );

  }

}