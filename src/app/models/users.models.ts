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

  tipo: string;

  password?: string;

  aprobado?: boolean;

  perfilCompleto?: boolean;

  fechaAlta?: any;

}