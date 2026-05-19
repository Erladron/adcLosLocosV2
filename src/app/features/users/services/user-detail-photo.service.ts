import { Injectable } from '@angular/core';

import {

  Camera,
  CameraResultType,
  CameraSource

} from '@capacitor/camera';

import { PhotoService }
from '@users/services/photo.service';

@Injectable({
  providedIn: 'root'
})

export class UserDetailPhotoService {

  constructor(

    private photoService: PhotoService

  ) { }

  // ============================================
  // SELECT PHOTO
  // ============================================

  /**
   * Abre selector archivos.
   */
  selectPhoto(): Promise<any> {

    return new Promise((resolve) => {

      const input = document.createElement(
        'input'
      );

      input.type = 'file';

      input.accept = 'image/*';

      input.onchange = (event: any) => {

        resolve(event);

      };

      input.click();

    });

  }

  // ============================================
  // TAKE PHOTO
  // ============================================

  /**
   * Abrir cámara dispositivo.
   */
  async takePhoto(): Promise<any> {

    const image =

      await Camera.getPhoto({

        quality: 90,

        resultType:
          CameraResultType.DataUrl,

        source:
          CameraSource.Camera

      });

    // ============================================
    // EMPTY IMAGE
    // ============================================

    if (!image.dataUrl) {

      return null;

    }

    // ============================================
    // CONVERT FILE
    // ============================================

    const file =

      this.dataURLtoFile(

        image.dataUrl,

        'camera.jpg'

      );

    // ============================================
    // DATA TRANSFER
    // ============================================

    const dataTransfer =
      new DataTransfer();

    dataTransfer.items.add(file);

    // ============================================
    // RETURN EVENT
    // ============================================

    return {

      target: {

        files:
          dataTransfer.files

      }

    };

  }

  // ============================================
  // DATA URL TO FILE
  // ============================================

  /**
   * Convierte base64 a File.
   */
  dataURLtoFile(

    dataurl: string,

    filename: string

  ): File {

    const arr =
      dataurl.split(',');

    const mime =
      arr[0].match(/:(.*?);/)?.[1]
      || '';

    const bstr =
      atob(arr[1]);

    let n =
      bstr.length;

    const u8arr =
      new Uint8Array(n);

    while (n--) {

      u8arr[n] =
        bstr.charCodeAt(n);

    }

    return new File(

      [u8arr],

      filename,

      { type: mime }

    );

  }

  // ============================================
  // PROCESS CROPPED IMAGE
  // ============================================

  /**
   * Procesa imagen cropper.
   */
  processCroppedImage(
    event: any
  ): string {

    if (!event?.base64) {

      return '';

    }

    return event.base64;

  }

  // ============================================
  // UPLOAD PROFILE PHOTO
  // ============================================

  /**
   * Subida foto perfil.
   */
  async uploadProfilePhoto(

    uid: string,

    imageBase64: string

  ): Promise<string> {

    return await this.photoService
      .uploadProfilePhoto(

        uid,

        imageBase64

      );

  }

}