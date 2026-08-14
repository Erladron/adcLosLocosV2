import { Injectable, inject, EnvironmentInjector, runInInjectionContext } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  onSnapshot,
  setDoc,
  updateDoc,
  runTransaction
} from '@angular/fire/firestore';
import { Observable, from, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AppEvent, EventAttendance } from '../models/events.models';
import { AppMessageCode } from '../constants/app-message-code.enum';
import { UserService } from './user.service';
import { UserFeesService } from './user-fees.service';
import { ErrorHandlerService } from './error-handler.service';

/**
 * @class EventsService
 * @description Servicio core de nivel de infraestructura encargado de la gestión, publicación, 
 * control de aforos de la agenda de eventos y orquestación de subcolecciones de asistencia.
 */
@Injectable({
  providedIn: 'root'
})
export class EventsService {

  /** @description Instancia inyectada del SDK de Firestore registrado en App. @private */
  private firestore = inject(Firestore);

  /** @description Instancia inyectada del inyector de entorno de Angular para contextos reactivos. @private */
  private injector = inject(EnvironmentInjector);

  /** @description Instancia inyectada del servicio maestro de usuarios. @private */
  private userService = inject(UserService);

  /** @description Instancia inyectada del satélite financiero de control de cuotas. @private */
  private userFeesService = inject(UserFeesService);

  /** @description Instancia inyectada del gestor centralizado de errores. @private */
  private errorHandler = inject(ErrorHandlerService);

  /**
   * @method normalizarFechaObtenida
   * @description Convierte de forma segura los Timestamps de Firestore a cadenas ISO legibles por los componentes.
   * @private
   */
  private normalizarFechaObtenida(fecha: any, campo: string, eventId: string): string {
    if (!fecha) {
      return '';
    }

    if (typeof fecha.toDate === 'function') {
      return fecha.toDate().toISOString();
    }

    if (fecha.seconds !== undefined) {
      return new Date(fecha.seconds * 1000).toISOString();
    }

    return fecha.toString();
  }

  /**
   * @method getEventsStream
   * @description Obtiene el stream de eventos en tiempo real garantizando el contexto de inyección de Angular.
   */
  public getEventsStream(): Observable<AppEvent[]> {
    return new Observable<AppEvent[]>((observer) => {
      let unsubscribe: (() => void) | undefined;

      runInInjectionContext(this.injector, () => {
        const eventsRef = collection(this.firestore, 'events');

        unsubscribe = onSnapshot(
          eventsRef,
          (snapshot) => {
            const events: AppEvent[] = snapshot.docs.map((docSnap) => {
              const e = docSnap.data();
              return {
                ...e,
                id: docSnap.id,
                startDate: this.normalizarFechaObtenida(e['startDate'], 'startDate', docSnap.id),
                endDate: e['endDate'] ? this.normalizarFechaObtenida(e['endDate'], 'endDate', docSnap.id) : ''
              } as AppEvent;
            });
            observer.next(events);
          },
          async (error) => {
            await this.errorHandler.handle(error, AppMessageCode.ADC_EVENT_ERR_0005);
            observer.error(error);
          }
        );
      });

      return () => {
        if (unsubscribe) unsubscribe();
      };
    });
  }

  /**
   * @method obtenerPasesActivosLive
   * @description Escucha en tiempo real la subcolección de pases emitidos vinculados a un usuario.
   */
  public obtenerPasesActivosLive(userUid: string): Observable<any[]> {
    return new Observable<any[]>((observer) => {
      let unsubscribe: (() => void) | undefined;

      runInInjectionContext(this.injector, () => {
        const fairAccessRef = collection(this.firestore, 'event-access');
        const q = query(fairAccessRef, where('userId', '==', userUid));

        unsubscribe = onSnapshot(
          q,
          (snapshot) => {
            const passes = snapshot.docs.map((docSnap) => ({
              id: docSnap.id,
              ...docSnap.data()
            }));
            observer.next(passes);
          },
          async (error) => {
            await this.errorHandler.handle(error, AppMessageCode.ADC_PASS_ERR_0004);
            observer.error(error);
          }
        );
      });

      return () => {
        if (unsubscribe) unsubscribe();
      };
    });
  }

  /**
   * @method getEvents
   * @description Descarga mediante snapshot directo a un solo golpe la colección completa de eventos del servidor.
   */
  public getEvents(): Observable<AppEvent[]> {
    return runInInjectionContext(this.injector, () => {
      const eventsRef = collection(this.firestore, 'events');

      const promesaSnapshot = getDocs(eventsRef)
        .then(snapshot => {
          return snapshot.docs.map(docSnap => {
            const e = docSnap.data();
            return {
              ...e,
              id: docSnap.id,
              startDate: this.normalizarFechaObtenida(e['startDate'], 'startDate', docSnap.id),
              endDate: e['endDate'] ? this.normalizarFechaObtenida(e['endDate'], 'endDate', docSnap.id) : ''
            } as AppEvent;
          });
        })
        .catch(async err => {
          await this.errorHandler.handle(err, AppMessageCode.ADC_EVENT_ERR_0005);
          throw err;
        });

      return from(promesaSnapshot) as Observable<AppEvent[]>;
    });
  }

