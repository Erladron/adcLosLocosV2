import { Injectable }
from '@angular/core';

import {

  Auth,
  createUserWithEmailAndPassword,
  getAuth

} from '@angular/fire/auth';

import {

  Firestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  setDoc

} from '@angular/fire/firestore';

import {

  initializeApp,
  getApp,
  deleteApp

} from '@angular/fire/app';

import { UserRole }
from '@users/models/user-role.enum';

import { UserStatus }
from '@users/models/user-status.enum';

import { AppMessageCode }
from '@core/constants/messages/app-message-code.enum';

@Injectable({
  providedIn: 'root'
})

export class AuthRegisterService {

  // ============================================
  // CONSTRUCTOR
  // ============================================

  constructor(

    private auth: Auth,

    private firestore: Firestore

  ) { }

  // ============================================
  // REGISTER USER
  // ============================================

  /**
   * Registro principal usuarios.
   *
   * checkPreRegister = true
   * -> usuario invitado
   *
   * checkPreRegister = false
   * -> alta admin/directiva
   */
  async register(

    user: any,

    checkPreRegister:
      boolean = true

  ) {

    // ============================================
    // NORMALIZE EMAIL
    // ============================================

    const email =

      user.email
        .trim()
        .toLowerCase();

    // ============================================
    // CHECK INVITATION
    // ============================================

    if (checkPreRegister) {

      await this.checkPreRegister(
        email
      );

    }

    let uid = '';

    // ============================================
    // ADMIN CREATE USER
    // ============================================

    if (!checkPreRegister) {

      uid = await this.createAdminUser(

        email,

        user.password

      );

    }

    // ============================================
    // NORMAL REGISTER
    // ============================================

    else {

      uid = await this.createNormalUser(

        email,

        user.password

      );

    }

    // ============================================
    // SAVE FIRESTORE USER
    // ============================================

    await this.saveFirestoreUser(

      uid,

      user,

      email,

      checkPreRegister

    );

    return true;

  }

  // ============================================
  // CHECK PRE REGISTER
  // ============================================

  /**
   * Comprueba si existe invitación.
   */
  async checkPreRegister(
    email: string
  ) {

    const preRegisterRef =

      collection(
        this.firestore,
        'preRegister'
      );

    const q =

      query(

        preRegisterRef,

        where(
          'email',
          '==',
          email
        )

      );

    const result =

      await getDocs(q);

    // ============================================
    // INVITATION NOT FOUND
    // ============================================

    if (result.empty) {

      throw new Error(

        AppMessageCode
          .ADC_INV_ERR_0006

      );

    }

  }

  // ============================================
  // CREATE ADMIN USER
  // ============================================

  /**
   * Alta creada por admin/directiva.
   *
   * Usa secondary Firebase App
   * para no perder sesión actual.
   */
  async createAdminUser(

    email: string,

    password: string

  ): Promise<string> {

    const currentConfig =
      getApp().options;

    const secondaryApp =

      initializeApp(

        currentConfig,

        'Secondary'

      );

    const secondaryAuth =

      getAuth(
        secondaryApp
      );

    try {

      const credential =

        await createUserWithEmailAndPassword(

          secondaryAuth,

          email,

          password

        );

      const uid =
        credential.user.uid;

      // ============================================
      // DELETE SECONDARY APP
      // ============================================

      await deleteApp(
        secondaryApp
      );

      return uid;

    }

    catch (error: any) {

      // ============================================
      // DELETE SECONDARY APP
      // ============================================

      await deleteApp(
        secondaryApp
      );

      // ============================================
      // HANDLE ERROR
      // ============================================

      this.handleRegisterError(
        error
      );

    }

  }

  // ============================================
  // CREATE NORMAL USER
  // ============================================

  /**
   * Registro usuario invitado.
   */
  async createNormalUser(

    email: string,

    password: string

  ): Promise<string> {

    try {

      const credential =

        await createUserWithEmailAndPassword(

          this.auth,

          email,

          password

        );

      return credential.user.uid;

    }

    catch (error: any) {

      console.error(
        'REGISTER ERROR',
        error
      );

      // ============================================
      // HANDLE ERROR
      // ============================================

      this.handleRegisterError(
        error
      );

    }

  }

  // ============================================
  // SAVE FIRESTORE USER
  // ============================================

  /**
   * Guarda usuario en Firestore.
   */
  async saveFirestoreUser(

    uid: string,

    user: any,

    email: string,

    checkPreRegister: boolean

  ) {

    const userDocRef =

      doc(
        this.firestore,
        'users',
        uid
      );

    await setDoc(userDocRef, {

      uid: uid,

      nombre:
        user.nombre || '',

      email:
        email,

      telefono:
        user.telefono || '',

      dni:
        user.dni || '',

      direccion:
        user.direccion || '',

      foto:
        user.foto || '',

      tipo:

        user.tipo ||

        (

          checkPreRegister

            ? UserRole.INVITADO

            : UserRole.SOCIO

        ),

      estado:

        checkPreRegister

          ? UserStatus.PENDIENTE_APROBACION

          : UserStatus.ACTIVO,

      estadoSolicitud:

        checkPreRegister

          ? 'pendiente'

          : 'aprobado',

      aprobado:
        !checkPreRegister,

      perfilCompleto:
        !checkPreRegister,

      createdAt:
        new Date()

    });

  }

  // ============================================
  // HANDLE FIREBASE ERRORS
  // ============================================

  /**
   * Traducción errores Firebase.
   */
  handleRegisterError(
    error: any
  ): never {

    // ============================================
    // EMAIL EXISTS
    // ============================================

    if (

      error?.code ===
      'auth/email-already-in-use'

    ) {

      throw new Error(

        AppMessageCode
          .ADC_AUTH_ERR_0004

      );

    }

    // ============================================
    // WEAK PASSWORD
    // ============================================

    if (

      error?.code ===
      'auth/weak-password'

    ) {

      throw new Error(

        AppMessageCode
          .ADC_AUTH_ERR_0005

      );

    }

    // ============================================
    // INVALID EMAIL
    // ============================================

    if (

      error?.code ===
      'auth/invalid-email'

    ) {

      throw new Error(

        AppMessageCode
          .ADC_AUTH_ERR_0006

      );

    }

    // ============================================
    // NETWORK ERROR
    // ============================================

    if (

      error?.code ===
      'auth/network-request-failed'

    ) {

      throw new Error(

        AppMessageCode
          .ADC_AUTH_ERR_0014

      );

    }

    // ============================================
    // DEFAULT ERROR
    // ============================================

    throw new Error(

      AppMessageCode
        .ADC_AUTH_ERR_0007

    );

  }

}