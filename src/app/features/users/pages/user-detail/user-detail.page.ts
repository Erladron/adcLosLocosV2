import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import {
  IonContent,
  IonButton,
  IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { saveOutline, createOutline, checkmarkOutline, trashOutline, refreshOutline } from 'ionicons/icons';

import { PersonalDataFormComponent } from './components/personal-data-form/personal-data-form.component';
import { MembershipFormComponent } from './components/membership-form/membership-form.component';
import { CredentialsFormComponent } from './components/credentials-form/credentials-form.component';
import { UserAuditFormComponent } from './components/user-audit-form/user-audit-form.component';

// Importaciones unificadas de la librería shared-core
import {
  PageHeaderComponent,
  UserService,
  User,
  UserStatus,
  UserRole,
  AuthService,
  UserDetailFacadeService,
  LoadingService,
  ErrorHandlerService,
  DialogService,
  NotificationService,
  AppMessageCode
} from 'shared-core';

/**
 * @class UserDetailPage
 * @description Componente controlador principal para la pantalla de alta, edición y detalle pormenorizado de usuarios.
 * Totalmente desacoplado de la infraestructura NoSQL directa, canalizando su lógica de negocio y permisos
 * a través de la fachada especializada UserDetailFacadeService y la capa unificada del UserService.
 */
@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.page.html',
  styleUrls: ['./user-detail.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
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

  // =========================================================================
  // 📥 INFRAESTRUCTURA INYECTADA (PATRÓN MODERNO INJECT)
  // =========================================================================
  private route = inject(ActivatedRoute);
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private facade = inject(UserDetailFacadeService);
  private loading = inject(LoadingService);
  private errorHandler = inject(ErrorHandlerService);
  private dialog = inject(DialogService);
  private notification = inject(NotificationService);

  // =========================================================================
  // 📋 ESTADOS DE LA INTERFAZ Y MODELOS DE DATOS
  // =========================================================================

  /** @description Instancia de datos del usuario que se está manipulando o visualizando en la pantalla. */
  public user: User = {
    tipo: 'invitado',
    estado: UserStatus.ACTIVE,
    publicarTelefono: false,
    publicarEmail: false,
    profesion: ''
  } as User;

  /** @description Identificador único (UID) del usuario extraído de los parámetros de enrutamiento. */
  public userId: string | null = null;

  /** @description Flag indicador que determina si la vista opera en modo de edición/lectura (true) o creación (false). */
  public isEditMode = false;

  /** @description Flag que indica si la pantalla se renderiza dentro del flujo autónomo de completado de perfil pos-registro web. */
  public isProfileCompletion = false;

  /** @description Determina si la acción procede de un flujo explícito de creación manual por parte de la directiva o administración. */
  public isAdminCreate = false;

  /** @description Flag de seguridad que determina si el perfil en pantalla pertenece al mismo usuario que ha iniciado sesión. */
  public isOwnProfile = false;

  /** @description Permiso para alterar o mutar los bloques de información civil e imágenes del perfil. */
  public canEditPersonalData = false;

  /** @description Permiso restrictivo para modificar asignaciones jerárquicas como roles corporativos y números de socio. */
  public canEditMembership = false;

  /** @description Permiso para gestionar configuraciones perimetrales de emails y accesos a credenciales de la cuenta. */
  public canEditCredentials = false;

  /** @description Permiso específico para autorizar o denegar la mutación directa de contraseñas. */
  public canEditPassword = false;

  /** @description Flag de administración que habilita la capacidad de aplicar una baja lógica destructiva temporal sobre el usuario. */
  public canDeactivateUser = false;

  /** @description Flag de administración que habilita la reactivación de cuentas en estado inactivo. */
  public canReactivateUser = false;

  /** @description Autoriza el renderizado de la consola de marcas de tiempo e historiales de auditoría del servidor. */
  public canViewAudit = false;

  /** @description 🛡️ MODO SEGURIDAD: Define si la pantalla debe ocultar datos de carácter personal y financiero por violación de privilegios. */
  public isVistaPublica = false;

  /** @description Estado reactivo de edición para el bloque del formulario de datos personales e imágenes. */
  public editingPersonalData = false;

  /** @description Estado reactivo de edición para el bloque del formulario de membresía, roles y control de tesorería. */
  public editingMembership = false;

  /** @description Estado reactivo de edición para el bloque de formularios de correos y credenciales primarias. */
  public editingCredentials = false;

  /** @description Listado estricto de roles mapeados disponibles para asignación jerárquica en el sistema. */
  public tiposDisponibles: string[] = ['administrador', 'directiva', 'socio', 'invitado'];

  /** @description Almacén temporal de respaldo del email original del usuario para evaluar solicitudes de cambio. */
  public originalEmail = '';

  /** @description Variable de control espejo para validar el doble check de introducción del correo electrónico. */
  public repeatEmail = '';

  /** @description Estado lógico que determina si el perfil se encuentra bloqueado a la espera de una verificación de red. */
  public pendingEmailVerification = false;

  /** @description Almacén local temporal para capturar la nueva contraseña plana introducida en el formulario. */
  public password = '';

  /** @description Variable espejo para la validación y confirmación física de contraseñas nuevas. */
  public repeatPassword = '';

  /** @description Almacena la contraseña actual del usuario autenticado exigida como re-autenticación en cambios sensibles. */
  public currentPassword = '';

  /** @description Captura el evento nativo del DOM disparado al seleccionar un nuevo fichero de imagen desde el hardware local. */
  public imageChangedEvent: any = '';

  /** @description Almacena el resultado en Base64 o URL local procesado por el componente recortador de imagen. */
  public croppedImage = '';

  /** @description Flag que activa o destruye la visualización en primer plano del panel del lienzo de recorte. */
  public mostrarCropper = false;

  /**
   * @constructor
   * @description Registra de forma aislada la paleta de iconos vectoriales del componente.
   */
  constructor() {
    addIcons({ saveOutline, createOutline, checkmarkOutline, trashOutline, refreshOutline });
  }

  /**
   * @method ngOnInit
   * @description Intercepta parámetros de enrutamiento y queries dinámicas, inicializando los estados de edición.
   */
  public async ngOnInit(): Promise<void> {
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

  /**
   * @method loadUser
   * @description Realiza la descarga asíncrona del documento del usuario aplicando la purga en modo Vista Pública.
   */
  public async loadUser(): Promise<void> {
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

            this.loadPermissions();

            if (this.isVistaPublica) {
              this.user.dni = '';
              this.user.direccion = '';

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

  /**
   * @method loadPermissions
   * @description Computa dinámicamente la matriz de compuertas de privilegios a través de la fachada.
   */
  public loadPermissions(): void {
    const permissions = this.facade.getPermissions(this.user);
    this.isOwnProfile = permissions.isOwnProfile;

    this.isVistaPublica = permissions.isSocio && !this.isOwnProfile;

    if (this.isVistaPublica) {
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
      this.canEditPersonalData = permissions.canEditPersonalData;
      this.canEditMembership = permissions.canEditMembership;
      this.canEditCredentials = permissions.canEditCredentials;
      this.canEditPassword = permissions.canEditPassword;

      this.canDeactivateUser = (permissions.isAdmin || permissions.isDirectiva) && this.user.estado === UserStatus.ACTIVE;
      this.canReactivateUser = (permissions.isAdmin || permissions.isDirectiva) && this.user.estado === UserStatus.INACTIVE;
      this.canViewAudit = permissions.isAdmin || permissions.isDirectiva;
    }
  }

  /**
   * @method onSendPasswordReset
   * @description Despacha el enlace seguro para el reseteo de claves canalizando los errores al interceptor unificado.
   */
  public async onSendPasswordReset(email: string): Promise<void> {
    if (!email) return;
    try {
      await this.loading.wrap(
        async () => { await this.authService.sendCustomResetPasswordEmail(email); },
        'Generando enlace seguro...'
      );
      await this.notification.success(`Enlace enviado con éxito a: ${email}`);
    } catch (error: any) {
      await this.errorHandler.handle(error);
      await this.notification.error('No se pudo enviar el correo de configuración.');
    }
  }

  /**
   * @method togglePersonalData
   * @description Conmuta el estado de edición y persiste los datos civiles e imágenes de perfil.
   */
  public async togglePersonalData(): Promise<void> {
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

  /**
   * @method toggleMembership
   * @description Conmuta el estado de edición y persiste el bloque jerárquico de membresía.
   */
  public async toggleMembership(): Promise<void> {
    if (this.isVistaPublica) return;
    if (!this.editingMembership) {
      this.editingMembership = true;
      return;
    }

    const success = await this.loading.wrap(
      async () => {
        return await this.facade.updateMembership({ user: this.user, userId: this.userId });
      },
      'Guardando membresía...'
    );
    if (success) {
      this.editingMembership = false;
      await this.loadUser();
    }
  }

  /**
   * @method toggleCredentials
   * @description Gestiona las actualizaciones de correos, comprobaciones espejo y contraseñas primarias.
   */
  public async toggleCredentials(): Promise<void> {
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

  /**
   * @method deactivateUser
   * @description Lanza un prompt de captura para motivar y consolidar la baja lógica del socio en el servidor.
   */
  public async deactivateUser(): Promise<void> {
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
          await this.userService.deactivateUser(this.user.id!, this.authService.getUid(), motivo);
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

  /**
   * @method reactivateUser
   * @description Revierte la baja lógica de una cuenta con confirmación explícita.
   */
  public async reactivateUser(): Promise<void> {
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
          await this.userService.reactivateUser(this.user.id!, this.authService.getUid());
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

  /**
   * @method save
   * @description Valida la estructura y comanda la creación física de nuevos registros de miembros en la plataforma.
   */
  public async save(): Promise<void> {
    if (this.isVistaPublica) return;

    if (this.user.tipo === UserRole.PORTERO) {
      if (!this.user.foto && !this.croppedImage) {
        this.notification.warning('La fotografía es obligatoria para identificar al personal de seguridad.');
        return;
      }
      if (!this.user.empresa || !this.user.empresa.trim()) {
        this.notification.warning('Debes especificar la empresa a la que pertenece el portero.');
        return;
      }
    }

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

  /** @description Lanza el selector de ficheros nativo para capturar una imagen de la galería. */
  public async selectPhoto(): Promise<void> {
    if (this.isVistaPublica) return;
    this.imageChangedEvent = await this.facade.selectPhoto();
    this.mostrarCropper = true;
  }

  /** @description Inicializa la cámara nativa a través del plugin Capacitor de hardware. */
  public async takePhoto(): Promise<void> {
    if (this.isVistaPublica) return;
    const result = await this.facade.takePhoto();
    if (!result) return;
    this.imageChangedEvent = result;
    this.mostrarCropper = true;
  }

  /** @description Intercepta los cambios en caliente del lienzo de recorte `ngx-image-cropper`. */
  public imageCropped(event: any): void {
    if (this.isVistaPublica) return;
    const result = this.facade.processCroppedImage(event);
    if (!result) return;
    this.croppedImage = result;
    this.user.foto = result;
  }

  /** @description Consolida la cadena Base64 optimizada como foto de perfil formal. */
  public applyCropper(): void {
    if (this.isVistaPublica) return;
    this.user.foto = this.croppedImage;
    this.mostrarCropper = false;
  }

  /** @description Cierra el lienzo de recorte restaurando el estado previo. */
  public cancelCropper(): void {
    this.mostrarCropper = false;
  }

  /**
     * @method solicitarBajaVoluntaria
     * @description 🛡️ FLUJO DE PRIVACIDAD AVANZADO: Solicita confirmación explícita reforzada al socio.
     * Si confirma escribiendo la clave, procesa la baja e inmediatamente gatilla la desconexión 
     * del chasis expulsando de forma segura al usuario hacia la pantalla de acceso.
     */
  public async solicitarBajaVoluntaria(): Promise<void> {
    if (!this.userId || !this.isOwnProfile) return;

    // 1. Primer filtro: Confirmación de intenciones
    const quiereContinuar = await this.dialog.confirm({
      header: '🛑 ¿Eliminar tu cuenta?',
      message: 'Esta acción dará de baja tu ficha de socio y eliminará de forma permanente e irreversible todos tus datos personales del sistema. ¿Estás completamente seguro?',
      confirmText: 'Sí, continuar',
      cancelText: 'Cancelar'
    });

    if (!quiereContinuar) return;

    // 2. Segundo filtro (Seguridad Industrial): Confirmación por palabra clave para evitar clicks accidentales
    const palabraClave = await this.dialog.prompt({
      header: 'Confirmación requerida',
      message: 'Escribe la palabra "ELIMINAR" (en mayúsculas) para confirmar la destrucción de tus datos de perfil:',
      placeholder: 'ELIMINAR',
      confirmText: 'Confirmar baja',
      cancelText: 'Volver atrás'
    });

    const palabraClaveSaneada = (palabraClave || '').trim();

    if (palabraClave !== 'ELIMINAR') {
      this.notification.warning('Acción cancelada: La palabra de confirmación no coincide.');
      return;
    }

    try {
      await this.loading.wrap(
        async () => {
          // 🚀 Invocamos el método del UserService aislado en shared-core
          await this.userService.solicitarBajaVoluntariaCuenta(this.userId!);

          // Despachamos la desconexión preventiva obligatoria
          // Esto limpia sockets vivos (onSnapshot) y borra el token de Firebase Auth para evitar bucles de red
          await this.authService.logout();
        },
        'Destruyendo datos personales y cerrando sesión...'
      );

      // Mostramos un mensaje claro y redirigimos de forma incondicional al Login
      await this.dialog.alert({
        header: 'Cuenta Eliminada',
        message: 'Tu perfil ha sido dado de baja voluntaria y tus datos personales han sido completamente eliminados conforme a la normativa de privacidad del club.',
        buttonText: 'Entendido'
      });

    } catch (error) {
      await this.errorHandler.handle(error, AppMessageCode.ADC_USER_ERR_0006);
    }
  }
}