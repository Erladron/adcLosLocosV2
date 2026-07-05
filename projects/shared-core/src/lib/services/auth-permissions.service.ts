import { Injectable } from '@angular/core';
import { UserRole } from '../models/user-role.enum';
import { UserStatus } from '../models/user-status.enum';
import { User } from '../models/users.models';

/**
 * @class AuthPermissionsService
 * @description Servicio especialista síncrono encargado de evaluar la matriz de capacidades, 
 * correspondencia de roles jerárquicos y estados transaccionales sobre los perfiles de usuario.
 * Diseñado como un motor de lógica puro libre de efectos secundarios o dependencias de infraestructura.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthPermissionsService {

  /**
   * @constructor
   * @description Inicializa el evaluador analítico de permisos.
   */
  constructor() { }

  // =========================================================================
  // 🔐 SESSION EVALUATORS (Comprobaciones Básicas de Canales de Auth)
  // =========================================================================

  /**
   * @method isLogged
   * @description Evalúa de forma lógica la presencia o nulidad de la instancia física de Firebase Auth.
   * @param {any} user Instancia cruda de la cuenta en el SDK.
   * @returns {boolean} True si hay un operador autenticado en el cliente.
   */
  public isLogged(user: any): boolean {
    return !!user;
  }

  /**
   * @method getUid
   * @description Extrae de forma segura el identificador único alfanumérico (UID) de la sesión.
   * @param {any} user Instancia cruda de la cuenta en el SDK.
   * @returns {string} Cadena con el UID resultante o un string vacío en caso de inconsistencia.
   */
  public getUid(user: any): string {
    return user?.uid || '';
  }

  // =========================================================================
  // 🏅 ROLE EVALUATORS (Mapeo de Rangos Jerárquicos Estrictos)
  // =========================================================================

  /**
   * @method getRole
   * @description Recupera la propiedad tipo que define el rol asignado en el documento.
   * @param {User | null} userData Instancia del modelo estructural de usuario.
   * @returns {string} Cadena correspondiente al rol o string vacío.
   */
  public getRole(userData: User | null): string {
    return userData?.tipo || '';
  }

  /**
   * @method isAdmin
   * @description Valida si el miembro ostenta privilegios totales de Administrador en el ecosistema.
   * @param {User | null} userData Instancia del modelo de usuario.
   * @returns {boolean} True si coincide con UserRole.ADMINISTRADOR.
   */
  public isAdmin(userData: User | null): boolean {
    return this.getRole(userData) === UserRole.ADMINISTRADOR;
  }

  /**
   * @method isDirectiva
   * @description Valida si el miembro pertenece formalmente al cuerpo operativo de la Junta Directiva.
   * @param {User | null} userData Instancia del modelo de usuario.
   * @returns {boolean} True si coincide con UserRole.DIRECTIVA.
   */
  public isDirectiva(userData: User | null): boolean {
    return this.getRole(userData) === UserRole.DIRECTIVA;
  }

  /**
   * @method isSocio
   * @description Valida si la cuenta corresponde a la ficha regular de un Socio de la peña.
   * @param {User | null} userData Instancia del modelo de usuario.
   * @returns {boolean} True si coincide con UserRole.SOCIO.
   */
  public isSocio(userData: User | null): boolean {
    return this.getRole(userData) === UserRole.SOCIO;
  }

  /**
   * @method isInvitado
   * @description Valida si el usuario se encuentra tipado como un Invitado externo en fase latente.
   * @param {User | null} userData Instancia del modelo de usuario.
   * @returns {boolean} True si coincide con UserRole.INVITADO.
   */
  public isInvitado(userData: User | null): boolean {
    return this.getRole(userData) === UserRole.INVITADO;
  }

  // =========================================================================
  // ⚙️ STATUS EVALUATORS (Fases del Ciclo de Vida del Miembro)
  // =========================================================================

  /**
   * @method hasStatus
   * @description Compara de forma genérica el estado actual del documento frente a un token UserStatus determinado.
   * @param {User | null} userData Instancia del modelo de usuario.
   * @param {UserStatus} status Constante del enumerado de control con el que contrastar.
   * @returns {boolean} True en caso de equivalencia atómica.
   */
  public hasStatus(userData: User | null, status: UserStatus): boolean {
    return userData?.estado === status;
  }

  /**
   * @description Retorna true si el socio consta plenamente habilitado y activo en el sistema.
   */
  public isActivo(userData: User | null): boolean {
    return this.hasStatus(userData, UserStatus.ACTIVE);
  }

  /**
   * @description Retorna true si el aspirante tiene pendiente la cumplimentación civil de sus datos personales.
   */
  public isPendienteDatos(userData: User | null): boolean {
    return this.hasStatus(userData, UserStatus.PENDING_DATA);
  }

  /**
   * @description Retorna true si el alta del perfil está en cola a la espera de la revisión de la Junta.
   */
  public isPendienteAprobacion(userData: User | null): boolean {
    return this.hasStatus(userData, UserStatus.PENDING_APPROVAL);
  }

  /**
   * @description Retorna true si la solicitud de alta del usuario fue desestimada y denegada.
   */
  public isRechazado(userData: User | null): boolean {
    return this.hasStatus(userData, UserStatus.REJECTED);
  }

  /**
   * @description Retorna true si la cuenta presenta una baja lógica del sistema por impago o sanción.
   */
  public isDeshabilitado(userData: User | null): boolean {
    return this.hasStatus(userData, UserStatus.INACTIVE);
  }
}