import { Component, inject, ChangeDetectorRef, OnInit, OnDestroy, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Auth, user } from '@angular/fire/auth';
import {
  IonApp,
  IonRouterOutlet,
  IonMenu,
  IonContent,
  IonList,
  IonItem,
  IonIcon,
  IonLabel,
  MenuController,
  NavController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
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
  cloudOfflineOutline,
  cashOutline,
  chevronDownOutline,
  chevronDown,
  chevronForward
} from 'ionicons/icons';

import { Firestore, collection, query, where, onSnapshot, Unsubscribe } from '@angular/fire/firestore';

import {
  UserRole,
  UserStatus,
  AuthService,
  FcmService,
  EventsService,
  ErrorHandlerService,
  AppEvent,
  FairAccessStatus
} from 'shared-core';
import { environment } from '@env/environment';

/**
 * @class AppComponent
 * @description Componente raíz de la aplicación de la Peña A.D.C. Los Locos.
 * Se encarga de la orquestación del menú lateral dinámico, la gestión de sesiones en tiempo real
 * y el cálculo reactivo del estado de los pases digitales según las convocatorias de la caseta.
 */
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonApp,
    IonRouterOutlet,
    IonMenu,
    IonContent,
    IonList,
    IonItem,
    IonIcon,
    IonLabel
  ]
})
export class AppComponent implements OnInit, OnDestroy {

