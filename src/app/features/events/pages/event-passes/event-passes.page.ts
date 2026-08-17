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
  calendarOutline,
  chevronForwardOutline
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
  PasseAccess,
  AppEvent,
  UserRole,
  PasseService,
  PasseAccessStatus,
  DateEsUtils
} from 'shared-core';

/**
 * @interface PaseUniversal
 * @description Estructura transaccional extendida para el mapeo visual de pases feriales con sus gradientes dinámicos.
 */
interface PaseUniversal extends PasseAccess {
  eventTitle: string;
  eventDescription: string;
  eventImg: string | null;
  dateStart: string;
  dateEnd: string;
  requiresAccessControl: boolean;
  limiteInvitadosPorSocio: number | null;
  backgroundStyle: string;
  validezTexto: string;
  validezInicio?: string;
  validezFin?: string;
  invitadosUsados?: number | null;
}

/**
 * @class PassePage
 * @description Componente controlador maestro encargado de listar los pases digitales del usuario activo,
 * autogenerar los identificadores criptográficos en formato QR y coordinar los accesos de la Peña.
 */
@Component({
  selector: 'app-event-passes',
  templateUrl: './event-passes.page.html',
  styleUrls: ['./event-passes.page.scss'],
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
export class PassePage implements OnInit, OnDestroy {

  // =========================================================================
  // 📥 INFRAESTRUCTURA INYECTADA (PATRÓN MODERNO INJECT)
  // =========================================================================
  private authService = inject(AuthService);
  private eventsService = inject(EventsService);
  private firestore = inject(Firestore);
  private errorHandler = inject(ErrorHandlerService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);
  private passeService = inject(PasseService);


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
      calendarOutline,
      chevronForwardOutline
    });

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
   * @method ionViewWillLeave
   * @description Ciclo de vida nativo de Ionic. Se ejecuta inmediatamente en cuanto la app 
   * inicia la transición de salida de esta pantalla (útil para deslogueos rápidos).
   */
  public ionViewWillLeave(): void {
    console.log('🛡️ [EventPassesPage] Detectado abandono de vista. Cancelando onSnapshot proactivamente.');
    this.desconectarEscuchaPases();
  }

  /**
   * @method desconectarEscuchaPases
   * @public
   * @description Expone la desconexión del Snapshot de forma atómica para el recolector de basura o acciones de Auth.
   */
  public desconectarEscuchaPases(): void {
    if (this.pasesUnsubscribeFn) {
      this.pasesUnsubscribeFn();
      this.pasesUnsubscribeFn = null;
      console.log('🧹 [EventPassesPage] Escucha global de pases cerrada bajo petición de Auth.');
    }
  }

  /**
   * @method ngOnDestroy
   * @description Destruye las suscripciones abiertas en memoria previniendo pérdidas de rendimiento.
   */
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
   * @method ionViewWillEnter
   * @description Ciclo de vida nativo de Ionic. Forzamos la reconexión y recalculo
   * en caliente cada vez que la vista entra en pantalla tras volver de la gestión de invitados.
   */
  public async ionViewWillEnter(): Promise<void> {
    await this.authService.waitForUserData();
    this.currentUserId = this.authService.getUid();
    this.isInvitado = this.authService.isInvitado();
    this.currentUserData = this.authService.currentUserData;

    if (this.currentUserId) {
      if (this.cacheEventos.length === 0) {
        this.escucharEventosYFiltros();
      } else {
        await this.cargarPasesUniversales();
      }
    }
  }

  /**
   * @method cargarPasesUniversales
   * @public
   * @async
   * @description Se conecta mediante onSnapshot vivo a la colección 'event-access', calculando vigencias
   * de forma elástica y ejecutando consultas NoSQL de invitaciones exclusivamente si el evento autoriza cupos.
   */
  public async cargarPasesUniversales(): Promise<void> {
    if (!this.currentUserId) return;

    if (this.pasesUnsubscribeFn) {
      this.pasesUnsubscribeFn();
    }

    try {
      const passeAccessRef = collection(this.firestore, 'event-access');
      const q = query(passeAccessRef, where('userId', '==', this.currentUserId));

      this.pasesUnsubscribeFn = onSnapshot(q, async (snapshot) => {
        const promesasPases = snapshot.docs.map(async (docSnap) => {
          const pass = { id: docSnap.id, ...docSnap.data() } as PasseAccess;

          if (pass.status === PasseAccessStatus.ACTIVE || (pass as any).status === 'active') {
            const ev = this.cacheEventos.find(e => e.id === pass.eventId);

            // 🎯 REGLA DE INVITADOS: Si es pase de invitado, restringimos la fecha al día asignado en el pase (pass.date)
            const esPaseInvitado = this.isInvitado || pass.userType === UserRole.INVITADO || (pass as any).userType === 'invitado';

            const inicioStr = esPaseInvitado
              ? (pass.date || (pass as any).dateStart || '')
              : ((pass as any).dateStart || pass.date || '');

            const finStr = esPaseInvitado
              ? inicioStr
              : ((pass as any).dateEnd || inicioStr);

            if (DateEsUtils.estaEnRangoDiarioEs(inicioStr, finStr)) {
              const eventImg = this.obtenerImagenPortadaEvento(ev);
              const gradienteUnico = this.generarColorUnicoPorId(pass.eventId);
              const esAllDay = ev ? (ev.allDay || (ev as any).isAllDay || false) : false;

              // Si es un pase de invitado, calculamos el texto de validez basándonos únicamente en su fecha diaria única
              const textoValidez = esPaseInvitado
                ? `EL ${this.formatearFechaEs(inicioStr, false)}`
                : this.calcularTextoValidez(inicioStr, finStr, esAllDay);

              let validezInicio = '';
              let validezFin = '';

              if (textoValidez) {
                const partes = textoValidez.split(/\s+AL\s+/i);
                if (partes.length === 2) {
                  validezInicio = partes[0].trim();
                  validezFin = 'AL ' + partes[1].trim();
                } else {
                  validezInicio = textoValidez;
                }
              }

              const limiteInvitados = ev ? (ev.limiteInvitadosPorSocio ?? null) : null;

              // 🚀 OPTIMIZACIÓN CRÍTICA DE LECTURAS FIRESTORE:
              let usados = 0;
              if (ev && this.currentUserId && !this.isInvitado && limiteInvitados && limiteInvitados > 0) {
                usados = await this.passeService.contarInvitacionesDelDia(this.currentUserId, pass.date, ev);
              }

              return {
                ...pass,
                eventTitle: ev ? ev.title : 'Convocatoria Oficial de la Peña',
                eventDescription: ev ? ev.description : 'Pase Digital de Acceso.',
                eventImg: eventImg,
                dateStart: inicioStr,
                dateEnd: finStr,
                requiresAccessControl: ev ? ev.requiresAccessControl : false,
                limiteInvitadosPorSocio: limiteInvitados,
                backgroundStyle: gradienteUnico,
                validezTexto: textoValidez,
                validezInicio: validezInicio,
                validezFin: validezFin,
                invitadosUsados: usados
              } as PaseUniversal;
            }
          }
          return null;
        });

        const resultados = await Promise.all(promesasPases);
        this.misPasesHoy = resultados.filter((p): p is PaseUniversal => p !== null);
        this.cdr.detectChanges();
      },
        error => this.errorHandler.handle(error));

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

  // Mapeo exacto idéntico al de EventDetailPage para mantener coherencia visual en toda la app
  private readonly EVENT_FALLBACK_IMAGES: Record<string, string> = {
    asamblea: 'assets/img/evento-asamblea.jpg',
    comida: 'assets/img/evento-comida.jpg',
    feria: 'assets/img/evento-feria.jpg',
    quedada: 'assets/img/evento-quedada.jpg'
  };

  /**
   * @method obtenerImagenPortadaEvento
   * @description Obtiene la imagen subida del evento o calcula la imagen por defecto según su tipo
   */
  private obtenerImagenPortadaEvento(ev: AppEvent | undefined): string {
    if (ev?.imageUrl && ev.imageUrl.trim() !== '') {
      return ev.imageUrl;
    }
    const tipo = ev?.type?.toLowerCase() || '';
    return this.EVENT_FALLBACK_IMAGES[tipo] || 'assets/img/escudo.png';
  }

  /**
   * @method formatearFechaEs
   * @description Convierte una cadena de fecha ISO a formato español DD/MM/YYYY o DD/MM/YYYY - HH24:MI
   */
  private formatearFechaEs(fechaIso: string, incluirHora: boolean = false): string {
    if (!fechaIso) return '';
    const d = new Date(fechaIso);
    if (isNaN(d.getTime())) return '';

    const dia = String(d.getDate()).padStart(2, '0');
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const anio = d.getFullYear();

    const fechaBase = `${dia}/${mes}/${anio}`;

    if (incluirHora) {
      const horas = String(d.getHours()).padStart(2, '0');
      const minutos = String(d.getMinutes()).padStart(2, '0');
      return `${fechaBase} - ${horas}:${minutos}`;
    }

    return fechaBase;
  }

  /**
   * @method calcularTextoValidez
   * @description Formatea la validez del pase respetando el formato DD/MM/YYYY y HH24:MI
   */
  private calcularTextoValidez(inicioStr: string, finStr: string, esTodoElDia: boolean): string {
    if (!inicioStr) return 'FECHA NO DISPONIBLE';

    const fechaIni = new Date(inicioStr);
    const fechaFin = finStr ? new Date(finStr) : fechaIni;

    // Comprobamos si el inicio y fin caen en el mismo día del calendario
    const mismoDia = fechaIni.getFullYear() === fechaFin.getFullYear() &&
      fechaIni.getMonth() === fechaFin.getMonth() &&
      fechaIni.getDate() === fechaFin.getDate();

    // Caso 1: Evento de Todo el Día (o sin hora especificada)
    if (esTodoElDia) {
      if (mismoDia) {
        return `EL ${this.formatearFechaEs(inicioStr, false)}`;
      }
      return `DEL ${this.formatearFechaEs(inicioStr, false)} HASTA ${this.formatearFechaEs(finStr, false)}`;
    }

    // Caso 2: Evento con Horario (HH24:MI)
    const inicioConHora = this.formatearFechaEs(inicioStr, true);
    const finConHora = this.formatearFechaEs(finStr, true);

    if (mismoDia) {
      const horaFin = `${String(fechaFin.getHours()).padStart(2, '0')}:${String(fechaFin.getMinutes()).padStart(2, '0')}`;
      return `${inicioConHora} A ${horaFin}`;
    }

    return `DEL ${inicioConHora} AL ${finConHora}`;
  }
}