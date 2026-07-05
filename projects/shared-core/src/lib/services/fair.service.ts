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

import { FairAccess, AppEvent, FairAccessStatus } from '../models/events.models';
import { User } from '../models/users.models';
import { UserStatus } from '../models/user-status.enum';
import { UserRole } from '../models/user-role.enum';

import { ErrorHandlerService } from './error-handler.service';
import { NotificationService } from './notification.service';
import { UserFeesService } from './user-fees.service'; // 🚀 Inyectado el satélite de tesorería core
import { AppMessageCode } from '../constants/app-message-code.enum';
import { APP_MESSAGES } from '../constants/app-messages';

/**
 * @interface PaseUniversal
 * @description Extensión profesional del contrato base FairAccess para dar soporte estricto 
 * a la validez temporal multi-día de los pases en la caseta ferial.
 */
export interface PaseUniversal extends FairAccess {
  dateStart: string;
  dateEnd: string;
}

/**
 * @class FairService
 * @description Servicio core encargado de la expedición de invitaciones feriales, control de cupos 
 * por socio y procesamiento transaccional de picajes de QR en la portería de la caseta.
 */
@Injectable({
  providedIn: 'root'
})
export class FairService {
  /** @description Instancia inyectada del SDK modular de Cloud Firestore. @private */
  private firestore = inject(Firestore);
  /** @description Instancia inyectada del interceptor central de excepciones. @private */
  private errorHandler = inject(ErrorHandlerService);
  /** @description Instancia inyectada del despachador de notificaciones visuales. @private */
  private notification = inject(NotificationService);
  /** @description Instancia inyectada del satélite financiero de control de cuotas. @private */
  private userFeesService = inject(UserFeesService);

