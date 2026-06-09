import { 
  Injectable, 
  inject, 
  EnvironmentInjector, 
  runInInjectionContext 
} from '@angular/core';
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

  // Injector de entorno para ejecutar contextos de inyección dinámicos en promesas asíncronas
  private injector = inject(EnvironmentInjector);

  constructor(
    private storage: Storage
  ) { }

  /**
   * Sube la foto de perfil de un socio a la carpeta 'profilePhotos'
   * @param uid Identificador único del usuario
   * @param base64 String de la imagen en formato DataURL
   * @returns Promesa con la URL de descarga pública de Firebase Storage
   */
  async uploadProfilePhoto(uid: string, base64: string): Promise<string> {
    return await runInInjectionContext(
      this.injector,
      async () => {
        try {
          const response = await fetch(base64);
          const blob = await response.blob();
          const storageRef = ref(this.storage, `profilePhotos/${uid}.jpg`);

          await uploadBytes(storageRef, blob);
          return await getDownloadURL(storageRef);
        } catch (error) {
          console.error('ERROR STORAGE PERFIL:', error);
          throw error;
        }
      }
    );
  }

  /**
   * OPTIMIZACIÓN PEÑA: Sube el póster o cartel de un evento a la carpeta dedicada 'eventPosters'
   * Mantiene el mismo flujo atómico y eficiente de conversión binaria que la foto de perfil.
   * * @param eventId Identificador único del evento (UUID generado en cliente o Firestore)
   * @param base64 String de la imagen optimizada en formato DataURL desde el canvas local
   * @returns Promesa con la URL de descarga pública para almacenar en el documento del evento
   */
  async uploadEventPoster(eventId: string, base64: string): Promise<string> {
    return await runInInjectionContext(
      this.injector,
      async () => {
        try {
          // ==========================================
          // TRANSFORMACIÓN: BASE64 -> BLOB BINARIO
          // ==========================================
          const response = await fetch(base64);
          const blob = await response.blob();

          // ==========================================
          // UBICACIÓN DE STORAGE: Carpeta independiente
          // ==========================================
          const storageRef = ref(this.storage, `eventPosters/${eventId}.jpg`);

          // ==========================================
          // PERSISTENCIA DE DATOS
          // ==========================================
          await uploadBytes(storageRef, blob);

          // Retornamos el enlace público definitivo
          return await getDownloadURL(storageRef);
        } catch (error) {
          console.error('ERROR STORAGE EVENTOS:', error);
          throw error;
        }
      }
    );
  }
}