import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef, Injectable } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import {
  IonContent,
  IonIcon,
  IonSegment,
  IonSegmentButton,
  IonLabel
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  addOutline, restaurantOutline, checkmarkCircle, mapOutline,
  peopleOutline, alertCircleOutline, businessOutline, chatbubblesOutline,
  add, checkmarkCircleOutline, closeCircleOutline, wineOutline, calendarOutline, qrCodeOutline,
  chevronForwardOutline, chevronBackOutline
} from 'ionicons/icons';

import { Observable, Subject, Subscription, of } from 'rxjs';
import { map, takeUntil, catchError } from 'rxjs/operators';

// Importaciones core del monorrepo shared-core
import {
  PageHeaderComponent,
  EventsService,
  AppEvent,
  EventType,
  EventStatus,
  LoadingService,
  NotificationService,
  ErrorHandlerService,
  AuthService
} from 'shared-core';

// Componentes y tipos nativos de angular-calendar (Standalone)
import {
  CalendarMonthViewComponent,
  CalendarDateFormatter,
  CalendarNativeDateFormatter,
  DateFormatterParams,
  type CalendarEvent,         // 👈 El 'type' evita errores de importación estática
  type CalendarMonthViewDay
} from 'angular-calendar';
import { isSameMonth, isSameDay } from 'date-fns';
import localeEs from '@angular/common/locales/es';



/**
 * @fileoverview Componente principal de gestión y visualización de la agenda de eventos.
 * Integra angular-calendar en su variante Standalone para presentar los marcadores (puntos)
 * de colores por día y desplegar el listado detallado filtrado al interactuar con el calendario.
 */

/** 
 * @description Diccionario de internacionalización oficial para los estados feriales de la peña. 
 */
export const EVENT_STATUS_ES: Record<EventStatus, string> = {
  [EventStatus.DRAFT]: 'Borrador',
  [EventStatus.PUBLISHED]: 'Abierto',
  [EventStatus.CANCELLED]: 'Cancelado',
  [EventStatus.COMPLETED]: 'Finalizado'
};

/** 
 * @description Mapa oficial de colores por tipo de evento (EventType) para los puntos e indicadores del calendario. 
 */
export const EVENT_TYPE_COLORS: Record<string, string> = {
  [EventType.ASAMBLEA]: '#f59e0b', // Amarillo / Ámbar
  [EventType.COMIDA]: '#ef4444',   // Rojo
  [EventType.QUEDADA]: '#10b981',  // Verde
  [EventType.FERIA]: '#ec4899',    // Rosa / Magenta
  default: '#38bdf8'               // Azul corporativo
};

// Registrar el idioma español en Angular
registerLocaleData(localeEs);

@Injectable()
export class CustomDateFormatter extends CalendarNativeDateFormatter {
  public override monthViewColumnHeader({ date, locale }: DateFormatterParams): string {
    const day = date.getDay();
    const daysMap: { [key: number]: string } = {
      1: 'L', // Lunes
      2: 'M', // Martes
      3: 'X', // Miércoles
      4: 'J', // Jueves
      5: 'V', // Viernes
      6: 'S', // Sábado
      0: 'D'  // Domingo
    };
    return daysMap[day] || '';
  }
}

/**
 * @class EventsPage
 * @implements {OnInit}
 * @implements {OnDestroy}
 * @description Pantalla unificada encargada de acoplar un calendario de navegación interactivo
 * (`CalendarMonthViewComponent`) con el catálogo dinámico de tarjetas de eventos en tiempo real.
 */
@Component({
  selector: 'app-events',
  templateUrl: './events.page.html',
  styleUrls: ['./events.page.scss'],
  standalone: true,
  providers: [
    {
      provide: CalendarDateFormatter,
      useClass: CustomDateFormatter // 👈 AQUÍ es donde debe ir el formateador
    }
  ],
  imports: [
    CommonModule,
    RouterLink,
    IonContent,
    IonIcon,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    PageHeaderComponent,
    CalendarMonthViewComponent,
  ]
})
export class EventsPage implements OnInit, OnDestroy {

