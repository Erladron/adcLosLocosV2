import { Timestamp } from '@angular/fire/firestore';
import { UserRole }
from './user-role.enum';

export {
  UserRole,
};

export interface UserDetail {

  uid: string;

  // =========================================
  // DATOS PERSONALES
  // =========================================

  nombre: string;

  email: string;

  telefono?: string;

  dni?: string;

  direccion?: string;

  foto?: string;

  // =========================================
  // MEMBRESIA
  // =========================================

  tipo: UserRole;

  numeroSocio?: string;

  // =========================================
  // CONTROL
  // =========================================

  source?: string;

  createdAt?: Timestamp | Date | null;
}


// =========================================
// CREDENCIALES
// =========================================

export interface UserCredentialsForm {

  currentPassword: string;

  newEmail: string;

  newPassword: string;

  repeatPassword: string;
}

// =========================================
// RESPUESTA FOTO
// =========================================

export interface CropperState {

  imageChangedEvent: any;

  croppedImage: string;

  mostrarCropper: boolean;
}

// =========================================
// CREACION ADMIN
// =========================================

export interface CreateUserRequest {

  nombre: string;

  email: string;

  password: string;

  telefono?: string;

  dni?: string;

  direccion?: string;

  foto?: string;

  tipo: UserRole;

  numeroSocio?: string;
}