import { Injectable } from '@angular/core';

import {

  Auth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword

} from '@angular/fire/auth';

import {

  Firestore,
  collection,
  query,
  where,
  getDocs,
  addDoc

} from '@angular/fire/firestore';

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

        // =========================
        // NO LOGIN
        // =========================

        if (!user) {

          this.currentUser = null;

          this.currentUserData = null;

          this.authReady = true;

          return;

        }

        this.currentUser = user;

        // =========================
        // USERS
        // =========================

        const usersRef =
          collection(
            this.firestore,
            'users'
          );

        const qUsers = query(

          usersRef,

          where(
            'uid',
            '==',
            user.uid
          )

        );

        const usersResult =
          await getDocs(qUsers);

        if (!usersResult.empty) {

          this.currentUserData = {

            id:
              usersResult.docs[0].id,

            source:
              'users',

            ...usersResult.docs[0].data()

          };

          this.authReady = true;

          return;

        }

        // =========================
        // REGISTERED USERS
        // =========================

        const registeredRef =
          collection(
            this.firestore,
            'registeredUsers'
          );

        const qRegistered = query(

          registeredRef,

          where(
            'uid',
            '==',
            user.uid
          )

        );

        const registeredResult =
          await getDocs(qRegistered);

        if (!registeredResult.empty) {

          this.currentUserData = {

            id:
              registeredResult.docs[0].id,

            source:
              'registeredUsers',

            ...registeredResult.docs[0].data()

          };

          this.authReady = true;

          return;

        }

        // =========================
        // DEFAULT
        // =========================

        this.currentUserData = null;

        this.authReady = true;

      }

    );

  }

  // =================================
  // LOGIN
  // =================================

  async login(

    email: string,

    password: string

  ) {

    return await signInWithEmailAndPassword(

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

  async register(user: any) {

    // NORMALIZAR EMAIL
    const email =
      user.email
        .trim()
        .toLowerCase();

    // =========================
    // PREREGISTRO
    // =========================

    const preRegisterRef =
      collection(
        this.firestore,
        'preRegister'
      );

    const q = query(

      preRegisterRef,

      where(
        'email',
        '==',
        email
      )

    );

    const result =
      await getDocs(q);

    // NO AUTORIZADO
    if (result.empty) {

      throw new Error(

        'Tu correo no está autorizado para registrarse.'

      );

    }

    // =========================
    // CREAR AUTH
    // =========================

    const credential =

      await createUserWithEmailAndPassword(

        this.auth,

        email,

        user.password

      );

    const uid =
      credential.user.uid;

    // =========================
    // REGISTERED USERS
    // =========================

    const registeredUsersRef =
      collection(
        this.firestore,
        'registeredUsers'
      );

    await addDoc(

      registeredUsersRef,

      {

        uid,

        nombre:
          user.nombre,

        email,

        tipo:
          'registrado',

        perfilCompleto:
          false,

        createdAt:
          new Date()

      }

    );

    return true;

  }

  // =================================
  // LOGGED
  // =================================

  isLogged(): boolean {

    return !!this.currentUser;

  }

  // =================================
  // ROLE
  // =================================

  getRole(): string {

    return (
      this.currentUserData?.tipo
      ||
      ''
    );

  }

  // =================================
  // IS REGISTERED
  // =================================

  isRegisteredUser(): boolean {

    return (

      this.currentUserData?.tipo
      ===
      'registrado'

    );

  }

  // =================================
  // IS ASSOCIATION USER
  // =================================

  isAssociationUser(): boolean {

    return (

      this.currentUserData?.source
      ===
      'users'

    );

  }

}