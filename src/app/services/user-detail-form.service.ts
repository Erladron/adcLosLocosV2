import { Injectable } from '@angular/core';

import {
  UserDetail,
  UserCredentialsForm,
  CreateUserRequest
} from '../models/user-detail.model';

import { UserRole }
from '../models/user-role.enum';

import { RequestStatus }
from '../models/request-status.enum';

@Injectable({
  providedIn: 'root'
})
export class UserDetailFormService {

  constructor() {}

  // =========================================
  // USUARIO VACIO
  // =========================================

  createEmptyUser(): UserDetail {

    return {

      uid: '',

      nombre: '',

      email: '',

      telefono: '',

      dni: '',

      direccion: '',

      foto: '',

      tipo: UserRole.INVITADO,

      numeroSocio: '',

      aprobado: false,

      perfilCompleto: false,

      estadoSolicitud: RequestStatus.PENDIENTE,

      source: '',

      createdAt: null
    };
  }

  // =========================================
  // CREDENCIALES VACIAS
  // =========================================

  createEmptyCredentials(): UserCredentialsForm {

    return {

      currentPassword: '',

      newEmail: '',

      newPassword: '',

      repeatPassword: ''
    };
  }

  // =========================================
  // FORMATEAR USER FIRESTORE
  // =========================================

  mapFirestoreUser(data: any): UserDetail {

    return {

      uid: data?.uid || '',

      nombre: data?.nombre || '',

      email: data?.email || '',

      telefono: data?.telefono || '',

      dni: data?.dni || '',

      direccion: data?.direccion || '',

      foto: data?.foto || '',

      tipo: data?.tipo || 'invitado',

      numeroSocio: data?.numeroSocio || '',

      aprobado: data?.aprobado ?? false,

      perfilCompleto: data?.perfilCompleto ?? false,

      estadoSolicitud: data?.estadoSolicitud || 'pending',

      source: data?.source || '',

      createdAt: data?.createdAt || null
    };
  }

  // =========================================
  // CREAR REQUEST ADMIN
  // =========================================

  buildCreateUserRequest(
    user: UserDetail,
    password: string
  ): CreateUserRequest {

    return {

      nombre: user.nombre,

      email: user.email,

      password,

      telefono: user.telefono || '',

      dni: user.dni || '',

      direccion: user.direccion || '',

      foto: user.foto || '',

      tipo: user.tipo,

      numeroSocio: user.numeroSocio || ''
    };
  }

  // =========================================
  // LIMPIAR ESPACIOS
  // =========================================

  sanitizeUser(user: UserDetail): UserDetail {

    return {

      ...user,

      nombre: user.nombre?.trim() || '',

      email: user.email?.trim().toLowerCase() || '',

      telefono: user.telefono?.trim() || '',

      dni: user.dni?.trim().toUpperCase() || '',

      direccion: user.direccion?.trim() || '',

      numeroSocio: user.numeroSocio?.trim() || ''
    };
  }

  // =========================================
  // PERFIL COMPLETO
  // =========================================

  isProfileComplete(user: UserDetail): boolean {

    if (!user) {
      return false;
    }

    if (!user.nombre) {
      return false;
    }

    if (!user.email) {
      return false;
    }

    // SOCIOS Y DIRECTIVA

    if (
      user.tipo === 'socio' ||
      user.tipo === 'directiva'
    ) {

      if (!user.numeroSocio) {
        return false;
      }

      if (!user.dni) {
        return false;
      }
    }

    return true;
  }

  // =========================================
  // PREPARAR UPDATE USER
  // =========================================

  buildUpdatePayload(user: UserDetail): Partial<UserDetail> {

    return {

      nombre: user.nombre,

      telefono: user.telefono || '',

      dni: user.dni || '',

      direccion: user.direccion || '',

      foto: user.foto || '',

      tipo: user.tipo,

      numeroSocio: user.numeroSocio || '',

      aprobado: user.aprobado,

      perfilCompleto: user.perfilCompleto,

      estadoSolicitud: user.estadoSolicitud
    };
  }

  // =========================================
  // RESET CREDENCIALES
  // =========================================

  resetCredentials(): UserCredentialsForm {

    return this.createEmptyCredentials();
  }

  // =========================================
  // CLONAR USER
  // =========================================

  cloneUser(user: UserDetail): UserDetail {

    return JSON.parse(
      JSON.stringify(user)
    );
  }
}