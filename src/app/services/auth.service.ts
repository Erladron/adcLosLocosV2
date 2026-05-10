import { Injectable } from '@angular/core';

import {
  initializeApp
} from 'firebase/app';

import {

  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User

} from 'firebase/auth';

import {

  getFirestore,
  doc,
  getDoc

} from 'firebase/firestore';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private app = initializeApp(environment.firebase);

  private auth = getAuth(this.app);

  private db = getFirestore(this.app);

  currentUser: User | null = null;

  currentUserData: any = null;

  authReady = false;

  constructor() {

    onAuthStateChanged(this.auth, async (user) => {

      this.currentUser = user;

      // CARGAR DATOS FIRESTORE
      if (user) {

        await this.loadUserData(user.uid);

      } else {

        this.currentUserData = null;

      }

      this.authReady = true;

    });

  }

  // LOGIN
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

  // LOGOUT
  async logout() {

    return await signOut(this.auth);

  }

  // USUARIO FIREBASE
  getUser() {

    return this.currentUser;

  }

  // DATOS FIRESTORE
  getUserData() {

    return this.currentUserData;

  }

  // ROL
  getRole(): string {

    return this.currentUserData?.tipo || '';

  }

  // COMPROBAR ROL
  isAdmin(): boolean {

    return this.getRole() === 'administrador';

  }

  isDirectiva(): boolean {

    return this.getRole() === 'directiva';

  }

  isSocio(): boolean {

    return this.getRole() === 'socio';

  }

  isInvitado(): boolean {

    return this.getRole() === 'invitado';

  }

  // HAY SESION
  isLogged(): boolean {

    return this.currentUser != null;

  }

  // CARGAR DATOS FIRESTORE
  async loadUserData(uid: string) {

    const ref = doc(this.db, 'users', uid);

    const snap = await getDoc(ref);

    if (snap.exists()) {

      this.currentUserData = snap.data();

    }

  }

}