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
  qrCodeOutline,
  cloudOfflineOutline
} from 'ionicons/icons';
import { AuthService } from 'projects/shared-core/src/lib/services/auth.service';
import { FcmService } from 'projects/shared-core/src/lib/services/fcm.service';
import { EventsService } from 'projects/shared-core/src/lib/services/events.service'; // 🚀 Inyección del servicio de eventos
import { CommonModule } from '@angular/common';

// Importaciones nativas de Firebase para escuchar la sesión y consultar la invitación
import { Auth, user } from '@angular/fire/auth';
import { Firestore, collection, query, where, getDocs, limit } from '@angular/fire/firestore';

import { UserRole, UserStatus } from 'shared-core';
import { Subscription } from 'rxjs';

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
  private auth = inject(Auth); 
  private eventsService = inject(EventsService); // 🚀 Inyectamos el motor core de eventos

  // Banderas de control dinámicas para el menú
  tieneInvitacionAsignada = false;
  hayFeriaActiva = false; // 🚀 Nueva propiedad analítica

  // Gestión de suscripciones para evitar fugas de memoria (Memory Leaks)
  private eventsSubscription?: Subscription;

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
      qrCodeOutline,
      cloudOfflineOutline
    });

    console.log('ENVIRONMENT:', environment.envName);
    console.log('PROJECT:', environment.firebase.projectId);

    this.checkLogin();
  }

  async checkLogin() {
    try {
      await this.waitForAuthReady();
      console.log('Firebase sincronizado con éxito. Estado de sesión:', this.authService.isLogged());

      user(this.auth).subscribe(async (userFirebase) => {
        if (userFirebase) {
          console.log('📡 [APP] Cambio de estado detectado (Usuario Logueado). Sincronizando datos...');
          this.fcmService.inicializarFCM();
          
          // Escuchamos los eventos en tiempo real para activar o desactivar el carnet de feria
          this.escucharEventosDeFeria();
          
          // Forzamos la espera de la sincronización de los perfiles y cargamos la invitación
          await this.verificarInvitacionExistente();
        } else {
          console.log('🚪 [APP] Cambio de estado detectado (Sin Sesión). Reseteando banderas del menú.');
          this.tieneInvitacionAsignada = false;
          this.hayFeriaActiva = false;
          
          // Limpieza de suscripciones activas al cerrar sesión
          if (this.eventsSubscription) {
            this.eventsSubscription.unsubscribe();
          }
        }
      });

    } catch (error) {
      console.error('Error crítico al sincronizar Firebase:', error);
    }
  }

  /**
   * 📣 ESCUCHAR EVENTOS DE FERIA EN TIEMPO REAL
   * Evalúa la colección global de convocatorias. Si existe algún evento de tipo "feria",
   * habilita automáticamente el menú del carnet en la interfaz de los socios.
   */
  private escucharEventosDeFeria() {
    if (this.eventsSubscription) {
      this.eventsSubscription.unsubscribe();
    }

    this.eventsSubscription = this.eventsService.getEvents().subscribe({
      next: (eventos) => {
        // Buscamos si hay algún evento activo cuyo tipo sea estrictamente 'feria'
        this.hayFeriaActiva = eventos.some(evento => evento.type === 'feria');
        console.log('🎡 [APP] Verificación de calendario: ¿Hay algún evento de feria activo?:', this.hayFeriaActiva);
      },
      error: (err) => {
        console.error('⚠️ [APP] Error recuperando eventos para el control del menú:', err);
        this.hayFeriaActiva = false;
      }
    });
  }

  async verificarInvitacionExistente() {
    if (typeof (this.authService as any).waitForUserData === 'function') {
      await (this.authService as any).waitForUserData();
    }

    const userUid = this.authService.getUid();
    
    if (!userUid || this.role !== UserRole.INVITADO) {
      this.tieneInvitacionAsignada = false;
      return;
    }

    try {
      const fairAccessRef = collection(this.firestore, 'fair-access');
      const tzoffset = (new Date()).getTimezoneOffset() * 60000;
      const hoy = (new Date(Date.now() - tzoffset)).toISOString().split('T')[0];

      const q = query(
        fairAccessRef, 
        where('userId', '==', userUid), 
        where('date', '==', hoy),
        limit(1)
      );
      const querySnapshot = await getDocs(q);
      
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
    this.hayFeriaActiva = false;
    if (this.eventsSubscription) {
      this.eventsSubscription.unsubscribe();
    }
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

  /**
   * 🎫 CONTROL INTELIGENTE DE PASES DE FERIA
   * El acceso se habilitará única y exclusivamente si el usuario es Socio o Directiva
   * Si es invitado y tiene generado el pase del dia
   * Y ADEMÁS la directiva ha publicado un evento de tipo 'feria' en la base de datos.
   */
  puedeVerPasesFeria(): boolean {
    if (this.esPorteroPuro() || !this.hayFeriaActiva) return false;
    
    return [
      UserRole.SOCIO,
      UserRole.DIRECTIVA
    ].includes(this.role as UserRole);
  }

  /**
   * 🔍 CONTROL DE ACCESOS DE PORTERÍA
   * El escáner de portería se habilitará para Directiva, Admin o Porteros
   * ÚNICA Y EXCLUSIVAMENTE si hay un evento de feria activo en el calendario.
   */
  puedeEscanearFeria(): boolean {
    if (!this.hayFeriaActiva) return false;

    return [
      UserRole.DIRECTIVA,
      UserRole.ADMINISTRADOR,
      UserRole.PORTERO
    ].includes(this.role as UserRole);
  }

  puedeVerInvitacionInvitado(): boolean {
    return this.role === UserRole.INVITADO && this.tieneInvitacionAsignada;
  }
}