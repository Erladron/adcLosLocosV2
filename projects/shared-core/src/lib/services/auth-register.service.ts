import { Injectable, inject } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  getAuth,
  deleteUser,
  signOut,
  UserCredential
} from '@angular/fire/auth';
import {
  Firestore,
  doc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
} from '@angular/fire/firestore';
import {
  initializeApp,
  getApp,
  deleteApp
} from '@angular/fire/app';

import { UserRole } from '../models/user-role.enum';
import { UserStatus } from '../models/user-status.enum'; 
import { User } from '../models/users.models';
import { InvitedUser } from '../models/invited-user.model';
import { AppMessageCode } from '../constants/app-message-code.enum';
import { FIREBASE_ERROR_MAP } from '../constants/firebase-error-map';
import { normalizeName, formatDNI } from '../utils/string.utils';

// 🚀 Saneado: Uso de importaciones relativas internas del Shared Core para evitar roturas en CI/CD
import { InvitedUserService } from './invited-user.service';
import { UserService } from './user.service';

/**
 * @class AuthRegisterService
 * @description Servicio core transaccional encargado de orquestar el alta e inscripción de usuarios en la plataforma.
 * Gestiona de forma síncrona la sincronización entre Firebase Authentication y Cloud Firestore, aplicando
 * un patrón rollback estricto en caso de fallo parcial para evitar registros huérfanos o inconsistencias.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthRegisterService {

  /** @description Instancia inyectada del chasis de autenticación de Firebase. @private */
  private auth = inject(Auth);

  /** @description Instancia inyectada del SDK modular de Cloud Firestore. @private */
  private firestore = inject(Firestore);

  /** @description Instancia inyectada del gestor de tokens de pre-alta de invitaciones. @private */
  private invitedUserService = inject(InvitedUserService);

  /** @description Instancia inyectada del servicio core de gestión de usuarios. @private */
  private userService = inject(UserService);

  /**
   * @constructor
   * @description Inicializa el motor transaccional de registro.
   */
  constructor() { }

  /**
   * @method register
   * @description Orquesta el flujo atómico de registro. Si es un registro civil común (`checkInvitation = true`),
   * exige y consume un token válido de invitación. Si es un alta administrativa (`checkInvitation = false`),
   * levanta una instancia secundaria de Firebase App en caliente para evitar la suplantación de la sesión activa del directivo.
   * @param {Partial<User>} user DTO con la información civil y credenciales facilitadas en el formulario.
   * @param {boolean} checkInvitation Determina si se aplica la restricción perimetral de invitaciones.
   * @returns {Promise<User | null>} Documento consolidado del usuario de Firestore.
   */
  public async register(user: Partial<User> & { password?: string }, checkInvitation: boolean = true): Promise<User | null> {
    if (!user.email) {
      throw new Error(AppMessageCode.ADC_AUTH_ERR_0006);
    }

    const email = user.email.trim().toLowerCase();
    let invitation: InvitedUser | null = null;

    // 1. Validación de invitación perimetral si aplica
    if (checkInvitation) {
      invitation = await this.validateInvitation(email);
      if (!invitation) {
        throw new Error(AppMessageCode.ADC_AUTH_ERR_0011); // Error: Invitación no encontrada o usada
      }
    }

    let uid = '';
    let createdCredential: UserCredential | null = null;

    try {
      // 2. Creación de la identidad en Firebase Authentication
      if (!checkInvitation) {
        if (!user.password) throw new Error(AppMessageCode.ADC_AUTH_ERR_0005);
        uid = await this.createAdminUser(email, user.password);
      } else {
        if (!user.password) throw new Error(AppMessageCode.ADC_AUTH_ERR_0005);
        createdCredential = await this.createNormalUser(email, user.password);
        uid = createdCredential.user.uid;
      }

      // 3. Persistencia del documento civil en Cloud Firestore
      await this.saveFirestoreUser(uid, user, email, checkInvitation, invitation);

      // 4. Consumo lógico del token de pre-alta si el flujo es de invitado común
      if (checkInvitation && invitation?.id) {
        await this.invitedUserService.markAsUsed(invitation.id, uid);
      }

      // 5. Descarga y devolución de la proyección unificada de datos resultante
      const firestoreUser = await this.userService.getById(uid);
      console.log('🎫 [AuthRegisterService] Alta atómica consolidada con éxito en el servidor:', firestoreUser);
      
      return firestoreUser;

    } catch (error) {
      console.error('🚨 [AuthRegisterService] Fallo transaccional detectado. Disparando secuencia de Rollback...', error);

      // 🔄 ECO-ROLLBACK ETAPA A: Purga física del documento en la base NoSQL
      if (uid) {
        try {
          await deleteDoc(doc(this.firestore, 'users', uid));
        } catch (rollbackError) {
          console.error('💥 [Rollback] Error crítico al borrar el registro huérfano de Firestore:', rollbackError);
        }
      }

      // 🔄 ECO-ROLLBACK ETAPA B: Eliminación de la identidad en Firebase Authentication
      if (createdCredential?.user) {
        try {
          await deleteUser(createdCredential.user);
        } catch (rollbackError) {
          console.error('💥 [Rollback] Error crítico al revocar la credencial de Firebase Auth:', rollbackError);
        }
      }

      // 🔄 ECO-ROLLBACK ETAPA C: Desconexión de seguridad preventiva
      try {
        await signOut(this.auth);
      } catch { }

      throw error;
    }
  }

  /**
   * @method validateInvitation
   * @description Consulta en Firestore si existe un token de siembra autorizado, vigente y sin consumir para el email.
   * @param {string} email Correo electrónico a evaluar.
   * @returns {Promise<InvitedUser | null>} Token estructurado resultante o null en su defecto.
   * @private
   */
  private async validateInvitation(email: string): Promise<InvitedUser | null> {
    const q = query(
      collection(this.firestore, 'invitedUsers'),
      where('email', '==', email),
      where('usado', '==', false)
    );

    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;

    const docSnap = snapshot.docs[0];
    return {
      id: docSnap.id,
      ...docSnap.data()
    } as InvitedUser;
  }

  /**
   * @method createAdminUser
   * @description Implementa el patrón de inicialización de App Secundaria en caliente. Permite a un directivo
   * logueado dar de alta a un socio manualmente en Firebase Auth sin alterar ni cerrar su propia sesión de trabajo.
   * @param {string} email Correo del nuevo usuario.
   * @param {string} password Contraseña del nuevo usuario.
   * @returns {Promise<string>} UID de la identidad generada.
   * @private
   */
  private async createAdminUser(email: string, password: string): Promise<string> {
    const currentConfig = getApp().options;
    const secondaryApp = initializeApp(currentConfig, 'SecondaryRegisterInstance');
    const secondaryAuth = getAuth(secondaryApp);

    try {
      const credential = await createUserWithEmailAndPassword(secondaryAuth, email, password);
      const uid = credential.user.uid;
      
      await deleteApp(secondaryApp);
      return uid;
    } catch (error: any) {
      await deleteApp(secondaryApp);
      this.handleRegisterError(error);
    }
  }

  /**
   * @method createNormalUser
   * @description Ejecuta el alta de identidades ordinaria sobre el contexto principal de autenticación.
   * @param {string} email Correo de registro.
   * @param {string} password Contraseña de acceso.
   * @returns {Promise<UserCredential>} Credencial resultante de la operación.
   * @private
   */
  private async createNormalUser(email: string, password: string): Promise<UserCredential> {
    try {
      return await createUserWithEmailAndPassword(this.auth, email, password);
    } catch (error: any) {
      this.handleRegisterError(error);
    }
  }

  /**
   * @method saveFirestoreUser
   * @description Transforma sintácticamente los datos civiles mediante utilidades síncronas y persiste el JSON resultante en Firestore.
   * @param {string} uid UID definitivo de adscripción.
   * @param {any} user Atributos procedentes del formulario.
   * @param {string} email Correo normalizado.
   * @param {boolean} checkInvitation Flag del tipo de flujo ejecutado.
   * @param {InvitedUser | null} invitation Instancia de la invitación si aplica.
   * @private
   */
  private async saveFirestoreUser(
    uid: string,
    user: any,
    email: string,
    checkInvitation: boolean,
    invitation: InvitedUser | null = null
  ): Promise<void> {
    const userDocRef = doc(this.firestore, 'users', uid);

    // Si es una invitación web común, forzamos los roles mínimos por seguridad del servidor, ignorando el payload del cliente
    const tipoFinal = checkInvitation ? UserRole.INVITADO : (user.tipo || UserRole.INVITADO);
    const estadoFinal = checkInvitation ? UserStatus.PENDING_DATA : (user.estado || UserStatus.PENDING_DATA);

    await setDoc(userDocRef, {
      nombre: normalizeName(user.nombre || user.nombreCompleto || ''),
      email: email,
      telefono: user.telefono || '',
      dni: formatDNI(user.dni || ''),
      direccion: user.direccion || '',
      foto: user.foto || '',
      tipo: tipoFinal,     // 🔒 Forzado inmutable en servidor
      estado: estadoFinal, // 🔒 Forzado inmutable en servidor
      createdAt: new Date(),
      creadoPor: user.creadoPor || '',
      creadoPorNombre: user.creadoPorNombre || '',
      invitadoPor: invitation?.invitadoPorUid || invitation?.invitadoPor || '',
      invitadoPorNombre: invitation?.invitadoPor || invitation?.invitadoPor || '',
      fechaInvitacion: invitation?.fechaInvitacion || null
    });
  }

  /**
   * @method handleRegisterError
   * @description 🚀 REFACTORIZADO: Intercepta las excepciones nativas de Firebase y las mapea al estándar
   * fuertemente tipado de constantes sirviéndose del FIREBASE_ERROR_MAP global.
   * @param {any} error Objeto de error emitido por las APIs de Google.
   * @returns {never}
   * @private
   */
  private handleRegisterError(error: any): never {
    const nativeCode = error?.code;
    
    if (nativeCode && FIREBASE_ERROR_MAP[nativeCode]) {
      throw new Error(FIREBASE_ERROR_MAP[nativeCode]);
    }

    throw new Error(AppMessageCode.ADC_AUTH_ERR_0007); // Fallback: Error general de registro
  }
}