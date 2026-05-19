import { UserRole } from './user-role.enum';
import { RequestStatus } from './request-status.enum';
import { UserStatus } from './user-status.enum';

export interface User {

  // =================================
  // IDENTIFICACION
  // =================================

  id?: string;

  uid: string;

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

  aprobado?: boolean;

  estadoSolicitud?: RequestStatus;

  perfilCompleto?: boolean;

  fechaAlta?: any;

  fechaAprobacion?: any;

  estado?: UserStatus;

}