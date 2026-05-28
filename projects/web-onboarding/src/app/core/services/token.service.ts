import { Injectable, inject } from '@angular/core';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private firestore = inject(Firestore);

  async validateInvitation(tokenId: string): Promise<{ isValid: boolean, data?: any, error?: string }> {
    try {
      const invitationRef = doc(this.firestore, `invitedUsers/${tokenId}`);
      const docSnap = await getDoc(invitationRef);

      if (!docSnap.exists()) {
        return { isValid: false, error: 'La invitación no existe o ha sido eliminada.' };
      }

      const invitationData = docSnap.data();

      // Validación adaptada a tu modelo (Booleano)
      // Si la invitación ya marca true en el campo 'usado', la bloqueamos
      if (invitationData['usado'] === true) {
        return { isValid: false, error: 'Esta invitación ya ha sido utilizada.' };
      }

      // Si existe y no ha sido usada, dejamos pasar al usuario
      return { isValid: true, data: invitationData };

    } catch (error) {
      console.error('Error de seguridad al validar el token:', error);
      return { isValid: false, error: 'Error de conexión con el servidor de validación.' };
    }
  }
}