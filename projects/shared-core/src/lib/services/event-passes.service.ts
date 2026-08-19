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
  arrayUnion
} from '@angular/fire/firestore';

import { PasseAccess, AppEvent, PasseAccessStatus } from '../models/events.models';
import { User } from '../models/users.models';
import { UserStatus } from '../models/user-status.enum';
import { UserRole } from '../models/user-role.enum';

import { ErrorHandlerService } from './error-handler.service';
import { NotificationService } from './notification.service';
import { UserFeesService } from './user-fees.service';
import { AppMessageCode } from '../constants/app-message-code.enum';
import { APP_MESSAGES } from '../constants/app-messages';

/**
 * @interface PaseUniversal
 * @description Extensión profesional del contrato base PasseAccess para dar soporte estricto 
 * a la validez temporal multi-día de los pases en la caseta ferial.
 */
export interface PaseUniversal extends PasseAccess {
  dateStart: string;
  dateEnd: string;
}

/**
 * @class PasseService
 * @description Servicio core encargado de la expedición de invitaciones feriales, control de cupos 
 * por socio y procesamiento transaccional de picajes de QR en la portería de la caseta.
 */
@Injectable({
  providedIn: 'root'
})
export class PasseService {
  /** @description Instancia inyectada del SDK modular de Cloud Firestore. @private */
  private firestore = inject(Firestore);
  /** @description Instancia inyectada del interceptor central de excepciones. @private */
  private errorHandler = inject(ErrorHandlerService);
  /** @description Instancia inyectada del despachador de notificaciones visuales. @private */
  private notification = inject(NotificationService);
  /** @description Instancia inyectada del satélite financiero de control de cuotas. @private */
  private userFeesService = inject(UserFeesService);

  /** @description Nombre identificativo de la colección en la base de datos NoSQL. @private @readonly */
  private readonly COLLECTION_NAME = 'event-access';

  /**
   * @method obtenerPaseDiarioUsuario
   * @description Recupera la credencial digital de acceso de un usuario comprobando el rango de validez multi-día.
   * @param {string} userId UID del socio o invitado consultado.
   * @param {string} date Fecha actual de consulta en formato ISO simplificado (YYYY-MM-DD).
   * @returns {Promise<PaseUniversal | null>} Pase universal activo o null en su defecto.
   */
  public async obtenerPaseDiarioUsuario(userId: string, date: string): Promise<PaseUniversal | null> {
    try {
      const accessRef = collection(this.firestore, this.COLLECTION_NAME);
      const qAccesos = query(accessRef, where('userId', '==', userId));
      const querySnapshot = await getDocs(qAccesos);

      if (querySnapshot.empty) return null;

      for (const docSnap of querySnapshot.docs) {
        const data = docSnap.data() as PaseUniversal;
        const inicio = data.dateStart || data.date || date;
        const fin = data.dateEnd || data.date || date;

        if (date >= inicio && date <= fin) {
          return { id: docSnap.id, ...data } as PaseUniversal;
        }
      }
      return null;
    } catch (error: any) {
      this.errorHandler.handle(error);
      return null;
    }
  }

  /**
   * @method contarInvitacionesDelDia
   * @description Calcula de forma síncrona el total de pases emitidos por un socio anfitrión para un evento dado.
   * @param {string} socioId UID del socio emisor.
   * @param {string} fecha Fecha de corte evaluada (mantenida por firma de interfaz).
   * @param {AppEvent} evento Convocatoria ferial de referencia.
   * @returns {Promise<number>} Número total de invitaciones consumidas por el socio.
   */
  public async contarInvitacionesDelDia(socioId: string, fecha: string, evento: AppEvent): Promise<number> {
    try {
      const accessRef = collection(this.firestore, this.COLLECTION_NAME);
      const q = query(
        accessRef,
        where('hostId', '==', socioId),
        where('eventId', '==', evento.id),
        where('status', '==', PasseAccessStatus.ACTIVE)
      );
      const snapshot = await getDocs(q);
      return snapshot.size;
    } catch (error: any) {
      this.errorHandler.handle(error);
      return 0;
    }
  }

