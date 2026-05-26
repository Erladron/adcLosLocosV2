import {
  Component,
  OnInit
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormsModule
} from '@angular/forms';

import {
  ActivatedRoute
} from '@angular/router';

import {
  IonContent,
  IonButton,
  IonIcon
} from '@ionic/angular/standalone';

import { addIcons }
  from 'ionicons';

import {
  saveOutline,
  createOutline,
  checkmarkOutline,
  trashOutline,
  refreshOutline

} from 'ionicons/icons';

import {
  PersonalDataFormComponent
} from './components/personal-data-form/personal-data-form.component';

import {
  MembershipFormComponent
} from './components/membership-form/membership-form.component';

import {
  CredentialsFormComponent
} from './components/credentials-form/credentials-form.component';

import {
  UserAuditFormComponent
} from './components/user-audit-form/user-audit-form.component';

import {
  PageHeaderComponent
} from '@shared/components/page-header/page-header.component';

import {
  UserService
} from '@users/services/user.service';

import {
  User
} from '@users/models/users.models';

import {
  AuthService
} from '@auth/services/auth.service';

import {
  UserStatus
} from '@users/models/user-status.enum';

import {
  UserDetailFacadeService
} from '@users/services/user-detail-facade.service';

import {
  LoadingService
} from '@core/services/loading.service';

import {
  ErrorHandlerService
} from '@core/services/error-handler.service';

import {
  DialogService
} from '@core/services/dialog.service';

import {
  NotificationService
} from '@core/services/notification.service';

@Component({

  selector: 'app-user-detail',

  templateUrl:
    './user-detail.page.html',

  styleUrls:
    ['./user-detail.page.scss'],

  standalone: true,

  imports: [

    CommonModule,
    FormsModule,

    IonContent,
    IonButton,
    IonIcon,

    PageHeaderComponent,

    PersonalDataFormComponent,
    MembershipFormComponent,
    CredentialsFormComponent,
    UserAuditFormComponent

  ]

})

