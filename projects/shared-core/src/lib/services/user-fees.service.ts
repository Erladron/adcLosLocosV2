import { Injectable, inject } from '@angular/core';
import { Firestore, doc, updateDoc, writeBatch } from '@angular/fire/firestore';
import { User } from '../models/users.models';
import { UserRole } from '../models/user-role.enum';

/**
 * @class UserFeesService
 * @description Servicio satélite especializado de la capa de datos encargado en exclusiva de la gestión,
 * auditoría y validación perimetral del estado financiero y solvencia de las cuotas de los socios.
 * Aisla la lógica de tesorería para evitar la proliferación de ficheros monstruo en el core.
 */
@Injectable({
  providedIn: 'root'
})
export class UserFeesService {

  /** @description Instancia inyectada del SDK modular de Cloud Firestore para persistencia atómica. @private */
  private firestore: Firestore = inject(Firestore);

  /**
   * @constructor
   * @description Inicializa el motor de control financiero de tesorería.
   */
  constructor() { }

  /**
   * @method updateCuotaStatus
   * @description Registra de forma atómica el estado de pago de la cuota del socio en Firestore.
   * Encapsula la inyección obligatoria de metadatos de auditoría de tesorería exigida por las Security Rules.
   * @param {string} uid UID único del socio cuya cuota va a actualizarse.
   * @param {boolean} alCorriente Nuevo estado financiero booleano (true si está pagado, false si está pendiente).
   * @param {string} adminUid UID del administrador o miembro de la directiva ejecutor que firma la modificación.
   * @param {string} adminNombre Nombre civil descriptivo del administrador ejecutor.
   * @returns {Promise<void>} Promesa asíncrona de actualización en la nube.
   */
  public async updateCuotaStatus(
    uid: string, 
    alCorriente: boolean, 
    adminUid: string, 
    adminNombre: string
  ): Promise<void> {
    const userDocRef = doc(this.firestore, `users/${uid}`);
    return await updateDoc(userDocRef, {
      cuotaAlCorriente: alCorriente,
      cuotaActualizadaPorUid: adminUid,
      cuotaActualizadaPorNombre: adminNombre,
      cuotaActualizadaAt: new Date() // Criterio unificado: Objeto Date nativo mapeado a Timestamp
    });
  }

  public async updateCuotasMasivas(
    cambios: { uid: string, alCorriente: boolean }[],
    adminUid: string,
    adminNombre: string
  ): Promise<void> {
    const batch = writeBatch(this.firestore);
    cambios.forEach(c => {
      const userDocRef = doc(this.firestore, `users/${c.uid}`);
      batch.update(userDocRef, {
        cuotaAlCorriente: c.alCorriente,
        cuotaActualizadaPorUid: adminUid,
        cuotaActualizadaPorNombre: adminNombre,
        cuotaActualizadaAt: new Date()
      });
    });
    return await batch.commit();
  }

  /**
   * @method esSocioSolvente
   * @description 💡 REGLA DE NEGOCIO INTERNA: Evalúa la solvencia financiera de un usuario.
   * Si el tipo de usuario no es un rol sujeto a cuotas (como invitados o porteros), la regla determina que "sí" es solvente
   * de forma transparente por bypass de esquema. Si es socio o directiva, valida estrictamente el booleano.
   * @param {User | null | undefined} user Instancia de datos del usuario que se pretende evaluar.
   * @returns {boolean} Retorna true si el usuario está al corriente de pago o si está exento de cuota.
   */
  public esSocioSolvente(user: User | null | undefined): boolean {
    if (!user) return false;
    
    // Si el usuario no pertenece a los roles de pago oficiales, se le concede acceso por bypass lógico
    if (user.tipo !== UserRole.SOCIO && user.tipo !== UserRole.DIRECTIVA) {
      return true;
    }

    return !!user.cuotaAlCorriente;
  }
}