  /** @description Nombre identificativo de la colección en la base de datos NoSQL. @private @readonly */
  private readonly COLLECTION_NAME = 'fair-access';

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
   * @description Calcula de forma síncrona el total de pases emitidos por un socio anfitrión para una fecha y evento dados.
   * @param {string} socioId UID del socio emisor.
   * @param {string} fecha Fecha de corte evaluada.
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
        where('date', '==', fecha)
      );
      const snapshot = await getDocs(q);
      return snapshot.size;
    } catch (error: any) {
      this.errorHandler.handle(error);
      throw error;
    }
  }

  /**
   * @method crearInvitacion
   * @description 💡 INTERCEPTOR FINANCIERO CRÍTICO: Registra un pase de invitación para un tercero externo.
   * Valida en primera instancia que el socio anfitrión se encuentre al corriente de pago de sus cuotas anuales.
   * Evalúa secundariamente los límites transaccionales de aforo fijados en la convocatoria.
   * @param {User} socio Modelo de datos del socio emisor o anfitrión.
   * @param {User} invitado Modelo de datos del usuario receptor beneficiario.
   * @param {string} fecha Fecha asignada de validez.
   * @param {AppEvent} evento Convocatoria ferial vinculada.
   * @returns {Promise<PaseUniversal>} Credencial extendida generada en el servidor.
   */
  public async crearInvitacion(socio: User, invitado: User, fecha: string, evento: AppEvent): Promise<PaseUniversal> {
    // 🛡️ REGLA DE NEGOCIO PERIMETRAL: Interceptación de emisión de pases por impago
    if (!this.userFeesService.esSocioSolvente(socio)) {
      throw new Error(AppMessageCode.ADC_FEES_ERR_0001);
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
        status: FairAccessStatus.PENDING, // 🚀 Inicializa en pending hasta que se evalúe el evento
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
   * @description Procesa de forma atómica el picaje o lectura del código QR ejecutado por el personal en puerta.
   * Inyecta de forma inmutable el registro cronológico del escaneo facilitando accesos ilimitados.
   * @param {string} rawPayload Cadena alfanumérica encriptada o string de lectura rápida procedete del QR.
   * @param {string} porteroUid UID del operario autenticado en portería que valida el carnet.
   * @returns {Promise<void>}
   */
  public async registrarEscaneoPortero(rawPayload: string, porteroUid: string): Promise<void> {
    try {
      let finalPaseId = rawPayload;
      const hoyFormateado = new Date().toISOString().split('T')[0];

      if (rawPayload.startsWith('SOCIO:')) {
        const partes = rawPayload.split(':');
        const socioUid = partes[1];

        const paseExistente = await this.obtenerPaseDiarioUsuario(socioUid, hoyFormateado);

        if (paseExistente && paseExistente.id) {
          finalPaseId = paseExistente.id;
        } else {
          throw new Error(APP_MESSAGES[AppMessageCode.ADC_FAIR_ERR_0007]);
        }
      }

      const paseRef = doc(this.firestore, this.COLLECTION_NAME, finalPaseId);
      const paseSnap = await getDoc(paseRef);

      if (!paseSnap.exists()) {
        throw new Error(APP_MESSAGES[AppMessageCode.ADC_FAIR_ERR_0002]);
      }

      const datosPase = paseSnap.data() as PaseUniversal;

      const inicio = datosPase.dateStart || datosPase.date || hoyFormateado;
      const fin = datosPase.dateEnd || datosPase.date || hoyFormateado;

      if (hoyFormateado < inicio || hoyFormateado > fin) {
        throw new Error(APP_MESSAGES[AppMessageCode.ADC_FAIR_ERR_0003]);
      }

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
   * @description Consulta el padrón general del club buscando usuarios con el rol INVITADO que estén activos y no tengan un pase hoy.
   * @param {string} currentUserId UID del usuario operador logueado para aplicar exclusión mútua.
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
        yaInvitadosIds.push((docSnap.data() as FairAccess).userId);
      });

      const usersRef = collection(this.firestore, 'users');
      const qInvitadosValidos = query(usersRef, where('tipo', '==', UserRole.INVITADO));
      const querySnapshot = await getDocs(qInvitadosValidos);
      const candidatos: User[] = [];

      querySnapshot.forEach(docSnap => {
        const data = docSnap.data() as any;
        // 🚀 Saneamiento: Se unifica la lectura evaluando exclusivamente la propiedad 'estado' del modelo
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
   * @description 🛡️ VULNERABILIDAD BLINDADA (Race Conditions): Emite una invitación para un tercero externo
   * de forma transaccional y atómica en el servidor. Realiza una lectura en caliente del aforo actual del evento,
   * valida que no se supere el límite de plazas máximas, crea el pase digital e incrementa el aforo.
   * @param {User} socio Modelo de datos del socio anfitrión emisor de la invitación.
   * @param {User} invitado Modelo de datos del usuario invitado receptor del pase.
   * @param {string} fecha Fecha asignada de validez del pase ferial (YYYY-MM-DD).
   * @param {AppEvent} evento Instancia local de la convocatoria para validar referencias.
   * @returns {Promise<PaseUniversal>} Promesa que resuelve la credencial generada con éxito tras la transacción.
   * @throws {Error} Lanza una excepción controlada si el socio no es solvente, si supera su cupo o si el aforo está completo.
   */
  public async crearInvitacionTransaccional(
    socio: User,
    invitado: User,
    fecha: string,
    evento: AppEvent
  ): Promise<PaseUniversal> {
    // 1. Regla perimetral: Interceptación inmediata por impago de cuotas
    if (!this.userFeesService.esSocioSolvente(socio)) {
      throw new Error(AppMessageCode.ADC_FEES_ERR_0001);
    }

    const totalInvitacionesHoy = await this.contarInvitacionesDelDia(socio.id!, fecha, evento);
    const limiteEvento = (evento as any).limiteInvitadosPorSocio || 0;

    if (limiteEvento > 0 && totalInvitacionesHoy >= limiteEvento) {
      throw new Error(`Has alcanzado el límite de ${limiteEvento} invitaciones permitidas para este evento.`);
    }

    // Importamos dinámicamente la transacción y el incrementador modular del SDK de Firestore
    const { runTransaction, doc, increment } = await import('@angular/fire/firestore');
    const nuevoId = crypto.randomUUID();

    const eventRef = doc(this.firestore, `events/${evento.id}`);
    const fairAccessRef = doc(this.firestore, this.COLLECTION_NAME, nuevoId);

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
      status: FairAccessStatus.PENDING,
      createdAt: new Date().toISOString(),
      eventId: evento.id,
      scans: []
    };

    // Ejecutamos la transacción atómica en el servidor
    await runTransaction(this.firestore, async (transaction) => {
      // Lectura crítica en caliente en el servidor para evitar sobreaforos concurrentes
      const eventSnap = await transaction.get(eventRef);
      if (!eventSnap.exists()) {
        throw new Error('El evento de destino no existe en la plataforma.');
      }

      const liveEventData = eventSnap.data() as AppEvent;
      const aforoMaximo = liveEventData.maxAttendees;
      const asistentesActuales = liveEventData.attendeeCount || 0;

      // 🛑 CERROJO DE CONCURRENCIA: Si otro usuario llenó el aforo en este milisegundo, abortamos
      if (aforoMaximo && asistentesActuales >= aforoMaximo) {
        throw new Error(`¡Aforo Completo! El evento alcanzó su límite de ${aforoMaximo} personas.`);
      }

      // Seteamos el pase digital del invitado en el lote transaccional
      transaction.set(fairAccessRef, nuevaInvitacion);

      // Incrementamos atómicamente el contador de asistentes en la convocatoria
      transaction.update(eventRef, {
        attendeeCount: increment(1)
      });
    });

    return nuevaInvitacion;
  }

  /**
   * @method eliminarInvitacionTransaccional
   * @description 🛡️ OPERACIÓN ATÓMICA: Anula la invitación de un tercero externo eliminando su registro 
   * en la colección 'fair-access' y decrementando atómicamente el contador de aforo del evento asociado 
   * en el servidor, mitigando cualquier condición de carrera concurrente.
   * Emplea los códigos de error controlados del chasis centralizado.
   * @param {string} paseId ID único de la invitación a eliminar.
   * @param {string} eventId ID de la convocatoria para actualizar su aforo.
   * @returns {Promise<void>} Promesa que resuelve al consolidar la transacción en el servidor.
   * @throws {Error} Lanza una excepción con código AppMessageCode si el evento de destino no existe.
   */
  public async eliminarInvitacionTransaccional(paseId: string, eventId: string): Promise<void> {
    const { runTransaction, doc, increment } = await import('@angular/fire/firestore');

    const eventRef = doc(this.firestore, `events/${eventId}`);
    const fairAccessRef = doc(this.firestore, this.COLLECTION_NAME, paseId);

    await runTransaction(this.firestore, async (transaction) => {
      const eventSnap = await transaction.get(eventRef);

      // 🛡️ CONTROL DE INTEGRIDAD: Si el evento no existe, lanzamos tu código de error oficial
      if (!eventSnap.exists()) {
        throw new Error(AppMessageCode.ADC_EVENT_ERR_0004);
      }

      const liveEventData = eventSnap.data() as AppEvent;
      const asistentesActuales = liveEventData.attendeeCount || 0;

      // Eliminamos el pase del invitado de la colección
      transaction.delete(fairAccessRef);

      // Decrementamos atómicamente el aforo (asegurándonos de no bajar de 0)
      const decremento = asistentesActuales > 0 ? -1 : 0;
      transaction.update(eventRef, {
        attendeeCount: increment(decremento)
      });
    });
  }
}