import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from 'projects/shared-core/src/lib/services/user.service';
import { AuthService } from 'projects/shared-core/src/lib/services/auth.service';
import { NotificationService } from 'projects/shared-core/src/lib/services/notification.service';
import { UserFeesService } from 'projects/shared-core/src/lib/services/user-fees.service';
import { ErrorHandlerService } from 'projects/shared-core/src/lib/services/error-handler.service';

import { UserDetailFormService } from './user-detail-form.service';
import { User, UserStatus } from '../models/users.models';
import { UpdatePersonalDataRequest } from '../models/update-personal-data-request.model';
import { AppMessageCode } from '../constants/app-message-code.enum';
import { normalizeName } from '../utils/string.utils';
import { UserDetailPhotoService } from './user-detail-photo.service';

/**
 * @class UserDetailDataService
 * @description Servicio intermedio de la capa core encargado de orquestar el procesamiento de datos,
 * las subidas multimedia de imágenes de perfil y la gestión del flujo de navegación pos-onboarding.
 * Centraliza las mutaciones de datos, la gestión de la bandera 'requiereCambioClave' y delega
 * la captura de excepciones en el ErrorHandlerService unificado[cite: 2, 5, 9].
 */
@Injectable({
  providedIn: 'root'
})
export class UserDetailDataService {

  /** @description Instancia inyectada del servicio central de persistencia de usuarios[cite: 5]. @private */
  private userService: UserService = inject(UserService);

  /** @description Instancia inyectada del servicio satélite de gestión financiera corporativa[cite: 5]. @private */
  private userFeesService: UserFeesService = inject(UserFeesService);

  /** @description Instancia inyectada del motor core de sesiones y credenciales de autenticación[cite: 5]. @private */
  private authService: AuthService = inject(AuthService);

  /** @description Instancia inyectada del despachador de alertas Toast de la interfaz gráfica[cite: 5]. @private */
  private notification: NotificationService = inject(NotificationService);

  /** @description Instancia inyectada del gestor centralizado de excepciones del ecosistema. @private */
  private errorHandler: ErrorHandlerService = inject(ErrorHandlerService);

  /** @description Instancia inyectada del validador analítico de lógica de formularios[cite: 5]. @private */
  private formService: UserDetailFormService = inject(UserDetailFormService);

  /** @description Instancia inyectada del gestor de optimización de imágenes de avatar[cite: 5]. @private */
  private photoService: UserDetailPhotoService = inject(UserDetailPhotoService);

  /** @description Instancia inyectada del enrutador general del framework Angular[cite: 5]. @private */
  private router: Router = inject(Router);

  /**
   * @constructor
   * @description Inicializa el servicio de procesamiento de datos de usuario[cite: 5].
   */
  constructor() { }

  /**
   * @method updatePersonalData
   * @description Procesa la normalización PascalCase del nombre, gestiona la subida asíncrona del archivo multimedia
   * a Storage y despacha el payload tipado hacia el endpoint limpio del UserService[cite: 5].
   * @param {any} params Objeto desestructurado con el modelo del usuario, su identificador y la imagen Base64 del cropper[cite: 5].
   * @returns {Promise<boolean>} Promesa asíncrona que resuelve a true si la mutación civil fue exitosa[cite: 5].
   */
  public async updatePersonalData({
    user,
    userId,
    croppedImage
  }: {
    user: User,
    userId: string | null,
    croppedImage: string
  }): Promise<boolean> {
    try {
      user.nombre = normalizeName(user.nombre || '');

      if (croppedImage && croppedImage.startsWith('data:image')) {
        const uid = user.id || crypto.randomUUID();
        user.foto = await this.photoService.uploadProfilePhoto(uid, croppedImage);
      }

      const nextStatus = user.estado === UserStatus.PENDING_DATA
        ? UserStatus.PENDING_APPROVAL
        : user.estado;

      const payload: UpdatePersonalDataRequest = {
        nombre: user.nombre,
        telefono: user.telefono || '',
        dni: user.dni || '',
        direccion: user.direccion || '',
        detallesDireccion: user.detallesDireccion || null,
        foto: user.foto || '',
        profesion: user.profesion || '',
        publicarTelefono: !!user.publicarTelefono,
        publicarEmail: !!user.publicarEmail,
        estado: nextStatus
      };

      if (userId) {
        await this.userService.updatePersonalData(userId, payload);
      }

      await this.notification.success('Datos personales actualizados');

      const authUid = this.authService.getUid();
      const isOnboardingFlow = nextStatus === UserStatus.PENDING_APPROVAL;

      if (authUid && authUid === user.id && !isOnboardingFlow) {
        await this.authService.reloadUserData(authUid);
      }

      if (isOnboardingFlow) {
        await this.router.navigate(['/pending-approval']);
      }

      return true;
    } catch (error) {
      console.error(error);
      await this.errorHandler.handle(error, AppMessageCode.ACD_USER_ERR_0002);
      return false;
    }
  }

