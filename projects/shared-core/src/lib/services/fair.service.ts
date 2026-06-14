import { Injectable, inject } from '@angular/core';
import { 
  Firestore, 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  query, 
  where, 
  arrayUnion,
  limit 
} from '@angular/fire/firestore';

import { FairAccess, AppEvent, EventType } from '../models/events.models';
import { User } from '../models/users.models';
import { UserStatus } from '../models/user-status.enum';
import { UserRole } from '../models/user-role.enum';

// Mecanismo de mensajería, avisos y control de errores nativo de la arquitectura corporativa
import { ErrorHandlerService } from './error-handler.service'; 
import { NotificationService } from './notification.service'; 
import { AppMessageCode } from '../constants/app-message-code.enum';
import { APP_MESSAGES } from '../constants/app-messages';

@Injectable({
  providedIn: 'root'
})
export class FairService {
  private firestore = inject(Firestore);
  private errorHandler = inject(ErrorHandlerService); 
  private notification = inject(NotificationService); 

  private readonly COLLECTION_NAME = 'fair-access';

  async obtenerPaseDiarioUsuario(userId: string, date: string): Promise<FairAccess | null> {
    try {
      const accessRef = collection(this.firestore, this.COLLECTION_NAME);
      const qAccesos = query(accessRef, where('userId', '==', userId), where('date', '==', date));
      const querySnapshot = await getDocs(qAccesos);

      if (querySnapshot.empty) return null;

      const docSnap = querySnapshot.docs[0];
      return { id: docSnap.id, ...docSnap.data() } as FairAccess;
    } catch (error: any) {
      this.errorHandler.handle(error);
      return null;
    }
  }

  async contarInvitacionesDelDia(socioId: string, fecha: string): Promise<number> {
    try {
      const accessRef = collection(this.firestore, this.COLLECTION_NAME);
      const q = query(accessRef, where('hostId', '==', socioId), where('date', '==', fecha));
      const snapshot = await getDocs(q);
      return snapshot.size;
    } catch (error: any) {
      this.errorHandler.handle(error);
      throw error; 
    }
  }

  async crearInvitacion(socio: User, invitado: User, fecha: string): Promise<FairAccess> {
    const totalInvitacionesHoy = await this.contarInvitacionesDelDia(socio.id, fecha);
    
    if (totalInvitacionesHoy >= 6) {
      throw new Error(APP_MESSAGES[AppMessageCode.ADC_FAIR_ERR_0001]);
    }

    try {
      const nuevoId = crypto.randomUUID();
      const paseRef = doc(this.firestore, this.COLLECTION_NAME, nuevoId);

      const nuevaInvitacion: FairAccess = {
        id: nuevoId,
        userId: invitado.id!,
        userName: `${invitado.nombre}`,
        userType: invitado.tipo || UserRole.INVITADO,
        hostId: socio.id,
        invitedByName: socio.nombre,
        date: fecha,
        createdAt: new Date().toISOString(),
        scans: [] 
      };

      await setDoc(paseRef, nuevaInvitacion);
      return nuevaInvitacion;
    } catch (error: any) {
      this.errorHandler.handle(error);
      throw error;
    }
  }

