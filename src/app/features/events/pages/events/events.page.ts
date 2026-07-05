import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core'; 
import { CommonModule } from '@angular/common'; 
import { RouterLink } from '@angular/router';
import {
  IonContent,
  IonIcon,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonDatetime
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  restaurantOutline, checkmarkCircle, mapOutline,
  peopleOutline, alertCircleOutline, businessOutline, chatbubblesOutline,
  add, checkmarkCircleOutline, closeCircleOutline, wineOutline, calendarOutline, qrCodeOutline
} from 'ionicons/icons';

import { Observable, Subject, Subscription, of } from 'rxjs';
import { map, tap, takeUntil, catchError } from 'rxjs/operators';

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
  AppMessageCode,
  AuthService
} from 'shared-core';

/** @description Diccionario de internacionalización oficial para los estados feriales de la peña. */
export const EVENT_STATUS_ES: Record<EventStatus, string> = {
  [EventStatus.DRAFT]: 'Borrador',
  [EventStatus.PUBLISHED]: 'Abierto', 
  [EventStatus.CANCELLED]: 'Cancelado',
  [EventStatus.COMPLETED]: 'Finalizado'
};

/**
 * @class EventsPage
 * @description Pantalla unificada premium encargada de acoplar un calendario de navegación interactivo
 * con el catálogo dinámico de tarjetas de eventos en tiempo real (onSnapshot).
 */
