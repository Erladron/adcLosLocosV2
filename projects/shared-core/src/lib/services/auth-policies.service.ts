import { Injectable, inject } from '@angular/core';
import { AuthService } from './auth.service'; // 🚀 Saneado: Importación relativa limpia para evitar la rotura en CI/CD
import { UserStatus } from '../models/user-status.enum';
import { User } from '../models/users.models';

/**
 * @class AuthPoliciesService
 * @description Servicio de nivel superior especialista en la resolución de políticas de negocio complejas
 * y restricciones de acceso perimetral. Utilizado por los Guards de enrutamiento y las directivas estructurales 
 * de la vista para determinar si un socio puede alterar el estado de un componente.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthPoliciesService {

  /** @description Instancia inyectada de la fachada maestra de sesiones. @private */
  private authService = inject(AuthService);

  /**
   * @constructor
   * @description Inicializa el motor de evaluación de políticas y capacidades.
   */
  constructor() { }

  // =========================================================================
  // 🔐 SESSION POLICIES
  // =========================================================================

  /**
   * @method isLogged
   * @description Informa si consta un canal de autenticación autenticado en la sesión local.
   * @returns {boolean}
   */
  public isLogged(): boolean {
    return this.authService.isLogged();
  }

  // =========================================================================
  // 👤 CURRENT CONTEXTS
  // =========================================================================

  /**
   * @description Provee el documento completo de Firestore con los metadatos de auditoría del socio.
   * @type {User | null}
   */
  get currentUser(): User | null {
    return this.authService.currentUserData;
  }

  /**
   * @description Devuelve la cadena del rango jerárquico que ostenta el usuario logueado.
   * @type {string}
   */
  get role(): string {
    return this.authService.getRole();
  }

  // =========================================================================
  // 🏅 ROLE EVALUATIONS (Delegación Homogénea en Fachada Core)
  // =========================================================================

  /** @description Informa si el usuario posee privilegios de Administrador Supremo. */
  public isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  /** @description Informa si el usuario pertenece formalmente a la Junta Directiva de la peña. */
  public isDirectiva(): boolean {
    return this.authService.isDirectiva();
  }

  /** @description Informa si el usuario posee la ficha regular sujeta a cuotas de Socio. */
  public isSocio(): boolean {
    return this.authService.isSocio();
  }

  /** @description Informa si la cuenta se encuentra tipada como un Invitado externo latente. */
  public isInvitado(): boolean {
    return this.authService.isInvitado();
  }

  // =========================================================================
  // ⚙️ STATE POLICIES (Evaluación de Ciclos de Vida Civiles)
  // =========================================================================

  /**
   * @method hasStatus
   * @description Contrasta si el estado del chasis del perfil coincide con la directiva solicitada.
   * @param {UserStatus} status Constante de verificación de estado.
   * @returns {boolean}
   */
  public hasStatus(status: UserStatus): boolean {
    return this.currentUser?.estado === status;
  }

  /** @description Retorna true si el socio se encuentra en estado plenamente verificado y activo. */
  public isActive(): boolean {
    return this.hasStatus(UserStatus.ACTIVE);
  }

  /** @description Retorna true si el aspirante tiene pendiente la cumplimentación de sus datos de onboarding. */
  public isPendingData(): boolean {
    return this.hasStatus(UserStatus.PENDING_DATA);
  }

  /** @description Retorna true si el alta civil está en la cola a la espera de aprobación formal de la junta. */
  public isPendingApproval(): boolean {
    return this.hasStatus(UserStatus.PENDING_APPROVAL);
  }

  // =========================================================================
  // ⚔️ MATRIX CAPABILITIES (Pasarelas de Gobierno del Sistema)
  // =========================================================================

  /**
   * @method canAccessAdminArea
   * @description Regla de negocio que concede o deniega el acceso perimetral a las vistas de administración.
   * @returns {boolean} True si el operador es Administrador o Directiva.
   */
  public canAccessAdminArea(): boolean {
    return this.isAdmin() || this.isDirectiva();
  }

  /**
   * @method canManageUsers
   * @description Regla de negocio que otorga privilegios de modificación de altas, bajas y estados en el padrón de socios.
   * @returns {boolean} True si el operador es Administrador o Directiva.
   */
  public canManageUsers(): boolean {
    return this.isAdmin() || this.isDirectiva();
  }
}