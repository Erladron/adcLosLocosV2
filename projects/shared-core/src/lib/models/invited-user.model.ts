export interface InvitedUser {

  id?: string;

  // =================================
  // BASIC
  // =================================

  nombre: string;

  email: string;

  telefono?: string;

  // =================================
  // INVITATION
  // =================================

  invitadoPor: string;

  invitadoPorUid: string;

  fechaInvitacion: any;

  // =================================
  // STATUS
  // =================================

  usado: boolean;

  usadoPorUid?: string;

  fechaRegistro?: any;

}