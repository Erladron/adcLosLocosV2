import { UserRole } from './user-role.enum';

import { UserStatus } from './user-status.enum';

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

  foto: string;

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