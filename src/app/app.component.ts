import { Component } from '@angular/core';
import {
  IonApp,
  IonRouterOutlet,
  IonMenu,
  IonContent,
  IonList,
  IonItem,
  IonIcon,
  IonLabel,
  MenuController
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { environment } from '../environments/environment';
import {
  homeOutline,
  peopleOutline,
  statsChartOutline,
  calendarOutline,
  logOutOutline,
  personAddOutline,
  checkmarkCircleOutline
} from 'ionicons/icons';
import { AuthService } from 'projects/shared-core/src/lib/services/auth.service';
import { CommonModule } from '@angular/common';

// 🚀 ¡AÑADIDA LA IMPORTACIÓN DE TU SERVICIO CENTRALIZADO!
import { FcmService } from 'projects/shared-core/src/lib/services/fcm.service'; 

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [
    IonApp,
    IonRouterOutlet,
    CommonModule,
    IonMenu,
    IonContent,
    IonList,
    IonItem,
    IonIcon,
    IonLabel
  ]
})
export class AppComponent {

  constructor(
    private router: Router,
    private menuCtrl: MenuController,
    public authService: AuthService,
    private fcmService: FcmService // 🚀 ¡INYECTAMOS EL SERVICIO AQUÍ TAMBIÉN!
  ) {
    addIcons({
      homeOutline,
      peopleOutline,
      statsChartOutline,
      calendarOutline,
      logOutOutline,
      personAddOutline,
      checkmarkCircleOutline
    });

    console.log('ENVIRONMENT:', environment.envName);
    console.log('PROJECT:', environment.firebase.projectId);

    this.checkLogin();
  }

  // =================================
  // COMPROBAR SESION
  // =================================
  async checkLogin() {
    try {
      await this.waitForAuthReady();
      console.log('Firebase sincronizado con éxito. Estado de sesión:', this.authService.isLogged());
      
      // 🚀 SI EL USUARIO YA ESTÁ LOGEADO, INICIALIZAMOS EL FLUJO CENTRALIZADO DE NOTIFICACIONES
      if (this.authService.isLogged()) {
        console.log('📡 [APP] Usuario autenticado detectado en el arranque. Activando FcmService...');
        this.fcmService.inicializarFCM();
      }

    } catch (error) {
      console.error('Error crítico al sincronizar Firebase:', error);
    }
  }

  private waitForAuthReady(): Promise<void> {
    if (this.authService.authReady) {
      return Promise.resolve();
    }
    return new Promise((resolve) => {
      const check = setInterval(() => {
        if (this.authService.authReady) {
          clearInterval(check);
          resolve();
        }
      }, 50);
    });
  }

  // =================================
  // NAVEGAR
  // =================================
  async navegar(ruta: string) {
    console.log('NAVEGAR:', ruta);
    await this.menuCtrl.close();
    await this.router.navigateByUrl(ruta);
  }

  // =================================
  // LOGOUT
  // =================================
  async logout() {
    await this.menuCtrl.close();
    await this.authService.logout();
    this.router.navigateByUrl('/login');
  }

  get role(): string {
    return this.authService.currentUserData?.tipo || '';
  }

  get status(): string {
    return this.authService.currentUserData?.estado || '';
  }

  canShowMenu(): boolean {
    if (!this.authService.isLogged()) return false;
    if (!this.authService.currentUserData) return false;

    const status = this.authService.currentUserData?.estado;
    if (status === 'pending_data' || status === 'pending_approval' || status === 'inactive') {
      return false;
    }
    return true;
  }

  puedeInvitar(): boolean {
    return ['socio', 'directiva', 'administrador'].includes(this.role);
  }

  puedeVerUsers(): boolean {
    return ['socio', 'directiva', 'administrador'].includes(this.role);
  }
}