  // =========================================================================
  // 💉 INYECCIÓN DE SERVICIOS (PATRÓN MODERNO INJECT)
  // =========================================================================
  private authService = inject(AuthService);
  private fcmService = inject(FcmService);
  private eventsService = inject(EventsService);
  private errorHandler = inject(ErrorHandlerService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private menuCtrl = inject(MenuController);
  private auth = inject(Auth);
  private firestore = inject(Firestore); 
  private zone = inject(NgZone);
  private navCtrl = inject(NavController);

  /** @description Instancia de acceso directo al SDK de Cloud Firestore. */
  private dbNativa: any;

  // =========================================================================
  // 🔄 SUSCRIPCIONES Y DESUSCRIPCIONES (Gestión de Memoria)
  // =========================================================================
  /** @description Almacena la suscripción activa al estado de autenticación de Firebase. */
  private authSubscription!: Subscription;
  /** @description Almacena la suscripción activa al catálogo de eventos de la peña. */
  private eventsSubscription!: Subscription;
  /** @description Función de limpieza para cerrar el canal onSnapshot nativo de pases. */
  private pasesUnsubscribeFn: Unsubscribe | null = null;

  // =========================================================================
  // 🎛️ BANDERAS DE CONTROL ESTANCIAL DE MENÚ (UX Dinámica)
  // =========================================================================
  /** @description Interruptor visual para desplegar la sección de administración de usuarios. */
  public menuGestionAbierto = false;
  /** @description Bandera que determina si se pinta el acceso a "Mis Pases Digitales". */
  public tienePasesActivos = false;
  /** @description Determina si existen eventos activos que requieran control de aforo por portería. */
  public hayEventosConControlActivos = false;

  // =========================================================================
  // 📦 ALMACENAMIENTO DE DATOS EN MEMORIA LOCAL
  // =========================================================================
  /** @description Array local con los pases calculados y listos para su uso por la interfaz. */
  public pasesUsuario: any[] = [];
  /** @description Caché local in-memory que clona los eventos para cruzar estados de vigencia. */
  private cacheEvents: AppEvent[] = [];

  /**
   * @constructor
   * @description Inicializa la carga de iconos nativos y vincula la instancia de base de datos.
   */
  constructor() {
    this.inicializarIconos();
    this.vincularInstanciaFirestoreNativa();
  }

  /**
   * @method ngOnInit
   * @description Ciclo de vida inicial. Arranca el motor de escucha reactiva de credenciales.
   */
  public ngOnInit(): void {
    this.escucharEstadoAutenticacion();
  }

  /**
   * @method ngOnDestroy
   * @description Ciclo de vida de destrucción. Purga y mata los hilos abiertos para evitar fugas de memoria.
   */
  public ngOnDestroy(): void {
    if (this.authSubscription) this.authSubscription.unsubscribe();
    if (this.eventsSubscription) this.eventsSubscription.unsubscribe();
    if (this.pasesUnsubscribeFn) {
      this.pasesUnsubscribeFn();
      this.pasesUnsubscribeFn = null;
    }
  }

  /**
   * @method inicializarIconos
   * @private
   * @description Registra el catálogo de iconos de Ionic usados en las opciones de la barra lateral.
   */
  private inicializarIconos(): void {
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
      cloudOfflineOutline,
      cashOutline,
      chevronDownOutline,
      chevronDown,
      chevronForward
    });
  }

  /**
   * @method vincularInstanciaFirestoreNativa
   * @private
   * @description Asigna la referencia del SDK de Firestore inyectado directamente por AngularFire.
   */
  private vincularInstanciaFirestoreNativa(): void {
    this.dbNativa = this.firestore;
  }

  /**
   * @method escucharEstadoAutenticacion
   * @private
   * @description Escucha activa sobre el estado del Auth. Si detecta sesión, orquesta el arranque de datos feriales.
   */
  private escucharEstadoAutenticacion(): void {
    this.authSubscription = user(this.auth).subscribe(async (userFirebase) => {
      if (userFirebase) {
        console.log('📡 [APP] Sincronizando datos de usuario logueado en la Peña...');
        this.fcmService.inicializarFCM(environment);

        this.escucharEventosActivos();
        await this.escucharPasesExistentesTiempoReal();
      } else {
        console.log('🔌 [APP] Sesión destruida o inexistente.');
        this.limpiarEstadoComponente();
      }
    });
  }

  /**
   * @method escucharEventosActivos
   * @private
   * @description Se conecta a la agenda de convocatorias e hidrata la caché local para los cálculos de vigencia.
   */
  private escucharEventosActivos(): void {
    if (this.eventsSubscription) {
      this.eventsSubscription.unsubscribe();
    }

    this.eventsSubscription = this.eventsService.getEvents().subscribe({
      next: (eventos: AppEvent[]) => {
        this.cacheEvents = eventos || [];
        const datosPlanos = JSON.parse(JSON.stringify(eventos || []));
        this.hayEventosConControlActivos = datosPlanos.some((evento: any) => evento.requiresAccessControl === true);

        console.log(`📅 [Caché Eventos] Actualizada con ${this.cacheEvents.length} convocatorias.`);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.warn('📡 Error sincronizando contextos de eventos:', err.message || err);
        this.hayEventosConControlActivos = false;
        this.cdr.detectChanges();
      }
    });
  }

  /**
   * @method escucharPasesExistentesTiempoReal
   * @public
   * @async
   * @returns {Promise<void>} Cobertura asíncrona de inicialización.
   * @description Abre la pasarela en tiempo real sobre la colección `/fair-access`. Calcula en caliente si
   * el pase está pendiente, activo o expirado cruzando cronologías con los eventos publicados de la Peña.
   */
  public async escucharPasesExistentesTiempoReal(): Promise<void> {
    await this.authService.waitForAuthReady();

    if (!this.authService.isLogged()) {
      this.tienePasesActivos = false;
      this.cdr.detectChanges();
      return;
    }

    if (typeof (this.authService as any).waitForUserData === 'function') {
      await (this.authService as any).waitForUserData();
    }

    const userUid = this.authService.getUid();

    if (!userUid || this.esPorteroPuro()) {
      this.tienePasesActivos = false;
      this.cdr.detectChanges();
      return;
    }

    if (this.pasesUnsubscribeFn) {
      this.pasesUnsubscribeFn();
    }

    try {
      console.log(`📌 [DEBUG PASES] Identidad válida. Registrando onSnapshot de fair-access para UID: ${userUid}`);

      const fairAccessRef = collection(this.dbNativa, 'fair-access');
      const q = query(fairAccessRef, where('userId', '==', userUid));

      this.pasesUnsubscribeFn = onSnapshot(q,
        (snapshot) => {
          console.log(`📡 [DEBUG PASES] Snapshot capturado de Firestore. Total docs: ${snapshot.size}`);

          if (snapshot.empty) {
            console.warn('⚠️ [DEBUG PASES] Base de datos vacía o sin pases para este UID.');
            this.pasesUsuario = [];
            this.tienePasesActivos = false;
            this.cdr.detectChanges();
            return;
          }

          const pases: any[] = [];
          const ahora = new Date();

          snapshot.forEach((doc) => {
            pases.push({ id: doc.id, ...doc.data() });
          });

          const pasesProcesados = pases.map(pass => {
            const ev = this.cacheEvents?.find(e => e.id === pass.eventId);
            let estadoCalculado = pass.status;

            if (ev) {
              const fechaFin = ev.endDate ? new Date(ev.endDate) : new Date(ev.startDate);
              if (ev.allDay) fechaFin.setHours(23, 59, 59, 999);

              if (ev.status === 'cancelled' || ev.status === 'completed' || ahora > fechaFin) {
                estadoCalculado = FairAccessStatus.EXPIRED;
              } else if (ev.status === 'published') {
                estadoCalculado = FairAccessStatus.ACTIVE;
              }
            }

            return {
              ...pass,
              statusCalculado: estadoCalculado,
              eventoEstado: ev ? ev.status : 'NO_ENCONTRADO_EN_CACHE'
            };
          });

          this.pasesUsuario = pasesProcesados;
          this.tienePasesActivos = pasesProcesados.some(pass => pass.statusCalculado === FairAccessStatus.ACTIVE);

          this.cdr.detectChanges();
        },
        (error) => {
          console.error('❌ [DEBUG PASES] Error en el canal activo de Firestore:', error.message);
          this.tienePasesActivos = false;
          this.cdr.detectChanges();
        }
      );

    } catch (error) {
      console.error('❌ [DEBUG PASES] Captura de excepción en asignación:', error);
      this.tienePasesActivos = false;
      this.cdr.detectChanges();
    }
  }

  /**
   * @method limpiarEstadoComponente
   * @private
   * @description Purga las memorias y estados de los interruptores cuando el socio cierra sesión.
   */
  private limpiarEstadoComponente(): void {
    if (this.pasesUnsubscribeFn) {
      this.pasesUnsubscribeFn();
      this.pasesUnsubscribeFn = null;
    }
    this.pasesUsuario = [];
    this.cacheEvents = [];
    this.tienePasesActivos = false;
    this.hayEventosConControlActivos = false;
    this.cdr.detectChanges();
  }

  /** @get role @returns {string} Código del rol jerárquico del usuario actual ('tipo' en Firestore). */
  get role(): string {
    return this.authService.currentUserData?.tipo || '';
  }

  /** @get status @returns {string} Estado de admisión de la ficha del socio. */
  get status(): string {
    return this.authService.currentUserData?.estado || '';
  }

  /** @method esPorteroPuro @returns {boolean} */
  public esPorteroPuro(): boolean {
    return this.role === UserRole.PORTERO;
  }

  /** @method canShowMenu @returns {boolean} */
  public canShowMenu(): boolean {
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

  /** @method puedeVerInicio @returns {boolean} */
  public puedeVerInicio(): boolean {
    return !this.esPorteroPuro();
  }

  /** @method puedeInvitar @returns {boolean} */
  public puedeInvitar(): boolean {
    return [UserRole.SOCIO, UserRole.DIRECTIVA, UserRole.ADMINISTRADOR].includes(this.role as UserRole);
  }

  /** @method puedeVerUsers @returns {boolean} */
  public puedeVerUsers(): boolean {
    return [UserRole.SOCIO, UserRole.DIRECTIVA, UserRole.ADMINISTRADOR].includes(this.role as UserRole);
  }

  /** @method puedeGestionarCuotas @returns {boolean} */
  public puedeGestionarCuotas(): boolean {
    return [UserRole.DIRECTIVA, UserRole.ADMINISTRADOR].includes(this.role as UserRole);
  }

  /** @method puedeVerEventos @returns {boolean} */
  public puedeVerEventos(): boolean {
    return [UserRole.INVITADO, UserRole.SOCIO, UserRole.DIRECTIVA, UserRole.ADMINISTRADOR].includes(this.role as UserRole);
  }

  /** @method puedeVerPasesEventos @returns {boolean} */
  public puedeVerPasesEventos(): boolean {
    if (this.esPorteroPuro()) return false;
    return this.tienePasesActivos;
  }

  /** @method puedeEscanearEventos @returns {boolean} */
  public puedeEscanearEventos(): boolean {
    return [UserRole.PORTERO, UserRole.DIRECTIVA, UserRole.ADMINISTRADOR].includes(this.role as UserRole);
  }

  /**
   * @method navegar
   * @param {string} ruta - Segmento destino (ej: '/home').
   * @description Ejecuta el enrutamiento y pliega el menú lateral deslizable nativo.
   */
  public navegar(ruta: string): void {
    this.router.navigate([ruta]);
    this.menuCtrl.close();
  }

  /**
   * @method logout
   * @description 🛡️ VULNERABILIDAD RESUELTA: Cierra explícitamente el socket activo (onSnapshot) 
   * antes de revocar las credenciales. Esto previene excepciones repetidas de falta de permisos 
   * en la pantalla de login debido a tokens nulos.
   * @returns {Promise<void>} Promesa asíncrona de desvinculación completa.
   */
  public async logout(): Promise<void> {
    try {
      this.menuCtrl.close();
      
      // 💥 MATAMOS EL SOCKET PRIMERO: Bloqueo proactivo ante ráfagas asíncronas
      if (this.pasesUnsubscribeFn) {
        this.pasesUnsubscribeFn();
        this.pasesUnsubscribeFn = null;
        console.log('🧹 [APP] Canal onSnapshot de fair-access cerrado preventivamente con éxito.');
      }

      this.limpiarEstadoComponente();
      await this.authService.logout();

      this.zone.run(async () => {
        await this.router.navigateByUrl('/login');
      });
    } catch (error) {
      await this.errorHandler.handle(error);
    }
  }
}