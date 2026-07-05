import { Injectable, inject } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ImageCroppedEvent } from 'ngx-image-cropper';

import { PhotoService } from './photo.service';
import { ErrorHandlerService } from './error-handler.service';
import { CropperState } from '../models/user-detail.model';

/**
 * @class UserPhotoService
 * @description Servicio core de UI especialista en la orquestación e interacción con el hardware multimedia del dispositivo.
 * Provee pasarelas síncronas y asíncronas para disparar la cámara nativa, abrir el carrete de fotos del sistema,
 * procesar lienzos de recorte (ngx-image-cropper) y formatear estructuras binarias.
 */
@Injectable({
  providedIn: 'root'
})
export class UserPhotoService {

  /** @description Instancia inyectada del servicio especialista de persistencia en Storage. @private */
  private photoService = inject(PhotoService);

  /** @description Instancia inyectada del interceptor central de excepciones. @private */
  private errorHandler = inject(ErrorHandlerService);

  /**
   * @constructor
   * @description Inicializa el gestor periférico multimedia.
   */
  constructor() {}

  /**
   * @method selectFromGallery
   * @description Lanza el selector nativo de la galería de fotos del sistema operativo.
   * Captura la imagen seleccionada y la extrae optimizada en una cadena con formato DataURL.
   * @returns {Promise<string | null>} Cadena en formato DataURL Base64 o null en caso de cancelación del socio.
   */
  public async selectFromGallery(): Promise<string | null> {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Photos
      });

      return image.dataUrl || null;
    } catch (error) {
      await this.errorHandler.handle(error);
      return null;
    }
  }

  /**
   * @method takePhoto
   * @description Invoca el disparador de la cámara fotográfica nativa del hardware del terminal.
   * @returns {Promise<string | null>} Cadena con la imagen codificada en formato DataURL Base64 o null si se desiste.
   */
  public async takePhoto(): Promise<string | null> {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera
      });

      return image.dataUrl || null;
    } catch (error) {
      await this.errorHandler.handle(error);
      return null;
    }
  }

  /**
   * @method processCroppedImage
   * @description Procesa de forma atómica el evento emitido por el canvas del recortador visual.
   * Extrae el Blob resultante y lo conmutará a una cadena Base64 apta para el hilo de red.
   * @param {ImageCroppedEvent} event Instancia estructural del evento devuelto por el ngx-image-cropper.
   * @returns {Promise<string | null>} Cadena binaria Base64 de la imagen recortada.
   */
  public async processCroppedImage(event: ImageCroppedEvent): Promise<string | null> {
    try {
      if (!event.blob) {
        return null;
      }

      return await this.blobToBase64(event.blob);
    } catch (error) {
      await this.errorHandler.handle(error);
      return null;
    }
  }

  /**
   * @method uploadUserPhoto
   * @description Delega de forma directa la subida física del avatar del socio hacia las carpetas protegidas del Storage.
   * @param {string} uid Identificador único universal del usuario titular.
   * @param {string} imageBase64 Cadena codificada en formato DataURL de la imagen consolidada.
   * @returns {Promise<string>} URL de descarga pública emitida por el servidor NoSQL.
   */
  public async uploadUserPhoto(uid: string, imageBase64: string): Promise<string> {
    return await this.photoService.uploadProfilePhoto(uid, imageBase64);
  }

  /**
   * @method blobToBase64
   * @description Utilidad asíncrona de bajo nivel encargada de leer flujos de objetos Blob nativos y serializarlos en cadenas legibles.
   * @param {Blob} blob Estructura física binaria de la imagen en memoria.
   * @private
   * @returns {Promise<string>}
   */
  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result as string);
      };

      reader.readAsDataURL(blob);
    });
  }

  /**
   * @method resetCropper
   * @description 🚀 TIPADO: Genera un objeto de estado unificado e inicializado para limpiar el lienzo del recortador visual en la pantalla.
   * @returns {CropperState} Estructura inicializada conforme al contrato de interfaz oficial corporativo.
   */
  public resetCropper(): CropperState {
    return {
      imageChangedEvent: '',
      croppedImage: '',
      mostrarCropper: false
    };
  }
}