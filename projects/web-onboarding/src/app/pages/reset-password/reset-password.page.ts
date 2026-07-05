import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Auth, confirmPasswordReset } from '@angular/fire/auth';
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
  ErrorHandlerService, 
  validatePassword, 
  passwordsMatch, 
  AppMessageCode 
} from 'shared-core';

/**
 * @class ResetPasswordComponent
 * @description Componente standalone encargado de interceptar el código de acción OOB (Out-Of-Band) de Firebase,
 * maquetar el formulario de actualización de credenciales de seguridad y consolidar el restablecimiento físico de contraseñas.
 */
@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    IonContent,
    IonItem,
    IonInput,
    IonButton,
    IonIcon,
    IonSpinner,
    IonText
  ],
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss']
})
export class ResetPasswordComponent implements OnInit {

  /** @description Instancia inyectada de la ruta activa para la captura del token cifrado de la URL. @private */
  private route = inject(ActivatedRoute);
  /** @description Instancia inyectada del enrutador de Angular para redirecciones complejas. @private */
  private router = inject(Router);
  /** @description Instancia inyectada del motor core de Firebase Authentication. @private */
  private auth = inject(Auth);
  /** @description Instancia inyectada del interceptor y auditor unificado de errores del core. @private */
  private errorHandler = inject(ErrorHandlerService);
  
  // =========================================================================
  // 📋 BINDINGS DEL FORMULARIO
  // =========================================================================
  
  /** @description String de la contraseña de acceso principal vinculada al input. */
  public password = '';
  /** @description String de confirmación de la contraseña vinculada al input espejo. */
  public repeatPassword = '';
  
  // =========================================================================
  // 🎨 CONTROLES VISUALES DE INTERFAZ (UI)
  // =========================================================================
  
  /** @description Flag de visibilidad ("botón ojo") de la contraseña principal. */
  public showPassword = false;
  /** @description Flag de visibilidad ("botón ojo") de la contraseña de confirmación. */
  public showRepeatPassword = false;
  
  // =========================================================================
  // ⚙️ GESTIÓN DE ESTADOS DE LOGÍSTICA
  // =========================================================================
  
  /** @description Bloqueo de renderizado inicial mientras se extrae el token de la URL. */
  public loading = true; 
  /** @description Token cifrado de un solo uso emitido y empaquetado por Firebase (oobCode). */
  public oobCode: string | null = null;
  /** @description Flag indicador de progreso que desactiva los formularios durante la llamada asíncrona. */
  public isSubmitting = false;
  /** @description Mensaje descriptivo legible de la alerta de exclusión o error contextual. */
  public errorMessage = '';
  /** @description Flag que activa la vista del contenedor de éxito una vez restablecida la contraseña. */
  public isSuccess = false;

  /**
   * @constructor
   * @description Inicializa de forma síncrona el componente de restablecimiento.
   */
  constructor() {}

  /**
   * @method ngOnInit
   * @description Recupera de forma atómica el token criptográfico de seguridad de la URL (oobCode).
   * Levanta un error preventivo en pantalla si el pase de seguridad no viene provisto.
   */
  public ngOnInit(): void {
    this.oobCode = this.route.snapshot.queryParamMap.get('oobCode');
    
    if (!this.oobCode) {
      this.errorMessage = 'No se ha proporcionado un token de seguridad válido. Solicita un nuevo enlace desde la App.';
    }

    this.loading = false;
  }

  /** @description Invierte el booleano para alternar el tipo de entrada del input de clave (text/password). */
  public togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  /** @description Invierte el booleano para alternar el tipo de entrada del input de confirmación (text/password). */
  public toggleRepeatPassword(): void {
    this.showRepeatPassword = !this.showRepeatPassword;
  }

  /**
   * @method resetPassword
   * @description Orquesta y valida la robustez de las cadenas a través de las utilidades puras del core.
   * Si pasa el cribado formal, efectúa el envío a red hacia los servidores distribuidos de Firebase Auth.
   * @returns {Promise<void>}
   */
  public async resetPassword(): Promise<void> {
    this.errorMessage = '';

    if (!this.oobCode) {
      this.errorMessage = 'Código de acción ausente o inválido.';
      return;
    }

    if (!this.password || !this.repeatPassword) {
      this.errorMessage = 'Por favor, rellena todos los campos obligatorios.';
      return;
    }

    // 🚀 REFACTORIZADO: Consumo directo de la utilidad core especializada en contraseñas
    if (!validatePassword(this.password)) {
      this.errorMessage = 'La nueva contraseña debe contener un mínimo de 6 caracteres.';
      return;
    }

    // 🚀 REFACTORIZADO: Consumo de la utilidad core especializada en simetría simétrica
    if (!passwordsMatch(this.password, this.repeatPassword)) {
      this.errorMessage = 'Las contraseñas introducidas no coinciden.';
      return;
    }

    try {
      this.isSubmitting = true;

      // Transmisión directa hacia el proveedor Cloud de Firebase Authentication
      await confirmPasswordReset(this.auth, this.oobCode, this.password);
      
      this.isSuccess = true;
      this.isSubmitting = false;

    } catch (error: any) {
      this.isSubmitting = false;
      await this.errorHandler.handle(error);
      
      // Control de excepciones semánticas de la pasarela Auth mapeadas a contenedores legibles
      if (error?.code === 'auth/expired-action-code') {
        this.errorMessage = 'El código de seguridad ha caducado. Vuelve a generar el correo de restablecimiento.';
      } else if (error?.code === 'auth/invalid-action-code') {
        this.errorMessage = 'El enlace ya ha sido utilizado o no es válido.';
      } else {
        this.errorMessage = 'No se pudo guardar la clave. Inténtalo de nuevo más tarde.';
      }
    }
  }
}