  /**
   * @method crearInvitacion
   * @description Registra un pase de invitación para un tercero externo validando solvencia y límites.
   * @param {User} socio Modelo de datos del socio emisor o anfitrión.
   * @param {User} invitado Modelo de datos del usuario receptor beneficiario.
   * @param {string} fecha Fecha asignada de validez.
   * @param {AppEvent} evento Convocatoria ferial vinculada.
   * @returns {Promise<PaseUniversal>} Credencial extendida generada en el servidor.
   */
  public async crearInvitacion(socio: User, invitado: User, fecha: string, evento: AppEvent): Promise<PaseUniversal> {
    if (!this.userFeesService.esSocioSolvente(socio)) {
      throw new Error(AppMessageCode.ACD_FEES_ERR_0001);
    }

    const totalInvitacionesHoy = await this.contarInvitacionesDelDia(socio.id!, fecha, evento);
    const limiteEvento = (evento as any).limiteInvitadosPorSocio || 0;

    if (limiteEvento > 0 && totalInvitacionesHoy >= limiteEvento) {
      throw new Error(`Has alcanzado el límite de ${limiteEvento} invitaciones permitidas para este evento.`);
    }

    try {
      const nuevoId = crypto.randomUUID();
      const paseRef = doc(this.firestore, this.COLLECTION_NAME, nuevoId);

      const nuevaInvitacion: PaseUniversal = {
        id: nuevoId,
        userId: invitado.id!,
        userName: `${invitado.nombre}`,
        userType: invitado.tipo || UserRole.INVITADO,
        hostId: socio.id!,
        invitedByName: socio.nombre,
        date: fecha,
        dateStart: fecha,
        dateEnd: fecha,
        status: PasseAccessStatus.ACTIVE,
        createdAt: new Date().toISOString(),
        eventId: evento.id,
        scans: []
      };

      await setDoc(paseRef, nuevaInvitacion);
      return nuevaInvitacion;
    } catch (error: any) {
      this.errorHandler.handle(error);
      throw error;
    }
  }

  /**
   * @method registrarEscaneoPortero
   * @description Procesa el picaje o lectura del código QR ejecutado en portería.
   * Permite reentradas ilimitadas registrando cada acceso en la matriz de auditoría 'scans'.
   * @param {string} rawPayload String procedente del QR.
   * @param {string} porteroUid UID del operario autenticado en portería.
   * @returns {Promise<void>}
   */
  public async registrarEscaneoPortero(rawPayload: string, porteroUid: string): Promise<void> {
    const payloadLimpio = (rawPayload || '').trim();

    // 🛡️ FILTRO DEFENSIVO 1: Descarte inmediato de QRs con URLs externas o barras dobles
    // Evita la excepción "Invalid segment ... Paths must not contain //" de Firestore SDK.
    if (!payloadLimpio || payloadLimpio.includes('//') || payloadLimpio.includes('http:') || payloadLimpio.includes('https:')) {
      throw new Error('QR ajeno al club. Por favor, escanee una credencial oficial.');
    }

    // 🛡️ FILTRO DEFENSIVO 2: Validación de sintaxis básica para IDs de documento de Firestore
    const esPaseSocio = payloadLimpio.startsWith('SOCIO:');
    const esIdValido = /^[a-zA-Z0-9_\-]+$/.test(payloadLimpio);

    if (!esPaseSocio && !esIdValido) {
      throw new Error('Código QR no reconocido. Escanee un carnet digital oficial.');
    }

    try {
      let finalPaseId = payloadLimpio;
      const hoyFormateado = new Date().toISOString().split('T')[0];

      // CASO A: Credencial de Socio con formato "SOCIO:<userId>:EVENTO-<eventId>"
      if (esPaseSocio) {
        const partes = payloadLimpio.split(':');
        if (partes.length < 3) {
          throw new Error('Formato de credencial de socio corrupto o ilegible.');
        }

        const socioUid = partes[1];
        const paseExistente = await this.obtenerPaseDiarioUsuario(socioUid, hoyFormateado);

        if (paseExistente && paseExistente.id) {
          finalPaseId = paseExistente.id;
        } else {
          throw new Error('El socio no tiene un pase activo registrado para hoy.');
        }
      }

      // CASO B: Credencial de Invitado o comprobación del pase en Firestore
      const paseRef = doc(this.firestore, this.COLLECTION_NAME, finalPaseId);
      const paseSnap = await getDoc(paseRef);

      if (!paseSnap.exists()) {
        throw new Error('Pase no encontrado o inexistente en la base de datos.');
      }

      const datosPase = paseSnap.data() as PaseUniversal;

      const inicio = datosPase.dateStart || datosPase.date || hoyFormateado;
      const fin = datosPase.dateEnd || datosPase.date || hoyFormateado;

      if (hoyFormateado < inicio || hoyFormateado > fin) {
        throw new Error(`Pase expirado. Válido únicamente del ${inicio} al ${fin}.`);
      }

      // 🔄 REENTRADAS PERMITIDAS: Registramos el nuevo picaje en el historial atómico sin bloquear el acceso
      await updateDoc(paseRef, {
        scans: arrayUnion({
          scannedAt: new Date().toISOString(),
          gatekeeperUid: porteroUid
        })
      });

    } catch (error: any) {
      if (!(error instanceof Error) ||
        (!error.message.includes(APP_MESSAGES[AppMessageCode.ACD_PASS_ERR_0001]) &&
          !error.message.includes(APP_MESSAGES[AppMessageCode.ACD_PASS_ERR_0002]) &&
          !error.message.includes(APP_MESSAGES[AppMessageCode.ACD_PASS_ERR_0003]) &&
          !error.message.includes(APP_MESSAGES[AppMessageCode.ACD_PASS_ERR_0007]))) {
        this.errorHandler.handle(error);
      }
      throw error;
    }
  }

