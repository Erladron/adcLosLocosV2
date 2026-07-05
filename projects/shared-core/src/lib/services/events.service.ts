import { Injectable, inject, EnvironmentInjector, runInInjectionContext } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  onSnapshot,
  setDoc,
  updateDoc,
  orderBy
} from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { AppEvent, EventAttendance } from '../models/events.models';
import { AppMessageCode } from '../constants/app-message-code.enum';
import { UserService } from './user.service';
import { UserFeesService } from './user-fees.service';

/**
 * @class EventsService
 * @description Servicio core de nivel de infraestructura encargado de la gestión, publicación, 
 * control de aforos de la agenda de eventos y orquestación de subcolecciones de asistencia.
 */
@Injectable({
  providedIn: 'root'
})
export class EventsService {

  /** @description Instancia inyectada del SDK modular de Cloud Firestore. @private */
  private firestore = inject(Firestore);

  /** @description Instancia inyectada del inyector de entorno de Angular para contextos reactivos. @private */
  private injector = inject(EnvironmentInjector);

  /** @description Instancia inyectada del servicio maestro de usuarios. @private */
  private userService = inject(UserService);

  /** @description Instancia inyectada del satélite financiero de control de cuotas. @private */
  private userFeesService = inject(UserFeesService);

  /**
   * @method normalizarFechaObtenida
   * @description Convierte de forma segura los Timestamps de Firestore a cadenas ISO legibles por los pipes de Angular.
   * @private
   */
  private normalizarFechaObtenida(fecha: any, campo: string, eventId: string): string {
    if (!fecha) {
      console.log(`⚠️ [FECHAS] El campo [${campo}] del evento [${eventId}] está vacío.`);
      return '';
    }

    if (typeof fecha.toDate === 'function') {
      const fechaConvertida = fecha.toDate().toISOString();
      return fechaConvertida;
    }

    return fecha.toString();
  }

  /**
   * @method obtenerPasesActivosLive
   * @description Escucha en tiempo real la subcolección de pases emitidos vinculados a un usuario.
   */
  public obtenerPasesActivosLive(userUid: string): Observable<any[]> {
    return runInInjectionContext(this.injector, () => {
      const fairAccessRef = collection(this.firestore, 'fair-access');
      const q = query(fairAccessRef, where('userId', '==', userUid));
      return collectionData(q, { idField: 'id' });
    });
  }

