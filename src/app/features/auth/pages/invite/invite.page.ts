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

import {

  InvitedUserService

} from '@users/services/invited-user.service';

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

    private invitedUserService:
      InvitedUserService,

    private notification:
      NotificationService,

    private loading:
      LoadingService,

    private errorHandler:
      ErrorHandlerService

  ) {

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
          // CHECK EXISTING USER
          // ============================================

          const canContinue =

            await this.validateExisting(
              email
            );

          if (!canContinue) {

            return;

          }

          // ============================================
          // CHECK EXISTING INVITATION
          // ============================================

          const existingInvitation =

            await this.invitedUserService
              .getInvitationByEmail(
                email
              );

          if (

            existingInvitation

            &&

            !existingInvitation.usado

          ) {

            await this.notification.warning(

              AppMessageCode
                .ADC_INV_ERR_0005

            );

            return;

          }

          // ============================================
          // CURRENT USER
          // ============================================

          const currentUser =

            this.authService
              .currentUserData;

          // ============================================
          // CREATE INVITATION
          // ============================================

          await this.invitedUserService
            .createInvitation({

              nombre: '',

              email,

              telefono: '',

              invitadoPor:

                currentUser?.nombre
                ||
                'Sistema',

              invitadoPorUid:

                currentUser?.uid
                ||
                '',

              fechaInvitacion:
                null,

              usado: false

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
  // VALIDATE EXISTING USER
  // ============================================

  async validateExisting(
    email: string
  ): Promise<boolean> {

    const existing =

      await this.userService
        .existsByEmail(
          email
        );

    // ============================================
    // EXISTS
    // ============================================

    if (existing.exists) {

      await this.notification.warning(

        AppMessageCode
          .ADC_INV_ERR_0004

      );

      return false;

    }

    return true;

  }

}