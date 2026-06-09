import { Injectable, inject, EnvironmentInjector, runInInjectionContext } from '@angular/core';
import { 
  Firestore, 
  collection, 
  collectionData, 
  doc, 
  docData, 
  addDoc, 
  updateDoc, 
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

  async createEvent(eventData: Partial<AppEvent>): Promise<string> {
    const eventsRef = collection(this.firestore, 'events');
    const docRef = await addDoc(eventsRef, eventData);
    
    const triggerPayload = {
      _notificationTrigger: {
        tipoNotificacion: 'NUEVO_EVENTO',
        eventId: docRef.id,
        titulo: '📅 ¡Nueva Convocatoria!',
        descripcion: `Nuevo evento en ACD Los Locos: "${eventData.title}"`,
        destinatarios: eventData.isPrivate 
          ? ['admin', 'directiva', 'socio'] 
          : ['admin', 'directiva', 'socio', 'invitado'],
        timestamp: new Date().getTime()
      }
    };

    await updateDoc(docRef, triggerPayload);
    return docRef.id;
  }

  async updateEvent(eventId: string, eventData: Partial<AppEvent>): Promise<void> {
    const eventRef = doc(this.firestore, `events/${eventId}`);
    
    const dataWithTrigger = {
      ...eventData,
      _notificationTrigger: {
        tipoNotificacion: 'MODIFICACION_EVENTO',
        eventId: eventId,
        titulo: '⚠️ Cambio en el Evento',
        descripcion: `El evento "${eventData.title || 'Informativo'}" ha sufrido modificaciones por parte de la directiva.`,
        destinatarios: eventData.isPrivate 
          ? ['admin', 'directiva', 'socio'] 
          : ['admin', 'directiva', 'socio', 'invitado'],
        timestamp: new Date().getTime()
      }
    };

    await updateDoc(eventRef, dataWithTrigger);
  }

  /**
   * 🛑 ELIMINAR EVENTO CON ALERTA PUSH AUTOMÁTICA
   * En lugar de borrar el documento a capón, inyectamos la orden de eliminación. 
   * La Cloud Function enviará las notificaciones y luego destruirá el documento de forma segura.
   */
  async deleteEvent(event: AppEvent): Promise<void> {
    const eventRef = doc(this.firestore, `events/${event.id}`);

    const deletionTrigger = {
      _notificationTrigger: {
        tipoNotificacion: 'ELIMINACION_EVENTO',
        eventId: event.id,
        titulo: '🛑 Evento Cancelado',
        descripcion: `Atención: El evento "${event.title}" ha sido cancelado definitivamente por la directiva.`,
        destinatarios: event.isPrivate 
          ? ['admin', 'directiva', 'socio'] 
          : ['admin', 'directiva', 'socio', 'invitado'],
        timestamp: new Date().getTime()
      }
    };

    return runInInjectionContext(this.injector, () => {
      return updateDoc(eventRef, deletionTrigger);
    });
  }
}