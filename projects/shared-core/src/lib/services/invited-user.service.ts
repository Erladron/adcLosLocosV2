import { Injectable, inject } from '@angular/core';
import { 
  Firestore, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  serverTimestamp, 
  updateDoc, 
  doc 
} from '@angular/fire/firestore';
import { InvitedUser } from '../models/invited-user.model';

/**
 * @class InvitedUserService
 * @description Servicio de infraestructura encargado de administrar las credenciales de siembra,
 * expedición de invitaciones de la Junta y canjes automáticos de tokens durante el onboarding.
 */
@Injectable({
  providedIn: 'root'
})
export class InvitedUserService {

  /** @description Instancia inyectada del SDK modular de Cloud Firestore. @private */
  private firestore = inject(Firestore);

  /**
   * @constructor
   * @description Inicializa el servicio de gestión de pre-altas.
   */
  constructor() {}

  /**
   * @method createInvitation
   * @description Registra un nuevo token de pre-alta web en la colección del servidor adjudicándole marcas de tiempo nativas.
   * @param {InvitedUser} invitation Payload estructural con los datos civiles del aspirante autorizados por la directiva.
   * @returns {Promise<any>} Referencia del documento generado en la base NoSQL.
   */
  public async createInvitation(invitation: InvitedUser): Promise<any> {
    const invitedRef = collection(this.firestore, 'invitedUsers');

    return await addDoc(invitedRef, {
      ...invitation,
      fechaInvitacion: serverTimestamp(), // Forzamos el reloj transaccional del servidor
      usado: false
    });
  }

  /**
   * @method getInvitationByEmail
   * @description Localiza el documento de siembra de un aspirante mediante su correo electrónico normalizado.
   * @param {string} email Dirección de correo electrónico sujeta a escrutinio.
   * @returns {Promise<InvitedUser | null>} Instancia del modelo tipado o null si no consta autorización previa.
   */
  public async getInvitationByEmail(email: string): Promise<InvitedUser | null> {
    const normalizedEmail = email.trim().toLowerCase();
    const invitedRef = collection(this.firestore, 'invitedUsers');

    // Buscamos coincidencia atómica por correo electrónico
    const q = query(
      invitedRef,
      where('email', '==', normalizedEmail)
    );

    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      return null;
    }

    // Estrategia defensiva: Si existieran duplicados por re-invitación, priorizamos el token disponible
    const activeDoc = snapshot.docs.find(d => !d.data()['usado']) || snapshot.docs[0];
    
    return {
      id: activeDoc.id,
      ...activeDoc.data()
    } as InvitedUser;
  }

  /**
   * @method isValidInvitation
   * @description Evaluación perimetral rápida que confirma si un email posee un token apto para el registro.
   * @param {string} email Dirección de correo electrónico.
   * @returns {Promise<boolean>} True si el token existe y no ha sido canjeado aún por otra cuenta.
   */
  public async isValidInvitation(email: string): Promise<boolean> {
    const invitation = await this.getInvitationByEmail(email);

    if (!invitation) {
      return false;
    }

    return !invitation.usado;
  }

  /**
   * @method markAsUsed
   * @description Quema transaccionalmente un token de invitación asociándolo de forma inmutable al UID del socio recién registrado.
   * @param {string} invitationId ID del documento de la invitación en Firestore.
   * @param {string} uid UID definitivo generado por Firebase Authentication para el nuevo miembro.
   * @returns {Promise<void>}
   */
  public async markAsUsed(invitationId: string, uid: string): Promise<void> {
    const invitationRef = doc(this.firestore, 'invitedUsers', invitationId);

    await updateDoc(invitationRef, {
      usado: true,
      usadoPorUid: uid,
      fechaRegistro: serverTimestamp() // Sello de tiempo oficial de consolidación
    });
  }
}