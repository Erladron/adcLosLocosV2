import { Component, inject, ChangeDetectorRef, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

// Biblioteca oficial de inyección y control NoSQL de AngularFire
import { Firestore, collection, query, where, onSnapshot, Unsubscribe } from '@angular/fire/firestore';

// Registro e iconografía standalone oficial de Ionic/Ionicons
import { addIcons } from 'ionicons';
import {
  qrCodeOutline,
  peopleOutline,
  ticketOutline,
  alertCircleOutline,
  sendOutline,
  checkmarkCircleOutline,
  closeOutline,
  idCardOutline,
  timeOutline,
  personOutline,
  wineOutline,
  sparklesOutline,
  searchOutline,
  trashOutline,
  arrowForwardOutline,
  calendarOutline
} from 'ionicons/icons';

import {
  IonContent,
  IonIcon,
  IonModal,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton
} from '@ionic/angular/standalone';

// Modelos, interfaces y utilidades de la librería unificada de la Peña
import {
  PageHeaderComponent,
  AuthService,
  EventsService,
  ErrorHandlerService,
  FairAccess,
  AppEvent,
  UserRole,
  FairAccessStatus,
  DateEsUtils // 🚀 El nuevo motor de fechas estandarizado de España
} from 'shared-core';

/**
 * @interface PaseUniversal
 * @description Estructura transaccional extendida para el mapeo visual de pases feriales con sus gradientes dinámicos.
 */
interface PaseUniversal extends FairAccess {
  eventTitle: string;
  eventDescription: string;
  eventImg: string | null;
  dateStart: string;
  dateEnd: string;
  requiresAccessControl: boolean;
  limiteInvitadosPorSocio: number | null;
  backgroundStyle: string;
  validezTexto: string;
}

/**
 * @class FairPage
 * @description Componente controlador maestro encargado de listar los pases digitales del usuario activo,
 * autogenerar los identificadores criptográficos en formato QR y coordinar los accesos de la Peña.
 */
@Component({
  selector: 'app-fair',
  templateUrl: './fair.page.html',
  styleUrls: ['./fair.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonIcon,
    IonModal,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    PageHeaderComponent
  ]
})
export class FairPage implements OnInit, OnDestroy {

  // =========================================================================
  // 📥 INFRAESTRUCTURA INYECTADA (PATRÓN MODERNO INJECT)
  // =========================================================================
  private authService = inject(AuthService);
  private eventsService = inject(EventsService);
  private firestore = inject(Firestore);
  private errorHandler = inject(ErrorHandlerService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);

  // =========================================================================
  // 📋 VARIABLES DE CONTROL Y ESTADO DE LA INTERFAZ
  // =========================================================================
  /** @description Identificador de la cuenta del usuario activo en la sesión. */
  public currentUserId: string | null = null;
  /** @description Documento completo con los metadatos de perfil del socio de la peña. */
  public currentUserData: any = null;
  /** @description Flag indicador de rol Invitado. */
  public isInvitado = false;
  /** @description Fecha actual estandarizada en formato de España (YYYY-MM-DD). */
  public hoyFormateado = '';

  /** @description Año en curso para las de la temporada del abono de la peña. */
  public anioActual: number = DateEsUtils.obtenerFechaActualEs().getFullYear();
  /** @description Catálogo final de pases computados activos de la peña para el HTML. */
  public misPasesHoy: PaseUniversal[] = [];

  /** @description Almacén en memoria de los pases cargados desde la agenda NoSQL. */
  private cacheEventos: AppEvent[] = [];

  // Control de overlays y modales de portería
  public qrPayload: string | null = null;
  public isQrModalOpen = false;
  public paseSeleccionadoModal: PaseUniversal | null = null;

  // Hilos de desuscripción de memoria
  private eventsSub: Subscription | null = null;
  private pasesUnsubscribeFn: Unsubscribe | null = null;

  /**
   * @constructor
   * @description Inicializa la carga de iconos nativos e interpreta el huso horario local de la peña.
   */
  constructor() {
    addIcons({
      qrCodeOutline,
      peopleOutline,
      ticketOutline,
      alertCircleOutline,
      sendOutline,
      checkmarkCircleOutline,
      closeOutline,
      idCardOutline,
      timeOutline,
      personOutline,
      wineOutline,
      sparklesOutline,
      searchOutline,
      trashOutline,
      arrowForwardOutline,
      calendarOutline
    });

    // Estandarizamos el día actual con el huso horario forzado de España
    this.hoyFormateado = DateEsUtils.formatearFechaCortaEs(DateEsUtils.obtenerFechaActualEs());
  }

  /**
   * @method ngOnInit
   * @description Ciclo de vida inicial. Recupera credenciales y dispara las escuchas relacionales.
   */
  public async ngOnInit(): Promise<void> {
    await this.authService.waitForUserData();
    this.currentUserId = this.authService.getUid();
    this.isInvitado = this.authService.isInvitado();
    this.currentUserData = this.authService.currentUserData;

    if (this.currentUserId) {
      this.escucharEventosYFiltros();
    }
  }

  /**
   * @method desconectarEscuchaPases
   * @public
   * @description Expone la desconexión del Snapshot para que el AuthService pueda invocarlo 
   * un milisegundo antes de destruir el token de Firebase.
   */
  public desconectarEscuchaPases(): void {
    if (this.pasesUnsubscribeFn) {
      this.pasesUnsubscribeFn();
      this.pasesUnsubscribeFn = null;
      console.log('🧹 [FairPage] Escucha global de pases cerrada bajo petición de Auth.');
    }
  }

  public ngOnDestroy(): void {
    if (this.eventsSub) this.eventsSub.unsubscribe();
    this.desconectarEscuchaPases();
  }

  /**
   * @method generarColorUnicoPorId
   * @param {string} eventId - ID único de la convocatoria.
   * @description Algoritmo matemático hash modular para autogenerar un gradiente visual HSL exclusivo por cada ID de convocatoria.
   */
  public generarColorUnicoPorId(eventId: string): string {
    if (!eventId) return 'linear-gradient(135deg, #1e3a8a 0%, #070d19 100%)';

    let hash = 0;
    for (let i = 0; i < eventId.length; i++) {
      hash = eventId.charCodeAt(i) + ((hash << 5) - hash);
    }

    const tonoColor = Math.abs(hash) % 360;
    return `linear-gradient(135deg, hsl(${tonoColor}, 75%, 35%) 0%, #070d19 100%)`;
  }

  /**
   * @method escucharEventosYFiltros
   * @private
   * @description Descarga la agenda de convocatorias publicadas de la peña antes de acoplar la sincronización de pases.
   */
  private escucharEventosYFiltros(): void {
    this.eventsSub = this.eventsService.getEvents().subscribe({
      next: (eventos: AppEvent[]) => {
        this.cacheEventos = eventos || [];
        this.cargarPasesUniversales();
      },
      error: (err) => this.errorHandler.handle(err)
    });
  }

  /**
   * @method cargarPasesUniversales
   * @public
   * @async
   * @description Se conecta mediante onSnapshot vivo a la colección de la peña, calculando vigencias
   * de forma limpia y elástica utilizando el motor unificado DateEsUtils.
   */
  public async cargarPasesUniversales(): Promise<void> {
    if (!this.currentUserId) return;

    if (this.pasesUnsubscribeFn) {
      this.pasesUnsubscribeFn();
    }

    try {
      const fairAccessRef = collection(this.firestore, 'fair-access');
      const q = query(fairAccessRef, where('userId', '==', this.currentUserId));

      this.pasesUnsubscribeFn = onSnapshot(q, {
        next: (snapshot) => {
          const pasesTmp: PaseUniversal[] = [];

          snapshot.forEach((docSnap) => {
            const pass = { id: docSnap.id, ...docSnap.data() } as FairAccess;

            // Verificamos si el pase consta con estado válido
            if (pass.status === FairAccessStatus.ACTIVE || (pass as any).status === 'active') {
              const ev = this.cacheEventos.find(e => e.id === pass.eventId);

              // Extraemos los límites de fecha del documento
              const inicioStr = (pass as any).dateStart || pass.date || '';
              const finStr = (pass as any).dateEnd || inicioStr;

              // 🚀 CONTROL UNIFICADO DE FECHA ESPAÑA: Evaluamos el rango con el método core estático
              if (DateEsUtils.estaEnRangoDiarioEs(inicioStr, finStr)) {
                const eventImg = ev ? (ev.imageUrl || (ev as any).eventImg) : null;
                const gradienteUnico = this.generarColorUnicoPorId(pass.eventId);

                pasesTmp.push({
                  ...pass,
                  eventTitle: ev ? ev.title : 'Convocatoria Oficial de la Peña',
                  eventDescription: ev ? ev.description : 'Pase Digital de Acceso.',
                  eventImg: eventImg,
                  dateStart: inicioStr,
                  dateEnd: finStr,
                  requiresAccessControl: ev ? ev.requiresAccessControl : false,
                  limiteInvitadosPorSocio: ev ? (ev.limiteInvitadosPorSocio ?? null) : null,
                  backgroundStyle: gradienteUnico,
                  validezTexto: (DateEsUtils.formatearFechaCortaEs(inicioStr) === DateEsUtils.formatearFechaCortaEs(finStr)) ? 'SOLO HOY' : 'ABONO EVENTO'
                });
              }
            }
          });

          this.misPasesHoy = pasesTmp;
          console.log(`🍏 [FairPage] Pases renderizados con éxito bajo huso horario de España: ${this.misPasesHoy.length}`);
          this.cdr.detectChanges();
        },
        error: (err) => this.errorHandler.handle(err)
      });

    } catch (error) {
      this.errorHandler.handle(error);
    }
  }

  public abrirCodigoQR(pase: PaseUniversal): void {
    this.qrPayload = this.isInvitado ? pase.id : `SOCIO:${this.currentUserId}:EVENTO-${pase.eventId}`;
    this.paseSeleccionadoModal = pase;
    this.isQrModalOpen = true;
    this.cdr.detectChanges();
  }

  public cerrarCodigoQR(): void {
    this.isQrModalOpen = false;
    this.paseSeleccionadoModal = null;
    this.qrPayload = null;
    this.cdr.detectChanges();
  }

  public irAGestionInvitados(pase: PaseUniversal): void {
    if (this.isInvitado) return;
    if (pase.limiteInvitadosPorSocio && pase.limiteInvitadosPorSocio > 0) {
      this.router.navigate([`/events/${pase.eventId}/guests`]);
    }
  }
}