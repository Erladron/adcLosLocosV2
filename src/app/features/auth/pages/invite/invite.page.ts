import { Component, OnInit }
from '@angular/core';

import { CommonModule }
from '@angular/common';

import { FormsModule }
from '@angular/forms';

import {

  IonContent,
  IonItem,
  IonInput,
  IonButton,
  IonIcon

} from '@ionic/angular/standalone';

import { addIcons }
from 'ionicons';

import { mailOpenOutline }
from 'ionicons/icons';

import {

  Firestore,
  collection,
  addDoc

} from '@angular/fire/firestore';

import { UserService }
from '@users/services/user.service';

import { AuthService }
from '@auth/services/auth.service';

import { NotificationService }
from '@core/services/notification.service';

import { LoadingService }
from '@core/services/loading.service';

import { ErrorHandlerService }
from '@core/services/error-handler.service';

import { AppMessageCode }
from '@core/constants/messages/app-message-code.enum';

import {

  PageHeaderComponent

} from '@shared/components/page-header/page-header.component';

@Component({

  selector: 'app-invite',

  templateUrl:
    './invite.page.html',

  styleUrls:
    ['./invite.page.scss'],

  standalone: true,

  imports: [

    CommonModule,
    FormsModule,

    IonContent,
    IonItem,
    IonInput,
    IonButton,
    IonIcon,

    PageHeaderComponent

  ]

})

export class InvitePage
implements OnInit {

  // ============================================
  // FORM
  // ============================================

  email = '';

  // ============================================
  // CONSTRUCTOR
  // ============================================

  constructor(

    private authService:
      AuthService,

    private userService:
      UserService,

    private notification:
      NotificationService,

    private loading:
      LoadingService,

    private errorHandler:
      ErrorHandlerService,

    private firestore:
      Firestore

  ) {

    // ============================================
    // ICONS
    // ============================================

    addIcons({

      mailOpenOutline

    });

  }

  // ============================================
  // INIT
  // ============================================

  ngOnInit() { }

  // ============================================
  // INVITAR
  // ============================================

  async invitar() {

    // ============================================
    // EMPTY EMAIL
    // ============================================

    if (!this.email) {

      await this.notification.error(

        AppMessageCode
          .ADC_INV_ERR_0001

      );

      return;

    }

    // ============================================
    // NORMALIZE EMAIL
    // ============================================

    const email =

      this.email
        .trim()
        .toLowerCase();

    // ============================================
    // VALIDATE EMAIL
    // ============================================

    const emailRegex =

      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (

      !emailRegex.test(email)

    ) {

      await this.notification.error(

        AppMessageCode
          .ADC_INV_ERR_0002

      );

      return;

    }

    try {

      await this.loading.wrap(

        async () => {

          // ============================================
          // CHECK EXISTING
          // ============================================

          const canContinue =

            await this.valExist();

          if (!canContinue) {

            return;

          }

          // ============================================
          // COLLECTION
          // ============================================

          const preRegisterRef =

            collection(

              this.firestore,

              'preRegister'

            );

          // ============================================
          // SAVE INVITATION
          // ============================================

          await addDoc(preRegisterRef, {

            email,

            fecha:
              new Date(),

            invitadoPor:

              this.authService
                .currentUser?.uid

              ||

              'administrador'

          });

          // ============================================
          // SUCCESS
          // ============================================

          await this.notification.success(

            AppMessageCode
              .ADC_INV_INF_0001

          );

          // ============================================
          // CLEAR FORM
          // ============================================

          this.email = '';

        },

        'Enviando invitación...'

      );

    }

    catch (error) {

      await this.errorHandler.handle(

        error,

        AppMessageCode
          .ADC_INV_ERR_0003

      );

    }

  }

  // ============================================
  // VALIDATE EXISTING
  // ============================================

  async valExist():
  Promise<boolean> {

    const existing =

      await this.userService
        .existsByEmail(
          this.email
        );

    // ============================================
    // EXISTS
    // ============================================

    if (existing.exists) {

      // ============================================
      // USER EXISTS
      // ============================================

      if (

        existing.source ===
        'users'

      ) {

        const createdAt =

          new Date(

            existing.data.createdAt.seconds
            * 1000

          ).toLocaleDateString();

        await this.notification.warning(

          `[${

            AppMessageCode
              .ADC_INV_ERR_0004

          }] El usuario ya pertenece a la aplicación desde ${createdAt}.`

        );

        return false;

      }

      // ============================================
      // INVITATION EXISTS
      // ============================================

      await this.notification.warning(

        AppMessageCode
          .ADC_INV_ERR_0005

      );

      return false;

    }

    return true;

  }

}