import { Injectable, inject } from '@angular/core';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';

// 🚀 REPARADO: Importación legítima desde el alias de la librería compartida para aplicaciones del monorrepo
import { ErrorHandlerService, InvitedUser } from 'shared-core';

/**
 * @interface TokenValidationResult
 * @description Estructura de control que rige la respuesta del proceso de validación del token de onboarding.
 */
export interface TokenValidationResult {
  /** @description Flag booleano que determina si el token de pre-alta está vigente y apto para su consumo. */
  isValid: boolean;
  /** @description Datos del perfil de siembra recuperados del servidor si el token es solvente. */
  data?: InvitedUser;
  /** @description Texto descriptivo amigable del motivo de la exclusión perimetral si no es válido. */
  error?: string;
}

/**
 * @class TokenService
 * @description Servicio especialista del ecosistema Web-onboarding encargado de visar la solvencia de los enlaces web
 * de invitación generados por la Junta Directiva antes de instanciar los formularios civiles de registro.
 */
@Injectable({
  providedIn: 'root'
})
export class TokenService {
  /** @description Instancia inyectada del SDK modular de Cloud Firestore. @private */
  private firestore = inject(Firestore);

  /** @description Instancia inyectada del interceptor central de excepciones exportado por el core. @private */
  private errorHandler = inject(ErrorHandlerService);

  /**
   * @constructor
   * @description Inicializa el servicio validador de tokens.
   */
  constructor() {}

  /**
   * @method validateInvitation
   * @description Realiza una lectura directa en Firestore para contrastar la existencia y vigencia de una invitación.
   * Bloquea el paso de forma fulminante si el token ya consta quemado en la base de datos (`usado === true`).
   * @param {string} tokenId Identificador único alfanumérico (UUID) del token de la invitación.
   * @returns {Promise<TokenValidationResult>} Objeto estructurado con el dictamen de validación.
   */
  public async validateInvitation(tokenId: string): Promise<TokenValidationResult> {
    try {
      const invitationRef = doc(this.firestore, `invitedUsers/${tokenId}`);
      const docSnap = await getDoc(invitationRef);

      if (!docSnap.exists()) {
        return { isValid: false, error: 'La invitación no existe o ha sido eliminada por la administración.' };
      }

      const invitationData = docSnap.data() as InvitedUser;

      // 🛡️ REGLA DE EXCLUSIÓN: Impedimos el canje múltiple del mismo token
      if (invitationData.usado === true) {
        return { isValid: false, error: 'Esta invitación ya ha sido utilizada para dar de alta otra cuenta.' };
      }

      // Si el documento existe y está íntegro, concedemos paso al chasis visual de Welcome
      return { isValid: true, data: invitationData };

    } catch (error) {
      await this.errorHandler.handle(error);
      return { isValid: false, error: 'Error de comunicación temporal con el servidor de validación.' };
    }
  }
}