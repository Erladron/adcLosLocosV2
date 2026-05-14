import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar, 
  IonButtons, 
  IonBackButton, 
  IonItem, 
  IonInput, 
  IonButton, 
  IonIcon 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { mailOpenOutline } from 'ionicons/icons';

// Importamos lo necesario para Firestore
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-invite',
  templateUrl: './invite.page.html',
  styleUrls: ['./invite.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    IonContent, 
    IonHeader, 
    IonTitle, 
    IonToolbar, 
    IonButtons, 
    IonBackButton, 
    IonItem, 
    IonInput, 
    IonButton,
    IonIcon
  ]
})
export class InvitePage implements OnInit {

  email: string = '';
  cargando: boolean = false;

  constructor(
    private authService: AuthService,
    private firestore: Firestore // Inyectamos Firestore
  ) {
    addIcons({
      mailOpenOutline
    });
  }

  ngOnInit() {}

  async invitar() {
    // 1. Validar que el email no esté vacío
    if (!this.email) {
      alert('Por favor, introduce un correo electrónico');
      return;
    }

    // 2. Normalizar el email (minúsculas y sin espacios)
    const emailNormalizado = this.email.trim().toLowerCase();

    try {
      this.cargando = true;

      // 3. Referencia a la colección 'preRegister'
      const preRegisterRef = collection(this.firestore, 'preRegister');

      // 4. Guardar en Firebase
      await addDoc(preRegisterRef, {
        email: emailNormalizado,
        fecha: new Date(),
        invitadoPor: this.authService.currentUser?.uid || 'admin' // Opcional: saber quién invitó
      });

      alert('Invitación enviada correctamente. El usuario ya puede registrarse.');
      this.email = ''; // Limpiamos el campo

    } catch (error: any) {
      console.error('Error al invitar:', error);
      alert('Error de permisos o de conexión al invitar: ' + error.message);
    } finally {
      this.cargando = false;
    }
  }
}