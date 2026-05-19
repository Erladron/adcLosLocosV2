import { Injectable } from '@angular/core';

import {

  Auth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User

} from '@angular/fire/auth';

import {

  Firestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc

} from '@angular/fire/firestore';

import { Router }
from '@angular/router';

import { UserStatus }
from '../../users/models/user-status.enum';

import { NotificationService }
from '@core/services/notification.service';

import { AppMessageCode }
from 'src/app/core/constants/messages/app-message-code.enum';

@Injectable({
  providedIn: 'root'
})

export class AuthSessionService {

  // ============================================
  // USER AUTH FIREBASE
  // ============================================

  currentUser: User | null = null;

  // ============================================
  // USER DATA FIRESTORE
  // ============================================

  currentUserData: any = null;

  // ============================================
  // AUTH READY
  // ============================================

  authReady = false;

  constructor(

    private auth: Auth,

    private firestore: Firestore,

    private router: Router,

    private notification: NotificationService

  ) { }

  // ============================================
  // INIT AUTH LISTENER
  // ============================================

  /**
   * Inicializa listener global auth.
   *
   * Detecta:
   * - login
   * - logout
   * - refresh sesión
   */
  initAuthListener() {

    onAuthStateChanged(

      this.auth,

      async (user) => {

        // ============================================
        // NO USER
        // ============================================

        if (!user) {

          this.currentUser = null;

          this.currentUserData = null;

          this.authReady = true;

          return;

        }

        // ============================================
        // USER AUTH
        // ============================================

        this.currentUser = user;

        await this.reloadUserData(
          user.uid
        );

      }

    );

  }

  // ============================================
  // LOGIN
  // ============================================

  /**
   * Login Firebase.
   */
  async login(

    email: string,

    password: string

  ) {

    // ============================================
    // VALIDATION
    // ============================================

    if (

      !email ||

      !password

    ) {

      throw new Error(

        AppMessageCode.ADC_AUTH_ERR_0007

      );

    }

    // ============================================
    // FIREBASE LOGIN
    // ============================================

    return await

      signInWithEmailAndPassword(

        this.auth,

        email,

        password

      );

  }

  // ============================================
  // LOGOUT
  // ============================================

  /**
   * Logout usuario.
   */
  async logout() {

    // ============================================
    // FIREBASE LOGOUT
    // ============================================

    await signOut(this.auth);

    // ============================================
    // RESET SESSION
    // ============================================

    this.currentUser = null;

    this.currentUserData = null;

    // ============================================
    // NAVIGATE LOGIN
    // ============================================

    this.router.navigate([
      '/login'
    ]);

  }

  // ============================================
  // RELOAD USER DATA
  // ============================================

  /**
   * Recarga datos Firestore usuario.
   */
  async reloadUserData(
    uid: string
  ) {

    const usersRef =

      collection(
        this.firestore,
        'users'
      );

    const qUsers =

      query(

        usersRef,

        where(
          'uid',
          '==',
          uid
        )

      );

    const usersResult =

      await getDocs(qUsers);

    // ============================================
    // USER FOUND
    // ============================================

    if (!usersResult.empty) {

      const userDoc =

        usersResult.docs[0];

      const userData: any = {

        id:
          userDoc.id,

        source: 'users',

        ...userDoc.data()

      };

      // ============================================
      // SYNC AUTH EMAIL -> FIRESTORE
      // ============================================

      if (

        this.auth.currentUser?.email &&

        userData.email !==
        this.auth.currentUser.email

      ) {

        await updateDoc(

          doc(

            this.firestore,

            'users',

            userDoc.id

          ),

          {

            email:
              this.auth.currentUser.email

          }

        );

        userData.email =

          this.auth.currentUser.email;

      }

      // ============================================
      // SAVE USER DATA
      // ============================================

      this.currentUserData =
        userData;

      // ============================================
      // USER CANCELADO
      // ============================================

      if (

        this.currentUserData.estado
          ?.trim()
          ?.toLowerCase()

        ===

        UserStatus.CANCELADO

      ) {

        // ============================================
        // SHOW ERROR
        // ============================================

        await this.notification.error(

          AppMessageCode.ADC_AUTH_ERR_0008

        );

        // ============================================
        // FORCE LOGOUT
        // ============================================

        await this.logout();

        return;

      }

      this.authReady = true;

      return;

    }

    // ============================================
    // USER NOT FOUND
    // ============================================

    this.currentUserData = null;

    this.authReady = true;

  }

  // ============================================
  // GET CURRENT USER
  // ============================================

  /**
   * Devuelve usuario auth actual.
   */
  getCurrentUser(): User | null {

    return this.currentUser;

  }

  // ============================================
  // GET CURRENT USER DATA
  // ============================================

  /**
   * Devuelve datos firestore usuario.
   */
  getCurrentUserData(): any {

    return this.currentUserData;

  }

  // ============================================
  // GET AUTH READY
  // ============================================

  /**
   * Auth inicializada.
   */
  isAuthReady(): boolean {

    return this.authReady;

  }

}