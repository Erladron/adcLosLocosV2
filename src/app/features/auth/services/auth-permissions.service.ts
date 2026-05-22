import {
  Injectable
} from '@angular/core';

import {
  UserRole
} from '../../users/models/user-role.enum';

import {
  UserStatus
} from '../../users/models/user-status.enum';

@Injectable({

  providedIn: 'root'

})

export class AuthPermissionsService {

  // ============================================
  // SESSION
  // ============================================

  isLogged(user: any): boolean {

    return !!user;

  }

  getUid(user: any): string {

    return user?.uid || '';

  }

  // ============================================
  // ROLE
  // ============================================

  getRole(userData: any): string {

    return userData?.tipo || '';

  }

  isAdmin(userData: any): boolean {

    return this.getRole(userData)

      ===

      UserRole.ADMINISTRADOR;

  }

  isDirectiva(userData: any): boolean {

    return this.getRole(userData)

      ===

      UserRole.DIRECTIVA;

  }

  isSocio(userData: any): boolean {

    return this.getRole(userData)

      ===

      UserRole.SOCIO;

  }

  isInvitado(userData: any): boolean {

    return this.getRole(userData)

      ===

      UserRole.INVITADO;

  }

  // ============================================
  // STATUS
  // ============================================

  hasStatus(

    userData: any,

    status: UserStatus

  ): boolean {

    return (

      userData?.estado

      ===

      status

    );

  }

  isActivo(userData: any): boolean {

    return this.hasStatus(

      userData,

      UserStatus.ACTIVE

    );

  }

  isPendienteDatos(
    userData: any
  ): boolean {

    return this.hasStatus(

      userData,

      UserStatus.PENDING_DATA

    );

  }

  isPendienteAprobacion(
    userData: any
  ): boolean {

    return this.hasStatus(

      userData,

      UserStatus.PENDING_APPROVAL

    );

  }

  isRechazado(
    userData: any
  ): boolean {

    return this.hasStatus(

      userData,

      UserStatus.REJECTED

    );

  }

  isDeshabilitado(
    userData: any
  ): boolean {

    return this.hasStatus(

      userData,

      UserStatus.DISABLED

    );

  }

}