  /**
   * @method getEventById
   * @description Recupera los datos de una convocatoria específica mediante Snapshot estático (getDoc).
   */
  public getEventById(eventId: string): Observable<AppEvent> {
    return runInInjectionContext(this.injector, () => {
      const eventRef = doc(this.firestore, `events/${eventId}`);

      const promesaDocumento = getDoc(eventRef)
        .then(docSnap => {
          if (!docSnap.exists()) return null;

          const e = docSnap.data();
          return {
            ...e,
            id: docSnap.id,
            startDate: this.normalizarFechaObtenida(e['startDate'], 'startDate', docSnap.id),
            endDate: e['endDate'] ? this.normalizarFechaObtenida(e['endDate'], 'endDate', docSnap.id) : ''
          } as AppEvent;
        })
        .catch(async err => {
          await this.errorHandler.handle(err, AppMessageCode.ADC_EVENT_ERR_0005);
          throw err;
        });

      return from(promesaDocumento) as Observable<AppEvent>;
    });
  }

  /**
   * @method getUserAttendanceForEvent
   * @description Recupera el documento de confirmación individual de asistencia de un socio mediante getDoc.
   */
  public getUserAttendanceForEvent(eventId: string, userId: string): Observable<EventAttendance | undefined> {
    return runInInjectionContext(this.injector, () => {
      const attendanceRef = doc(this.firestore, `events/${eventId}/attendance/${userId}`);

      const promesaAsistencia = getDoc(attendanceRef)
        .then(docSnap => {
          if (docSnap.exists()) return docSnap.data() as EventAttendance;
          return undefined;
        })
        .catch(async err => {
          await this.errorHandler.handle(err, AppMessageCode.ADC_EVENT_ERR_0002);
          throw err;
        });

      return from(promesaAsistencia) as Observable<EventAttendance | undefined>;
    });
  }

  /**
   * @method registerAttendance
   * @description Registra la asistencia del socio de forma transaccional.
   */
  public async registerAttendance(eventId: string, userId: string, confirmarAsistencia: boolean): Promise<void> {
    return runInInjectionContext(this.injector, async () => {
      const eventRef = doc(this.firestore, `events/${eventId}`);
      const attendanceRef = doc(this.firestore, `events/${eventId}/attendance/${userId}`);
      const paseId = `${userId}_${eventId}`;
      const fairAccessRef = doc(this.firestore, `event-access/${paseId}`);

      try {
        await runTransaction(this.firestore, async (transaction) => {
          const eventSnap = await transaction.get(eventRef);
          if (!eventSnap.exists()) {
            throw new Error(AppMessageCode.ADC_EVENT_ERR_0010);
          }

          const eventData = eventSnap.data();
          const requiereControl = eventData['requiresAccessControl'] === true;
          const esAllDay = eventData['allDay'] === true;

          const aforoActual = eventData['attendeeCount'] || 0;
          const capacidadMaxima = eventData['maxCapacity'] || 0;

          if (confirmarAsistencia) {
            if (capacidadMaxima > 0 && aforoActual >= capacidadMaxima) {
              throw new Error(AppMessageCode.ADC_EVENT_ERR_0008);
            }

            transaction.set(attendanceRef, {
              userId: userId,
              eventId: eventId,
              status: 'going',
              registeredAt: new Date().toISOString(),
              companions: 0
            });

            transaction.update(eventRef, {
              attendeeCount: aforoActual + 1
            });

            if (requiereControl) {
              const fechaInicioBase = eventData['startDate']
                ? this.normalizarFechaObtenida(eventData['startDate'], 'startDate', eventId)
                : new Date().toISOString();

              let fechaFinCalculada = eventData['endDate']
                ? this.normalizarFechaObtenida(eventData['endDate'], 'endDate', eventId)
                : fechaInicioBase;

              if (esAllDay && fechaInicioBase) {
                const soloFecha = fechaInicioBase.split('T')[0];
                fechaFinCalculada = `${soloFecha}T23:59:59.999Z`;
              }

              transaction.set(fairAccessRef, {
                id: paseId,
                userId: userId,
                eventId: eventId,
                dateStart: fechaInicioBase,
                dateEnd: fechaFinCalculada,
                date: fechaInicioBase.split('T')[0],
                generatedAt: new Date().toISOString(),
                status: 'active',
                scans: []
              });
            }
          } else {
            const nuevoAforoRestado = aforoActual > 0 ? aforoActual - 1 : 0;

            transaction.delete(attendanceRef);
            transaction.update(eventRef, {
              attendeeCount: nuevoAforoRestado
            });

            if (requiereControl) {
              transaction.delete(fairAccessRef);
            }
          }
        });
      } catch (error: any) {
        await this.errorHandler.handle(error, AppMessageCode.ADC_EVENT_ERR_0002);
        throw error;
      }
    });
  }

