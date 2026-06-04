import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IonContent, IonButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { saveOutline, createOutline, checkmarkOutline, trashOutline, refreshOutline } from 'ionicons/icons';

import { PersonalDataFormComponent } from './components/personal-data-form/personal-data-form.component';
import { MembershipFormComponent } from './components/membership-form/membership-form.component';
import { CredentialsFormComponent } from './components/credentials-form/credentials-form.component';
import { UserAuditFormComponent } from './components/user-audit-form/user-audit-form.component';
import { PageHeaderComponent } from 'shared-core';

import { UserService } from 'projects/shared-core/src/lib/services/user.service';
import { User, UserStatus } from 'shared-core';
import { AuthService } from 'projects/shared-core/src/lib/services/auth.service';
import { UserDetailFacadeService } from 'projects/shared-core/src/lib/services/user-detail-facade.service';
import { LoadingService } from 'projects/shared-core/src/lib/services/loading.service';
import { ErrorHandlerService } from 'projects/shared-core/src/lib/services/error-handler.service';
import { DialogService } from 'projects/shared-core/src/lib/services/dialog.service';
import { NotificationService } from 'projects/shared-core/src/lib/services/notification.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.page.html',
  styleUrls: ['./user-detail.page.scss'],
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
export class UserDetailPage implements OnInit {

  // ============================================
  // USER (Instanciación por defecto)
  // ============================================
  user: User = {
    tipo: 'invitado',
    estado: UserStatus.ACTIVE,
    publicarTelefono: false,
    publicarEmail: false,
    profesion: ''
  } as User;

  userId: string | null = null;
  isEditMode = false;
  isProfileCompletion = false;
  isAdminCreate = false;

  // ============================================
  // PERMISSIONS (Controladores lógicos de compuertas)
  // ============================================
  isOwnProfile = false;
  canEditPersonalData = false;
  canEditMembership = false;
  canEditCredentials = false;
  canEditPassword = false;
  canDeactivateUser = false;
  canReactivateUser = false;
  canViewAudit = false;

  /** 🛡️ MODO SEGURIDAD: Define si la pantalla debe comportarse como una consulta de información pública de comunidad */
  isVistaPublica = false;

  // ============================================
  // EDIT STATES
  // ============================================
  editingPersonalData = false;
  editingMembership = false;
  editingCredentials = false;