  /**
   * @method getEvents
   * @description Descarga mediante snapshot directo a un solo golpe la colección completa de eventos del servidor.
   */
  public getEvents(): Observable<AppEvent[]> {
    return runInInjectionContext(this.injector, () => {
      const eventsRef = collection(this.firestore, 'events');

      const promesaSnapshot = getDocs(eventsRef).then(snapshot => {
        return snapshot.docs.map(docSnap => {
          const e = docSnap.data();
          return {
            ...e,
            id: docSnap.id,
            startDate: this.normalizarFechaObtenida(e['startDate'], 'startDate', docSnap.id),
            endDate: e['endDate'] ? this.normalizarFechaObtenida(e['endDate'], 'endDate', docSnap.id) : ''
          } as AppEvent;
        });
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

      const promesaDocumento = getDoc(eventRef).then(docSnap => {
        if (!docSnap.exists()) return null;

        const e = docSnap.data();
        return {
          ...e,
          id: docSnap.id,
          startDate: this.normalizarFechaObtenida(e['startDate'], 'startDate', docSnap.id),
          endDate: e['endDate'] ? this.normalizarFechaObtenida(e['endDate'], 'endDate', docSnap.id) : ''
        } as AppEvent;
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

      const promesaAsistencia = getDoc(attendanceRef).then(docSnap => {
        if (docSnap.exists()) return docSnap.data() as EventAttendance;
        return undefined;
      });

      return from(promesaAsistencia) as Observable<EventAttendance | undefined>;
    });
  }

  /**
   * @method registerAttendance
   * @description 🚀 OPTIMIZACIÓN DE INTEGRIDAD DE NO-REDUNDANCIA: Registra la asistencia del socio de forma transaccional.
   * Al emitir el pase digital en `fair-access`, se eliminan por completo los campos duplicados 'eventTitle' y 'locationName'.
   * Esto garantiza de forma absoluta que si la junta edita los datos de la convocatoria, las credenciales QR del socio 
   * no queden desactualizadas, resolviéndose en caliente en las vistas gracias al ID relacional.
   * @param {string} eventId ID único del evento en Firestore.
   * @param {string} userId UID del socio o directivo operador.
   * @param {boolean} confirmarAsistencia True si confirma ("Asistiré"), False si revoca plaza ("No iré").
   * @returns {Promise<void>}
   */
  public async registerAttendance(eventId: string, userId: string, confirmarAsistencia: boolean): Promise<void> {
    const { runTransaction, doc, increment } = await import('@angular/fire/firestore');

    return runInInjectionContext(this.injector, async () => {
      const eventRef = doc(this.firestore, `events/${eventId}`);
      const attendanceRef = doc(this.firestore, `events/${eventId}/attendance/${userId}`);
      const paseId = `${userId}_${eventId}`;
      const fairAccessRef = doc(this.firestore, `fair-access/${paseId}`);

      try {
        await runTransaction(this.firestore, async (transaction) => {
          const eventSnap = await transaction.get(eventRef);
          if (!eventSnap.exists()) throw new Error('No se puede gestionar la asistencia de un evento inexistente.');

          const eventData = eventSnap.data();
          const requiereControl = eventData['requiresAccessControl'] === true;
          const esAllDay = eventData['allDay'] === true;

          const aforoActual = eventData['attendeeCount'] || 0;
          const capacidadMaxima = eventData['maxCapacity'] || 0;

          if (confirmarAsistencia) {
            if (capacidadMaxima > 0 && aforoActual >= capacidadMaxima) {
              throw new Error('¡Vaya! Acaban de agotarse las plazas para este evento en este preciso instante.');
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

              // 🚀 SANEADO: Se purgan las cadenas estáticas estancadas manteniendo la integridad pura
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
        throw error;
      }
    });
  }

  /**
   * @method createEvent
   * @description Persiste un nuevo documento estructural de evento en la colección principal `/events`.
   */
  public async createEvent(eventData: Partial<AppEvent>): Promise<string> {
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
  }

  /**
   * @method updateEvent
   * @description Modifica campos de texto e imagen de una convocatoria sin interferir en los contadores.
   */
  public async updateEvent(eventId: string, eventData: Partial<AppEvent>): Promise<void> {
    const eventRef = doc(this.firestore, `events/${eventId}`);
    const { id, attendeeCount, ...cleanData } = eventData;

    const finalPayload: any = { ...cleanData };
    if (eventData.startDate) finalPayload.startDate = new Date(eventData.startDate);
    if (eventData.endDate) finalPayload.endDate = new Date(eventData.endDate);

    await updateDoc(eventRef, finalPayload);
  }

  /**
   * @method deleteEvent
   * @description Elimina físicamente en cascada el evento, sus sub-asistencias y credenciales feriales emitidas.
   */
  public async deleteEvent(event: AppEvent): Promise<void> {
    if (!event.id) throw new Error('No se puede eliminar un evento sin un identificador válido.');
    const eventId = event.id;

    const fairAccessRef = collection(this.firestore, 'fair-access');
    const qPases = query(fairAccessRef, where('eventId', '==', eventId));
    const snapshotPases = await getDocs(qPases);
    const promesasPases = snapshotPases.docs.map(docSnap => deleteDoc(docSnap.ref));
    await Promise.all(promesasPases);

    const attendanceRef = collection(this.firestore, `events/${eventId}/attendance`);
    const snapshotAsistencia = await getDocs(attendanceRef);
    const promesasAsistencia = snapshotAsistencia.docs.map(docSnap => deleteDoc(docSnap.ref));
    await Promise.all(promesasAsistencia);

    const eventRef = doc(this.firestore, `events/${eventId}`);
    return runInInjectionContext(this.injector, () => {
      return deleteDoc(eventRef);
    });
  }

  /**
   * @method getEventLive
   * @description Inicializa un socket onSnapshot en tiempo real para sincronizar variaciones asíncronas de aforo.
   */
  public getEventLive(eventId: string): Observable<AppEvent> {
    const eventRef = doc(this.firestore, `events/${eventId}`);

    return new Observable<AppEvent>((observer) => {
      const unsubscribe = onSnapshot(eventRef, (docSnap) => {
        if (docSnap.exists()) {
          const e = docSnap.data();
          observer.next({
            ...e,
            id: docSnap.id,
            startDate: this.normalizarFechaObtenida(e['startDate'], 'startDate', docSnap.id),
            endDate: e['endDate'] ? this.normalizarFechaObtenida(e['endDate'], 'endDate', docSnap.id) : ''
          } as AppEvent);
        }
      }, (error) => observer.error(error));

      return () => unsubscribe();
    });
  }

  /**
 * @method getEventsStream
 * @description Crea un canal de escucha en tiempo real (onSnapshot) sobre la colección de eventos.
 * Cualquier cambio en los aforos se transmitirá instantáneamente a todos los dispositivos activos.
 * @returns {Observable<EventData[]>} Flujo reactivo con el array de eventos actualizado.
 */
public getEventsStream(): Observable<any[]> {
  return new Observable((subscriber) => {
    const eventsRef = collection(this.firestore, 'events');
    // Si usas algún orden lógico (ej: por fecha), añádelo aquí en el query
    const q = query(eventsRef, orderBy('date', 'asc')); 

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const events = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        subscriber.next(events);
      },
      (error) => {
        console.error('💥 [EventsService] Error en stream de eventos:', error);
        subscriber.error(error);
      }
    );

    // Salvoconducto de limpieza: Cuando el componente se destruya, matamos el socket automáticamente
    return () => unsubscribe();
  });
}
}