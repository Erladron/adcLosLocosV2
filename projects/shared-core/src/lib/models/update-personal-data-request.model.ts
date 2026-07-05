import { UserStatus } from './user-status.enum';

/**
 * @interface UpdatePersonalDataRequest
 * @description Petición estructurada (DTO) para la mutación y actualización del perfil de datos personales.
 * Se utiliza de forma exclusiva en los flujos de "Complete Profile" (onboarding post-registro web) y en la edición civil ordinaria de la cuenta.
 * Aligera el payload aislando los campos editables de los parámetros inmutables de administración (roles, cuotas, números de socio).
 */
export interface UpdatePersonalDataRequest {

  /** @description Nombre completo del socio (normalizado en PascalCase por el orquestador de datos). */
  nombre: string;

  /** @description Teléfono móvil o fijo de contacto. */
  telefono: string;

  /** @description Documento Nacional de Identidad (DNI/NIE) para el libro oficial de registro del club. */
  dni: string;

  /** @description Dirección postal principal de residencia. */
  direccion: string;

  /** @description Información habitacional secundaria u opcional (Piso, Puerta, Letra, Bloque). */
  detallesDireccion?: string;

  /** @description Cadena de caracteres con la URL de descarga de Storage o el string binario Base64 de la foto de perfil. */
  foto: string;

  /** @description Profesión, sector u ocupación laboral activa del socio (Opcional). */
  profesion?: string;

  // =========================================================================
  // 🛡️ MODIFICABLE PRIVACY PREFERENCES (Flags de Visibilidad Directa)
  // =========================================================================

  /** @description Permiso explícito del usuario para exponer públicamente su teléfono en el directorio de la peña. */
  publicarTelefono: boolean;

  /** @description Permiso explícito del usuario para exponer públicamente su email en el directorio de la peña. */
  publicarEmail: boolean;

  // =========================================================================
  // ⚙️ STATE CONTROL (Ciclo de Vida del Onboarding)
  // =========================================================================

  /** @description Estado operativo del usuario. Se usa para transicionar automáticamente de PENDING_DATA a PENDING_APPROVAL. */
  estado?: UserStatus;
}