  // ============================================
  // MEMBERSHIP TYPES
  // ============================================
  tiposDisponibles: string[] = ['administrador', 'directiva', 'socio', 'invitado'];

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

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private authService: AuthService,
    private facade: UserDetailFacadeService,
    private loading: LoadingService,
    private errorHandler: ErrorHandlerService,
    private dialog: DialogService,
    private notification: NotificationService
  ) {
    addIcons({ saveOutline, createOutline, checkmarkOutline, trashOutline, refreshOutline });
  }

  // ============================================
  // INIT (Captura de rutas y precarga de sesión local)
  // ============================================
  async ngOnInit(): Promise<void> {
    let idParam = this.route.snapshot.paramMap.get('id');
    if (idParam === 'undefined' || idParam === 'null') {
      idParam = null;
    }

    this.userId = idParam;
    this.isAdminCreate = this.route.snapshot.queryParamMap.get('adminCreate') === 'true';
    const currentUser = this.authService.currentUserData;

    if (!this.userId && !this.isAdminCreate && currentUser) {
      this.userId = currentUser.id || (currentUser as any).uid || null;
    }

    this.isEditMode = !!this.userId;

    if (this.isEditMode && this.userId) {
      if (currentUser && (currentUser.id === this.userId || (currentUser as any).uid === this.userId)) {
        this.user = { publicarTelefono: false, publicarEmail: false, profesion: '', ...currentUser };
        this.originalEmail = this.user.email || '';
        this.repeatEmail = this.user.email || '';
        this.isProfileCompletion = false;
        this.loadPermissions();
      }
      await this.loadUser();

    } else if (!this.isAdminCreate) {
      if (currentUser) {
        this.user = { publicarTelefono: false, publicarEmail: false, profesion: '', ...currentUser };
        this.isProfileCompletion = true;
        this.isOwnProfile = true;
      }
      this.canEditPersonalData = true;
      this.canEditMembership = false;
      this.canEditCredentials = true;
      this.canEditPassword = true;

      this.editingPersonalData = true;
      this.editingMembership = false;
      this.editingCredentials = true;
    } else {
      this.user = { tipo: 'invitado', estado: UserStatus.ACTIVE, publicarTelefono: false, publicarEmail: false, profesion: '' } as User;
      this.isProfileCompletion = false;
      this.isOwnProfile = false;
      this.canEditPersonalData = true;
      this.canEditMembership = true;
      this.canEditCredentials = true;
      this.canEditPassword = true;

      this.editingPersonalData = true;
      this.editingMembership = true;
      this.editingCredentials = true;
    }
  }

  // ============================================
  // CARGA DE USUARIOS DESDE FIRESTORE
  // ============================================
  async loadUser(): Promise<void> {
    try {
      await this.loading.wrap(
        async () => {
          if (!this.userId) return;
          const data = await this.userService.getById(this.userId);
          if (data) {
            this.user = { publicarTelefono: false, publicarEmail: false, profesion: '', ...data };
            this.originalEmail = this.user.email || '';
            this.repeatEmail = this.user.email || '';
            this.isProfileCompletion = false;
            
            // Calculamos los permisos antes de sanitizar las variables locales
            this.loadPermissions();
            
            // 🔒 🧠 ADAPTACIÓN DE BORRADO RADICAL PARA VISTA PÚBLICA
            if (this.isVistaPublica) {
              // Si un socio cotillea a otro, vaciamos el DNI y la dirección postal.
              // Al volverse cadenas vacías (''), el *ngIf del HTML destruirá el campo visualmente de la pantalla.
              this.user.dni = '';
              this.user.direccion = '';
              
              // Aplicamos el cerrojo de intimidad: si el socio guardó sus datos como privados (false),
              // los purgamos del objeto para que el formulario no pinte inputs vacíos ni exponga nada.
              if (!this.user.publicarTelefono) this.user.telefono = '';
              if (!this.user.publicarEmail) this.user.email = '';
            }
          }
        },
        'Cargando usuario...'
      );
    } catch (error) {
      await this.errorHandler.handle(error);
    }
  }

  // ============================================
  // CALCULO DINÁMICO DE COMPUERTAS DE SEGURIDAD
  // ============================================
  loadPermissions(): void {
    const permissions = this.facade.getPermissions(this.user);
    this.isOwnProfile = permissions.isOwnProfile;

    // Evaluamos si el usuario activo en sesión es un socio común (sin permisos de administración ni junta directiva)
    const soySocioComun = this.authService.isSocio() && !this.authService.isAdmin() && !this.authService.isDirectiva();
    
    // Entramos en Modo Vista Pública si eres socio común y estás curioseando una tarjeta ajena
    this.isVistaPublica = soySocioComun && !this.isOwnProfile;

    if (this.isVistaPublica) {
      // Bloqueo estricto de todas las compuertas de mutación en la base de datos
      this.canEditPersonalData = false;
      this.canEditMembership = false;
      this.canEditCredentials = false;
      this.canEditPassword = false;
      this.canDeactivateUser = false;
      this.canReactivateUser = false;
      this.canViewAudit = false;
      
      this.editingPersonalData = false;
      this.editingMembership = false;
      this.editingCredentials = false;
    } else {
      // Flujo de permisos normal para Directivos, Administradores o cuando modificas tu propio perfil
      this.canEditPersonalData = permissions.canEditPersonalData;
      this.canEditMembership = permissions.canEditMembership;
      this.canEditCredentials = permissions.canEditCredentials;
      this.canEditPassword = permissions.canEditPassword;

      this.canDeactivateUser = (this.authService.isAdmin() || this.authService.isDirectiva()) && this.user.estado === UserStatus.ACTIVE;
      this.canReactivateUser = (this.authService.isAdmin() || this.authService.isDirectiva()) && this.user.estado === UserStatus.INACTIVE;
      this.canViewAudit = this.authService.isAdmin() || this.authService.isDirectiva();
    }
  }

  // ============================================
  // SERVICIOS AUXILIARES DE CREDENCIALES
  // ============================================
  async onSendPasswordReset(email: string): Promise<void> {
    if (!email) return;
    try {
      await this.loading.wrap(
        async () => { await this.authService.sendCustomResetPasswordEmail(email); },
        'Generando enlace seguro...'
      );
      await this.notification.success(`Enlace enviado con éxito a: ${email}`);
    } catch (error: any) {
      console.error('Error al invocar la pasarela de reseteo:', error);
      await this.notification.error('No se pudo enviar el correo de configuración.');
    }
  }

  // ============================================
  // PROCESADORES DE ESCRITURA (Bypaseados si isVistaPublica es true)
  // ============================================
  async togglePersonalData(): Promise<void> {
    if (this.isVistaPublica) return;
    if (!this.editingPersonalData) {
      this.editingPersonalData = true;
      return;
    }
    const success = await this.loading.wrap(
      async () => {
        return await this.facade.updatePersonalData({
          user: this.user,
          userId: this.userId,
          croppedImage: this.croppedImage
        });
      },
      'Guardando datos personales...'
    );
    if (success) {
      this.editingPersonalData = false;
    }
  }

  async toggleMembership(): Promise<void> {
    if (this.isVistaPublica) return;
    if (!this.editingMembership) {
      this.editingMembership = true;
      return;
    }
    const success = await this.loading.wrap(
      async () => { return await this.facade.updateMembership({ user: this.user, userId: this.userId }); },
      'Guardando membresía...'
    );
    if (success) {
      this.editingMembership = false;
    }
  }

  async toggleCredentials(): Promise<void> {
    if (this.isVistaPublica) return;
    if (!this.editingCredentials) {
      this.editingCredentials = true;
      return;
    }
    const success = await this.loading.wrap(
      async () => {
        return await this.facade.updateCredentials({
          user: this.user,
          userId: this.userId,
          originalEmail: this.originalEmail,
          repeatEmail: this.repeatEmail,
          password: this.password,
          repeatPassword: this.repeatPassword,
          currentPassword: this.currentPassword,
          isOwnProfile: this.isOwnProfile
        });
      },
      'Guardando credenciales...'
    );
    if (success) {
      this.editingCredentials = false;
      this.currentPassword = '';
      this.password = '';
      this.repeatPassword = '';
    }
  }

  async deactivateUser(): Promise<void> {
    if (this.isVistaPublica) return;
    const motivo = await this.dialog.prompt({
      header: 'Dar de baja usuario',
      message: 'Introduce el motivo de la baja',
      placeholder: 'Motivo de la baja',
      confirmText: 'Dar de baja',
      cancelText: 'Cancelar'
    });
    if (!motivo) return;

    try {
      await this.loading.wrap(
        async () => {
          await this.userService.deactivateUser(this.user.id, this.authService.getUid(), motivo);
          this.user.estado = UserStatus.INACTIVE;
          this.loadPermissions();
          await this.loadUser();
        },
        'Desactivando usuario...'
      );
      await this.notification.success('Usuario desactivado correctamente');
    } catch (error) {
      await this.errorHandler.handle(error);
    }
  }

  async reactivateUser(): Promise<void> {
    if (this.isVistaPublica) return;
    const confirmar = await this.dialog.confirm({
      header: 'Reactivar usuario',
      message: `¿Desea reactivar a ${this.user.nombre}?`,
      confirmText: 'Reactivar',
      cancelText: 'Cancelar'
    });
    if (!confirmar) return;

    try {
      await this.loading.wrap(
        async () => {
          await this.userService.reactivateUser(this.user.id, this.authService.getUid());
          this.user.estado = UserStatus.ACTIVE;
          this.loadPermissions();
          await this.loadUser();
        },
        'Reactivando usuario...'
      );
      await this.notification.success('Usuario reactivado correctamente');
    } catch (error) {
      await this.errorHandler.handle(error);
    }
  }

  async save(): Promise<void> {
    if (this.isVistaPublica) return;
    try {
      await this.loading.wrap(
        async () => {
          await this.facade.createUser({
            user: this.user,
            repeatEmail: this.repeatEmail,
            password: this.password,
            repeatPassword: this.repeatPassword,
            croppedImage: this.croppedImage
          });
        },
        'Creando usuario...'
      );
    } catch (error) {
      await this.errorHandler.handle(error);
    }
  }

  // ============================================
  // GESTORES DE CÁMARA Y RECORTE DE AVATAR
  // ============================================
  async selectPhoto(): Promise<void> {
    if (this.isVistaPublica) return;
    this.imageChangedEvent = await this.facade.selectPhoto();
    this.mostrarCropper = true;
  }

  async takePhoto(): Promise<void> {
    if (this.isVistaPublica) return;
    const result = await this.facade.takePhoto();
    if (!result) return;
    this.imageChangedEvent = result;
    this.mostrarCropper = true;
  }

  imageCropped(event: any): void {
    if (this.isVistaPublica) return;
    const result = this.facade.processCroppedImage(event);
    if (!result) return;
    this.croppedImage = result;
    this.user.foto = result;
  }

  applyCropper(): void {
    if (this.isVistaPublica) return;
    this.user.foto = this.croppedImage;
    this.mostrarCropper = false;
  }

  cancelCropper(): void {
    this.mostrarCropper = false;
  }
}