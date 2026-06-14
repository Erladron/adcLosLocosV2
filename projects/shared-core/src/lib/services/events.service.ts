import { Injectable, inject, EnvironmentInjector, runInInjectionContext } from '@angular/core';
import { 
  Firestore, 
  collection, 
  collectionData, 
  doc, 
  docData, 
  setDoc,
  updateDoc, 
  deleteDoc,
  runTransaction 
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AppEvent, EventAttendance } from '../models/events.models';
import { AppMessageCode } from '../constants/app-message-code.enum';

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  private firestore = inject(Firestore);
  private injector = inject(EnvironmentInjector);

  getEvents(): Observable<AppEvent[]> {
    return runInInjectionContext(this.injector, () => {
      const eventsRef = collection(this.firestore, 'events');
      return collectionData(eventsRef, { idField: 'id' }) as Observable<AppEvent[]>;
    });
  }

  getEventById(eventId: string): Observable<AppEvent> {
    return runInInjectionContext(this.injector, () => {
      const eventRef = doc(this.firestore, `events/${eventId}`);
      return docData(eventRef, { idField: 'id' }) as Observable<AppEvent>;
    });
  }

  getUserAttendanceForEvent(eventId: string, userId: string): Observable<EventAttendance | undefined> {
    return runInInjectionContext(this.injector, () => {
      const attendanceRef = doc(this.firestore, `events/${eventId}/attendance/${userId}`);
      return docData(attendanceRef, { idField: 'id' }) as Observable<EventAttendance | undefined>;
    });
  }

  registerAttendance(eventId: string, userId: string, isAttending: boolean): Promise<void> {
    const eventRef = doc(this.firestore, `events/${eventId}`);
    const attendanceRef = doc(this.firestore, `events/${eventId}/attendance/${userId}`);

    return runInInjectionContext(this.injector, () => {
      return runTransaction(this.firestore, async (transaction) => {
        const eventSnap = await transaction.get(eventRef);
        const attendanceSnap = await transaction.get(attendanceRef);

        if (!eventSnap.exists()) {
          throw new Error(AppMessageCode.ADC_EVENT_ERR_0004);
        }

        const eventData = eventSnap.data() as AppEvent;
        const currentAttendance = attendanceSnap.exists() ? (attendanceSnap.data() as EventAttendance) : null;
        
        const previousStatus = currentAttendance ? currentAttendance.status : null;
        const targetStatus = isAttending ? 'going' : 'not_going';

        if (previousStatus === targetStatus) {
          return;
        }

        let newAttendeeCount = eventData.attendeeCount || 0;

        if (isAttending) {
          if (eventData.maxAttendees && newAttendeeCount >= eventData.maxAttendees) {
            throw new Error(AppMessageCode.ADC_EVENT_ERR_0008); 
          }
          if (previousStatus !== 'going') {
            newAttendeeCount += 1;
          }
          transaction.set(attendanceRef, {
            eventId,
            userId,
            status: 'going',
            companions: 0,
            registeredAt: new Date().toISOString()
          }, { merge: true });

        } else {
          if (previousStatus === 'going') {
            newAttendeeCount = Math.max(0, newAttendeeCount - 1);
          }
          transaction.set(attendanceRef, {
            eventId,
            userId,
            status: 'not_going',
            companions: 0,
            registeredAt: new Date().toISOString()
          }, { merge: true });
        }

        transaction.update(eventRef, { attendeeCount: newAttendeeCount });
      });
    });
  }

  /**
   * 📅 CREAR CONVOCATORIA LIMPIA
   * Optimizado con setDoc para generar el ID en el cliente y realizar una sola escritura en Firestore.
   */
  async createEvent(eventData: Partial<AppEvent>): Promise<string> {
    // Generamos una referencia limpia para obtener un ID único de forma síncrona
    const newEventRef = doc(collection(this.firestore, 'events'));
    const eventId = newEventRef.id;

    // Guardamos los datos limpios de la convocatoria en un solo impacto de red
    const cleanPayload: Partial<AppEvent> = {
      ...eventData,
      id: eventId,
      attendeeCount: 0
    };

    await setDoc(newEventRef, cleanPayload);
    return eventId;
  }

  /**
   * ⚠️ MODIFICAR CONVOCATORIA LIMPIA
   * Actualiza única y exclusivamente los datos estructurales del formulario.
   */
  async updateEvent(eventId: string, eventData: Partial<AppEvent>): Promise<void> {
    const eventRef = doc(this.firestore, `events/${eventId}`);
    
    // Purga total de campos de trigger externos: la app solo actualiza la información civil del evento
    const { id, attendeeCount, ...cleanData } = eventData;

    await updateDoc(eventRef, cleanData);
  }

  /**
   * 🛑 ELIMINAR CONVOCATORIA FÍSICA DIRECTA
   * La aplicación móvil destruye el documento de inmediato. 
   * El servidor en la nube (Cloud Function) reaccionará de forma reactiva al borrado.
   */
  async deleteEvent(event: AppEvent): Promise<void> {
    if (!event.id) {
      throw new Error('No se puede eliminar un evento sin un identificador válido.');
    }

    const eventRef = doc(this.firestore, `events/${event.id}`);

    return runInInjectionContext(this.injector, () => {
      return deleteDoc(eventRef);
    });
  }
}