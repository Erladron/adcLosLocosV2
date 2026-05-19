import { Injectable } from '@angular/core';

import { UserRole } from '../../users/models/user-role.enum';
import { UserStatus } from '../../users/models/user-status.enum';

@Injectable({
  providedIn: 'root'
})

export class AuthPermissionsService {

  // ============================================
  // HELPERS GENERALES
  // ============================================

  /**
   * Obtiene el rol actual del usuario.
   */
  getRole(userData: any): string {

    return userData?.tipo || '';

  }

  /**
   * Obtiene el UID autenticado.
   */
  getUid(user: any): string {

    return user?.uid || '';

  }

  /**
   * Indica si el usuario está logueado.
   */
  isLogged(user: any): boolean {

    return !!user;

  }

  // ============================================
  // ROLES
  // ============================================

  /**
   * Usuario administrador.
   */
  isAdmin(userData: any): boolean {

    return this.getRole(userData)
      === UserRole.ADMINISTRADOR;

  }

  /**
   * Usuario directiva.
   */
  isDirectiva(userData: any): boolean {

    return this.getRole(userData)
      === UserRole.DIRECTIVA;

  }

  /**
   * Usuario socio.
   */
  isSocio(userData: any): boolean {

    return this.getRole(userData)
      === UserRole.SOCIO;

  }

  /**
   * Usuario invitado.
   */
  isInvitado(userData: any): boolean {

    return this.getRole(userData)
      === UserRole.INVITADO;

  }

  // ============================================
  // ESTADOS
  // ============================================

  /**
   * Usuario activo.
   */
  isActivo(userData: any): boolean {

    return userData?.estado
      === UserStatus.ACTIVO;

  }

  /**
   * Usuario pendiente aprobación.
   */
  isPendienteAprobacion(userData: any): boolean {

    return userData?.estado
      === UserStatus.PENDIENTE_APROBACION;

  }

  /**
   * Usuario cancelado.
   */
  isCancelado(userData: any): boolean {

    return userData?.estado
      === UserStatus.CANCELADO;

  }

  // ============================================
  // HELPERS LEGACY
  // ============================================

  /**
   * Compatibilidad antigua.
   * Posible eliminación futura.
   */
  isRegisteredUser(userData: any): boolean {

    return userData?.tipo === 'registrado';

  }

  /**
   * Comprueba si pertenece a colección users.
   */
  isAssociationUser(userData: any): boolean {

    return userData?.source === 'users';

  }

}