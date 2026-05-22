import { Injectable } from '@angular/core';

import { Router }
from '@angular/router';

import { UserService }
from '@users/services/user.service';

import { AuthService }
from '@auth/services/auth.service';

import { NotificationService }
from '@core/services/notification.service';

import { UserDetailFormService }
from './user-detail-form.service';

import { UserDetailPhotoService }
from './user-detail-photo.service';

import { User }
from '@users/models/users.models';

import { UserStatus }
from '@users/models/user-status.enum';

import { AppMessageCode }
from 'src/app/core/constants/messages/app-message-code.enum';

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

        this.formService
          .normalizeName(

            user.nombre || ''

          );

      // ============================================
      // PHOTO
      // ============================================

      if (croppedImage) {

        const uid =

          user.uid ||
          crypto.randomUUID();

        user.foto =

          await this.photoService
            .uploadProfilePhoto(

              uid,

              croppedImage

            );

      }

      // ============================================
      // UPDATE USER
      // ============================================

      if (userId) {

        await this.userService.update(

          userId,

          {

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


          }

        );

      }

      // ============================================
      // SUCCESS
      // ============================================

      await this.notification.success(

        'Datos personales actualizados'

      );

      // ============================================
      // RELOAD AUTH DATA
      // ============================================

      await this.authService
        .reloadUserData(
          user.uid
        );

      // ============================================
      // PENDING USER
      // ============================================

      if (

        user.estado ===
        UserStatus.PENDING_APPROVAL

      ) {

        this.router.navigate([
          '/home'
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

    // ============================================
    // VALIDATION
    // ============================================

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

      // ============================================
      // OWN PROFILE
      // ============================================

      if (isOwnProfile) {

        await this.authService
          .updateCredentials(

            user.uid,

            originalEmail,

            currentPassword,

            user.email || '',

            password || ''

          );

      }

      // ============================================
      // ADMIN / DIRECTIVA
      // ============================================

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

      // ============================================
      // SUCCESS
      // ============================================

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

    // ============================================
    // VALIDATE EMAILS
    // ============================================

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

    // ============================================
    // VALIDATE PASSWORDS
    // ============================================

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

      // ============================================
      // NORMALIZE NAME
      // ============================================

      user.nombre =

        this.formService
          .normalizeName(

            user.nombre || ''

          );

      // ============================================
      // PASSWORD
      // ============================================

      user.password =
        password;

      // ============================================
      // PHOTO
      // ============================================

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

      // ============================================
      // CREATE USER
      // ============================================

      await this.authService
        .createUserAsAdmin(

          user

        );

      // ============================================
      // SUCCESS
      // ============================================

      await this.notification.success(

        AppMessageCode.ADC_AUTH_INF_0001

      );

      // ============================================
      // NAVIGATE
      // ============================================

      this.router.navigate([
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