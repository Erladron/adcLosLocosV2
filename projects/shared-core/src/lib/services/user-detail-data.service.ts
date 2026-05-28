import { Injectable } from '@angular/core';

import { Router }
  from '@angular/router';

import { UserService }
  from 'projects/shared-core/src/lib/services/user.service';

import { AuthService }
  from 'projects/shared-core/src/lib/services/auth.service';

import { NotificationService }
  from 'projects/shared-core/src/lib/services/notification.service';

import { UserDetailFormService }
  from './user-detail-form.service';

import { User } from '../models/users.models';
import { UserStatus } from '../models/user-status.enum';
import { UpdatePersonalDataRequest } from '../models/update-personal-data-request.model';
import { AppMessageCode } from '../constants/app-message-code.enum';
import { normalizeName } from '../utils/string.utils';

import { UserDetailPhotoService }
  from './user-detail-photo.service';

@Injectable({
  providedIn: 'root'
})

export class UserDetailDataService {

  constructor(

    private userService: UserService,

    private authService: AuthService,

    private notification: NotificationService,

    private formService:
      UserDetailFormService,

    private photoService:
      UserDetailPhotoService,

    private router: Router

  ) { }

  // ============================================
  // UPDATE PERSONAL DATA
  // ============================================

  async updatePersonalData({

    user,
    userId,
    croppedImage

  }: {

    user: User,
    userId: string | null,
    croppedImage: string

  }) {

    try {

      // ============================================
      // NORMALIZE NAME
      // ============================================

      user.nombre =

        normalizeName(

          user.nombre || ''

        );

      // ============================================
      // PHOTO
      // ============================================

      console.log(
        'CROPPED IMAGE DEBUG',
        croppedImage
      );

      if (

        croppedImage

        &&

        croppedImage.startsWith(
          'data:image'
        )

      ) {

        const uid =

          user.id ||
          crypto.randomUUID();

        console.log(
          'UPLOAD PHOTO UID',
          uid
        );

        user.foto =

          await this.photoService
            .uploadProfilePhoto(

              uid,

              croppedImage

            );

        console.log(
          'PHOTO URL RESULT',
          user.foto
        );

      }
      else {

        console.warn(
          'INVALID CROPPED IMAGE'
        );

      }

      // ============================================
      // ONBOARDING STATUS
      // ============================================

      const nextStatus =

        user.estado ===
        UserStatus.PENDING_DATA

          ?

          UserStatus.PENDING_APPROVAL

          :

          user.estado;

      // ============================================
      // UPDATE PAYLOAD
      // ============================================

      const payload:
        UpdatePersonalDataRequest = {

        nombre:
          user.nombre,

        telefono:
          user.telefono || '',

        dni:
          user.dni || '',

        direccion:
          user.direccion || '',

        foto:
          user.foto || '',

        estado:
          nextStatus

      };

      console.log(
        'UPDATE PERSONAL DATA PAYLOAD',
        payload
      );

      // ============================================
      // UPDATE USER
      // ============================================

      if (userId) {

        await this.userService
          .updatePersonalData(

            userId,

            payload

          );

      }

      // ============================================
      // SUCCESS
      // ============================================

      await this.notification.success(

        'Datos personales actualizados'

      );

      // ============================================
      // CURRENT AUTH USER
      // ============================================

      const authUid =
        this.authService.getUid();

      // ============================================
      // ONBOARDING FLOW
      // ============================================

      const isOnboardingFlow =

        nextStatus ===
        UserStatus.PENDING_APPROVAL;

      // ============================================
      // REFRESH SESSION ONLY ACTIVE USERS
      // ============================================

      if (

        authUid

        &&

        authUid === user.id

        &&

        !isOnboardingFlow

      ) {

        await this.authService
          .reloadUserData(
            authUid
          );

      }

      // ============================================
      // ONBOARDING NAVIGATION
      // ============================================

      if (

        isOnboardingFlow

      ) {

        await this.router.navigate([
          '/pending-approval'
        ]);

      }

      return true;

    }

    catch (error) {

      console.error(error);

      await this.notification.error(

        AppMessageCode.ADC_USER_ERR_0002

      );

      return false;

    }

  }

