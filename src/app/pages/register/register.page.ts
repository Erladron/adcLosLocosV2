import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonButton, IonInput, IonItem, IonHeader, 
  IonToolbar, IonTitle, IonButtons, IonBackButton, IonIcon
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { addIcons } from 'ionicons';
import { eyeOutline, eyeOffOutline } from 'ionicons/icons';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, IonContent, IonButton, IonInput, 
    IonItem, IonHeader, IonToolbar, IonTitle, IonButtons, 
    IonBackButton, IonIcon
  ]
})
export class RegisterPage {

  user = { nombre: '', email: '', password: '' };
  passwordConfirm = '';
  showPassword = false;
  showPasswordConfirm = false;
  cargando = false;

  constructor(private authService: AuthService, private router: Router) {
    addIcons({ eyeOutline, eyeOffOutline });
  }

  async registrarse() {
    if (!this.user.nombre || !this.user.email || !this.user.password) {
      alert('Complete todos los campos');
      return;
    }

    if (this.user.password !== this.passwordConfirm) {
      alert('Las contraseñas no coinciden');
      return;
    }

    if (this.user.password.length < 6) {
      alert('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    try {
      this.cargando = true;
      await this.authService.register(this.user);
      alert('Cuenta creada correctamente');
      this.router.navigate(['/login']);
    } catch (error: any) {
      alert(error?.message || 'Error registrando usuario');
    } finally {
      this.cargando = false;
    }
  }
}