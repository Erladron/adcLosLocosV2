import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // 🚀 Manteniendo el import reactivo
import { 
  IonItem, 
  IonLabel, 
  IonInput, 
  IonButton, 
  IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  eyeOutline, eyeOffOutline, createOutline, saveOutline, 
  closeOutline, lockClosedOutline, sendOutline, mailOutline
} from 'ionicons/icons';

// Importaciones unificadas del dominio compartido de shared-core
import { User } from 'shared-core';

/**
 * @class CredentialsFormComponent
 * @description Sub-formulario enfocado en la validación de contraseñas, emails de acceso y reseteos.
 */
@Component({
  selector: 'app-credentials-form',
  templateUrl: './credentials-form.component.html', // 🚀 REPARADO: Su HTML correcto, no el de personal-data
  styleUrls: ['./credentials-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    ReactiveFormsModule, 
    IonItem, 
    IonLabel, 
    IonInput, 
    IonButton, 
    IonIcon
  ]
})
export class CredentialsFormComponent {

  // =========================================================================
  // 📥 VARIABLES DE ENTRADA (INPUTS)
  // =========================================================================
  @Input() public user: Partial<User> | null = null;
  @Input() public isEditMode = false;
  @Input() public isOwnProfile = false;
  @Input() public canEditCredentials = false;
  @Input() public canEditPassword = false;
  @Input() public editing = false;
  @Input() public repeatEmail = '';
  @Input() public password = '';
  @Input() public repeatPassword = '';
  @Input() public currentPassword = '';
  @Input() public pendingEmailVerification = false;

  // =========================================================================
  // 📤 CANALES DE SALIDA (OUTPUTS)
  // =========================================================================
  @Output() public repeatEmailChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() public passwordChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() public repeatPasswordChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() public toggleEdit: EventEmitter<void> = new EventEmitter<void>();
  @Output() public cancelEdit: EventEmitter<void> = new EventEmitter<void>();
  @Output() public currentPasswordChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() public sendResetLink: EventEmitter<string> = new EventEmitter<string>();

  // =========================================================================
  // 📦 ESTADOS INTERNOS VISUALES
  // =========================================================================
  public mostrarPassword = false;
  public mostrarRepeatPassword = false;

  /**
   * @constructor
   * @description Registra la colección de iconos vectoriales consumidos de forma local.
   */
  constructor() {
    addIcons({
      eyeOutline, eyeOffOutline, createOutline, saveOutline, 
      closeOutline, lockClosedOutline, sendOutline, mailOutline
    });
  }

  public onTogglePassword(): void { this.mostrarPassword = !this.mostrarPassword; }
  public onToggleRepeatPassword(): void { this.mostrarRepeatPassword = !this.mostrarRepeatPassword; }

  /** @description Valida la equivalencia exacta de las cadenas de correos introducidas. @returns {boolean} */
  public emailsMatch(): boolean {
    if (!this.user?.email || !this.repeatEmail) return false;
    return (this.user.email.trim().toLowerCase() === this.repeatEmail.trim().toLowerCase());
  }

  /** @description Valida la equivalencia del doble check de contraseñas nuevas. @returns {boolean} */
  public passwordsMatch(): boolean {
    if (!this.password || !this.repeatPassword) return false;
    return (this.password.trim() === this.repeatPassword.trim());
  }

  /** @description Evalúa la robustez de la clave mediante análisis por expresiones regulares. @returns {string} */
  public getPasswordStrength(): string {
    const password = this.password || '';
    if (password.length < 6) return 'Débil';
    if (password.match(/[A-Z]/) && password.match(/[0-9]/) && password.length >= 8) return 'Fuerte';
    return 'Media';
  }

  /** @description Despacha hacia el padre la petición de envío del enlace de configuración de clave. */
  public onSendLink(): void {
    if (this.user && this.user.email) {
      this.sendResetLink.emit(this.user.email);
    }
  }
}