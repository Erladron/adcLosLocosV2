import { Component, inject } from '@angular/core';
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
  checkmarkCircleOutline,
  ticketOutline,
  scanOutline,
  qrCodeOutline
} from 'ionicons/icons';
import { AuthService } from 'projects/shared-core/src/lib/services/auth.service';
import { FcmService } from 'projects/shared-core/src/lib/services/fcm.service';
import { CommonModule } from '@angular/common';

// Importaciones nativas de Firebase para escuchar la sesión y consultar la invitación
import { Auth, user } from '@angular/fire/auth';
import { Firestore, collection, query, where, getDocs, limit } from '@angular/fire/firestore';

import { UserRole, UserStatus } from 'shared-core';

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

  private firestore = inject(Firestore);
  private auth = inject(Auth); // Inyectamos el motor de autenticación nativo de Firebase

  // Bandera de control para saber si el invitado tiene una invitación física generada en el backend
  tieneInvitacionAsignada = false;

  constructor(
    private router: Router,
    private menuCtrl: MenuController,
    public authService: AuthService,
    private fcmService: FcmService
  ) {
    addIcons({
      homeOutline,
      peopleOutline,
      statsChartOutline,
      calendarOutline,
      logOutOutline,
      personAddOutline,
      checkmarkCircleOutline,
      ticketOutline,
      scanOutline,
      qrCodeOutline
    });

    console.log('ENVIRONMENT:', environment.envName);
    console.log('PROJECT:', environment.firebase.projectId);

    this.checkLogin();
  }

  async checkLogin() {
    try {
      await this.waitForAuthReady();
      console.log('Firebase sincronizado con éxito. Estado de sesión:', this.authService.isLogged());

      // Sincronización reactiva nativa utilizando la función 'user()' de Angular Fire.
      // Cada vez que un usuario haga Login o Logout en el navegador, este flujo se activa solo.
      user(this.auth).subscribe(async (userFirebase) => {
        if (userFirebase) {
          console.log('📡 [APP] Cambio de estado detectado (Usuario Logueado). Sincronizando datos...');
          this.fcmService.inicializarFCM();
          
          // Forzamos la espera de la sincronización de los perfiles y cargamos la invitación
          await this.verificarInvitacionExistente();
        } else {
          console.log('🚪 [APP] Cambio de estado detectado (Sin Sesión). Reseteando banderas del menú.');
          this.tieneInvitacionAsignada = false;
        }
      });

    } catch (error) {
      console.error('Error crítico al sincronizar Firebase:', error);
    }
  }

  // Método encargado de realizar la query de comprobación rápida en Firestore
  async verificarInvitacionExistente() {
    // Nos aseguramos de que los datos del documento de Firestore estén sincronizados en memoria
    if (typeof (this.authService as any).waitForUserData === 'function') {
      await (this.authService as any).waitForUserData();
    }

    const userUid = this.authService.getUid();
    
    // Ahora que ya tenemos el perfil real mapeado, comprobamos si es un INVITADO de verdad
    if (!userUid || this.role !== UserRole.INVITADO) {
      this.tieneInvitacionAsignada = false;
      return;
    }

    try {
      const fairAccessRef = collection(this.firestore, 'fair-access');
      
      // Obtener la fecha de hoy formateada de forma exacta en base local
      const tzoffset = (new Date()).getTimezoneOffset() * 60000;
      const hoy = (new Date(Date.now() - tzoffset)).toISOString().split('T')[0];

      // Buscamos un documento en fair-access que pertenezca al UID del invitado activo Y para el día de hoy
      const q = query(
        fairAccessRef, 
        where('userId', '==', userUid), 
        where('date', '==', hoy),
        limit(1)
      );
      const querySnapshot = await getDocs(q);
      
      // Si el tamaño del snapshot es mayor que cero, es que tiene un pase activo a su nombre hoy
      this.tieneInvitacionAsignada = !querySnapshot.empty;
      console.log('🎫 [APP] Verificación de pase para Invitado finalizada. ¿Tiene invitación hoy?:', this.tieneInvitacionAsignada);
    } catch (error) {
      console.error('⚠️ [APP] No se pudo verificar la asignación del pase de feria en el servidor:', error);
      this.tieneInvitacionAsignada = false;
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

  async navegar(ruta: string) {
    console.log('NAVEGAR:', ruta);
    await this.menuCtrl.close();
    await this.router.navigateByUrl(ruta);
  }

  async logout() {
    console.log('🚪 [APP] Iniciando proceso de cierre de sesión seguro...');
    this.tieneInvitacionAsignada = false;
    await this.menuCtrl.close();
    await this.authService.logout();
    window.location.href = '/login';
  }

  get role(): UserRole | string {
    return this.authService.currentUserData?.tipo || '';
  }

  get status(): UserStatus | string {
    return this.authService.currentUserData?.estado || '';
  }

  esPorteroPuro(): boolean {
    return this.role === UserRole.PORTERO;
  }

  canShowMenu(): boolean {
    if (!this.authService.isLogged()) return false;
    if (!this.authService.currentUserData) return false;

    if (
      this.status === UserStatus.PENDING_DATA ||
      this.status === UserStatus.PENDING_APPROVAL ||
      this.status === UserStatus.INACTIVE
    ) {
      return false;
    }
    return true;
  }

  puedeVerInicio(): boolean {
    return !this.esPorteroPuro();
  }

  puedeInvitar(): boolean {
    return [
      UserRole.SOCIO,
      UserRole.DIRECTIVA,
      UserRole.ADMINISTRADOR
    ].includes(this.role as UserRole);
  }

  puedeVerUsers(): boolean {
    return [
      UserRole.SOCIO,
      UserRole.DIRECTIVA,
      UserRole.ADMINISTRADOR
    ].includes(this.role as UserRole);
  }

  puedeVerEventos(): boolean {
    return [
      UserRole.INVITADO,
      UserRole.SOCIO,
      UserRole.DIRECTIVA,
      UserRole.ADMINISTRADOR,
    ].includes(this.role as UserRole);
  }

  puedeVerCarnet(): boolean {
    if (this.esPorteroPuro()) return false;
    return [
      UserRole.SOCIO,
      UserRole.DIRECTIVA
    ].includes(this.role as UserRole);
  }

  puedeEscanearFeria(): boolean {
    return [
      UserRole.DIRECTIVA,
      UserRole.ADMINISTRADOR,
      UserRole.PORTERO
    ].includes(this.role as UserRole);
  }

  // Helper dinámico para saber si se le debe pintar el botón al perfil invitado
  puedeVerInvitacionInvitado(): boolean {
    return this.role === UserRole.INVITADO && this.tieneInvitacionAsignada;
  }
}