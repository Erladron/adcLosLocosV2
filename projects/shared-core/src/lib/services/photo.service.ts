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
import { ErrorHandlerService } from './error-handler.service';

/**
 * @class PhotoService
 * @description Servicio core especialista de infraestructura encargado de administrar la persistencia de ficheros
 * binarios multimedia en Firebase Storage. Provee capacidades de transformación atómica (DataURL Base64 a Blobs binarios)
 * y gestiona las estructuras de directorios aislados para perfiles y cartelería de la peña.
 */
@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  /** @description Instancia inyectada del inyector de entorno para contextos dinámicos asíncronos. @private */
  private injector = inject(EnvironmentInjector);

  /** @description Instancia inyectada del motor core de almacenamiento Firebase Storage. @private */
  private storage = inject(Storage);

  /** @description Instancia inyectada del interceptor y gestor centralizado de excepciones. @private */
  private errorHandler = inject(ErrorHandlerService);

  /**
   * @constructor
   * @description Inicializa el gestor especialista de almacenamiento multimedia.
   */
  constructor() { }

  /**
   * @method uploadProfilePhoto
   * @description Sube la fotografía de avatar de un socio a la carpeta dedicada 'profilePhotos'.
   * Transforma el string DataURL en un Blob físico optimizado antes de realizar la transferencia de red.
   * @param {string} uid Identificador único universal del usuario titular.
   * @param {string} base64 Cadena de caracteres de la imagen en formato DataURL codificada.
   * @returns {Promise<string>} Promesa que resuelve con la URL de descarga pública emitida por Firebase Storage.
   */
  public async uploadProfilePhoto(uid: string, base64: string): Promise<string> {
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
          await this.errorHandler.handle(error);
          throw error;
        }
      }
    );
  }

  /**
   * @method uploadEventPoster
   * @description Sube el póster, cartel publicitario o imagen de una convocatoria a la carpeta 'eventPosters'.
   * Mantiene el mismo flujo de conversión binaria eficiente que la foto de perfil para blindar la memoria móvil.
   * @param {string} eventId Identificador único universal de la convocatoria de referencia.
   * @param {string} base64 Cadena de caracteres de la imagen optimizada desde el canvas local en formato DataURL.
   * @returns {Promise<string>} Promesa que resuelve con la URL de descarga pública para inyectar en el documento de Firestore.
   */
  public async uploadEventPoster(eventId: string, base64: string): Promise<string> {
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
          await this.errorHandler.handle(error);
          throw error;
        }
      }
    );
  }
}