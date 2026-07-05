/**
 * @enum EventType
 * @description Catálogo tipado de las modalidades y tipologías oficiales de convocatoria de la peña.
 */
export enum EventType {
  ASAMBLEA = 'asamblea',
  COMIDA = 'comida',
  QUEDADA = 'quedada',
  FERIA = 'feria' // 🚀 Identificador único estructurado para la lógica de la caseta
}

/**
 * @enum EventStatus
 * @description Estados operativos del ciclo de vida de una convocatoria en la agenda.
 */
export enum EventStatus {
  DRAFT = 'draft',         // Borrador (restringido a la Junta Directiva)
  PUBLISHED = 'published', // Abierto y visible para la masa social
  CANCELLED = 'cancelled', // Convocatoria anulada de forma lógica
  COMPLETED = 'completed'  // Evento histórico finalizado
}

/**
 * @interface AppEvent
 * @description Modelo estructural maestro para los documentos alojados en la colección principal `/events`.
 */
export interface AppEvent {
  /** @description ID único del documento persistido en Firestore. */
  id: string;
  /** @description Título comercializador de la convocatoria. */
  title: string;
  /** @description Memoria o descripción pormenorizada de las actividades. */
  description: string;
  /** @description Tipología vinculada del enum EventType. */
  type: EventType;
  /** @description Estado administrativo del enum EventStatus. */
  status: EventStatus;

  // 🕒 Atributos de temporización oficiales (Estándar ISO 8601)
  /** @description Fecha y hora de inicio de la convocatoria. */
  startDate: string;
  /** @description Fecha y hora de finalización del evento. */
  endDate: string;
  /** @description Flag opcional para delimitar eventos de jornada completa. */
  allDay?: boolean;
  /** @description Determina si el evento requiere filtros de visibilidad. */
  isPrivate: boolean;
  /** @description Flag indicador para el disparo automático de pases QR. */
  requiresAccessControl: boolean;

  /** @description Límite dinámico regulado de invitaciones feriales externas permitidas por socio. */
  limiteInvitadosPorSocio?: number;

  /** @description Ubicación geográfica e identidad del emplazamiento estructurado para Mapbox. */
  location: {
    name: string;
    address: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };

  /** @description Capacidad de aforo máximo configurable por la Junta. */
  maxAttendees?: number;
  /** @description Contador transaccional de plazas confirmadas en tiempo real. */
  attendeeCount: number;
  /** @description URL de descarga del cartel promocional alojado en Firebase Storage. */
  imageUrl?: string;

  // Campos de auditoría interna
  /** @description UID del directivo o administrador instanciador. */
  createdBy: string;
  /** @description Timestamp ISO de creación del documento. */
  createdAt: string;
}

/**
 * @interface EventAttendance
 * @description Estructura transaccional de confirmación de asistencia para la subcolección interna `/events/{id}/attendance`.
 */
export interface EventAttendance {
  /** @description ID único del registro (coincide con el UID del socio para evitar colisiones). */
  id: string;
  /** @description ID de la convocatoria vinculada. */
  eventId: string;
  /** @description UID del socio solicitante. */
  userId: string;
  /** @description Veredicto transaccional de asistencia. */
  status: 'going' | 'not_going' | 'waitlist';

  // Métricas logísticas complementarias
  /** @description Número de plazas adicionales añadidas para acompañantes. */
  companions: number;
  /** @description Pasarela de pago elegida si la convocatoria requiere desembolso. */
  paymentMethod?: 'bizum' | 'cash';
  /** @description Timestamp de confirmación del botón de asistencia. */
  registeredAt: string;
}

/**
 * @enum FairAccessStatus
 * @description Catálogo unificado de los estados lógicos de un pase o credencial digital de caseta ferial.
 */
export enum FairAccessStatus {
  ACTIVE = 'active',
  PENDING = 'pending',
  EXPIRED = 'expired'
}

/**
 * @interface FairAccess
 * @description Credencial digital inmutable y pase QR analizado por las porterías en la colección `/fair-access`.
 */
export interface FairAccess {
  /** @description ID único del pase (coincide con el payload encriptado/leído del código QR). */
  id: string;
  /** @description UID del socio titular o beneficiario del pase. */
  userId: string;
  /** @description Nombre completo visible en la interfaz del terminal de portería al escanear. */
  userName: string;
  /** @description Rol de acceso del usuario para control visual rápido en puerta. */
  userType: string;
  /** @description UID del socio anfitrión (null si se trata del carnet propio del socio). */
  hostId: string | null;
  /** @description Nombre completo del socio que emite e invita al tercero externo. */
  invitedByName: string | null;
  /** @description Código identificativo o fecha del pase (ej: "FERIA-2026"). */
  date: string;
  /** @description Sello o bandera del estado de la credencial utilizando el enumerado oficial. */
  status: FairAccessStatus; // 🚀 ¡Saneado y fuertemente tipado!
  /** @description Timestamp de expedición de la credencial. */
  createdAt: string;
  /** @description ID único del evento ferial o convocatoria de adscripción. */
  eventId: string;

  /** @description Historial de picajes cronológicos para auditoría de aforo dinámico en puerta. */
  scans: {
    scannedAt: string;
    gatekeeperUid: string;
  }[];
}

// =========================================================================
// 🇪🇸 TRADUCCIONES OFICIALES (Diccionarios Homogéneos de Lenguaje Natural)
// =========================================================================

/** @description Diccionario oficial para el mapeo visual de tipologías de eventos. */
export const EVENT_TYPE_ES: Record<EventType, string> = {
  [EventType.ASAMBLEA]: '🗳️ Asamblea General',
  [EventType.COMIDA]: '🍽️ Comida / Convivencia',
  [EventType.QUEDADA]: '🛵 Quedada de la Peña',
  [EventType.FERIA]: '🎪 Caseta de la Feria'
};

/** @description Diccionario oficial para la visualización del estado de las convocatorias. */
export const EVENT_STATUS_ES: Record<EventStatus, string> = {
  [EventStatus.DRAFT]: 'Borrador',
  [EventStatus.PUBLISHED]: 'Abierto / Publicado',
  [EventStatus.CANCELLED]: 'Cancelado',
  [EventStatus.COMPLETED]: 'Finalizado'
};

/** @description Diccionario de traducciones para los estados internos de asistencia. */
export const ATTENDANCE_STATUS_ES: Record<'going' | 'not_going' | 'waitlist', string> = {
  'going': 'Asistiré',
  'not_going': 'No asistiré',
  'waitlist': 'En lista de espera'
};