import {
  Injectable,
  inject,
  EnvironmentInjector,
  runInInjectionContext
}
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

  // =================================
  // INJECTOR
  // =================================

  private injector =
    inject(EnvironmentInjector);

  constructor(

    private storage: Storage

  ) { }

  // =================================
  // SUBIR FOTO PERFIL
  // =================================

  async uploadProfilePhoto(

    uid: string,

    base64: string

  ): Promise<string> {

    return await runInInjectionContext(

      this.injector,

      async () => {

        try {

          // =============================
          // BASE64 → BLOB
          // =============================

          const response =
            await fetch(base64);

          const blob =
            await response.blob();

          // =============================
          // STORAGE REF
          // =============================

          const storageRef =
            ref(

              this.storage,

              `profilePhotos/${uid}.jpg`

            );

          // =============================
          // UPLOAD
          // =============================

          await uploadBytes(

            storageRef,

            blob

          );

          // =============================
          // URL
          // =============================

          return await getDownloadURL(
            storageRef
          );

        }

        catch (error) {

          console.error(
            'ERROR STORAGE:',
            error
          );

          throw error;

        }

      }

    );

  }

}