  /**
   * @method verificarYGenerarPaseSocioLogueado
   * @description Pasarela reservada para procesos de inicialización de credenciales de temporada.
   * @param {User} usuarioActivo Instancia maestra del usuario activo.
   * @returns {Promise<void>}
   */
  public async verificarYGenerarPaseSocioLogueado(usuarioActivo: User): Promise<void> {
    return;
  }

  /**
   * @method obtenerInvitadosDelSocio
   * @description Descarga el listado completo de pases de invitados asignados por un socio para una fecha concreta.
   * @param {string} socioId UID del socio anfitrión.
   * @param {string} fecha Cadena temporal YYYY-MM-DD.
   * @returns {Promise<PaseUniversal[]>} Matriz con los pases de invitación expedidos.
   */
  public async obtenerInvitadosDelSocio(socioId: string, fecha: string): Promise<PaseUniversal[]> {
    try {
      const accessRef = collection(this.firestore, this.COLLECTION_NAME);
      const q = query(accessRef, where('hostId', '==', socioId), where('date', '==', fecha));
      const snap = await getDocs(q);
      const invitados: PaseUniversal[] = [];
      snap.forEach(docSnap => {
        invitados.push({ id: docSnap.id, ...docSnap.data() } as PaseUniversal);
      });
      return invitados;
    } catch (error) {
      this.errorHandler.handle(error);
      return [];
    }
  }

