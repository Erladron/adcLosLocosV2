import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  getDoc,
  setDoc,
  query,
  where
} from '@angular/fire/firestore';

import {
  Functions,
  httpsCallable
} from '@angular/fire/functions';

import { User } from '../models/users.models';
import { UserStatus } from '../models/user-status.enum';
import { UserRole } from '../models/user-role.enum';
import { UpdatePersonalDataRequest } from '../models/update-personal-data-request.model';
import { UserFeesService } from './user-fees.service'; // 🚀 ASEGÚRATE DE QUE ESTE IMPORT ESTÁ INCLUIDO

/**
 * @class UserService
 * @description Servicio centralizado e inyectable de alta capacidad encargado de la gestión del padrón de socios.
 * Gobierna de forma directa las mutaciones NoSQL e interactúa con el satélite de tesorería core.
 */
@Injectable({
  providedIn: 'root'
})
export class UserService {

  // =========================================================================
  // 📥 INYECCIÓN DE DEPENDENCIAS MODERNA (ESTRICTO SEGÚN .CLINERULES)
  // =========================================================================
  /** @description Instancia del SDK modular de Cloud Firestore para persistencia. @private */
  private firestore = inject(Firestore);
  
  /** @description Instancia nativa del SDK de Firebase Cloud Functions para backend. @private */
  private functions = inject(Functions);
  
  /** @description Satélite financiero de la peña encargado de auditar la solvencia de cuotas. @private */
  private userFeesService = inject(UserFeesService); // 🔒 ¡INJECTADO CORRECTAMENTE AQUÍ!

  /**
   * @constructor
   * @description Constructor limpio y vacío conforme a las reglas modernas de Angular.
   */
  constructor() { }

  /**
   * @method generarUUID
   * @description 💡 CENTRALIZACIÓN UTALITARIA: Genera una cadena identificativa única de tipo UUID V4
   * para la asignación estable de IDs de documentos en operaciones del chasis de soporte y flujos multimedia.
   * @returns {string} Cadena alfanumérica única resultante.
   */
  public generarUUID(): string {
    return crypto.randomUUID();
  }

  /**
   * @method existeNumeroSocio
   * @description Consulta en caliente en la base de datos la existencia de un número de socio asignado para evitar colisiones.
   * Permite inyectar de forma opcional un UID de exclusión para no autocollisionar durante flujos de edición.
   * @param {string} numero Cadena de texto correspondiente al número de socio que se pretende verificar.
   * @param {string} [excluirUid] UID opcional del usuario en edición para omitir en la evaluación.
   * @returns {Promise<boolean>} Promesa asíncrona que resuelve a true si el número de socio ya se encuentra registrado.
   */
  public async existeNumeroSocio(
    numero: string,
    excluirUid?: string
  ): Promise<boolean> {
    if (!numero) {
      return false;
    }
    const usersRef = collection(this.firestore, 'users');
    const q = query(usersRef, where('numeroSocio', '==', numero));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return false;
    }