  // ============================================
  // UPDATE MEMBERSHIP
  // ============================================

  async updateMembership({

    user,
    userId

  }: {

    user: User,
    userId: string | null

  }) {

    try {

      // ============================================
      // UPDATE USER
      // ============================================

      if (userId) {

        await this.userService.update(

          userId,

          {

            tipo:
              user.tipo,

            numeroSocio:
              user.numeroSocio || ''

          }

        );

      }

      // ============================================
      // SUCCESS
      // ============================================

      await this.notification.success(

        'Membresía actualizada'

      );

      return true;

    }

    catch (error) {

      console.error(error);

      await this.notification.error(

        'Error actualizando membresía'

      );

      return false;

    }

  }

  // ============================================
  // UPDATE CREDENTIALS
  // ============================================

  async updateCredentials({

    user,
    userId,
    originalEmail,
    repeatEmail,
    password,
    repeatPassword,
    currentPassword,
    isOwnProfile

  }: {

    user: User,
    userId: string | null,
    originalEmail: string,
    repeatEmail: string,
    password: string,
    repeatPassword: string,
    currentPassword: string,
    isOwnProfile: boolean

  }) {

    const validation =

      this.formService
        .validateCredentialsForm({

          email:
            user.email || '',

          repeatEmail,

          password,

          repeatPassword,

          originalEmail

        });

    if (!validation.valid) {

      await this.notification.error(

        validation.error!

      );

      return false;

    }

    try {

      if (isOwnProfile) {

        await this.authService
          .updateCredentials(

            user.id,

            originalEmail,

            currentPassword,

            user.email || '',

            password || ''

          );

      }

      else {

        if (userId) {

          await this.userService.update(

            userId,

            {

              email:
                user.email

            }

          );

        }

      }

      await this.notification.success(

        password

          ? 'Contraseña actualizada y verificación enviada al nuevo email'

          : 'Verificación enviada al nuevo email'

      );

      return true;

    }

    catch (error: any) {

      console.error(error);

      await this.notification.error(

        error?.message ||

        AppMessageCode.ADC_AUTH_ERR_0009

      );

      return false;

    }

  }

  // ============================================
  // CREATE USER
  // ============================================

  async createUser({

    user,
    repeatEmail,
    password,
    repeatPassword,
    croppedImage

  }: {

    user: User,
    repeatEmail: string,
    password: string,
    repeatPassword: string,
    croppedImage: string

  }) {

    const emailValidation =

      this.formService
        .validateEmails(

          user.email || '',

          repeatEmail

        );

    if (!emailValidation.valid) {

      await this.notification.error(

        emailValidation.error!

      );

      return false;

    }

    const passwordValidation =

      this.formService
        .validatePasswords(

          password,

          repeatPassword

        );

    if (!passwordValidation.valid) {

      await this.notification.error(

        passwordValidation.error!

      );

      return false;

    }

    try {

      user.nombre =

        normalizeName(

          user.nombre || ''

        );

      user.password =
        password;

      if (croppedImage) {

        const tempUid =
          crypto.randomUUID();

        user.foto =

          await this.photoService
            .uploadProfilePhoto(

              tempUid,

              croppedImage

            );

      }

      await this.authService
        .createUserAsAdmin(

          user

        );

      await this.notification.success(

        AppMessageCode.ADC_AUTH_INF_0001

      );

      await this.router.navigate([
        '/gest-user'
      ]);

      return true;

    }

    catch (error: any) {

      console.error(error);

      await this.notification.error(

        error?.message ||

        AppMessageCode.ADC_USER_ERR_0001

      );

      return false;

    }

  }

}