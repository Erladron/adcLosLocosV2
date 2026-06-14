// 1. Tipos de Eventos (Para tus pestañas de filtrado)
export enum EventType {
  ASAMBLEA = 'asamblea',
  COMIDA = 'comida',
  QUEDADA = 'quedada',
  FERIA = 'feria' // 🚀 NUEVO: Identificador único para el evento de la caseta
}

// 2. Estados del Evento
export enum EventStatus {
  DRAFT = 'draft',         // Borrador (solo lo ve la directiva)
  PUBLISHED = 'published', // Abierto y visible para los socios
  CANCELLED = 'cancelled', // Evento anulado
  COMPLETED = 'completed'  // Evento ya pasado/finalizado
}

// 3. Modelo principal del Evento (El que va en la colección 'events')
export interface AppEvent {
  id: string;                    // ID único del documento en Firestore
  title: string;                 // Título del evento
  description: string;           // Descripción detallada
  type: EventType;               // asamblea, comida, quedada o feria
  status: EventStatus;           // Estado actual

  // 🔥 Campos de temporización oficiales
  startDate: string;             // Fecha y hora de inicio (Formato ISO)
  endDate: string;               // Fecha y hora de fin (Formato ISO)
  allDay?: boolean;              // True si la convocatoria dura toda la jornada
  isPrivate: boolean;

  // Parámetros de configuración específicos de negocio
  limiteInvitadosPorSocio?: number; // 🚀 NUEVO: Límite dinámico de invitaciones por caseta

  // Lugar estructurado para Mapbox
  location: {
    name: string;                // Ej: Mesón "El Loco Sordomudo"
    address: string;             // Ej: Calle de la Peña, Nº 12
    coordinates?: {              // Opcional, para pintar el pin en Mapbox
      lat: number;
      lng: number;
    };
  };

  maxAttendees?: number;         // Aforo máximo (Opcional)
  attendeeCount: number;         // Contador de plazas ocupadas en tiempo real

  imageUrl?: string;             // Foto o cartel (URL de Firebase Storage)

  // Auditoría
  createdBy: string;             // ID del administrador que lo creó
  createdAt: string;             // Fecha de creación
}

// 4. Modelo de Asistencia (Para la subcolección 'events/{id}/attendance')
// Esto es lo que se crea cuando un socio pulsa "Asistiré"
export interface EventAttendance {
  id: string;                    // Suele ser el mismo ID del usuario para evitar duplicados
  eventId: string;               // Referencia al evento
  userId: string;                // Referencia al socio
  status: 'going' | 'not_going' | 'waitlist'; // ¿Va, no va, o está en reserva?

  // Datos extra súper útiles para logística
  companions: number;            // Acompañantes (+1, +2)
  paymentMethod?: 'bizum' | 'cash'; // Si requiere pago

  registeredAt: string;          // Cuándo le dio al botón
}

export interface FairAccess {
  id: string;            // ID único del pase (será el contenido encriptado/leído del QR)
  userId: string;        // UID del socio o invitado que intenta entrar
  userName: string;      // Nombre completo para que el portero lo vea en pantalla al escanear
  userType: string;      // Rol ('socio', 'directiva', 'invitado') para control visual en puerta
  hostId: string | null; // UID del socio que invita (null si es el carnet del propio socio)
  invitedByName: string | null; //Nombre de la persona que genera el pase de feria al invitado
  date: string;          // Fecha del pase o código de temporada única (ej: "FERIA-2026")
  createdAt: string;     // Timestamp de cuándo se emitió el pase/invitación
  
  // Historial de picajes para permitir entradas y salidas ilimitadas en el mismo día
  scans: {
    scannedAt: string;     // Hora exacta del escaneo
    gatekeeperUid: string; // UID del administrador/directiva que estaba en la puerta
  }[];
}

// 🇪🇸 Diccionarios de Traducción Oficial para ACD Los Locos

export const EVENT_TYPE_ES: Record<EventType, string> = {
  [EventType.ASAMBLEA]: 'Asamblea',
  [EventType.COMIDA]: 'Comida / Convivencia',
  [EventType.QUEDADA]: 'Quedada',
  [EventType.FERIA]: 'Feria (Caseta)'
};

export const EVENT_STATUS_ES: Record<EventStatus, string> = {
  [EventStatus.DRAFT]: 'Borrador',
  [EventStatus.PUBLISHED]: 'Abierto / Publicado',
  [EventStatus.CANCELLED]: 'Cancelado',
  [EventStatus.COMPLETED]: 'Finalizado'
};

export const ATTENDANCE_STATUS_ES: Record<'going' | 'not_going' | 'waitlist', string> = {
  'going': 'Asistiré',
  'not_going': 'No asistiré',
  'waitlist': 'En lista de espera'
};