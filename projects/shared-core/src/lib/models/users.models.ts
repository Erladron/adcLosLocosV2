import { UserRole } from './user-role.enum';
import { UserStatus } from './user-status.enum';

/**
 * Modelo representativo de un Usuario/Socio en la plataforma ADC Los Locos.
 * Incluye datos de identificación, perfil, auditoría multinivel y privacidad.
 */
export interface User {

  // =================================
  // IDENTIFICACION
  // =================================

  id?: string;

  numeroSocio?: string;

  // =================================
  // DATOS PERSONALES
  // =================================

  nombre: string;

  telefono: string;

  email: string;

  dni: string;

  direccion: string;

  detallesDireccion?: string;

  foto: string;

  /** Profesión u ocupación actual del socio (Opcional) */
  profesion?: string;

  /** 🚀 Empresa de seguridad a la que pertenece (Exclusivo para Porteros) */
  empresa?: string;

  // =================================
  // AJUSTES DE PRIVACIDAD (CONTROL DE VISIBILIDAD)
  // =================================

  /** Define si el socio autoriza a que otros socios comunes vean su teléfono */
  publicarTelefono: boolean;

  /** Define si el socio autoriza a que otros socios comunes vean su correo electrónico */
  publicarEmail: boolean;

  // =================================
  // CONTROL
  // =================================

  tipo: UserRole;

  password?: string;

  estado?: UserStatus;

  // =================================
  // AUDITORIA CREACION
  // =================================

  createdAt?: any;

  creadoPorUid?: string;

  creadoPorNombre?: string;

  // =================================
  // AUDITORIA INVITACION
  // =================================

  invitadoPorUid?: string;

  invitadoPorNombre?: string;

  fechaInvitacion?: any;

  // =================================
  // AUDITORIA APROBACION
  // =================================

  aprobadoPorUid?: string;

  aprobadoPorNombre?: string;

  approvedAt?: any;

  // =================================
  // AUDITORIA BAJA
  // =================================

  deactivatedAt?: any;

  bajaRealizadaPorUid?: string;

  bajaRealizadaPorNombre?: string;

  motivoBaja?: string;

  // =================================
  // AUDITORIA REACTIVACION
  // =================================

  reactivatedAt?: any;

  reactivadoPorUid?: string;

  reactivadoPorNombre?: string;

}