import { UserRole }
from 'src/app/models/user-role.enum';

import { RequestStatus }
from 'src/app/models/request-status.enum';

// =========================================
// ROLES
// =========================================

export const USER_ROLES: UserRole[] = [

  UserRole.ADMINISTRADOR,

  UserRole.DIRECTIVA,

  UserRole.SOCIO,

  UserRole.INVITADO,

  UserRole.REGISTRADO
];

// =========================================
// ROLES GESTIONABLES DIRECTIVA
// =========================================

export const DIRECTIVA_ALLOWED_ROLES: UserRole[] = [

  UserRole.SOCIO,

  UserRole.INVITADO
];

// =========================================
// TABS USER DETAIL
// =========================================

export const USER_DETAIL_TABS = [

  {
    key: 'personales',
    label: 'Datos personales',
    icon: 'person-outline'
  },

  {
    key: 'membresia',
    label: 'Membresía',
    icon: 'shield-outline'
  },

  {
    key: 'credenciales',
    label: 'Credenciales',
    icon: 'key-outline'
  }
];

// =========================================
// ESTADOS SOLICITUD
// =========================================

export const REQUEST_STATUS = {

  PENDING: 'pending' as RequestStatus,

  APPROVED: 'approved' as RequestStatus,

  REJECTED: 'rejected' as RequestStatus
};

// =========================================
// LABELS ESTADOS
// =========================================

export const REQUEST_STATUS_LABELS = {

  pending: 'Pendiente',

  approved: 'Aprobado',

  rejected: 'Rechazado'
};

// =========================================
// LABELS ROLES
// =========================================

export const USER_ROLE_LABELS = {

  administrador: 'Administrador',

  directiva: 'Directiva',

  socio: 'Socio',

  invitado: 'Invitado',

  registrado: 'Registrado'
};

// =========================================
// ICONOS ROLES
// =========================================

export const USER_ROLE_ICONS = {

  administrador: 'shield-outline',

  directiva: 'people-outline',

  socio: 'person-outline',

  invitado: 'person-circle-outline',

  registrado: 'time-outline'
};

// =========================================
// DEFAULTS
// =========================================

export const DEFAULT_USER_PHOTO =
  'assets/img/default-avatar.png';

// =========================================
// LIMITES
// =========================================

export const USER_LIMITS = {

  MIN_PASSWORD_LENGTH: 6,

  PHONE_LENGTH: 9,

  DNI_LENGTH: 9
};

// =========================================
// MENSAJES
// =========================================

export const USER_MESSAGES = {

  USER_CREATED:
    'Usuario creado correctamente',

  USER_UPDATED:
    'Usuario actualizado correctamente',

  USER_NOT_FOUND:
    'Usuario no encontrado',

  INVALID_DNI:
    'DNI incorrecto',

  INVALID_PHONE:
    'Teléfono incorrecto',

  PASSWORDS_NOT_MATCH:
    'Las contraseñas no coinciden',

  REQUIRED_NAME:
    'El nombre es obligatorio',

  REQUIRED_EMAIL:
    'El email es obligatorio',

  REQUIRED_PASSWORD:
    'La contraseña es obligatoria',

  REQUIRED_MEMBER_NUMBER:
    'El número de socio es obligatorio',

  ERROR_LOADING_USER:
    'Error cargando usuario',

  ERROR_SAVING_USER:
    'Error guardando usuario',

  ERROR_UPLOADING_IMAGE:
    'Error subiendo imagen',

  EMAILS_NOT_MATCH:
  'Los emails no coinciden'
};

// =========================================
// MODOS
// =========================================

export const USER_DETAIL_MODES = {

  CREATE: 'create',

  EDIT: 'edit',

  PROFILE: 'profile'
};

// =========================================
// STORAGE PATHS
// =========================================

export const STORAGE_PATHS = {

  USERS:
    'users',

  AVATARS:
    'avatars'
};