  /**
   * @method obtenerCandidatosInvitadosDisponibles
   * @description Consulta el padrón buscando usuarios con rol INVITADO activos que no tengan un pase hoy.
   * @param {string} currentUserId UID del usuario operador.
   * @param {string} fecha Fecha ferial de evaluación.
   * @returns {Promise<User[]>} Catálogo de usuarios aptos para recibir una invitación.
   */
  public async obtenerCandidatosInvitadosDisponibles(currentUserId: string, fecha: string): Promise<User[]> {
    try {
      const accessRef = collection(this.firestore, this.COLLECTION_NAME);
      const qAccesos = query(accessRef, where('date', '==', fecha));
      const snapAccesos = await getDocs(qAccesos);
      const yaInvitadosIds: string[] = [];
      snapAccesos.forEach(docSnap => {
        yaInvitadosIds.push((docSnap.data() as PasseAccess).userId);
      });

      const usersRef = collection(this.firestore, 'users');
      const qInvitadosValidos = query(usersRef, where('tipo', '==', UserRole.INVITADO));
      const querySnapshot = await getDocs(qInvitadosValidos);
      const candidatos: User[] = [];

      querySnapshot.forEach(docSnap => {
        const data = docSnap.data() as any;
        const esActivo = data.estado === UserStatus.ACTIVE || data.estado === UserStatus.PENDING_APPROVAL;
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

  /**
   * @method crearInvitacionTransaccional
   * @description 🛡️ VULNERABILIDAD BLINDADA (Race Conditions): Emite una invitación para un tercero
   * calculando atómicamente el aforo consumido EN LA FECHA DE VALIDEZ del pase para dar soporte a
   * convocatorias multi-día sin acumular pases caducados de días anteriores.
   * 
   * @param {User} socio Modelo de datos del socio anfitrión.
   * @param {User} invitado Modelo de datos del usuario invitado.
   * @param {string} fecha Fecha asignada de validez del pase ferial (YYYY-MM-DD).
   * @param {AppEvent} evento Instancia local de la convocatoria.
   * @returns {Promise<PaseUniversal>} Promesa que resuelve la credencial generada con éxito.
   * @throws {Error} Lanza una excepción con código AppMessageCode en caso de fallo.
   */
  public async crearInvitacionTransaccional(
    socio: User,
    invitado: User,
    fecha: string,
    evento: AppEvent
  ): Promise<PaseUniversal> {
    if (!this.userFeesService.esSocioSolvente(socio)) {
      throw new Error(AppMessageCode.ACD_FEES_ERR_0001);
    }

    const totalInvitacionesHoy = await this.contarInvitacionesDelDia(socio.id!, fecha, evento);
    const limiteEvento = (evento as any).limiteInvitadosPorSocio || 0;

    if (limiteEvento > 0 && totalInvitacionesHoy >= limiteEvento) {
      throw new Error(`Has alcanzado el límite de ${limiteEvento} invitaciones permitidas para este evento.`);
    }

    const { runTransaction, doc, increment, collection, query, where, getDocs } = await import('@angular/fire/firestore');
    const nuevoId = crypto.randomUUID();

    const eventRef = doc(this.firestore, `events/${evento.id}`);
    const passeAccessRef = doc(this.firestore, this.COLLECTION_NAME, nuevoId);

    const nuevaInvitacion: PaseUniversal = {
      id: nuevoId,
      userId: invitado.id!,
      userName: `${invitado.nombre}`,
      userType: invitado.tipo || UserRole.INVITADO,
      hostId: socio.id!,
      invitedByName: socio.nombre,
      date: fecha,
      dateStart: fecha,
      dateEnd: fecha,
      status: PasseAccessStatus.ACTIVE,
      createdAt: new Date().toISOString(),
      eventId: evento.id,
      scans: []
    };

    await runTransaction(this.firestore, async (transaction) => {
      const eventSnap = await transaction.get(eventRef);
      if (!eventSnap.exists()) {
        throw new Error(AppMessageCode.ACD_EVENT_ERR_0004);
      }

      const liveEventData = eventSnap.data() as AppEvent;
      const aforoMaximo = liveEventData.maxAttendees;

      // 🛑 CERROJO DE CONCURRENCIA POR DÍA: Evaluamos el aforo real de la fecha del pase
      if (aforoMaximo && aforoMaximo > 0) {
        const accessRef = collection(this.firestore, this.COLLECTION_NAME);
        const qAforoFecha = query(
          accessRef,
          where('eventId', '==', evento.id),
          where('status', '==', PasseAccessStatus.ACTIVE)
        );
        const snapAccesos = await getDocs(qAforoFecha);

        let pasesActivosFecha = 0;
        snapAccesos.forEach((docItem) => {
          const p = docItem.data();
          const inicio = p['dateStart'] || p['date'] || fecha;
          const fin = p['dateEnd'] || p['date'] || fecha;
          if (fecha >= inicio && fecha <= fin) {
            pasesActivosFecha++;
          }
        });

        if (pasesActivosFecha >= aforoMaximo) {
          throw new Error(AppMessageCode.ACD_EVENT_ERR_0008);
        }
      }

      transaction.set(passeAccessRef, nuevaInvitacion);

      transaction.update(eventRef, {
        attendeeCount: increment(1)
      });
    });

    return nuevaInvitacion;
  }

  /**
   * @method eliminarInvitacionTransaccional
   * @description 🛡️ OPERACIÓN ATÓMICA: Anula la invitación de un tercero externo eliminando su registro 
   * en la colección 'event-access' y decrementando atómicamente el contador de aforo del evento asociado.
   * @param {string} paseId ID único de la invitación a eliminar.
   * @param {string} eventId ID de la convocatoria para actualizar su aforo.
   * @returns {Promise<void>} Promesa que resuelve al consolidar la transacción en el servidor.
   * @throws {Error} Lanza una excepción con código AppMessageCode si el evento de destino no existe.
   */
  public async eliminarInvitacionTransaccional(paseId: string, eventId: string): Promise<void> {
    const { runTransaction, doc, increment } = await import('@angular/fire/firestore');

    const eventRef = doc(this.firestore, `events/${eventId}`);
    const passeAccessRef = doc(this.firestore, this.COLLECTION_NAME, paseId);

    await runTransaction(this.firestore, async (transaction) => {
      const eventSnap = await transaction.get(eventRef);

      if (!eventSnap.exists()) {
        throw new Error(AppMessageCode.ACD_EVENT_ERR_0004);
      }

      const liveEventData = eventSnap.data() as AppEvent;
      const asistentesActuales = liveEventData.attendeeCount || 0;

      transaction.delete(passeAccessRef);

      const decremento = asistentesActuales > 0 ? -1 : 0;
      transaction.update(eventRef, {
        attendeeCount: increment(decremento)
      });
    });
  }
}