  /**
   * @method updateMembership
   * @description Actualiza exclusivamente el rango corporativo jerárquico y el número de socio[cite: 5].
   * @param {any} params Parámetros desestructurados que contienen el modelo del usuario y su identificador de documento[cite: 5].
   * @returns {Promise<boolean>} Promesa asíncrona que resuelve a true si la persistencia fue consolidada correctamente[cite: 5].
   */
  public async updateMembership({
    user,
    userId
  }: {
    user: User,
    userId: string | null
  }): Promise<boolean> {
    try {
      if (userId) {
        await this.userService.update(userId, {
          tipo: user.tipo,
          numeroSocio: user.numeroSocio || ''
        });
      }

      await this.notification.success('Membresía actualizada');
      return true;
    } catch (error) {
      console.error(error);
      await this.errorHandler.handle(error);
      return false;
    }
  }

  /**
   * @method updateCredentials
   * @description Valida la equivalencia sintáctica e invoca la actualización asíncrona de correos o claves de inicio de sesión[cite: 5].
   * @param {any} params Parámetros compuestos del subformulario de credenciales de seguridad[cite: 5].
   * @returns {Promise<boolean>} Promesa asíncrona de resolución[cite: 5].
   */
  public async updateCredentials({
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
  }): Promise<boolean> {
    const validation = this.formService.validateCredentialsForm({
      email: user.email || '',
      repeatEmail,
      password,
      repeatPassword,
      originalEmail
    });

    if (!validation.valid) {
      await this.notification.error(validation.error!);
      return false;
    }

    try {
      if (isOwnProfile) {
        await this.authService.updateCredentials(
          user.id,
          originalEmail,
          currentPassword,
          user.email || '',
          password || ''
        );
      } else if (userId) {
        await this.userService.update(userId, { email: user.email });
      }

      await this.notification.success(
        password
          ? 'Contraseña actualizada y verificación enviada al nuevo email'
          : 'Verificación enviada al nuevo email'
      );
      return true;
    } catch (error: any) {
      console.error(error);
      await this.errorHandler.handle(error, AppMessageCode.ACD_AUTH_ERR_0010);
      return false;
    }
  }

  /**
   * @method createUser
   * @description Orquesta y valida la creación manual directa de un nuevo socio en el sistema por parte de la directiva[cite: 5].
   * Garantiza la inicialización de la bandera 'requiereCambioClave = true' en el modelo local de Angular[cite: 2, 5],
   * delega la alta en el backend e intercepta cualquier excepción mediante el ErrorHandlerService[cite: 5, 8, 9].
   * @param {any} params Parámetros del chasis de alta compilados por el formulario de creación[cite: 5].
   * @returns {Promise<boolean>} Promesa asíncrona que resuelve a true si el alta se completó con éxito[cite: 5].
   */
  public async createUser({
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
  }): Promise<boolean> {
    const emailValidation = this.formService.validateEmails(user.email || '', repeatEmail);
    if (!emailValidation.valid) {
      await this.notification.error(emailValidation.error!);
      return false;
    }

    const passwordValidation = this.formService.validatePasswords(password, repeatPassword);
    if (!passwordValidation.valid) {
      await this.notification.error(passwordValidation.error!);
      return false;
    }

    try {
      user.nombre = normalizeName(user.nombre || '');
      user.password = password;

      user.publicarTelefono = user.publicarTelefono ?? false;
      user.publicarEmail = user.publicarEmail ?? false;
      user.profesion = user.profesion || '';
      user.cuotaAlCorriente = user.cuotaAlCorriente ?? false;
      
      // 🔑 LA PIEZA CLAVE: Mantiene el flag en la memoria RAM del modelo de Angular
      user.requiereCambioClave = true;

      if (croppedImage) {
        const tempUid = crypto.randomUUID();
        user.foto = await this.photoService.uploadProfilePhoto(tempUid, croppedImage);
      }

      console.log('NUEVO USUARIO A REGISTRAR: ', user);
      await this.authService.createUserAsAdmin(user);

      await this.notification.success(AppMessageCode.ACD_AUTH_INF_0001);
      await this.router.navigate(['/gest-user']);
      return true;

    } catch (error: any) {
      console.error('🚨 Error durante la creación de usuario:', error);
      
      // 🚀 Canalización al interceptor maestro de excepciones
      await this.errorHandler.handle(error, AppMessageCode.ACD_USER_ERR_0001);
      return false;
    }
  }
}