@Component({
  selector: 'app-events',
  templateUrl: './events.page.html',
  styleUrls: ['./events.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    IonContent,
    IonIcon,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonDatetime,
    PageHeaderComponent
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

  /** @description Disparador atómico encargado de romper flujos vivos en el ciclo de destrucción. */
  private destroy$ = new Subject<void>();

  // =========================================================================
  // 📋 VARIABLES DE CONTROL Y FLUJOS REACTIVOS (HTML COMPLETELY ACCESSIBLE)
  // =========================================================================
  public estadoTraduccion = EVENT_STATUS_ES;

  public events$!: Observable<AppEvent[]>;
  public filteredEvents$!: Observable<AppEvent[]>;
  
  /** @description Hilo de suscripción destinado a gobernar el socket en tiempo real de Firestore. */
  private eventsSubscription!: Subscription;
  
  public currentFilter = 'todos';
  public selectedDate: string = new Date().toISOString();
  public highlightedDates: any[] = [];

  public isAdmin = false;
  public currentUserId: string | null = null; 
  public userAttendances: { [eventId: string]: 'going' | 'not_going' | 'waitlist' | 'none' } = {}; 
  private cacheEvents: AppEvent[] = [];

  /**
   * @constructor
   * @description Inicializa la iconografía atómica integrada de la peña.
   */
  constructor() {
    addIcons({
      restaurantOutline, checkmarkCircle, mapOutline,
      peopleOutline, alertCircleOutline, businessOutline, chatbubblesOutline,
      add, checkmarkCircleOutline, closeCircleOutline, wineOutline, calendarOutline, qrCodeOutline
    });
  }

  /**
   * @method ngOnInit
   * @description Inicializa la consola maestra validando la sesión del socio o directiva.
   * @returns {Promise<void>}
   */
  public async ngOnInit(): Promise<void> {
    await this.authService.waitForUserData();

    this.currentUserId = this.authService.getUid();
    this.isAdmin = this.authService.isAdmin() || this.authService.isDirectiva();
  }

  /**
   * @method ionViewWillEnter
   * @description Ciclo de vida nativo de Ionic. Abre y acopla el canal de datos reactivos (onSnapshot).
   * @returns {void}
   */
  public ionViewWillEnter(): void {
    console.log('🔄 [AGENDA] Vinculando canal reactivo en caliente con Firestore...');
    this.initEventsStream();
  }

  /**
   * @method ionViewWillLeave
   * @description Ciclo de vida nativo de Ionic. Intercepta la salida de la pantalla para apagar el socket,
   * anulando lecturas en segundo plano y fugas de memoria indeseadas.
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
   * @description Desvincula de forma radical los flujos de control locales y de memoria.
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
   * @description 🚀 REFACTORIZADO EN TIEMPO REAL: Se suscribe al nuevo método reactivo `getEventsStream()` de tu servicio.
   * Cualquier mutación o actualización en caliente sobre el aforo bailará al instante en los dispositivos de los socios.
   * @private
   * @returns {void}
   */
  private initEventsStream(): void {
    if (this.eventsSubscription) {
      this.eventsSubscription.unsubscribe();
    }

    this.events$ = this.eventsService.getEventsStream().pipe(
      takeUntil(this.destroy$),
      map((events: AppEvent[]) => { 
        const eventosActivos = events.filter(event => 
          event && 
          event.status !== EventStatus.CANCELLED && 
          (event as any).status !== 'DELETED'
        );

        if (this.authService.isInvitado()) {
          return eventosActivos.filter(event => event.isPrivate === false);
        }
        return eventosActivos;
      }),
      tap((events: AppEvent[]) => { 
        this.cacheEvents = events;
        this.mapearPuntitosCalendario();
        
        events.forEach(event => {
          if (event.id && !this.authService.isInvitado() && this.currentUserId) {
            this.eventsService.getUserAttendanceForEvent(event.id, this.currentUserId)
              .pipe(takeUntil(this.destroy$), catchError(() => of(null)))
              .subscribe(attendance => { 
                if (attendance && attendance.status) {
                  this.userAttendances[event.id!] = attendance.status as any;
                }
              });
          }
        });
      }),
      catchError(() => of([]))
    );

    this.eventsSubscription = this.events$.subscribe(() => {
      this.applyFilter();
      this.cdr.detectChanges();
    });
  }

  /**
   * @method mapearPuntitosCalendario
   * @description Computa en memoria los días de actividad ferial para pintar los marcadores.
   * @private
   * @returns {void}
   */
  private mapearPuntitosCalendario(): void {
    const fechasConEvento = new Set(
      this.cacheEvents
        .map(e => e.startDate ? e.startDate.split('T')[0] : null)
        .filter(Boolean)
    );

    this.highlightedDates = Array.from(fechasConEvento).map(fecha => ({
      date: fecha,
      textColor: '#4ade80',
      backgroundColor: 'rgba(34, 197, 94, 0.16)'
    }));
    this.cdr.detectChanges();
  }

  /**
   * @method onDateChanged
   * @description Intercepta la selección interactiva de fechas y actualiza el renderizado del listado.
   * @param {any} event Parámetros devueltos por el ion-datetime.
   * @returns {void}
   */
  public onDateChanged(event: any): void {
    this.selectedDate = event.detail.value;
    this.applyFilter();
  }

  /**
   * @method setFilter
   * @description Altera el filtro secundario de categorías (segment).
   * @param {any} filter Valor del segmento.
   * @returns {void}
   */
  public setFilter(filter: any): void {
    this.currentFilter = filter || 'todos';
    this.applyFilter();
  }

  /**
   * @method applyFilter
   * @description Resuelve de forma combinada los filtros de fecha del calendario y tipado de segmento en memoria local.
   * @private
   * @returns {void}
   */
  private applyFilter(): void {
    const fechaFormateada = this.selectedDate.split('T')[0];

    this.filteredEvents$ = this.events$.pipe(
      map(events => {
        let res = events.filter(e => e.startDate && e.startDate.startsWith(fechaFormateada));
        
        if (this.currentFilter !== 'todos') {
          res = res.filter(e => e.type === this.currentFilter);
        }
        return res;
      }),
      catchError(() => of([]))
    );
    this.cdr.detectChanges();
  }

  /**
   * @method isUserGoing
   * @description Evalúa de forma síncrona si el socio logueado ha confirmado previamente su asistencia al evento.
   * @param {string} eventId - Identificador único de la convocatoria NoSQL.
   * @returns {boolean} True si el estado del mapa local se corresponde con 'going'.
   */
  public isUserGoing(eventId: string): boolean { 
    return this.userAttendances[eventId] === 'going'; 
  }

  /**
   * @method isUserNotGoing
   * @description Evalúa de forma síncrona si el socio ha declinado o marcado como inasistencia el evento.
   * @param {string} eventId - Identificador único de la convocatoria NoSQL.
   * @returns {boolean} True si el estado se corresponde con 'not_going'.
   */
  public isUserNotGoing(eventId: string): boolean { 
    return this.userAttendances[eventId] === 'not_going'; 
  }

  /**
   * @method isEventFull
   * @description Compara analíticamente si el aforo actual de confirmaciones ha cubierto el cupo máximo configurado.
   * @param {AppEvent} event - Instancia del modelo de datos de la convocatoria sujeta a control de plazas.
   * @returns {boolean} True si las reservas igualan o superan la capacidad total autorizada.
   */
  public isEventFull(event: AppEvent): boolean {
    if (!event.maxAttendees) return false;
    return (event.attendeeCount || 0) >= event.maxAttendees;
  }

  /**
   * @method confirmAttendance
   * @description Invoca de forma segura el método transaccional de shared-core para registrar la reserva de plaza.
   * Al ser reactivo en tiempo real, el incremento de asistentes impactará al instante en el resto de la peña.
   * @param {string} eventId - Identificador único de la convocatoria.
   * @param {Event} event - Evento síncrono del DOM de Ionic utilizado para frenar la propagación de burbujeo (stopPropagation).
   * @returns {Promise<void>}
   */
  public async confirmAttendance(eventId: string, event: Event): Promise<void> {
    event.stopPropagation();
    try {
      await this.loading.wrap(
        () => this.eventsService.registerAttendance(eventId, this.currentUserId!, true),
        'Confirmando plaza...'
      );
      this.userAttendances[eventId] = 'going';
      await this.notification.success(AppMessageCode.ADC_EVENT_INF_0003);
    } catch (error) {
      await this.errorHandler.handle(error, AppMessageCode.ADC_EVENT_ERR_0002);
    }
  }

  /**
   * @method declineAttendance
   * @description Invoca el método transaccional para liberar la plaza del socio, anulando simultáneamente su pase digital si procediera.
   * @param {string} eventId - Identificador único de la convocatoria.
   * @param {Event} event - Evento del DOM de Ionic para frenar la propagación en la tarjeta interactiva.
   * @returns {Promise<void>}
   */
  public async declineAttendance(eventId: string, event: Event): Promise<void> {
    event.stopPropagation();
    try {
      await this.loading.wrap(
        () => this.eventsService.registerAttendance(eventId, this.currentUserId!, false),
        'Cancelando asistencia...'
      );
      this.userAttendances[eventId] = 'not_going';
      await this.notification.info(AppMessageCode.ADC_EVENT_INF_0002);
    } catch (error) {
      await this.errorHandler.handle(error, AppMessageCode.ADC_EVENT_ERR_0002);
    }
  }

  /**
   * @method getIconForType
   * @description Mapeador utilitario de interfaz encargado de traducir el enumerado tecnológico del evento hacia un string kebab-case de Ionicons.
   * @param {EventType | string} type - Tipo de modalidad de la convocatoria.
   * @returns {string} Nombre unívoco del icono vectorial resultante (ej: 'wine-outline').
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
}