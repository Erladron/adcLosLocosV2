import { Injectable, inject } from '@angular/core';
import { User } from '../models/users.models';
import { UserDetailPermissionsService } from './user-detail-permissions.service';
import { UserDetailPhotoService } from './user-detail-photo.service';
import { UserDetailDataService } from './user-detail-data.service';

/**
 * @class UserDetailFacadeService
 * @description Fachada arquitectónica de abstracción encargada de consolidar, unificar y simplificar
 * las llamadas del chasis del controlador de detalle (`UserDetailPage`) hacia los servicios 
 * especialistas de permisos, mutaciones de datos y hardware multimedia de fotografía.
 */
@Injectable({
  providedIn: 'root'
})
export class UserDetailFacadeService {

  /** @description Instancia inyectada del validador de políticas y permisos visuales del detalle. @private */
  private permissionsService: UserDetailPermissionsService = inject(UserDetailPermissionsService);
  
  /** @description Instancia inyectada del gestor multimedia por hardware de capturas y avatares. @private */
  private photoService: UserDetailPhotoService = inject(UserDetailPhotoService);
  
  /** @description Instancia inyectada del orquestador intermedio de procesamiento y lógica de datos. @private */
  private dataService: UserDetailDataService = inject(UserDetailDataService);

  /**
   * @constructor
   * @description Inicializa la fachada unificada del detalle de usuarios.
   */
  constructor() { }

  /**
   * @method getPermissions
   * @description Obtiene de forma síncrona la matriz indexada de capacidades, flags y derechos de edición de la ficha.
   * @param {User} user Instancia del modelo de datos del usuario evaluado en la pantalla.
   * @returns {any} Objeto descriptor de permisos booleanos para el controlador visual.
   */
  public getPermissions(user: User): any {
    return this.permissionsService.getPermissions(user);
  }

  /**
   * @method updatePersonalData
   * @description Canaliza y delega en el DataService el saneamiento y la persistencia de los datos personales civiles.
   * @param {any} data Objeto compuesto con el modelo de datos, ID del documento y Base64 de la imagen del recortador.
   * @returns {Promise<boolean>} Promesa asíncrona que resuelve a true si la mutación civil fue consolidada con éxito.
   */
  public async updatePersonalData(data: { user: User, userId: string | null, croppedImage: string }): Promise<boolean> {
    return await this.dataService.updatePersonalData(data);
  }

  /**
   * @method updateMembership
   * @description Transmite hacia el DataService la orden de actualización de roles corporativos y control financiero de cuotas.
   * @param {any} data Parámetros compuestos del usuario e identificador de documento.
   * @returns {Promise<boolean>} Promesa asíncrona que resuelve a true tras el éxito del guardado jerárquico.
   */
  public async updateMembership(data: { user: User, userId: string | null }): Promise<boolean> {
    return await this.dataService.updateMembership(data);
  }

  /**
   * @method updateCredentials
   * @description Distribuye hacia el DataService la solicitud de validación y cambio de correos electrónicos o contraseñas primarias.
   * @param {any} data Parámetros y contraseñas del formulario de credenciales de seguridad.
   * @returns {Promise<boolean>} Promesa asíncrona de resolución.
   */
  public async updateCredentials(data: {
    user: User,
    userId: string | null,
    originalEmail: string,
    repeatEmail: string,
    password: string,
    repeatPassword: string,
    currentPassword: string,
    isOwnProfile: boolean
  }): Promise<boolean> {
    return await this.dataService.updateCredentials(data);
  }

  /**
   * @method createUser
   * @description Canaliza hacia el DataService el flujo operativo completo de validación y alta manual administrativa de un nuevo socio.
   * @param {any} data Estructura con las contraseñas, emails y datos iniciales de la cuenta.
   * @returns {Promise<boolean>} Promesa asíncrona de creación.
   */
  public async createUser(data: {
    user: User,
    repeatEmail: string,
    password: string,
    repeatPassword: string,
    croppedImage: string
  }): Promise<boolean> {
    return await this.dataService.createUser(data);
  }

  /**
   * @method selectPhoto
   * @description Dispara a través del PhotoService la apertura dinámica del explorador nativo de archivos del sistema operativo.
   * @returns {Promise<any>} Promesa con el evento de cambio (`change`) del archivo multimedia devuelto.
   */
  public async selectPhoto(): Promise<any> {
    return await this.photoService.selectPhoto();
  }

  /**
   * @method takePhoto
   * @description Invoca a través del PhotoService la inicialización y captura de los sensores de la cámara por hardware Capacitor.
   * @returns {Promise<any>} Promesa asíncrona con el evento multimedia estructurado.
   */
  public async takePhoto(): Promise<any> {
    return await this.photoService.takePhoto();
  }

  /**
   * @method processCroppedImage
   * @description Delega en el PhotoService el saneamiento y la extracción del string binario Base64 del lienzo del cropper.
   * @param {any} event Evento nativo emitido por el componente `ngx-image-cropper`.
   * @returns {string} Cadena Base64 limpia de la imagen recortada.
   */
  public processCroppedImage(event: any): string {
    return this.photoService.processCroppedImage(event);
  }
}