  // ===========================================================================
  // 🚀 PROCESADOR DE ACCESOS DE SÓLO LECTURA (Enfoque de seguridad del Portero)
  // ===========================================================================
  async registrarEscaneoPortero(rawPayload: string, porteroUid: string): Promise<void> {
    try {
      let finalPaseId = rawPayload;

      // 🛡️ TRADUCCIÓN DEL QR DEL SOCIO O DIRECTIVA
      if (rawPayload.startsWith('SOCIO:')) {
        const partes = rawPayload.split(':');
        const socioUid = partes[1];
        const fechaPase = partes[2];

        // Buscamos el pase único de temporada que el Login del socio le pregeneró
        const paseExistente = await this.obtenerPaseDiarioUsuario(socioUid, fechaPase);

        if (paseExistente && paseExistente.id) {
          finalPaseId = paseExistente.id;
        } else {
          throw new Error(APP_MESSAGES[AppMessageCode.ADC_FAIR_ERR_0007]);
        }
      }

      // 🛡️ VALIDACIÓN DEL PASAPORTE EN LA BASE DE DATOS
      const paseRef = doc(this.firestore, this.COLLECTION_NAME, finalPaseId);
      const paseSnap = await getDoc(paseRef);
      
      if (!paseSnap.exists()) {
        throw new Error(APP_MESSAGES[AppMessageCode.ADC_FAIR_ERR_0002]);
      }

      const datosPase = paseSnap.data() as FairAccess;
      const hoyFormateado = new Date().toISOString().split('T')[0];

      // 🛡️ CONTROL INTELIGENTE DE VIGENCIA SEGÚN EL ROL
      if (datosPase.userType === UserRole.SOCIO || datosPase.userType === UserRole.DIRECTIVA) {
        // Regla para Socios: Verificamos si hoy sigue habiendo un evento ferial activo
        const eventsRef = collection(this.firestore, 'events');
        const qFeria = query(
          eventsRef,
          where('type', '==', EventType.FERIA),
          where('status', '==', 'published')
        );
        const queryEvents = await getDocs(qFeria);
        let feriaVigenteHoy = false;

        queryEvents.forEach(docSnap => {
          const ev = docSnap.data() as AppEvent;
          if (ev.startDate && ev.endDate) {
            const inicio = ev.startDate.split('T')[0];
            const fin = ev.endDate.split('T')[0];
            if (hoyFormateado >= inicio && hoyFormateado <= fin) {
              feriaVigenteHoy = true;
            }
          }
        });

        if (!feriaVigenteHoy) {
          throw new Error(APP_MESSAGES[AppMessageCode.ADC_FAIR_ERR_0003]);
        }
      } else {
        // Regla para Invitados: El pase debe expirar el mismo día de su emisión plano estricto
        if (datosPase.date !== hoyFormateado) {
          throw new Error(APP_MESSAGES[AppMessageCode.ADC_FAIR_ERR_0003]);
        }
      }

      // Si supera todas las capas, el portero escribe el registro de entrada/salida
      await updateDoc(paseRef, {
        scans: arrayUnion({
          scannedAt: new Date().toISOString(),
          gatekeeperUid: porteroUid
        })
      });

    } catch (error: any) {
      if (!(error instanceof Error) || 
         (!error.message.includes(APP_MESSAGES[AppMessageCode.ADC_FAIR_ERR_0001]) &&
          !error.message.includes(APP_MESSAGES[AppMessageCode.ADC_FAIR_ERR_0002]) &&  
          !error.message.includes(APP_MESSAGES[AppMessageCode.ADC_FAIR_ERR_0003]) &&
          !error.message.includes(APP_MESSAGES[AppMessageCode.ADC_FAIR_ERR_0007]))) {
        this.errorHandler.handle(error);
      }
      throw error;
    }
  }

  // ===========================================================================
  // 🚀 INYECTOR SILENCIOSO PARA EL LOGIN DEL SOCIO (Elegante y sin errores falsos)
  // ===========================================================================
  async verificarYGenerarPaseSocioLogueado(usuarioActivo: User): Promise<void> {
    if (!usuarioActivo.id || usuarioActivo.estado !== UserStatus.ACTIVE) return;
    if (usuarioActivo.tipo !== UserRole.SOCIO && usuarioActivo.tipo !== UserRole.DIRECTIVA) return;

    const hoyFormateado = new Date().toISOString().split('T')[0];

    try {
      const eventsRef = collection(this.firestore, 'events');
      const qFeria = query(
        eventsRef,
        where('type', '==', EventType.FERIA),
        where('status', '==', 'published')
      );

      const queryEvents = await getDocs(qFeria);
      let hayFeriaHoy = false;
      let identificadorTemporada = '';

      queryEvents.forEach(docSnap => {
        const ev = docSnap.data() as AppEvent;
        
        if (ev.startDate && ev.endDate) {
          const fechaInicioPlana = ev.startDate.split('T')[0];
          const fechaFinPlana = ev.endDate.split('T')[0];

          if (hoyFormateado >= fechaInicioPlana && hoyFormateado <= fechaFinPlana) {
            hayFeriaHoy = true;
            const anyo = fechaInicioPlana.split('-')[0];
            identificadorTemporada = `FERIA-${anyo}`;
          }
        }
      });

      if (!hayFeriaHoy || !identificadorTemporada) return;

      const paseExistente = await this.obtenerPaseDiarioUsuario(usuarioActivo.id, identificadorTemporada);

      if (!paseExistente) {
        const nuevoPaseRef = doc(this.firestore, this.COLLECTION_NAME, usuarioActivo.id);
        
        const nuevoPaseSocio: FairAccess = {
          id: usuarioActivo.id,
          userId: usuarioActivo.id,
          userName: usuarioActivo.nombre || 'Socio Oficial',
          userType: usuarioActivo.tipo,
          hostId: usuarioActivo.id,
          invitedByName: usuarioActivo.nombre,
          date: identificadorTemporada,
          createdAt: new Date().toISOString(),
          scans: []
        };

        await setDoc(nuevoPaseRef, nuevoPaseSocio);
        
        this.notification.success(APP_MESSAGES[AppMessageCode.ADC_FAIR_INF_0003]);
        console.log(`🎯 Credencial Ferial Multijornada [${identificadorTemporada}] generada para: ${usuarioActivo.nombre}`);
      }

    } catch (error) {
      console.error('Error en segundo plano gestionando pase automático de feria:', error);
    }
  }

