import { Injectable }
from '@angular/core';

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
  deleteDoc

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

import { InvitedUserService }
from '@users/services/invited-user.service';

@Injectable({
  providedIn: 'root'
})

export class AuthRegisterService {

  // ============================================
  // CONSTRUCTOR
  // ============================================

  constructor(

    private auth: Auth,

    private firestore: Firestore,

    private invitedUserService:
      InvitedUserService

  ) {}

  // ============================================
  // REGISTER USER
  // ============================================

  /**
   * checkInvitation = true
   * -> registro invitado
   *
   * checkInvitation = false
   * -> alta admin/directiva
   */
  async register(

    user: any,

    checkInvitation:
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
    // VALIDATE INVITATION
    // ============================================

    let invitation: any = null;

    if (checkInvitation) {

      invitation =

        await this.validateInvitation(
          email
        );

    }

    // ============================================
    // TRANSACTION CONTROL
    // ============================================

    let uid = '';

    let createdCredential:
      UserCredential | null = null;

    try {

      // ============================================
      // ADMIN CREATE USER
      // ============================================

      if (!checkInvitation) {

        uid = await this.createAdminUser(

          email,

          user.password

        );

      }

      // ============================================
      // NORMAL REGISTER
      // ============================================

      else {

        createdCredential =

          await this.createNormalUser(

            email,

            user.password

          );

        uid =
          createdCredential.user.uid;

      }

      // ============================================
      // SAVE FIRESTORE USER
      // ============================================

      await this.saveFirestoreUser(

        uid,

        user,

        email,

        checkInvitation

      );

      // ============================================
      // MARK INVITATION USED
      // ============================================

      if (

        checkInvitation

        &&

        invitation

      ) {

        await this.invitedUserService
          .markAsUsed(

            invitation.id,

            uid

          );

      }

      return true;

    }

    catch (error) {

      console.error(
        'REGISTER ROLLBACK',
        error
      );

      // ============================================
      // DELETE FIRESTORE USER
      // ============================================

      if (uid) {

        try {

          await deleteDoc(

            doc(
              this.firestore,
              'users',
              uid
            )

          );

        }

        catch (rollbackError) {

          console.error(

            'ROLLBACK FIRESTORE ERROR',

            rollbackError

          );

        }

      }

      // ============================================
      // DELETE AUTH USER
      // ============================================

      if (

        createdCredential?.user

      ) {

        try {

          await deleteUser(

            createdCredential.user

          );

        }

        catch (rollbackError) {

          console.error(

            'ROLLBACK AUTH ERROR',

            rollbackError

          );

        }

      }

      // ============================================
      // LOGOUT
      // ============================================

      try {

        await signOut(
          this.auth
        );

      }

      catch {}

      throw error;

    }

  }

  // ============================================
  // VALIDATE INVITATION
  // ============================================

  async validateInvitation(
    email: string
  ) {

    const invitation =

      await this.invitedUserService
        .getInvitationByEmail(
          email
        );

    if (!invitation) {

      throw new Error(

        AppMessageCode
          .ADC_INV_ERR_0006

      );

    }

    if (invitation.usado) {

      throw new Error(

        AppMessageCode
          .ADC_INV_ERR_0006

      );

    }

    return invitation;

  }

  // ============================================
  // CREATE ADMIN USER
  // ============================================

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

      await deleteApp(
        secondaryApp
      );

      return uid;

    }

    catch (error: any) {

      await deleteApp(
        secondaryApp
      );

      this.handleRegisterError(
        error
      );

    }

  }

  // ============================================
  // CREATE NORMAL USER
  // ============================================

  async createNormalUser(

    email: string,

    password: string

  ): Promise<UserCredential> {

    try {

      const credential =

        await createUserWithEmailAndPassword(

          this.auth,

          email,

          password

        );

      return credential;

    }

    catch (error: any) {

      this.handleRegisterError(
        error
      );

    }

  }

  // ============================================
  // SAVE FIRESTORE USER
  // ============================================

  async saveFirestoreUser(

    uid: string,

    user: any,

    email: string,

    checkInvitation: boolean

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

          checkInvitation

            ? UserRole.INVITADO

            : UserRole.SOCIO

        ),

      estado:

        checkInvitation

          ? UserStatus.PENDING_DATA

          : UserStatus.ACTIVE,

      createdAt:
        new Date()

    });

  }

  // ============================================
  // HANDLE FIREBASE ERRORS
  // ============================================

  handleRegisterError(
    error: any
  ): never {

    if (

      error?.code ===
      'auth/email-already-in-use'

    ) {

      throw new Error(

        AppMessageCode
          .ADC_AUTH_ERR_0004

      );

    }

    if (

      error?.code ===
      'auth/weak-password'

    ) {

      throw new Error(

        AppMessageCode
          .ADC_AUTH_ERR_0005

      );

    }

    if (

      error?.code ===
      'auth/invalid-email'

    ) {

      throw new Error(

        AppMessageCode
          .ADC_AUTH_ERR_0006

      );

    }

    if (

      error?.code ===
      'auth/network-request-failed'

    ) {

      throw new Error(

        AppMessageCode
          .ADC_AUTH_ERR_0014

      );

    }

    throw new Error(

      AppMessageCode
        .ADC_AUTH_ERR_0007

    );

  }

}