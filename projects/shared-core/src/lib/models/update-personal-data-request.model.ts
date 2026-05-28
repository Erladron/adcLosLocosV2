import { UserStatus }
from './user-status.enum';

export interface UpdatePersonalDataRequest {

  nombre: string;

  telefono: string;

  dni: string;

  direccion: string;

  foto: string;

  estado?: UserStatus;

}