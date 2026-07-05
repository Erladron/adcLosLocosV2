import { UserRole } from './user-role.enum';

export { UserRole };

/**
 * @interface UserDetail
 * @description Modelo de presentación secundario utilizado para mapear la proyección de campos estructurados
 * en los subformularios de edición y visualización del chasis del detalle.
 */
export interface UserDetail {
  /** @description Identificador único universal (UID) del registro de usuario. */
  uid: string;

  // =========================================================================
  // 📋 PERSONAL DATA (Información Civil y Profesional)
  // =========================================================================

  /** @description Nombre completo del usuario. */
  nombre: string;

  /** @description Correo electrónico principal de acceso. */
  email: string;

  /** @description Teléfono de contacto (Opcional). */
  telefono?: string;

  /** @description Documento Nacional de Identidad o NIE (Opcional). */
  dni?: string;

  /** @description Dirección postal de residencia (Opcional). */
  direccion?: string;

  /** @description URL de descarga o string binario Base64 del avatar de perfil (Opcional). */
  foto?: string;

  /** @description 🚀 Empresa de seguridad externa a la que pertenece (Exclusivo para el rol Portero). */
  empresa?: string;

  // =========================================================================
  // 🎫 MEMBERSHIP DATA (Rango y Control de Organización)
  // =========================================================================

  /** @description Rol o nivel jerárquico asignado en el sistema. */
  tipo: UserRole;

  /** @description Código identificativo único del miembro asignado por la Junta (Opcional). */
  numeroSocio?: string;

  // =========================================================================
  // ⚙️ AUDIT & SYSTEM CONTROLS (Metadatos de Control Remoto)
  // =========================================================================

  /** @description Canal de procedencia u origen del alta del registro (ej: 'web', 'manual'). */
  source?: string;

  /** * @description Timestamp o fecha de alta inicial en el sistema (Opcional).
   * 🚀 Saneado: Purga absoluta de la importación de Timestamp de Firebase para blindar la abstracción core.
   */
  createdAt?: Date | string | { seconds: number; nanoseconds: number } | null;
}

// =========================================================================
// 🔐 SECURITY CREDENTIALS (Contrato de Validación de Cajas de Claves)
// =========================================================================

/**
 * @interface UserCredentialsForm
 * @description Estructura de control utilizada para tipar el subformulario reactivo de cambio de credenciales.
 */
export interface UserCredentialsForm {
  /** @description Contraseña actual del operador, exigida por el servidor para procesos de re-autenticación crítica. */
  currentPassword: string;

  /** @description Nueva dirección de correo electrónico que se pretende vincular a la cuenta. */
  newEmail: string;

  /** @description Nueva contraseña plana de acceso que se desea establecer. */
  newPassword: string;

  /** @description Caja espejo para el doble check de confirmación de la nueva clave. */
  repeatPassword: string;
}

// =========================================================================
// 📸 MULTIMEDIA RESPONSES (Estado de Lienzo del Recortador de Avatar)
// =========================================================================

/**
 * @interface CropperState
 * @description Estructura reguladora para gobernar el estado reactivo del modal ngx-image-cropper.
 */
export interface CropperState {
  /** @description Evento nativo del DOM de cambio de fichero disparado por el input file. */
  imageChangedEvent: any;

  /** @description String Base64 resultante del procesamiento optimizado de recortes. */
  croppedImage: string;

  /** @description Flag booleano para instanciar o destruir el panel del cropper de la vista. */
  mostrarCropper: boolean;
}

// =========================================================================
// 🛠️ ADMIN REQUESTS (DTO de Creación Manual por la Directiva)
// =========================================================================

/**
 * @interface CreateUserRequest
 * @description Payload estructurado para la invocación del alta manual y bypass de invitación de la junta.
 */
export interface CreateUserRequest {
  /** @description Nombre completo normalizado. */
  nombre: string;

  /** @description Email único de acceso y notificaciones push. */
  email: string;

  /** @description Contraseña provisional plana asignada por el directivo. */
  password: string;

  /** @description Teléfono de contacto (Opcional). */
  telefono?: string;

  /** @description Documento Nacional de Identidad (Opcional). */
  dni?: string;

  /** @description Dirección postal de residencia (Opcional). */
  direccion?: string;

  /** @description Foto inicial en string Base64 (Opcional). */
  foto?: string;

  /** @description Empresa de seguridad vinculada (Opcional). */
  empresa?: string;

  /** @description Rango asignado de la peña. */
  tipo: UserRole;

  /** @description Número identificativo de socio formalizado en el libro del club (Opcional). */
  numeroSocio?: string;
}