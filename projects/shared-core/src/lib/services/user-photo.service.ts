import { Injectable } from '@angular/core';

import {
  Camera,
  CameraResultType,
  CameraSource
} from '@capacitor/camera';

import {
  ImageCroppedEvent
} from 'ngx-image-cropper';

import { PhotoService } from './photo.service';

@Injectable({
  providedIn: 'root'
})
export class UserPhotoService {

  constructor(
    private photoService: PhotoService
  ) {}

  // =========================================
  // ABRIR GALERIA
  // =========================================

  async selectFromGallery(): Promise<string | null> {

    try {

      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Photos
      });

      return image.dataUrl || null;

    } catch (error) {

      console.error(error);

      return null;
    }
  }

  // =========================================
  // HACER FOTO
  // =========================================

  async takePhoto(): Promise<string | null> {

    try {

      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera
      });

      return image.dataUrl || null;

    } catch (error) {

      console.error(error);

      return null;
    }
  }

  // =========================================
  // PROCESAR CROPPER
  // =========================================

  async processCroppedImage(
    event: ImageCroppedEvent
  ): Promise<string | null> {

    try {

      if (!event.blob) {
        return null;
      }

      return await this.blobToBase64(event.blob);

    } catch (error) {

      console.error(error);

      return null;
    }
  }

  // =========================================
  // SUBIR FOTO PERFIL
  // =========================================

  async uploadUserPhoto(
    uid: string,
    imageBase64: string
  ): Promise<string> {

    return await this.photoService.uploadProfilePhoto(
      uid,
      imageBase64
    );
  }

  // =========================================
  // BLOB → BASE64
  // =========================================

  private blobToBase64(
    blob: Blob
  ): Promise<string> {

    return new Promise((resolve, reject) => {

      const reader = new FileReader();

      reader.onerror = reject;

      reader.onload = () => {

        resolve(
          reader.result as string
        );
      };

      reader.readAsDataURL(blob);
    });
  }

  // =========================================
  // LIMPIAR CROPPER
  // =========================================

  resetCropper() {

    return {
      imageChangedEvent: '',
      croppedImage: '',
      mostrarCropper: false
    };
  }
}