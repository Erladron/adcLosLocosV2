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
      const passeAccessRef = collection(this.firestore, 'event-access');
      const q = query(passeAccessRef, where('userId', '==', this.currentUserId));

      this.pasesUnsubscribeFn = onSnapshot(q, {
        next: (snapshot) => {
          const pasesTmp: PaseUniversal[] = [];

          snapshot.forEach((docSnap) => {
            const pass = { id: docSnap.id, ...docSnap.data() } as PasseAccess;

            if (pass.status === PasseAccessStatus.ACTIVE || (pass as any).status === 'active') {
              const ev = this.cacheEventos.find(e => e.id === pass.eventId);

              const inicioStr = (pass as any).dateStart || pass.date || '';
              const finStr = (pass as any).dateEnd || inicioStr;

              if (DateEsUtils.estaEnRangoDiarioEs(inicioStr, finStr)) {
                // 🎯 Calculamos la imagen de portada exacta (la subida o la correspondiente a su tipo)
                const eventImg = this.obtenerImagenPortadaEvento(ev);
                const gradienteUnico = this.generarColorUnicoPorId(pass.eventId);
                const esAllDay = ev ? (ev.allDay || (ev as any).isAllDay || false) : false;
                const textoValidez = this.calcularTextoValidez(inicioStr, finStr, esAllDay);

                // ✂️ PARSEO DE VALIDEZ EN 2 LÍNEAS (DEL ... / AL ...)
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
                  validezTexto: textoValidez,
                  validezInicio: validezInicio,
                  validezFin: validezFin
                });
              }
            }
          });

          this.misPasesHoy = pasesTmp;
          console.log(`🍏 [EventPassesPage] Pases renderizados con éxito bajo huso horario de España: ${this.misPasesHoy.length}`);
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          if (!this.authService.getUid() || (err && err.code === 'permission-denied') || (err && err.message && err.message.includes('false for'))) {
            console.log('🔕 [EventPassesPage] Interceptado error de permisos post-logout. Desconectando snapshot de forma segura.');
            this.desconectarEscuchaPases();
            return;
          }
          this.errorHandler.handle(err);
        }
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