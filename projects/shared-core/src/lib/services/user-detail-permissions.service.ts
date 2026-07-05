import { Injectable, inject } from '@angular/core';
import { AuthService } from 'projects/shared-core/src/lib/services/auth.service';
import { User } from '../models/users.models';
import { UserRole } from '../models/user-role.enum';

/**
 * @class UserDetailPermissionsService
 * @description Evaluador analítico síncrono encargado de resolver la matriz de capacidades, flags de navegación
 * y permisos visuales de los subformularios del detalle cruzando las variables de sesión del operador activo frente al socio en pantalla.
 */
@Injectable({
  providedIn: 'root'
})
export class UserDetailPermissionsService {

  /** @description Instancia inyectada del motor central de sesiones y roles del ecosistema. @private */
  private authService: AuthService = inject(AuthService);

  /**
   * @constructor
   * @description Inicializa el evaluador de privilegios del detalle de usuarios.
   */
  constructor() { }

  /**
   * @method getPermissions
   * @description Compila de forma masiva el set completo de banderas condicionales booleanas requeridas por la interfaz gráfica.
   * Determina de forma automática el estado de roles y si el operador está consultando su propia ficha corporativa.
   * @param {User} user Instancia de datos del usuario mapeado activamente en la pantalla.
   * @returns {any} Mapa indexado con los booleanos jerárquicos y capacidades de edición computados.
   */
  public getPermissions(user: User): any {
    const isAdmin = this.authService.isAdmin();
    const isDirectiva = this.authService.isDirectiva();
    const isSocio = this.authService.isSocio();
    const isInvitado = this.authService.isInvitado();

    const isOwnProfile = this.authService.getUid() === user.id;
    const isNewUser = !user.id;

    const canEditPersonalData = isAdmin || isDirectiva || isNewUser || isOwnProfile;

    let canEditMembership = false;
    if (isAdmin) {
      canEditMembership = true;
    } else if (isDirectiva) {
      canEditMembership = user.tipo === UserRole.INVITADO ||
        user.tipo === UserRole.SOCIO ||
        user.tipo === UserRole.DIRECTIVA ||
        isOwnProfile;
    }

    const canEditCredentials = isOwnProfile;
    const canEditPassword = isOwnProfile;

    return {
      isAdmin,
      isDirectiva,
      isSocio,
      isInvitado,
      isOwnProfile,
      canEditPersonalData,
      canEditMembership,
      canEditCredentials,
      canEditPassword
    };
  }

  /**
   * @method isOwnProfile
   * @description Evalúa la correspondencia biunívoca de la identidad del operador autenticado frente a la ficha consultada.
   * @param {User} user Instancia del usuario en pantalla.
   * @returns {boolean} Retorna true si el usuario se está consultando a sí mismo.
   */
  public isOwnProfile(user: User): boolean {
    return (this.authService.getUid() === user.id);
  }

  /**
   * @method canEditPersonalData
   * @description Evalúa la capacidad del operador para abrir a flujos de escritura el bloque civil de datos personales.
   * @param {User} user Instancia del usuario en pantalla.
   * @returns {boolean} Retorna true si la mutación civil está amparada por las reglas de negocio.
   */
  public canEditPersonalData(user: User): boolean {
    return (!user.id || this.authService.isAdmin() || this.authService.isDirectiva() || this.isOwnProfile(user));
  }

  /**
   * @method canEditMembership
   * @description Delimita la capacidad operativa jerárquica para alterar roles o números de socio.
   * @param {User} user Instancia del usuario en pantalla.
   * @returns {boolean} Retorna true si el operador posee rango suficiente para alterar la jerarquía del club.
   */
  public canEditMembership(user: User): boolean {
    if (this.authService.isAdmin()) {
      return true;
    }

    if (this.authService.isDirectiva()) {
      return (
        user.tipo === UserRole.INVITADO ||
        user.tipo === UserRole.SOCIO ||
        user.tipo === UserRole.DIRECTIVA ||
        this.isOwnProfile(user)
      );
    }

    return false;
  }

  /**
   * @method canEditCredentials
   * @description Compuerta de seguridad para habilitar la edición de correos electrónicos de acceso de la cuenta.
   * @param {User} user Instancia del usuario en pantalla.
   * @returns {boolean} Retorna true si el operador es el titular legítimo de las credenciales.
   */
  public canEditCredentials(user: User): boolean {
    return this.isOwnProfile(user);
  }

  /**
   * @method canEditPassword
   * @description Compuerta de permisos para autorizar flujos de re-ajuste de claves de inicio de sesión.
   * @param {User} user Instancia del usuario en pantalla.
   * @returns {boolean} Retorna true si es el propietario legítimo de la cuenta.
   */
  public canEditPassword(user: User): boolean {
    return this.isOwnProfile(user);
  }
}