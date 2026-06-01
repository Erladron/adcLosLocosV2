import {
  Component,
  OnInit
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  Router
} from '@angular/router';

import {
  IonContent,
  IonButton,
  IonIcon
} from '@ionic/angular/standalone';

import {
  addIcons
} from 'ionicons';

import {
  checkmarkCircleOutline,
  logOutOutline
} from 'ionicons/icons';

import {
  AuthService
} from 'projects/shared-core/src/lib/services/auth.service';

// 🚀 ¡AÑADIDA LA IMPORTACIÓN DE TU SERVICIO CENTRALIZADO!
import { FcmService } from 'projects/shared-core/src/lib/services/fcm.service'; // Asegúrate de que la ruta de tu librería pública coincide

@Component({
  selector: 'app-pending-approval',
  templateUrl: './pending-approval.page.html',
  styleUrls: ['./pending-approval.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonButton,
    IonIcon
  ]
})
export class PendingApprovalPage
  implements OnInit {

  // =================================
  // USER
  // =================================

  nombre = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private fcmService: FcmService // 🚀 ¡INYECTAMOS EL SERVICIO DE NOTIFICACIONES!
  ) {
    addIcons({
      checkmarkCircleOutline,
      logOutOutline
    });
  }

  // =================================
  // INIT
  // =================================

  ngOnInit(): void {
    const userData = this.authService.currentUserData;

    this.nombre = userData?.nombre || '';

    // 🚀 ¡MÁGIA EN ACCIÓN! Despertamos Capacitor en esta pantalla de bloqueo
    // para que registre el token FCM y escuche el push de aprobación del admin.
    this.fcmService.inicializarFCM();
  }

  // =================================
  // LOGOUT
  // =================================

  async logout(): Promise<void> {
    await this.authService.logout();
    await this.router.navigateByUrl('/login');
  }

}