  /**
   * @method createEvent
   * @description Persiste un nuevo documento estructural de evento en la colección principal `/events`.
   */
  public async createEvent(eventData: Partial<AppEvent>): Promise<string> {
    try {
      const newEventRef = doc(collection(this.firestore, 'events'));
      const eventId = newEventRef.id;

      const cleanPayload: any = {
        ...eventData,
        id: eventId,
        attendeeCount: 0,
        startDate: eventData.startDate ? new Date(eventData.startDate) : new Date()
      };

      if (eventData.endDate) {
        cleanPayload.endDate = new Date(eventData.endDate);
      }

      await setDoc(newEventRef, cleanPayload);
      return eventId;
    } catch (error) {
      await this.errorHandler.handle(error, AppMessageCode.ADC_EVENT_ERR_0001);
      throw error;
    }
  }

  /**
   * @method updateEvent
   * @description Modifica campos de texto e imagen de una convocatoria sin interferir en los contadores.
   */
  public async updateEvent(eventId: string, eventData: Partial<AppEvent>): Promise<void> {
    try {
      const eventRef = doc(this.firestore, `events/${eventId}`);
      const { id, attendeeCount, ...cleanData } = eventData;

      const finalPayload: any = { ...cleanData };
      if (eventData.startDate) finalPayload.startDate = new Date(eventData.startDate);
      if (eventData.endDate) finalPayload.endDate = new Date(eventData.endDate);

      await updateDoc(eventRef, finalPayload);
    } catch (error) {
      await this.errorHandler.handle(error, AppMessageCode.ADC_EVENT_ERR_0001);
      throw error;
    }
  }

  /**
   * @method deleteEvent
   * @description Elimina físicamente en cascada el evento, sus sub-asistencias y credenciales feriales emitidas.
   */
  public async deleteEvent(event: AppEvent): Promise<void> {
    try {
      if (!event.id) {
        throw new Error(AppMessageCode.ADC_EVENT_ERR_0011);
      }
      const eventId = event.id;

      const fairAccessRef = collection(this.firestore, 'event-access');
      const qPases = query(fairAccessRef, where('eventId', '==', eventId));
      const snapshotPases = await getDocs(qPases);
      const promesasPases = snapshotPases.docs.map(docSnap => deleteDoc(docSnap.ref));
      await Promise.all(promesasPases);

      const attendanceRef = collection(this.firestore, `events/${eventId}/attendance`);
      const snapshotAsistencia = await getDocs(attendanceRef);
      const promesasAsistencia = snapshotAsistencia.docs.map(docSnap => deleteDoc(docSnap.ref));
      await Promise.all(promesasAsistencia);

      const eventRef = doc(this.firestore, `events/${eventId}`);
      await deleteDoc(eventRef);
    } catch (error) {
      await this.errorHandler.handle(error, AppMessageCode.ADC_EVENT_ERR_0003);
      throw error;
    }
  }

  /**
   * @method getEventLive
   * @description Inicializa un socket onSnapshot en tiempo real para sincronizar variaciones asíncronas de aforo.
   */
  public getEventLive(eventId: string): Observable<AppEvent> {
    return new Observable<AppEvent>((observer) => {
      let unsubscribe: (() => void) | undefined;

      runInInjectionContext(this.injector, () => {
        const eventRef = doc(this.firestore, `events/${eventId}`);

        unsubscribe = onSnapshot(
          eventRef,
          (docSnap) => {
            if (docSnap.exists()) {
              const e = docSnap.data();
              observer.next({
                ...e,
                id: docSnap.id,
                startDate: this.normalizarFechaObtenida(e['startDate'], 'startDate', docSnap.id),
                endDate: e['endDate'] ? this.normalizarFechaObtenida(e['endDate'], 'endDate', docSnap.id) : ''
              } as AppEvent);
            }
          },
          async (error) => {
            await this.errorHandler.handle(error, AppMessageCode.ADC_EVENT_ERR_0005);
            observer.error(error);
          }
        );
      });

      return () => {
        if (unsubscribe) unsubscribe();
      };
    });
  }
}