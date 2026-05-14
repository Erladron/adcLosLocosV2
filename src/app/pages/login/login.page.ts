import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonButton,
  IonInput,
  IonItem,
  IonSpinner,
  IonIcon
} from '@ionic/angular/standalone';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { addIcons } from 'ionicons';
import { 
  eyeOutline, 
  eyeOffOutline, 
  lockClosedOutline, 
  mailOutline 
} from 'ionicons/icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonButton,
    IonInput,
    IonItem,
    IonSpinner,
    IonIcon
  ]
})
export class LoginPage {
  // Variables de formulario
  email = '';
  password = '';
  
  // Variables de estado
  cargando = false;
  showPassword = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    // Registramos los iconos necesarios
    addIcons({ 
      eyeOutline, 
      eyeOffOutline, 
      lockClosedOutline, 
      mailOutline 
    });
  }

  async ingresar() {
    if (!this.email || !this.password) {
      alert('Por favor, introduce tu email y contraseña.');
      return;
    }

    try {
      this.cargando = true;
      await this.authService.login(this.email, this.password);
      
      // Si el login es correcto, el AuthService actualizará el estado 
      // y podemos redirigir al home.
      this.router.navigate(['/home']);
    } catch (error: any) {
      console.error('Error en login:', error);
      let mensaje = 'Error al iniciar sesión.';
      
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        mensaje = 'Credenciales incorrectas.';
      } else if (error.code === 'auth/invalid-email') {
        mensaje = 'El formato del email no es válido.';
      }
      
      alert(mensaje);
    } finally {
      this.cargando = false;
    }
  }

  irARegistro() {
    this.router.navigate(['/register']);
  }
}