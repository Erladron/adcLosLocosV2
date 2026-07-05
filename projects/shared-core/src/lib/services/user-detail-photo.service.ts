import { Injectable, inject } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { PhotoService } from './photo.service';

/**
 * @class UserDetailPhotoService
 * @description Servicio core de soporte especializado en la gestión multimedia para la ficha de usuario.
 * Interactúa con los plugins por hardware de Capacitor Camera y gestiona la conversión de streams binarios
 * delegando la inserción final en el PhotoService de infraestructura.
 */
@Injectable({
  providedIn: 'root'
})
export class UserDetailPhotoService {

  /** @description Instancia inyectada del servicio core de almacenamiento fotográfico de Storage. @private */
  private photoService: PhotoService = inject(PhotoService);

  /**
   * @constructor
   * @description Inicializa el gestor de capturas multimedia del detalle de usuarios.
   */
  constructor() { }

  /**
   * @method selectPhoto
   * @description Genera dinámicamente un elemento input de tipo archivo en el DOM del navegador para lanzar el explorador nativo.
   * @returns {Promise<any>} Promesa que resuelve el evento de cambio (`change`) del archivo multimedia seleccionado.
   */
  public selectPhoto(): Promise<any> {
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (event: any) => {
        resolve(event);
      };
      input.click();
    });
  }

  /**
   * @method takePhoto
   * @description Despierta e inicializa los sensores de la cámara del chasis móvil. 
   * Pre-escala la resolución física por hardware a un ratio idóneo de 800x800px para aligerar la cuota de almacenamiento de Storage.
   * @returns {Promise<any>} Promesa asíncrona que resuelve el archivo empaquetado dentro de una simulación de estructura DataTransfer.
   */
  public async takePhoto(): Promise<any> {
    const image = await Camera.getPhoto({
      quality: 65,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
      width: 800,
      height: 800
    });

    if (!image.dataUrl) {
      return null;
    }

    const file = this.dataURLtoFile(image.dataUrl, 'camera.jpg');
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);

    return {
      target: {
        files: dataTransfer.files
      }
    };
  }

  /**
   * @method dataURLtoFile
   * @description Algoritmo de desestructuración que convierte una cadena DataURL en Base64 hacia un objeto binario File indexado.
   * @param {string} dataurl Cadena Base64 estructurada procedente de la API de la cámara.
   * @param {string} filename Nombre físico de salida que se le asignará al fichero binario.
   * @returns {File} Fichero binario listo para la manipulación de streams.
   */
  public dataURLtoFile(dataurl: string, filename: string): File {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || '';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  }

  /**
   * @method processCroppedImage
   * @description Sanea e independiza la porción de bits Base64 puros procedentes de los cortes del lienzo de ngx-image-cropper.
   * @param {any} event Objeto evento resultante emitido por el cropper.
   * @returns {string} Cadena Base64 de la imagen limpia o un string vacío en caso de inconsistencia.
   */
  public processCroppedImage(event: any): string {
    if (!event?.base64) {
      return '';
    }
    return event.base64;
  }

  /**
   * @method uploadProfilePhoto
   * @description Invoca de forma asíncrona al PhotoService core para tramitar la subida física del binario del avatar a Firebase Storage.
   * @param {string} id Identificador único de usuario (UID) que se usará para nombrar al fichero en Storage.
   * @param {string} imageBase64 Flujo de caracteres en Base64 de la fotografía de perfil solvente.
   * @returns {Promise<string>} Promesa que resuelve la URL pública de descarga emitida por el servidor de Storage.
   */
  public async uploadProfilePhoto(id: string, imageBase64: string): Promise<string> {
    return await this.photoService.uploadProfilePhoto(id, imageBase64);
  }
}