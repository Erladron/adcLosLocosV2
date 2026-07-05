import { UserRole } from './user-role.enum';
import { UserStatus } from './user-status.enum';

// 🚀 LA SOLUCIÓN: Re-exportación explícita de los enumerados del ecosistema
export { UserRole };
export { UserStatus };

/**
 * @interface User
 * @description Modelo representativo maestro de un Usuario/Socio en la plataforma de la peña.
 * Centraliza de forma unificada los datos de identificación, perfil civil, preferencias de visibilidad, 
 * estado financiero transaccional y la traza completa de auditoría multinivel del ciclo de vida del miembro.
 */
export interface User {

  // =========================================================================
  // 🔑 IDENTIFICACIÓN
  // =========================================================================

  /** @description Identificador único del usuario (UID procedente de Firebase Authentication). */
  id?: string;

  /** @description Número identificativo oficial asignado manualmente al socio por la Junta Directiva. */
  numeroSocio?: string;

  // =========================================================================
  // 📋 DATOS PERSONALES
  // =========================================================================

  /** @description Nombre y apellidos completos del usuario en formato PascalCase. */
  nombre: string;

  /** @description Número de teléfono móvil o fijo de contacto. */
  telefono: string;

  /** @description Correo electrónico unívoco de acceso (Sincronizado con Firebase Auth). */
  email: string;

  /** @description Documento Nacional de Identidad (DNI/NIE) validado sintácticamente. */
  dni: string;

  /** @description Dirección postal física del domicilio principal (Validada mediante API Mapbox). */
  direccion: string;

  /** @description Información aclaratoria o complementaria del domicilio (Opcional). */
  detallesDireccion?: string;

  /** @description URL de descarga de Storage o representación en Base64 de la fotografía de perfil del socio. */
  foto: string;

  /** @description Profesión, oficio u ocupación actual del socio (Opcional). */
  profesion?: string;

  /** @description Empresa de seguridad externa a la que pertenece el usuario (Exclusivo para el rol 'portero'). */
  empresa?: string;

  // =========================================================================
  // 💰 ESTADO FINANCIERO Y CONTROL DE MEMBRESÍA
  // =========================================================================

  /** * @description Determina si el socio se encuentra al corriente de pago de las cuotas del club.
   * Campo opcional (?): Exclusivo para roles 'socio' y 'directiva'. No aplica a invitados ni porteros.
   * Modificable exclusivamente por los roles 'administrador' y 'directiva' de forma controlada.
   */
  cuotaAlCorriente?: boolean;

  // =========================================================================
  // 🛡️ AJUSTES DE PRIVACIDAD (CONTROL DE VISIBILIDAD)
  // =========================================================================

  /** @description Define si el socio autoriza a que otros socios comunes visualicen su número de teléfono en el directorio. */
  publicarTelefono: boolean;

  /** @description Define si el socio autoriza a que otros socios comunes visualicen su correo electrónico en el directorio. */
  publicarEmail: boolean;

  // =========================================================================
  // ⚙️ GESTIÓN DE ROLES Y SESIÓN
  // =========================================================================

  /** @description Rol asignado dentro del ecosistema que delimita la matriz de permisos de navegación. */
  tipo: UserRole;

  /** @description Contraseña temporal utilizada únicamente en procesos de pre-alta o reseteo (No persiste de forma plana). */
  password?: string;

  /** @description Estado actual del flujo de vida del usuario en el sistema. */
  estado?: UserStatus;

  // =========================================================================
  // ⏳ AUDITORÍA DE CREACIÓN
  // =========================================================================

  /** @description Fecha y hora de creación del registro. Soporta Date nativo, String ISO o el mapa estructural Timestamp de Firebase. */
  createdAt?: Date | string | { seconds: number; nanoseconds: number } | null;

  /** @description UID del usuario administrador que dio de alta el perfil directamente. */
  creadoPorUid?: string;

  /** @description Nombre del usuario administrador que dio de alta el perfil directamente. */
  creadoPorNombre?: string;

  // =========================================================================
  // ⏳ AUDITORÍA DE INVITACIÓN
  // =========================================================================

  /** @description UID del socio o administrador anfitrión que emitió la invitación web. */
  invitadoPorUid?: string;

  /** @description Nombre del socio o administrador anfitrión que emitió la invitación web. */
  invitadoPorNombre?: string;

  /** @description Fecha y hora en la que se generó o consumió el token de invitación. */
  fechaInvitacion?: Date | string | { seconds: number; nanoseconds: number } | null;

  // =========================================================================
  // ⏳ AUDITORÍA DE APROBACIÓN
  // =========================================================================

  /** @description UID del miembro de la directiva que aprobó la solicitud de onboarding. */
  aprobadoPorUid?: string;

  /** @description Nombre del miembro de la directiva que aprobó la solicitud de onboarding. */
  aprobadoPorNombre?: string;

  /** @description Fecha y hora exacta de la aprobación e ingreso oficial al club. */
  approvedAt?: Date | string | { seconds: number; nanoseconds: number } | null;

  // =========================================================================
  // ⏳ AUDITORÍA DE CONTROL DE CUOTAS
  // =========================================================================

  /** @description UID del administrador o directivo que realizó la última actualización sobre la cuota. */
  cuotaActualizadaPorUid?: string;

  /** @description Nombre del administrador o directivo que realizó la última actualización sobre la cuota. */
  cuotaActualizadaPorNombre?: string;

  /** @description Fecha y hora de la última modificación del estado financiero. */
  cuotaActualizadaAt?: Date | string | { seconds: number; nanoseconds: number } | null;

  // =========================================================================
  // ⏳ AUDITORÍA DE BAJA / DESACTIVACIÓN
  // =========================================================================

  /** @description Fecha y hora en la que el usuario fue suspendido o dado de baja de forma lógica. */
  deactivatedAt?: Date | string | { seconds: number; nanoseconds: number } | null;

  /** @description UID del miembro de la directiva que ejecutó la baja del usuario. */
  bajaRealizadaPorUid?: string;

  /** @description Nombre del miembro de la directiva que ejecutó la baja del usuario. */
  bajaRealizadaPorNombre?: string;

  /** @description Texto detallado con la justificación o motivo de la baja del socio. */
  motivoBaja?: string;

  // =========================================================================
  // ⏳ AUDITORÍA DE REACTIVACIÓN
  // =========================================================================

  /** @description Fecha y hora de la última reactivación de una cuenta inactiva o rechazada. */
  reactivatedAt?: Date | string | { seconds: number; nanoseconds: number } | null;

  /** @description UID del administrador que reactivó la cuenta del usuario. */
  reactivóPorUid?: string;

  /** @description Nombre del administrador que reactivó la cuenta del usuario. */
  reactivadoPorNombre?: string;
}