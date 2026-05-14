import { Injectable }
from '@angular/core';

import {

  Storage,
  ref,
  uploadBytes,
  getDownloadURL

} from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  constructor(

    private storage: Storage

  ) {}

  // =================================
  // SUBIR FOTO PERFIL
  // =================================

  async uploadProfilePhoto(

    uid: string,

    base64: string

  ): Promise<string> {

    try {

      // BASE64 → BLOB
      const response =
        await fetch(base64);

      const blob =
        await response.blob();

      // REFERENCIA
      const storageRef =
        ref(

          this.storage,

          `profilePhotos/${uid}.jpg`

        );

      // SUBIR
      await uploadBytes(

        storageRef,

        blob

      );

      // URL FINAL
      return await getDownloadURL(
        storageRef
      );

    } catch (error) {

      console.error(
        'ERROR STORAGE:',
        error
      );

      throw error;

    }

  }

}