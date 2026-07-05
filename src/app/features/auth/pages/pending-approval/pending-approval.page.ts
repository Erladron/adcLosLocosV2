import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonContent, IonButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmarkCircleOutline, logOutOutline } from 'ionicons/icons';

// Importaciones unificadas de la librería compartida shared-core
import { AuthService, FcmService } from 'shared-core';
import { environment } from '@env/environment';

/**
 * @class PendingApprovalPage
 * @description Pantalla de bloqueo informativo para usuarios en estado de aprobación pendiente.
 * Inicializa los listeners de notificaciones Push para reaccionar al alta en tiempo real.
 */
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
export class PendingApprovalPage implements OnInit {

  // =========================================================================
  // 📥 INFRAESTRUCTURA INYECTADA (PATRÓN MODERNO INJECT)
  // =========================================================================
  private authService = inject(AuthService);
  private router = inject(Router);
  private fcmService = inject(FcmService);

  // =========================================================================
  // 📋 ESTADOS DE LA PÁGINA
  // =========================================================================
  public nombre = '';

  /**
   * @constructor
   * @description Registra los iconos vectoriales de control de estado.
   */
  constructor() {
    addIcons({
      checkmarkCircleOutline,
      logOutOutline
    });
  }

  /**
   * @method ngOnInit
   * @description Inicializa la vista capturando la identidad del usuario y activando
   * el puente nativo de notificaciones Push con Capacitor.
   */
  public ngOnInit(): void {
    const userData = this.authService.currentUserData;
    this.nombre = userData?.nombre || '';

    // 🚀 ¡MAGIA EN ACCIÓN! Despertamos Capacitor en esta pantalla de bloqueo
    // para que registre el token FCM y escuche el push de aprobación del admin.
    this.fcmService.inicializarFCM(environment);
  }

  /**
   * @method logout
   * @description Destruye la sesión del operador y redirige a la zona de acceso.
   */
  public async logout(): Promise<void> {
    await this.authService.logout();
    await this.router.navigateByUrl('/login');
  }
}