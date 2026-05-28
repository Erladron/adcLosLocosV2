import {
  Injectable
} from '@angular/core';

import {
  AuthService
} from 'projects/shared-core/src/lib/services/auth.service';

import {
  UserStatus
} from '../models/user-status.enum';

@Injectable({

  providedIn: 'root'

})

export class AuthPoliciesService {

  constructor(

    private authService:
      AuthService

  ) { }

  // ============================================
  // SESSION
  // ============================================

  isLogged(): boolean {

    return this.authService
      .isLogged();

  }

  // ============================================
  // CURRENT USER
  // ============================================

  get currentUser() {

    return this.authService
      .currentUserData;

  }

  // ============================================
  // ROLE
  // ============================================

  get role(): string {

    return this.authService
      .getRole();

  }

  // ============================================
  // ROLES
  // ============================================

  isAdmin(): boolean {

    return this.role
      === 'administrador';

  }

  isDirectiva(): boolean {

    return this.role
      === 'directiva';

  }

  isSocio(): boolean {

    return this.role
      === 'socio';

  }

  isInvitado(): boolean {

    return this.role
      === 'invitado';

  }

  // ============================================
  // STATUS
  // ============================================

  hasStatus(
    status: UserStatus
  ): boolean {

    return (

      this.currentUser?.estado

      ===

      status

    );

  }

  isActive(): boolean {

    return this.hasStatus(
      UserStatus.ACTIVE
    );

  }

  isPendingData(): boolean {

    return this.hasStatus(
      UserStatus.PENDING_DATA
    );

  }

  isPendingApproval(): boolean {

    return this.hasStatus(
      UserStatus.PENDING_APPROVAL
    );

  }

  // ============================================
  // ADMIN
  // ============================================

  canAccessAdminArea(): boolean {

    return (

      this.isAdmin()

      ||

      this.isDirectiva()

    );

  }

  canManageUsers(): boolean {

    return (

      this.isAdmin()

      ||

      this.isDirectiva()

    );

  }

}