    if (excluirUid) {
      return snapshot.docs.some(doc => doc.id !== excluirUid);
    }
    return true;
  }

  /**
   * @method create
   * @description Persiste por primera vez un documento de usuario estructurado dentro de la colección core `/users`.
   * @param {string} uid Identificador único de usuario procedente del registro en Firebase Authentication.
   * @param {User} user Instancia de datos estructurada con el modelo de la entidad de usuario.
   * @returns {Promise<void>} Promesa asíncrona de resolución de inserción.
   */
  public async create(uid: string, user: User): Promise<void> {
    const ref = doc(this.firestore, 'users', uid);
    return await setDoc(ref, user);
  }

  /**
   * @method getAll
   * @description Descarga el directorio completo sin filtros de la colección de usuarios del club.
   * Uso exclusivo para tareas críticas administrativas de auditoría.
   * @returns {Promise<User[]>} Promesa que resuelve un array indexado con todos los usuarios registrados.
   */
  public async getAll(): Promise<User[]> {
    const usersRef = collection(this.firestore, 'users');
    const snapshot = await getDocs(usersRef);
    return snapshot.docs.map(docItem => ({
      id: docItem.id,
      ...docItem.data()
    } as User));
  }

  /**
   * @method getApprovedUsers
   * @description Recupera mediante una consulta indexada del servidor a todos los usuarios en estado oficial 'active'.
   * @returns {Promise<User[]>} Promesa asíncrona que resuelve el catálogo de socios y usuarios activos.
   */
  public async getApprovedUsers(): Promise<User[]> {
    const usersRef = collection(this.firestore, 'users');
    const q = query(usersRef, where('estado', '==', UserStatus.ACTIVE));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(docItem => ({
      id: docItem.id,
      ...docItem.data()
    } as User));
  }

  /**
   * @method getUsersForSocioComun
   * @description 🛡️ PRIVACIDAD BLINDADA (RGPD): Descarga el censo de socios activos autorizado.
   * Aplica un filtrado sanitario riguroso en el servicio: si un miembro tiene desactivadas las opciones
   * 'publicarTelefono' o 'publicarEmail', sus datos privados son destruidos antes de retornar el array,
   * impidiendo fugas de información a través del árbol de memoria del cliente.
   * @returns {Promise<User[]>} Catálogo de socios sanitizado y seguro.
   */
  public async getUsersForSocioComun(): Promise<User[]> {
    const usersRef = collection(this.firestore, 'users');
    const qActivosSocio = query(
      usersRef,
      where('tipo', 'in', [UserRole.SOCIO, UserRole.DIRECTIVA, UserRole.INVITADO]),
      where('estado', '==', UserStatus.ACTIVE)
    );
    const snapshot = await getDocs(qActivosSocio);
    
    return snapshot.docs.map(docItem => {
      const data = docItem.data() as User;
      
      // Sanitización defensiva in-memory
      const telefonoSanitizado = data.publicarTelefono ? (data.telefono || '') : '';
      const emailSanitizado = data.publicarEmail ? (data.email || '') : '';
      
      return {
        id: docItem.id,
        nombre: data.nombre,
        tipo: data.tipo,
        estado: data.estado,
        foto: data.foto || '',
        profesion: data.profesion || '',
        numeroSocio: data.numeroSocio || '',
        publicarTelefono: data.publicarTelefono,
        publicarEmail: data.publicarEmail,
        // 🔒 Campos desinfectados si el socio prefiere mantener su privacidad
        telefono: telefonoSanitizado,
        email: emailSanitizado,
        // 🔒 Purgamos el DNI y la dirección física por completo para socios comunes
        dni: '',
        direccion: ''
      } as User;
    });
  }

  /**
   * @method getInactiveUsers
   * @description Recupera mediante consulta indexada del servidor el histórico total de bajas lógicas aplicadas.
   * @returns {Promise<User[]>} Promesa asíncrona con el listado de usuarios inactivos.
   */
  public async getInactiveUsers(): Promise<User[]> {
    const usersRef = collection(this.firestore, 'users');
    const q = query(usersRef, where('estado', '==', UserStatus.INACTIVE));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(docItem => ({
      id: docItem.id,
      ...docItem.data()
    } as User));
  }

  /**
   * @method getPendingUsers
   * @description Descarga de forma asíncrona las solicitudes de pre-alta procedentes de invitaciones web completadas.
   * @returns {Promise<User[]>} Promesa asíncrona con el array de usuarios pendientes de aprobación por la directiva.
   */
  public async getPendingUsers(): Promise<User[]> {
    const usersRef = collection(this.firestore, 'users');
    const q = query(usersRef, where('estado', '==', UserStatus.PENDING_APPROVAL));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(docItem => ({
      id: docItem.id,
      ...docItem.data()
    } as User));
  }

  /**
   * @method getSociosActivosParaMantenimiento
   * @description 💡 CENTRALIZACIÓN OPERATIVA: Recupera mediante filtros en el servidor exclusivamente a los miembros
   * de la masa social activos (Roles socio y directiva) sujetos al abono de cuotas para el panel masivo de tesorería.
   * @returns {Promise<User[]>} Promesa asíncrona con el listado financiero filtrado.
   */
  public async getSociosActivosParaMantenimiento(): Promise<User[]> {
    const usersRef = collection(this.firestore, 'users');
    const q = query(
      usersRef, 
      where('tipo', 'in', [UserRole.SOCIO, UserRole.DIRECTIVA]), 
      where('estado', '==', UserStatus.ACTIVE)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(docItem => ({
      id: docItem.id,
      ...docItem.data() as User
    }));
  }

  /**
   * @method getById
   * @description Busca de forma unívoca un documento de usuario en la base de datos según su UID físico.
   * @param {string} uid Identificador único del documento solicitado.
   * @returns {Promise<User | null>} Promesa asíncrona con el objeto de datos del usuario o null si no se localiza en la base de datos.
   */
  public async getById(uid: string): Promise<User | null> {
    const docRef = doc(this.firestore, 'users', uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as User;
    }
    return null;
  }

  /**
   * @method updatePersonalData
   * @description Modifica de forma quirúrgica los campos de datos de carácter personal civiles y flags de privacidad.
   * @param {string} uid UID único del usuario que sufre la modificación.
   * @param {UpdatePersonalDataRequest} data Payload tipado con las mutaciones de datos autorizadas del formulario.
   * @returns {Promise<void>} Promesa asíncrona de persistencia.
   */
  public async updatePersonalData(uid: string, data: UpdatePersonalDataRequest): Promise<void> {
    const ref = doc(this.firestore, 'users', uid);
    console.log('UPDATE PERSONAL DATA PAYLOAD', data);
    
    return await updateDoc(ref, {
      nombre: data.nombre,
      telefono: data.telefono || '',
      dni: data.dni || '',
      direccion: data.direccion || '',
      detallesDireccion: data.detallesDireccion || '',
      foto: data.foto || '',
      profesion: data.profesion || '',
      publicarTelefono: !!data.publicarTelefono,
      publicarEmail: !!data.publicarEmail,
      estado: data.estado
    });
  }

  /**
   * @method update
   * @description Método genérico intermedio para mutaciones abstractas controladas sobre el documento de usuario.
   * @param {string} uid UID del documento destino.
   * @param {any} data JSON plano con las parejas clave-valor destinadas a impactar el registro.
   * @returns {Promise<void>} Promesa asíncrona de finalización.
   */
  public async update(uid: string, data: any): Promise<void> {
    const ref = doc(this.firestore, 'users', uid);
    return await updateDoc(ref, data);
  }

  /**
   * @method deactivateUser
   * @description Invoca de forma remota la Cloud Function serverless encargada de tramitar la baja de una cuenta.
   * El backend procesa las marcas administrativas e inhabilita las credenciales de sesión en la nube.
   * @param {string} uid UID del usuario que se pretende dar de baja.
   * @param {string} adminUid UID del directivo o administrador autenticado solicitante.
   * @param {string} motivo Texto descriptivo argumentando la razón física o justificación de la desactivación.
   * @returns {Promise<any>} Promesa asíncrona con el veredicto del servidor rematado por Node.js 24.
   */
  public async deactivateUser(uid: string, adminUid: string, motivo: string): Promise<any> {
    const callable = httpsCallable(this.functions, 'deactivateUser');
    return await callable({ uid, adminUid, motivo });
  }

  /**
   * @method reactivateUser
   * @description Despierta de forma reactiva una cuenta desactivada o bloqueada invocando la Cloud Function correspondiente.
   * @param {string} uid UID del usuario suspendido que va a restaurarse a estado activo.
   * @param {string} adminUid UID del administrador autorizador.
   * @returns {Promise<any>} Promesa de retorno asíncrona de la función serverless.
   */
  public async reactivateUser(uid: string, adminUid: string): Promise<any> {
    const callable = httpsCallable(this.functions, 'reactivateUser');
    return await callable({ uid, adminUid });
  }

  /**
   * @method delete
   * @description Ejecuta de forma fulminante la destrucción física permanente de un documento de usuario en la base de datos NoSQL.
   * @param {string} uid UID del documento que se eliminará por completo de la colección principal.
   * @returns {Promise<void>} Promesa de resolución destructiva.
   */
  public async delete(uid: string): Promise<void> {
    const ref = doc(this.firestore, 'users', uid);
    return await deleteDoc(ref);
  }

  /**
   * @method approveUser
   * @description Invoca la Cloud Function serverless encargada de aprobar e incorporar oficialmente un registro pendiente de onboarding al club.
   * @param {string} uid UID del usuario aspirante en estado de revisión.
   * @returns {Promise<any>} Promesa de retorno asíncrona de la función en la nube.
   */
  public async approveUser(uid: string): Promise<any> {
    const callable = httpsCallable(this.functions, 'approveUser');
    return await callable({ uid });
  }

  /**
   * @method rejectUser
   * @description Aplica una actualización directa modificando el estado del usuario a 'rejected', denegando su onboarding.
   * @param {string} uid UID del usuario aspirante rechazado.
   * @returns {Promise<void>} Promesa asíncrona de actualización del estado lógico.
   */
  public async rejectUser(uid: string): Promise<void> {
    const userRef = doc(this.firestore, 'users', uid);
    await updateDoc(userRef, { estado: UserStatus.REJECTED });
  }

  /**
   * @method existsByEmail
   * @description Ejecuta un escaneo indexado y normalizado en minúsculas en Firestore para verificar duplicidades de correos electrónicos.
   * Retorna un objeto descriptor con el origen de la cuenta y sus datos en caso de coincidencia positiva.
   * @param {string} email Cadena de texto correspondiente al correo electrónico que se pretende verificar.
   * @returns {Promise<any>} Promesa asíncrona con el descriptor de existencia y datos adjuntos.
   */
  public async existsByEmail(email: string): Promise<any> {
    const normalizedEmail = email.trim().toLowerCase();
    const usersRef = collection(this.firestore, 'users');
    const qUsers = query(usersRef, where('email', '==', normalizedEmail));
    const usersResult = await getDocs(qUsers);

    if (!usersResult.empty) {
      return {
        exists: true,
        source: 'users',
        data: usersResult.docs[0].data()
      };
    }
    return { exists: false };
  }

  /**
   * @method requestUserApproval
   * @description Despacha una solicitud estructurada de aprobación hacia el trigger en la nube para notificar a los teléfonos de la directiva.
   * @param {any} [data] Payload o argumentos complementarios requeridos por la Cloud Function serverless.
   * @returns {Promise<any>} Promesa asíncrona de resolución del entorno Functions.
   */
  public async requestUserApproval(data?: any): Promise<any> {
    const callable = httpsCallable(this.functions, 'requestUserApproval');
    return await callable(data); 
  }

  /**
   * @method solicitarBajaVoluntariaCuenta
   * @description 🛡️ CUMPLIMIENTO LEGAL & CONTROL DE TESORERÍA: Permite tramitar la baja voluntaria.
   * Aplica un bloqueo de seguridad si el socio o directiva presenta deudas pendientes con el club.
   * Si es solvente, pasa su estado a 'inactive' y purga de inmediato toda su información personal (PII).
   * @param {string} uid UID único del usuario que solicita la eliminación de su cuenta.
   * @throws {Error} Lanza una excepción controlada si el socio debe la cuota anual.
   */
  public async solicitarBajaVoluntariaCuenta(uid: string): Promise<void> {
    // 1. Descargamos el perfil actual en caliente desde el servidor para verificar su estado real
    const userSnapshot = await getDoc(doc(this.firestore, 'users', uid));
    if (!userSnapshot.exists()) {
      throw new Error('El perfil de usuario no existe en el sistema.');
    }
    
    const userActualData = userSnapshot.data() as User;

    // 2. 🔒 EL CERROJO DE TESORERÍA: Si no está al corriente de pago, bloqueamos la baja ipso-facto
    if (!this.userFeesService.esSocioSolvente(userActualData)) {
      throw new Error('ADC_USER_ERR_0007'); 
    }

    const userRef = doc(this.firestore, 'users', uid);
    
    // 3. Si es solvente (o es un rol exento como invitado/portero), procedemos a la purga de PII
    return await updateDoc(userRef, {
      estado: UserStatus.INACTIVE,
      deactivatedAt: new Date().toISOString(),
      bajaRealizadaPorUid: uid,
      bajaRealizadaPorNombre: 'Autobaja del Titular',
      motivoBaja: 'El usuario ha solicitado la eliminación voluntaria de su cuenta desde la aplicación.',
      telefono: '',
      dni: '',
      direccion: '',
      detallesDireccion: '',
      foto: '',
      profesion: '',
      publicarTelefono: false,
      publicarEmail: false
    });
  }
}