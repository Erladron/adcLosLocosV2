import {
  UserDetail,
  UserRole
} from 'src/app/models/user-detail.model';

// =========================================
// COMPARAR USERS
// =========================================

export function areUsersEqual(
  user1: UserDetail,
  user2: UserDetail
): boolean {

  return JSON.stringify(user1)
    === JSON.stringify(user2);
}

// =========================================
// CLONAR USER
// =========================================

export function cloneUser(
  user: UserDetail
): UserDetail {

  return JSON.parse(
    JSON.stringify(user)
  );
}

// =========================================
// ES ROL ADMINISTRATIVO
// =========================================

export function isManagementRole(
  role: UserRole
): boolean {

  return (
    role === 'administrador' ||
    role === 'directiva'
  );
}

// =========================================
// REQUIERE NUMERO SOCIO
// =========================================

export function requiresMemberNumber(
  role: UserRole
): boolean {

  return (
    role === 'socio' ||
    role === 'directiva'
  );
}

// =========================================
// REQUIERE DNI
// =========================================

export function requiresDNI(
  role: UserRole
): boolean {

  return (
    role === 'socio' ||
    role === 'directiva'
  );
}

// =========================================
// OBTENER INICIALES
// =========================================

export function getUserInitials(
  nombre: string
): string {

  if (!nombre) {
    return '';
  }

  const words = nombre
    .trim()
    .split(' ')
    .filter(Boolean);

  if (words.length === 1) {

    return words[0]
      .substring(0, 2)
      .toUpperCase();
  }

  return (
    words[0][0] +
    words[1][0]
  ).toUpperCase();
}

// =========================================
// FORMATEAR TELEFONO
// =========================================

export function formatPhone(
  phone: string
): string {

  if (!phone) {
    return '';
  }

  const clean = phone.replace(/\D/g, '');

  if (clean.length !== 9) {
    return clean;
  }

  return `${clean.substring(0, 3)} ${
    clean.substring(3, 6)
  } ${
    clean.substring(6, 9)
  }`;
}

// =========================================
// LIMPIAR STRING
// =========================================

export function cleanString(
  value: string
): string {

  if (!value) {
    return '';
  }

  return value.trim();
}

// =========================================
// ES EMAIL CAMBIADO
// =========================================

export function hasEmailChanged(
  originalEmail: string,
  newEmail: string
): boolean {

  return (
    originalEmail?.trim().toLowerCase()
    !==
    newEmail?.trim().toLowerCase()
  );
}

// =========================================
// PASSWORD MODIFICADA
// =========================================

export function hasPasswordChanged(
  password: string
): boolean {

  return !!password?.trim();
}

// =========================================
// OBTENER NOMBRE CORTO
// =========================================

export function getShortName(
  fullName: string
): string {

  if (!fullName) {
    return '';
  }

  const words = fullName
    .trim()
    .split(' ')
    .filter(Boolean);

  if (words.length <= 2) {
    return fullName;
  }

  return `${words[0]} ${words[1]}`;
}

// =========================================
// USER TIENE FOTO
// =========================================

export function hasPhoto(
  user: UserDetail
): boolean {

  return !!user?.foto;
}

// =========================================
// USER APROBADO
// =========================================

export function isApproved(
  user: UserDetail
): boolean {

  return user?.estadoSolicitud === 'approved';
}

// =========================================
// USER PENDIENTE
// =========================================

export function isPending(
  user: UserDetail
): boolean {

  return user?.estadoSolicitud === 'pending';
}

// =========================================
// USER RECHAZADO
// =========================================

export function isRejected(
  user: UserDetail
): boolean {

  return user?.estadoSolicitud === 'rejected';
}

// =========================================
// ORDENAR USERS POR NOMBRE
// =========================================

export function sortUsersByName(
  users: UserDetail[]
): UserDetail[] {

  return [...users].sort((a, b) => {

    return a.nombre.localeCompare(
      b.nombre,
      'es',
      { sensitivity: 'base' }
    );
  });
}

// =========================================
// ORDENAR USERS POR NUMERO SOCIO
// =========================================

export function sortUsersByMemberNumber(
  users: UserDetail[]
): UserDetail[] {

  return [...users].sort((a, b) => {

    return Number(a.numeroSocio || 0)
      -
      Number(b.numeroSocio || 0);
  });
}