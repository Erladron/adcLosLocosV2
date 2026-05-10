export interface User {
  nombre: string;
  dni: string;
  email: string;
  telefono: string;
  direccion: string;
  cp: string;
  fechaNacimiento: string;
  profesion: string;
  rol: 'invitado' | 'socio';
  esAdmin: boolean;
  fechaAlta?: Date;
  foto?: string;
}