import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Auth, confirmPasswordReset } from '@angular/fire/auth';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss']
})
export class ResetPasswordComponent implements OnInit {
  
  // Datos del formulario vinculados a tus inputs
  password = '';
  repeatPassword = '';
  
  // Control de los botones "ojo" de tus inputs
  showPassword = false;
  showRepeatPassword = false;
  
  // Gestión de estados con tus clases de interfaz
  loading = true; 
  oobCode: string | null = null;
  isSubmitting = false;
  errorMessage = '';
  isSuccess = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private auth: Auth
  ) {}

  ngOnInit() {
    // Capturamos el token de seguridad oculto de la URL
    this.oobCode = this.route.snapshot.queryParamMap.get('oobCode');
    
    if (!this.oobCode) {
      this.errorMessage = 'No se ha proporcionado un token de seguridad válido. Solicita un nuevo enlace desde la App.';
    }

    // Apagamos el cargando para dar paso a tu maquetación limpia
    this.loading = false;
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleRepeatPassword() {
    this.showRepeatPassword = !this.showRepeatPassword;
  }

  async resetPassword() {
    this.errorMessage = '';

    if (!this.oobCode) {
      this.errorMessage = 'Código de acción ausente o inválido.';
      return;
    }

    if (!this.password || !this.repeatPassword) {
      this.errorMessage = 'Por favor, rellena todos los campos obligatorios.';
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'La nueva contraseña debe contener un mínimo de 6 caracteres.';
      return;
    }

    if (this.password !== this.repeatPassword) {
      this.errorMessage = 'Las contraseñas introducidas no coinciden.';
      return;
    }

    try {
      this.isSubmitting = true;

      // Actualización directa en la base de datos de autenticación de Firebase
      await confirmPasswordReset(this.auth, this.oobCode, this.password);
      
      this.isSuccess = true;
      this.isSubmitting = false;

    } catch (error: any) {
      this.isSubmitting = false;
      console.error('Error crítico al actualizar contraseña:', error);
      
      // Control de excepciones estándar de Firebase mapeadas a tu contenedor de texto
      if (error.code === 'auth/expired-action-code') {
        this.errorMessage = 'El código de seguridad ha caducado. Vuelve a generar el correo de restablecimiento.';
      } else if (error.code === 'auth/invalid-action-code') {
        this.errorMessage = 'El enlace ya ha sido utilizado o no es válido.';
      } else {
        this.errorMessage = 'No se pudo guardar la clave. Inténtalo de nuevo más tarde.';
      }
    }
  }
}