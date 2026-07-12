import { Injectable } from '@angular/core';
import { UserRole } from '../models/user-role.enum';
import { User } from '../models/users.models';

/**
 * @class UserPermissionsService
 * @description Servicio especialista síncrono y puro encargado de evaluar la matriz de capacidades,
 * edición cruzada de fichas, borrado y gobernanza perimetral de usuarios en base a sus roles de organización.
 */
@Injectable({
  providedIn: 'root'
})
export class UserPermissionsService {

  /**
   * @constructor
   * @description Inicializa el motor de evaluación de permisos sobre usuarios.
   */
  constructor() { }

  // =========================================================================
  // 🏅 REFACTORIZACIÓN: EVALUADORES DE ROL INTEGRADOS CON ENUMS
  // =========================================================================

  /** @description Informa si el usuario ostenta el rango supremo de Administrador. */
  public isAdmin(user: User | null): boolean {
    if (!user) return false;
    return user.tipo === UserRole.ADMINISTRADOR;
  }

  /** @description Informa si el usuario pertenece al cuerpo operativo de la Junta Directiva. */
  public isDirectiva(user: User | null): boolean {
    if (!user) return false;
    return user.tipo === UserRole.DIRECTIVA;
  }

  /** @description Informa si el usuario posee la ficha regular de Socio. */
  public isSocio(user: User | null): boolean {
    if (!user) return false;
    return user.tipo === UserRole.SOCIO;
  }

  /** @description Informa si el usuario está catalogado como un Invitado externo latente. */
  public isInvitado(user: User | null): boolean {
    if (!user) return false;
    return user.tipo === UserRole.INVITADO;
  }

  // =========================================================================
  // 🛡️ CAPABILITY EVALUATORS (Matriz de Operaciones Cruzadas)
  // =========================================================================

  /**
   * @method canEditPersonalData
   * @description Regla perimetral: Todos los perfiles civiles pueden modificar únicamente sus propios datos.
   * @param {User | null} currentUser Operador activo en la sesión.
   * @param {User | null} targetUser Usuario sobre el que se pretende aplicar la edición.
   * @returns {boolean}
   */
  public canEditPersonalData(currentUser: User | null, targetUser: User | null): boolean {
    if (!currentUser || !targetUser) return false;
    return currentUser.id === targetUser.id;
  }

  /**
   * @method canEditMembership
   * @description Regla organizativa: Los administradores mutan cualquier cuenta menos la suya propia.
   * Los directivos pueden alterar los metadatos organizativos de socios y otros directivos.
   */
  public canEditMembership(currentUser: User | null, targetUser: User | null): boolean {
    if (!currentUser || !targetUser) return false;

    if (this.isAdmin(currentUser)) {
      return currentUser.id !== targetUser.id;
    }

    if (this.isDirectiva(currentUser)) {
      return targetUser.tipo === UserRole.SOCIO || targetUser.tipo === UserRole.DIRECTIVA;
    }

    return false;
  }

  /**
   * @method canDeleteUser
   * @description Regla destructiva atómica: Capacidad restrictiva exclusiva de administradores supremos.
   * Se prohíbe de forma taxativa el borrado de la propia cuenta activa.
   */
  public canDeleteUser(currentUser: User | null, targetUser: User | null): boolean {
    if (!currentUser || !targetUser) return false;
    if (!this.isAdmin(currentUser)) return false;
    return currentUser.id !== targetUser.id;
  }

  /** @description Determina si el operador puede visar u homologar solicitudes de onboarding pendientes. */
  public canApproveUsers(user: User | null): boolean {
    if (!user) return false;
    return this.isAdmin(user) || this.isDirectiva(user);
  }

  /** @description Determina si el operador posee permisos de invocación sobre altas manuales. */
  public canCreateUsers(user: User | null): boolean {
    if (!user) return false;
    return this.isAdmin(user) || this.isDirectiva(user);
  }

  /**
   * @method getAvailableRoles
   * @description 🚀 ACTULIZADO: Retorna los tokens de rol asignables por el operador de cara a formularios de altas o cambios de rango.
   * Incorpora el rol PORTERO al catálogo visible de la administración.
   * @param {User | null} user Operador que realiza la consulta.
   * @returns {UserRole[]} Lista de roles disponibles.
   */
  public getAvailableRoles(user: User | null): UserRole[] {
    if (!user) return [];

    if (this.isAdmin(user)) {
      return [
        UserRole.ADMINISTRADOR,
        UserRole.DIRECTIVA,
        UserRole.SOCIO,
        UserRole.INVITADO,
        UserRole.PORTERO
      ];
    }

    if (this.isDirectiva(user)) {
      return [
        UserRole.SOCIO,
        UserRole.INVITADO
      ];
    }

    return [UserRole.INVITADO];
  }

  /** @description Evalúa si el operador tiene la facultad jerárquica de conmutar los roles de una cuenta. */
  public canChangeRole(currentUser: User | null, targetUser: User | null): boolean {
    if (!currentUser || !targetUser) return false;

    if (this.isAdmin(currentUser)) {
      return currentUser.id !== targetUser.id;
    }

    if (this.isDirectiva(currentUser)) {
      return targetUser.tipo === UserRole.SOCIO || targetUser.tipo === UserRole.INVITADO;
    }

    return false;
  }

  /** @description Concede o deniega la entrada al panel corporativo de control de gestión de socios. */
  public canAccessManagement(user: User | null): boolean {
    if (!user) return false;
    return this.isAdmin(user) || this.isDirectiva(user);
  }

  /** @description Otorga privilegios para crear, editar o purgar convocatorias en la agenda de eventos. */
  public canManageEvents(user: User | null): boolean {
    if (!user) return false;
    return this.isAdmin(user) || this.isDirectiva(user);
  }

  /** @description Evalúa si la cuenta dispone de permisos para expedir invitaciones web de pre-alta. */
  public canInviteUsers(user: User | null): boolean {
    if (!user) return false;
    return this.isAdmin(user) || this.isDirectiva(user) || this.isSocio(user);
  }

  /** @description Regla de seguridad perimetral: Ningún usuario o directivo puede alterar las credenciales de acceso de un tercero. */
  public canEditCredentials(currentUser: User | null, targetUser: User | null): boolean {
    if (!currentUser || !targetUser) return false;
    return currentUser.id === targetUser.id;
  }
}