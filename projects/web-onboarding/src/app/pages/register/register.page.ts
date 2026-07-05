import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { 
  IonContent, 
  IonItem, 
  IonInput, 
  IonButton, 
  IonIcon, 
  IonSpinner,
  IonText
} from '@ionic/angular/standalone';

// Importaciones de tu librería shared-core
import { 
  AuthService, 
  NotificationService, 
  ErrorHandlerService,
  AppMessageCode, 
  UserStatus, 
  UserRole,
  InvitedUser,
  User
} from 'shared-core';

// Servicio del token
import { TokenService } from '../../core/services/token.service';

/**
 * @class RegisterComponent
 * @description Componente standalone especialista encargado de gestionar el formulario y la lógica de autoregistro
 * de nuevos miembros mediante enlaces de invitación cifrados por token. Consolida las auditorías
 * de onboarding y dispara los flujos transaccionales de Firebase Auth.
 */
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    IonContent,
    IonItem,
    IonInput,
    IonButton,
    IonIcon,
    IonSpinner,
    IonText
  ],
  templateUrl: './register.page.html',
  styleUrl: './register.page.scss'
})
export class RegisterComponent implements OnInit {
  /** @description Instancia inyectada del constructor reactivo de formularios. @private */
  private fb = inject(FormBuilder);
  /** @description Instancia inyectada del extractor de parámetros de la ruta activa. @private */
  private route = inject(ActivatedRoute);
  /** @description Instancia inyectada del enrutador global de Angular. @private */
  private router = inject(Router);

  /** @description Instancia inyectada del servicio de autenticación y sesión del core. @private */
  private authService = inject(AuthService);
  /** @description Instancia inyectada del despachador de alertas visuales. @private */
  private notification = inject(NotificationService);
  /** @description Instancia inyectada del validador perimetral de pases NoSQL. @private */
  private tokenService = inject(TokenService);
  /** @description Instancia inyectada del interceptor centralizado de excepciones. @private */
  private errorHandler = inject(ErrorHandlerService);

  // =========================================================================
  // 🔄 VARIABLES DE ESTADO
  // =========================================================================
  
  /** @description Formulario reactivo con las credenciales de siembra. */
  public registerForm!: FormGroup;
  /** @description Token alfanumérico extraído de la URL. */
  public token = '';
  /** @description Datos limpios de la invitación recuperados desde Firestore. */
  public invitationData: InvitedUser | null = null;

  // =========================================================================
  // 🎨 VARIABLES DE INTERFAZ (UI)
  // =========================================================================
  
  /** @description Flag indicador para alternar la visibilidad de la contraseña en texto plano. */
  public showPassword = false;
  /** @description Flag indicador para alternar la visibilidad de la confirmación de la contraseña. */
  public showPasswordConfirm = false;
  /** @description Flag de bloqueo visual que desactiva el botón durante el envío de red. */
  public cargando = false;

  /** @description Ruta estática homologada del asset del escudo corporativo de la peña. */
  public logoUrl = 'assets/img/escudo.png';

  /**
   * @method ngOnInit
   * @description Inicializa la estructura de validación reactiva y dispara el visado del token de acceso.
   * En caso de ausencia o invalidez del pase, redirige ipso-facto a la pantalla de bienvenida.
   */
  public async ngOnInit(): Promise<void> {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';

    this.registerForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator.bind(this) });

    if (!this.token) {
      this.router.navigate(['/welcome']);
      return;
    }

    const validation = await this.tokenService.validateInvitation(this.token);

    if (!validation.isValid) {
      await this.notification.error(validation.error || 'Token inválido');
      this.router.navigate(['/welcome']);
      return;
    }

    this.invitationData = validation.data || null;
  }

  /**
   * @method passwordMatchValidator
   * @description Validador personalizado síncrono que comprueba la simetría exacta entre la clave y su espejo.
   */
  public passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordsMismatch: true };
  }

  /**
   * @method onSubmit
   * @description Orquesta el proceso de persistencia. Consume el token, mapea de forma estricta los campos
   * de auditoría del nuevo usuario según el modelo core y redirige a la pantalla de confirmación.
   */
  public async onSubmit(): Promise<void> {
    if (!this.invitationData || !this.invitationData.email) {
      await this.notification.error('No se han podido cargar los datos de la invitación.');
      this.router.navigate(['/welcome']);
      return;
    }

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    try {
      this.cargando = true;

      // 🔥 REFACTORIZADO: Mapeo de auditoría unificado y alineado con la interfaz estructural User
      const userDataToRegister: Partial<User> & { password?: string } = {
        nombre: this.registerForm.value.nombre.trim(),
        email: this.invitationData.email,
        password: this.registerForm.value.password,
        estado: UserStatus.PENDING_DATA,
        tipo: UserRole.INVITADO,
        
        // Rastro formal de auditoría de invitación unificado
        invitadoPorNombre: this.invitationData.invitadoPor || 'Administrador',
        invitadoPorUid: this.invitationData.invitadoPorUid || '',
        creadoPorNombre: 'Autoregistro desde Web'
      };

      // Disparamos la creación atómica del perfil e inserción en Firebase Auth
      const registeredUser = await this.authService.register(userDataToRegister);
      
      await new Promise(resolve => setTimeout(resolve, 800));

      if (registeredUser?.id) {
        await this.authService.reloadUserData(registeredUser.id);
      }

      // Solicitamos la hidratación del estado reactivo global sin bloquear el hilo visual
      this.authService.waitForUserData();

      this.cargando = false;
      this.notification.success(AppMessageCode.ADC_AUTH_INF_0001);

      this.router.navigate(['/success'], {
        queryParams: { token: this.token }
      });

    } catch (error) {
      this.cargando = false;
      await this.errorHandler.handle(error);

      if (error instanceof Error && error.message) {
        await this.notification.error(error.message);
      } else {
        await this.notification.error(AppMessageCode.ADC_AUTH_ERR_0006);
      }
    }
  }
}