export class UserDetailPage
  implements OnInit {

  // ============================================
  // USER
  // ============================================

  user: User = {

    tipo: 'invitado',

    estado: UserStatus.ACTIVE

  } as User;

  userId: string | null = null;

  isEditMode = false;

  isProfileCompletion = false;

  isAdminCreate = false;

  // ============================================
  // PERMISSIONS
  // ============================================

  isOwnProfile = false;

  canEditPersonalData = false;

  canEditMembership = false;

  canEditCredentials = false;

  canEditPassword = false;

  canDeactivateUser = false;

  canReactivateUser = false;

  canViewAudit = false;

  // ============================================
  // EDIT STATES
  // ============================================

  editingPersonalData = false;

  editingMembership = false;

  editingCredentials = false;

  // ============================================
  // MEMBERSHIP TYPES
  // ============================================

  tiposDisponibles: string[] = [

    'administrador',
    'directiva',
    'socio',
    'invitado'

  ];

  // ============================================
  // CREDENTIALS
  // ============================================

  originalEmail = '';

  repeatEmail = '';

  pendingEmailVerification = false;

  password = '';

  repeatPassword = '';

  currentPassword = '';

  // ============================================
  // IMAGE
  // ============================================

  imageChangedEvent: any = '';

  croppedImage = '';

  mostrarCropper = false;

  // ============================================
  // CONSTRUCTOR
  // ============================================

  constructor(

    private route:
      ActivatedRoute,

    private userService:
      UserService,

    private authService:
      AuthService,

    private facade:
      UserDetailFacadeService,

    private loading:
      LoadingService,

    private errorHandler:
      ErrorHandlerService,

    private dialog:
      DialogService,

    private notification:
      NotificationService

  ) {

    addIcons({

      saveOutline,
      createOutline,
      checkmarkOutline,
      trashOutline,
      refreshOutline

    });

  }

  // ============================================
  // INIT
  // ============================================

  async ngOnInit(): Promise<void> {

    this.userId =

      this.route.snapshot
        .paramMap
        .get('id');

    this.isAdminCreate =

      this.route.snapshot
        .queryParamMap
        .get('adminCreate')

      ===

      'true';

    this.isEditMode =
      !!this.userId;

    if (

      this.isEditMode &&
      this.userId

    ) {

      await this.loadUser();

    }

    else if (!this.isAdminCreate) {

      const currentUser =

        this.authService
          .currentUserData;

      if (currentUser) {

        this.user = {

          ...currentUser

        };

        this.isProfileCompletion =
          true;

        this.isOwnProfile =
          true;

      }

      this.canEditPersonalData =
        true;

      this.canEditMembership =
        false;

      this.canEditCredentials =
        true;

      this.canEditPassword =
        true;

      this.editingPersonalData =
        true;

      this.editingMembership =
        false;

      this.editingCredentials =
        true;

    }

    else {

      this.user = {

        tipo: 'invitado',

        estado: UserStatus.ACTIVE

      } as User;

      this.isProfileCompletion =
        false;

      this.isOwnProfile =
        false;

      this.canEditPersonalData =
        true;

      this.canEditMembership =
        true;

      this.canEditCredentials =
        true;

      this.canEditPassword =
        true;

      this.editingPersonalData =
        true;

      this.editingMembership =
        true;

      this.editingCredentials =
        true;

    }

  }

  // ============================================
  // LOAD USER
  // ============================================

  async loadUser(): Promise<void> {

    try {

      await this.loading.wrap(

        async () => {

          const data =

            await this.userService
              .getById(
                this.userId!
              );

          if (data) {

            this.user = {

              ...data

            };

            this.originalEmail =
              this.user.email || '';

            this.repeatEmail =
              this.user.email || '';

            this.isProfileCompletion =
              false;

            this.loadPermissions();

          }

        },

        'Cargando usuario...'

      );

    }

    catch (error) {

      await this.errorHandler.handle(
        error
      );

    }

  }

  // ============================================
  // LOAD PERMISSIONS
  // ============================================

  loadPermissions(): void {

    const permissions =

      this.facade.getPermissions(
        this.user
      );

    this.isOwnProfile =
      permissions.isOwnProfile;

    this.canEditPersonalData =
      permissions.canEditPersonalData;

    this.canEditMembership =
      permissions.canEditMembership;

    this.canEditCredentials =
      permissions.canEditCredentials;

    this.canEditPassword =
      permissions.canEditPassword;

    this.canDeactivateUser =

      (

        this.authService.isAdmin()

        ||

        this.authService.isDirectiva()

      )

      &&

      this.user.estado ===
      UserStatus.ACTIVE;

    this.canReactivateUser =

      (

        this.authService.isAdmin()

        ||

        this.authService.isDirectiva()

      )

      &&

      this.user.estado ===
      UserStatus.INACTIVE;

    this.canViewAudit =

      this.authService.isAdmin()

      ||

      this.authService.isDirectiva();

  }

  // ============================================
  // PERSONAL DATA
  // ============================================

  async togglePersonalData(): Promise<void> {

    if (!this.editingPersonalData) {

      this.editingPersonalData = true;

      return;

    }

    const success =

      await this.loading.wrap(

        async () => {

          return await this.facade
            .updatePersonalData({

              user:
                this.user,

              userId:
                this.userId,

              croppedImage:
                this.croppedImage

            });

        },

        'Guardando datos personales...'

      );

    if (success) {

      this.editingPersonalData =
        false;

    }

  }

  // ============================================
  // MEMBERSHIP
  // ============================================

  async toggleMembership(): Promise<void> {

    if (!this.editingMembership) {

      this.editingMembership = true;

      return;

    }

    const success =

      await this.loading.wrap(

        async () => {

          return await this.facade
            .updateMembership({

              user:
                this.user,

              userId:
                this.userId

            });

        },

        'Guardando membresía...'

      );

    if (success) {

      this.editingMembership =
        false;

    }

  }

  // ============================================
  // CREDENTIALS
  // ============================================

  async toggleCredentials(): Promise<void> {

    if (!this.editingCredentials) {

      this.editingCredentials = true;

      return;

    }

    const success =

      await this.loading.wrap(

        async () => {

          return await this.facade
            .updateCredentials({

              user:
                this.user,

              userId:
                this.userId,

              originalEmail:
                this.originalEmail,

              repeatEmail:
                this.repeatEmail,

              password:
                this.password,

              repeatPassword:
                this.repeatPassword,

              currentPassword:
                this.currentPassword,

              isOwnProfile:
                this.isOwnProfile

            });

        },

        'Guardando credenciales...'

      );

    if (success) {

      this.editingCredentials =
        false;

      this.currentPassword = '';

      this.password = '';

      this.repeatPassword = '';

    }

  }

  // ============================================
  // DEACTIVATE USER
  // ============================================

  async deactivateUser(): Promise<void> {

    const motivo =

      await this.dialog.prompt({

        header:
          'Dar de baja usuario',

        message:
          'Introduce el motivo de la baja',

        placeholder:
          'Motivo de la baja',

        confirmText:
          'Dar de baja',

        cancelText:
          'Cancelar'

      });

    if (!motivo) {

      return;

    }

    try {

      await this.loading.wrap(

        async () => {

          await this.userService
            .deactivateUser(

              this.user.uid,

              this.authService.getUid(),

              motivo

            );

          this.user.estado =
            UserStatus.INACTIVE;

          this.loadPermissions();

          await this.loadUser();

        },

        'Desactivando usuario...'

      );

      await this.notification.success(
        'Usuario desactivado correctamente'
      );

    }

    catch (error) {

      await this.errorHandler.handle(
        error
      );

    }

  }

  // ============================================
  // REACTIVATE USER
  // ============================================

  async reactivateUser(): Promise<void> {

    const confirmar =

      await this.dialog.confirm({

        header:
          'Reactivar usuario',

        message:
          `¿Desea reactivar a ${this.user.nombre}?`,

        confirmText:
          'Reactivar',

        cancelText:
          'Cancelar'

      });

    if (!confirmar) {

      return;

    }

    try {

      await this.loading.wrap(

        async () => {

          await this.userService
            .reactivateUser(

              this.user.uid,

              this.authService.getUid()

            );

          this.user.estado =
            UserStatus.ACTIVE;

          this.loadPermissions();

          await this.loadUser();

        },

        'Reactivando usuario...'

      );

      await this.notification.success(
        'Usuario reactivado correctamente'
      );

    }

    catch (error) {

      await this.errorHandler.handle(
        error
      );

    }

  }

  // ============================================
  // GLOBAL SAVE
  // ============================================

  async save(): Promise<void> {

    try {

      await this.loading.wrap(

        async () => {

          await this.facade
            .createUser({

              user:
                this.user,

              repeatEmail:
                this.repeatEmail,

              password:
                this.password,

              repeatPassword:
                this.repeatPassword,

              croppedImage:
                this.croppedImage

            });

        },

        'Creando usuario...'

      );

    }

    catch (error) {

      await this.errorHandler.handle(
        error
      );

    }

  }

  // ============================================
  // SELECT PHOTO
  // ============================================

  async selectPhoto(): Promise<void> {

    this.imageChangedEvent =

      await this.facade
        .selectPhoto();

    this.mostrarCropper = true;

  }

  // ============================================
  // TAKE PHOTO
  // ============================================

  async takePhoto(): Promise<void> {

    const result =

      await this.facade
        .takePhoto();

    if (!result) {

      return;

    }

    this.imageChangedEvent =
      result;

    this.mostrarCropper = true;

  }

  // ============================================
  // IMAGE CROPPED
  // ============================================

  imageCropped(event: any): void {

    const result =

      this.facade
        .processCroppedImage(
          event
        );

    if (!result) {

      return;

    }

    this.croppedImage =
      result;

    this.user.foto =
      result;

  }

  // ============================================
  // APPLY CROPPER
  // ============================================

  applyCropper(): void {

    this.user.foto =
      this.croppedImage;

    this.mostrarCropper = false;

  }

  // ============================================
  // CANCEL CROPPER
  // ============================================

  cancelCropper(): void {

    this.mostrarCropper = false;

  }

}