import { Injectable } from '@angular/core';

import {

  Auth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  getAuth,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  updateEmail

} from '@angular/fire/auth';

import {

  Firestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  setDoc,
  updateDoc

} from '@angular/fire/firestore';

import {

  initializeApp,
  getApp,
  deleteApp

} from '@angular/fire/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  currentUser: any = null;

  currentUserData: any = null;

  authReady = false;

  constructor(

    private auth: Auth,

    private firestore: Firestore

  ) {

    onAuthStateChanged(

      this.auth,

      async (user) => {

        if (!user) {

          this.currentUser = null;

          this.currentUserData = null;

          this.authReady = true;

          return;

        }

        this.currentUser = user;

        await this.reloadUserData(
          user.uid
        );

      }

    );

  }

  // =================================
  // RECARGAR USER
  // =================================

  async reloadUserData(uid: string) {

    const usersRef =
      collection(
        this.firestore,
        'users'
      );

    const qUsers =
      query(
        usersRef,
        where('uid', '==', uid)
      );

    const usersResult =
      await getDocs(qUsers);

    if (!usersResult.empty) {

      this.currentUserData = {

        id:
          usersResult.docs[0].id,

        source: 'users',

        ...usersResult.docs[0].data()

      };

      this.authReady = true;

      return;

    }

    const registeredRef =
      collection(
        this.firestore,
        'registeredUsers'
      );

    const qRegistered =
      query(
        registeredRef,
        where('uid', '==', uid)
      );

    const registeredResult =
      await getDocs(qRegistered);

    if (!registeredResult.empty) {

      this.currentUserData = {

        id:
          registeredResult.docs[0].id,

        source:
          'registeredUsers',

        ...registeredResult
          .docs[0]
          .data()

      };

    } else {

      this.currentUserData =
        null;

    }

    this.authReady = true;

  }

  // =================================
  // LOGIN
  // =================================

  async login(
    email: string,
    password: string
  ) {

    return await
      signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );

  }

  // =================================
  // LOGOUT
  // =================================

  async logout() {

    await signOut(this.auth);

  }

  // =================================
  // REGISTER
  // =================================

  async register(

    user: any,

    checkPreRegister:
      boolean = true

  ) {

    const email =
      user.email
        .trim()
        .toLowerCase();

    if (checkPreRegister) {

      const preRegisterRef =
        collection(
          this.firestore,
          'preRegister'
        );

      const q =
        query(
          preRegisterRef,
          where('email', '==', email)
        );

      const result =
        await getDocs(q);

      if (result.empty) {

        throw new Error(
          'Tu correo no está autorizado para registrarse.'
        );

      }

    }

    let uid = '';

    if (!checkPreRegister) {

      const currentConfig =
        getApp().options;

      const secondaryApp =
        initializeApp(
          currentConfig,
          'Secondary'
        );

      const secondaryAuth =
        getAuth(secondaryApp);

      try {

        const credential =

          await createUserWithEmailAndPassword(

            secondaryAuth,

            email,

            user.password

          );

        uid =
          credential.user.uid;

        await deleteApp(
          secondaryApp
        );

      } catch (error) {

        await deleteApp(
          secondaryApp
        );

        throw error;

      }

    } else {

      const credential =

        await createUserWithEmailAndPassword(

          this.auth,

          email,

          user.password

        );

      uid =
        credential.user.uid;

    }

    const collectionName =

      checkPreRegister

        ? 'registeredUsers'

        : 'users';

    const userDocRef =
      doc(
        this.firestore,
        collectionName,
        uid
      );

    await setDoc(userDocRef, {

      uid,

      nombre:
        user.nombre,

      email,

      telefono:
        user.telefono || '',

      dni:
        user.dni || '',

      direccion:
        user.direccion || '',

      foto:
        user.foto || '',

      numeroSocio:
        user.numeroSocio || '',

      tipo:

        user.tipo ||

        (

          checkPreRegister

            ? 'registrado'

            : 'socio'

        ),

      perfilCompleto:
        !checkPreRegister,

      createdAt:
        new Date()

    });

    return true;

  }

  // =================================
  // CAMBIAR CREDENCIALES
  // =================================

  async updateCredentials(

    uid: string,

    currentEmail: string,

    currentPassword: string,

    newEmail: string,

    newPassword: string

  ) {

    if (!this.auth.currentUser) {

      throw new Error(
        'Usuario no autenticado'
      );

    }

    // REAUTH
    const credential =

      EmailAuthProvider
        .credential(

          currentEmail,

          currentPassword

        );

    await reauthenticateWithCredential(

      this.auth.currentUser,

      credential

    );

    // EMAIL
    if (

      newEmail &&

      newEmail !== currentEmail

    ) {

      await updateEmail(

        this.auth.currentUser,

        newEmail

      );

      // FIRESTORE
      const userRef =

        doc(
          this.firestore,
          'users',
          uid
        );

      await updateDoc(userRef, {

        email:
          newEmail

      });

    }

    // PASSWORD
    if (

      newPassword &&

      newPassword.trim() !== ''

    ) {

      await updatePassword(

        this.auth.currentUser,

        newPassword

      );

    }

  }

  // =================================
  // HELPERS
  // =================================

  isLogged(): boolean {

    return !!this.currentUser;

  }

  getRole(): string {

    return this.currentUserData?.tipo || '';

  }

  isRegisteredUser(): boolean {

    return this.currentUserData?.tipo === 'registrado';

  }

  isAssociationUser(): boolean {

    return this.currentUserData?.source === 'users';

  }

}