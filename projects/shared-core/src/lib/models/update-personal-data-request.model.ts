import { UserStatus } from './user-status.enum';

/**
 * Petición estructurada para la actualización del perfil de datos personales.
 * Se utiliza en los flujos de "Complete Profile" y edición de cuenta.
 */
export interface UpdatePersonalDataRequest {

  nombre: string;

  telefono: string;

  dni: string;

  direccion: string;

  detallesDireccion?: string;

  foto: string;

  /** Profesión u ocupación del socio (Opcional) */
  profesion?: string;

  // ============================================
  // PREFERENCIAS DE PRIVACIDAD MODIFICABLES
  // ============================================

  /** Permiso del usuario para exponer su teléfono en el directorio de socios */
  publicarTelefono: boolean;

  /** Permiso del usuario para exponer su email en el directorio de socios */
  publicarEmail: boolean;

  // ============================================
  // CONTROL DE ESTADO
  // ============================================

  estado?: UserStatus;

}