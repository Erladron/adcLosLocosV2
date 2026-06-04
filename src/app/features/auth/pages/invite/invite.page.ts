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
  from 'projects/shared-core/src/lib/services/user.service';

import { AuthService }
  from 'projects/shared-core/src/lib/services/auth.service';

import { NotificationService }
  from 'projects/shared-core/src/lib/services/notification.service';

import { LoadingService }
  from 'projects/shared-core/src/lib/services/loading.service';

import { ErrorHandlerService }
  from 'projects/shared-core/src/lib/services/error-handler.service';

import { AppMessageCode }
  from 'shared-core';

import {

  PageHeaderComponent

} from 'shared-core';

import {

  InvitedUserService

} from 'projects/shared-core/src/lib/services/invited-user.service';

import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { EmailTemplates } from 'shared-core'; // Ajusta la ruta exacta según tu estructura

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
      ErrorHandlerService,

    private firestore:
      Firestore
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
                'Administrador',

              invitadoPorUid:

                currentUser?.id
                ||
                '',

              fechaInvitacion:
                null,

              usado: false

            });

          // ============================================
          // GET TOKEN (DOCUMENT ID)
          // ============================================

          // Recuperamos la invitación recién creada para sacar su ID y usarlo como Token
          const nuevaInvitacion =
            await this.invitedUserService
              .getInvitationByEmail(email);

          // ============================================
          // PREPARE EMAIL TEMPLATE
          // ============================================

          const htmlTemplate = EmailTemplates.getInvitationTemplate(nuevaInvitacion.id);

          // ============================================
          // SEND EMAIL VIA FIRESTORE (MODULAR API)
          // ============================================

          const mailCollection = collection(this.firestore, 'mail');

          await addDoc(mailCollection, {
            to: email,
            message: {
              subject: '¡Bienvenido! Completa tu inscripción - ADC Los Locos',
              html: htmlTemplate
            }
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