  // =========================================================================
  // 📥 INFRAESTRUCTURA INYECTADA (PATRÓN MODERNO INJECT)
  // =========================================================================
  private eventsService = inject(EventsService);
  private loading = inject(LoadingService);
  private notification = inject(NotificationService);
  private errorHandler = inject(ErrorHandlerService);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);

  locale: string = 'es';
  weekStartsOn: number = 1; // 1 = Lunes

  /** 
   * @private
   * @description Disparador atómico encargado de romper flujos vivos en el ciclo de destrucción del componente. 
   */
  private destroy$ = new Subject<void>();

  // =========================================================================
  // 📋 VARIABLES DE CONTROL Y ESTADO DE CALENDARIO
  // =========================================================================

  public refresh = new Subject<void>();

  /** @description Diccionario expuesto para traducir estados de evento en la plantilla. */
  public estadoTraduccion = EVENT_STATUS_ES;

  /** @description Controla la fecha y el mes/año visible en el calendario. */
  public viewDate: Date = new Date();

  /** @description Almacena la fecha seleccionada activamente por el usuario. */
  public selectedDate: Date = new Date();

  /** @description Lista total de eventos leídos de Firestore mapeados a la interfaz que consume `angular-calendar`. */
  public calendarEvents: CalendarEvent[] = [];

  /** @description Lista de eventos filtrados para el día seleccionado (desplegados debajo del calendario). */
  public eventosDelDia: AppEvent[] = [];

  /** @description Hilo de suscripción destinado a gobernar el socket en tiempo real (onSnapshot). */
  private eventsSubscription!: Subscription;

  /** @description Filtro por tipo de evento ('todos', 'ASAMBLEA', etc.). */
  public currentFilter = 'todos';

  /** @description Indica si el usuario actual posee rol de administrador o directiva. */
  public isAdmin = false;

  /** @description Identificador único del usuario autenticado. */
  public currentUserId: string | null = null;

  /** @description Cache interna con los eventos originales devueltos por Firestore. */
  private cacheEvents: AppEvent[] = [];

  /** @description Imágenes por defecto asignadas cuando un evento carece de URL de portada. */
  private readonly EVENT_FALLBACK_IMAGES: Record<string, string> = {
    asamblea: 'assets/img/evento-asamblea.jpg',
    comida: 'assets/img/evento-comida.jpg',
    feria: 'assets/img/evento-feria.jpg',
    quedada: 'assets/img/evento-quedada.jpg'
  };

  constructor() {
    addIcons({
      addOutline, restaurantOutline, checkmarkCircle, mapOutline,
      peopleOutline, alertCircleOutline, businessOutline, chatbubblesOutline,
      add, checkmarkCircleOutline, closeCircleOutline, wineOutline, calendarOutline, qrCodeOutline,
      chevronForwardOutline, chevronBackOutline
    });
  }

  /**
   * @method ngOnInit
   * @async
   * @description Inicializa la sesión de usuario y verifica sus privilegios administrativos.
   * @returns {Promise<void>}
   */
  public async ngOnInit(): Promise<void> {
    await this.authService.waitForUserData();

    this.currentUserId = this.authService.getUid();
    this.isAdmin = this.authService.isAdmin() || this.authService.isDirectiva();
    console.log('[GESTION EVENTOS]....: ¿Puede dar de alta eventos? ', this.isAdmin);
  }

  /**
   * @method ionViewWillEnter
   * @description Ciclo de vida Ionic. Activa la escucha en tiempo real de eventos al entrar en la vista.
   * @returns {void}
   */
  public ionViewWillEnter(): void {
    console.log('🔄 [AGENDA] Vinculando canal reactivo en caliente con Firestore...');
    this.initEventsStream();
  }

  /**
   * @method ionViewWillLeave
   * @description Ciclo de vida Ionic. Cancela la suscripción a Firestore al salir de la pantalla.
   * @returns {void}
   */
  public ionViewWillLeave(): void {
    if (this.eventsSubscription) {
      this.eventsSubscription.unsubscribe();
      console.log('🧹 [AGENDA] Canal reactivo (onSnapshot) cerrado limpiamente al salir de la pantalla.');
    }
  }

  /**
   * @method ngOnDestroy
   * @description Ciclo de vida Angular. Destruye los observables vivos para prevenir fugas de memoria (memory leaks).
   * @returns {void}
   */
  public ngOnDestroy(): void {
    if (this.eventsSubscription) {
      this.eventsSubscription.unsubscribe();
    }
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * @method initEventsStream
   * @private
   * @description Suscribe al stream de Firestore, mapea la información a `CalendarEvent` y aplica los filtros.
   * @returns {void}
   */
  private initEventsStream(): void {
    if (this.eventsSubscription) {
      this.eventsSubscription.unsubscribe();
    }

    this.eventsSubscription = this.eventsService.getEventsStream().pipe(
      takeUntil(this.destroy$),
      map((events: AppEvent[]) => {
        if (!events) return [];
        // Filtro de privacidad para usuarios invitados
        if (this.authService.isInvitado()) {
          return events.filter(event => event.isPrivate === false);
        }
        return events;
      }),
      catchError((err) => {
        console.error('🚨 [AGENDA] Error en el stream de Firestore:', err);
        return of([]);
      })
    ).subscribe((events) => {
      this.cacheEvents = events || [];
      console.log('📦 [AGENDA] Eventos recibidos de Firestore:', this.cacheEvents.length);

      // 1. Mapear los eventos al formato que exige angular-calendar (con sus puntos de color)
      this.calendarEvents = this.mapearEventosParaCalendario(this.cacheEvents);

      // 2. Filtrar y refrescar la lista de eventos del día seleccionado
      this.applyFilter();

      this.cdr.detectChanges();
    });
  }

  /**
   * @method mapearEventosParaCalendario
   * @private
   * @description Convierte la lista de `AppEvent` de Firestore en objetos compatibles con `CalendarEvent`.
   * Asigna el color del punto inferior según la propiedad `type` del evento.
   * @param {AppEvent[]} eventos Lista de eventos de Firestore.
   * @returns {CalendarEvent[]} Lista formateada para el calendario.
   */
  private mapearEventosParaCalendario(eventos: AppEvent[]): CalendarEvent[] {
    return eventos.map(e => {
      const startDate = this.parseFirestoreTimestamp(e.startDate) || new Date();
      const endDate = this.parseFirestoreTimestamp(e.endDate) || startDate;
      const colorHex = EVENT_TYPE_COLORS[e.type] || EVENT_TYPE_COLORS['default'];

      return {
        start: startDate,
        end: endDate,
        title: e.title || 'Evento',
        color: {
          primary: colorHex,
          secondary: colorHex + '33' // Opacidad suave para fondos si fuera necesario
        },
        meta: e // Guardamos el objeto AppEvent original dentro del meta del evento
      };
    });
  }

  /**
   * @method parseFirestoreTimestamp
   * @private
   * @description Convierte de forma segura un valor de fecha proveniente de Firestore (Timestamp, Date o string ISO) a Date nativo.
   * @param {any} dateVal Objeto o valor representando la fecha.
   * @returns {Date | null} Objeto Date o null si es inválido.
   */
  private parseFirestoreTimestamp(dateVal: any): Date | null {
    if (!dateVal) return null;
    if (typeof dateVal.toDate === 'function') {
      return dateVal.toDate();
    }
    if (dateVal.seconds !== undefined) {
      return new Date(dateVal.seconds * 1000);
    }
    const parsed = new Date(dateVal);
    return isNaN(parsed.getTime()) ? null : parsed;
  }

  /**
   * @method beforeMonthViewRender
   * @description Hook de interceptación que evalúa cada casilla del calendario antes del renderizado.
   * Inyecta la clase CSS personalizada 'cal-day-selected' exclusivamente sobre la celda coincidente con `selectedDate`.
   * @param {{ body: CalendarMonthViewDay[] }} param0 Matriz de celdas del mes entregadas por angular-calendar.
   * @returns {void}
   */
  public beforeMonthViewRender({ body }: { body: CalendarMonthViewDay[] }): void {
    body.forEach(day => {
      if (this.selectedDate && isSameDay(this.selectedDate, day.date)) {
        day.cssClass = 'cal-day-selected';
      } else {
        day.cssClass = '';
      }
    });
  }

  /**
   * @method onDayClicked
   * @description Manejador que se dispara al pulsar sobre una casilla (día) del calendario.
   * Actualiza la fecha seleccionada, filtra la lista inferior y fuerza el refresco visual.
   * @param {CalendarMonthViewDay} day Objeto entregado por `angular-calendar` representando la celda.
   * @returns {void}
   */
  public onDayClicked(day: CalendarMonthViewDay): void {
    if (!day || !day.date) return;

    // Si pulsamos un día del mes activo
    if (isSameMonth(day.date, this.viewDate)) {
      this.selectedDate = new Date(day.date.getTime());
      this.applyFilter();
      this.refresh.next();
      this.cdr.detectChanges();
    }
  }

  /**
   * @method changeMonth
   * @description Modifica la fecha visible (`viewDate`) sumando o restando meses.
   * Mantiene el mismo número de día seleccionado en el nuevo mes (o el último día válido si el mes tiene menos días).
   * @param {number} amount Cantidad de meses a desplazar (+1 para avanzar, -1 para retroceder).
   * @returns {void}
   */
  public changeMonth(amount: number): void {
    const newViewDate = new Date(this.viewDate);
    newViewDate.setMonth(newViewDate.getMonth() + amount);
    this.viewDate = newViewDate;

    // Preservar el número de día previamente seleccionado
    const currentDayNumber = this.selectedDate ? this.selectedDate.getDate() : 1;

    // Calculamos el último día del nuevo mes objetivo (para evitar saltos como 31 de Febrero -> Marzo)
    const lastDayOfNewMonth = new Date(newViewDate.getFullYear(), newViewDate.getMonth() + 1, 0).getDate();
    const targetDay = Math.min(currentDayNumber, lastDayOfNewMonth);

    // Asignamos el nuevo día seleccionado manteniendo la coherencia
    this.selectedDate = new Date(newViewDate.getFullYear(), newViewDate.getMonth(), targetDay);

    this.applyFilter();
    this.refresh.next();
    this.cdr.detectChanges();
  }

  /**
   * @method applyFilter
   * @description Filtra los eventos almacenados en memoria evaluando si el día seleccionado se encuentra 
   * dentro del rango `[startDate, endDate]` de cada evento, considerando también el filtro de tipo (`currentFilter`).
   * @returns {void}
   */
  public applyFilter(): void {
    if (!this.selectedDate) return;

    const targetTime = new Date(
      this.selectedDate.getFullYear(),
      this.selectedDate.getMonth(),
      this.selectedDate.getDate()
    ).getTime();

    this.eventosDelDia = this.cacheEvents.filter(e => {
      if (!e.title) return false;

      const start = this.parseFirestoreTimestamp(e.startDate);
      if (!start) return false;

      const startTime = new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime();
      const end = this.parseFirestoreTimestamp(e.endDate) || start;
      const endTime = new Date(end.getFullYear(), end.getMonth(), end.getDate()).getTime();

      // Comprobar si la fecha elegida cae en el rango del evento
      const estaEnRango = targetTime >= startTime && targetTime <= endTime;

      // Aplicar filtro por categoría si es distinto a 'todos'
      const pasaFiltroTipo = this.currentFilter === 'todos' || e.type === this.currentFilter;

      return estaEnRango && pasaFiltroTipo;
    });

    this.cdr.detectChanges();
  }

  /**
   * @method setFilter
   * @description Actualiza el filtro por categoría/tipo de evento.
   * @param {any} filter Nombre del tipo de evento a filtrar ('todos', 'ASAMBLEA', etc.).
   * @returns {void}
   */
  public setFilter(filter: any): void {
    this.currentFilter = filter || 'todos';
    this.applyFilter();
  }

  /**
   * @method getIconForType
   * @description Retorna el nombre del icono de Ionicons correspondiente al tipo de evento.
   * @param {EventType | string} type Tipo de evento.
   * @returns {string} Nombre del icono en Ionicons.
   */
  public getIconForType(type: EventType | string): string {
    switch (type) {
      case EventType.ASAMBLEA: return 'business-outline';
      case EventType.COMIDA: return 'restaurant-outline';
      case EventType.QUEDADA: return 'chatbubbles-outline';
      case EventType.FERIA: return 'wine-outline';
      default: return 'restaurant-outline';
    }
  }

  /**
   * @method getEventBgImage
   * @description Devuelve la URL de la portada del evento o una imagen fallback representativa.
   * @param {any} event Objeto del evento.
   * @returns {string} Ruta de la imagen asignada.
   */
  public getEventBgImage(event: any): string {
    if (event?.imageUrl && event.imageUrl.trim() !== '') {
      return event.imageUrl;
    }
    const tipo = event?.type?.toLowerCase();
    return this.EVENT_FALLBACK_IMAGES[tipo] || 'assets/img/escudo.png';
  }

  /**
   * @method nuevoEvento
   * @description Redirige al formulario de alta de nuevo evento.
   * @returns {void}
   */
  public nuevoEvento(): void {
    this.router.navigate(['/events/new']);
  }
}