  async obtenerEventoFeriaActivo(): Promise<AppEvent | null> {
    try {
      const hoyFormateado = new Date().toISOString().split('T')[0];
      const eventsRef = collection(this.firestore, 'events');
      const qFeria = query(eventsRef, where('type', '==', EventType.FERIA), where('status', '==', 'published'));
      const queryEvents = await getDocs(qFeria);
      
      let eventoFeria: AppEvent | null = null;
      queryEvents.forEach(docSnap => {
        const ev = docSnap.data() as AppEvent;
        if (ev.startDate && ev.endDate) {
          const inicio = ev.startDate.split('T')[0];
          const fin = ev.endDate.split('T')[0];
          if (hoyFormateado >= inicio && hoyFormateado <= fin) {
            eventoFeria = { id: docSnap.id, ...ev };
          }
        }
      });
      return eventoFeria;
    } catch (error) {
      this.errorHandler.handle(error);
      return null;
    }
  }

  async obtenerInvitadosDelSocio(socioId: string, fecha: string): Promise<FairAccess[]> {
    try {
      const accessRef = collection(this.firestore, this.COLLECTION_NAME);
      const q = query(accessRef, where('hostId', '==', socioId), where('date', '==', fecha));
      const snap = await getDocs(q);
      const invitados: FairAccess[] = [];
      snap.forEach(docSnap => {
        invitados.push({ id: docSnap.id, ...docSnap.data() } as FairAccess);
      });
      return invitados;
    } catch (error) {
      this.errorHandler.handle(error);
      return [];
    }
  }

  async obtenerCandidatosInvitadosDisponibles(currentUserId: string, fecha: string): Promise<User[]> {
    try {
      const accessRef = collection(this.firestore, this.COLLECTION_NAME);
      const qAccesos = query(accessRef, where('date', '==', fecha));
      const snapAccesos = await getDocs(qAccesos);
      const yaInvitadosIds: string[] = [];
      snapAccesos.forEach(docSnap => {
        yaInvitadosIds.push((docSnap.data() as FairAccess).userId);
      });

      const usersRef = collection(this.firestore, 'users');
      const qInvitadosValidos = query(usersRef, where('tipo', '==', UserRole.INVITADO));
      const querySnapshot = await getDocs(qInvitadosValidos);
      const candidatos: User[] = [];

      querySnapshot.forEach(docSnap => {
        const data = docSnap.data() as any;
        const esActivo = data.status === UserStatus.ACTIVE || data.estado === UserStatus.ACTIVE || data.status === UserStatus.PENDING_APPROVAL;
        const noTienePaseHoy = !yaInvitadosIds.includes(docSnap.id);
        
        if (docSnap.id !== currentUserId && esActivo && noTienePaseHoy) {
          candidatos.push({ id: docSnap.id, ...data } as User);
        }
      });
      return candidatos;
    } catch (error) {
      this.errorHandler.handle(error);
      return [];
    }
  }
}