import { Component, OnInit, OnDestroy, inject } from '@angular/core'; 
import { CommonModule } from '@angular/common'; 
import { RouterLink } from '@angular/router';
import {
  IonContent,
  IonIcon,
  IonSegment,
  IonSegmentButton,
  IonLabel
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  restaurantOutline, checkmarkCircle, mapOutline,
  peopleOutline, alertCircleOutline, businessOutline, chatbubblesOutline,
  add, checkmarkCircleOutline, closeCircleOutline, wineOutline
} from 'ionicons/icons';

import { Observable, Subject, of } from 'rxjs';
import { map, tap, takeUntil, catchError } from 'rxjs/operators';

import {
  PageHeaderComponent,
  EventsService,
  AppEvent,
  EventType,
  EventStatus, // 🚀 Importamos vuestro enum de estados
  LoadingService,
  NotificationService,
  ErrorHandlerService,
  AppMessageCode,
  APP_MESSAGES,
  AuthService 
} from 'shared-core';

// 🇪🇸 Diccionario de Traducción Oficial de Estados para el Listado de la Peña
export const EVENT_STATUS_ES: Record<EventStatus, string> = {
  [EventStatus.DRAFT]: 'Borrador',
  [EventStatus.PUBLISHED]: 'Abierto', // Cambiado a "Abierto" para que quede compacto en la tarjeta verde
  [EventStatus.CANCELLED]: 'Cancelado',
  [EventStatus.COMPLETED]: 'Finalizado'
};

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
    PageHeaderComponent
  ]
})
export class EventsPage implements OnInit, OnDestroy {
  private eventsService = inject(EventsService);
  private loading = inject(LoadingService);
  private notification = inject(NotificationService);
  private errorHandler = inject(ErrorHandlerService);
  private authService = inject(AuthService); 

  private destroy$ = new Subject<void>();

  // 🚀 Exponemos el diccionario para que el HTML pueda traducir en caliente
  public estadoTraduccion = EVENT_STATUS_ES;

  events$!: Observable<AppEvent[]>;
  filteredEvents$!: Observable<AppEvent[]>;
  currentFilter: string = 'todos';

  isAdmin: boolean = false;
  currentUserId: string | null = null; 

  userAttendances: { [eventId: string]: 'going' | 'not_going' | 'waitlist' | 'none' } = {}; 

  constructor() {
    addIcons({
      restaurantOutline, checkmarkCircle, mapOutline,
      peopleOutline, alertCircleOutline, businessOutline, chatbubblesOutline,
      add, checkmarkCircleOutline, closeCircleOutline, wineOutline
    });
  }

  async ngOnInit() {
    await this.authService.waitForUserData();

    this.currentUserId = this.authService.getUid();
    this.isAdmin = this.authService.isAdmin() || this.authService.isDirectiva();

    this.initEventsStream();
  }

  private initEventsStream() {
    this.events$ = this.eventsService.getEvents().pipe(
      takeUntil(this.destroy$), 
      map((events: AppEvent[]) => { 
        if (this.authService.isInvitado()) {
          return events.filter(event => event.isPrivate === false);
        }
        return events;
      }),
      tap((events: AppEvent[]) => { 
        events.forEach(event => {
          if (event.id) {
            this.userAttendances[event.id] = 'none'; 

            if (!this.authService.isInvitado() && this.currentUserId) {
              this.eventsService.getUserAttendanceForEvent(event.id, this.currentUserId)
                .pipe(
                  takeUntil(this.destroy$),
                  catchError(() => {
                    return of(null);
                  })
                ) 
                .subscribe({ 
                  next: (attendance) => { 
                    if (attendance && attendance.status) { 
                      this.userAttendances[event.id!] = attendance.status as any; 
                    }
                  }
                });
            }
          }
        });
      }),
      catchError((err) => {
        return of([]);
      })
    );

    this.applyFilter(); 
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setFilter(filter: any) {
    this.currentFilter = filter || 'todos'; 
    this.applyFilter(); 
  }

  private applyFilter() {
    this.filteredEvents$ = this.events$.pipe(
      map(events => {
        if (this.currentFilter === 'todos') return events; 
        return events.filter(e => e.type === this.currentFilter); 
      }),
      catchError(() => of([])) 
    );
  }

  public isUserGoing(eventId: string): boolean {
    return this.userAttendances[eventId] === 'going'; 
  }

  public isUserNotGoing(eventId: string): boolean {
    return this.userAttendances[eventId] === 'not_going'; 
  }

  public isEventFull(event: AppEvent): boolean {
    if (!event.maxAttendees) return false; 
    return (event.attendeeCount || 0) >= event.maxAttendees;
  }

  async confirmAttendance(eventId: string, event: Event) {
    event.stopPropagation(); 
    
    if (this.authService.isInvitado()) {
      await this.notification.info('Operación restringida: Los usuarios con rol Invitado no pueden apuntarse a eventos.');
      return;
    }

    try {
      await this.loading.wrap(
        () => this.eventsService.registerAttendance(eventId, this.currentUserId!, true), 
        'Confirmando tu plaza...' 
      );
      this.userAttendances[eventId] = 'going'; 
      await this.notification.success(AppMessageCode.ADC_EVENT_INF_0003); 
    } catch (error) {
      await this.errorHandler.handle(error, AppMessageCode.ADC_EVENT_ERR_0002); 
    }
  }

  async declineAttendance(eventId: string, event: Event) {
    event.stopPropagation(); 

    if (this.authService.isInvitado()) {
      await this.notification.info('Operación restringida: Funcionalidad exclusiva para socios de la peña.');
      return;
    }

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

  getIconForType(type: EventType | string): string {
    switch (type) {
      case EventType.ASAMBLEA: return 'business-outline'; 
      case EventType.COMIDA: return 'restaurant-outline'; 
      case EventType.QUEDADA: return 'chatbubbles-outline'; 
      case EventType.FERIA: return 'wine-outline'; 
      default: return 'restaurant-outline'; 
    }
  }
}