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
  from '@users/models/user-status.enum';

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
   */
  initAuthListener() {

    onAuthStateChanged(

      this.auth,

      async (user) => {

        console.log(
          'AUTH LISTENER',
          user
        );

        // ============================================
        // RESET AUTH READY
        // ============================================

        this.authReady = false;

        // ============================================
        // NO USER
        // ============================================

        if (!user) {

          this.currentUser = null;

          this.currentUserData = null;

          this.authReady = true;

          // ============================================
          // GO LOGIN
          // ============================================

          await this.router.navigate([
            '/login'
          ]);

          return;

        }

        // ============================================
        // USER AUTH
        // ============================================

        this.currentUser = user;

        // ============================================
        // LOAD FIRESTORE USER
        // ============================================

        await this.reloadUserData(
          user.uid
        );

        // ============================================
        // READY
        // ============================================

        this.authReady = true;

        // ============================================
        // NO USER DATA
        // ============================================

        if (!this.currentUserData) {

          await this.router.navigate([
            '/login'
          ]);

          return;

        }

        // ============================================
        // NAVIGATION BY STATUS
        // ============================================

        switch (this.currentUserData.estado) {

          // ============================================
          // COMPLETE PROFILE
          // ============================================

          case UserStatus.PENDING_DATA:

            await this.router.navigate([
              '/complete-profile'
            ]);

            break;

          // ============================================
          // PENDING APPROVAL
          // ============================================

          case UserStatus.PENDING_APPROVAL:

            await this.router.navigate([
              '/pending-approval'
            ]);

            break;

          // ============================================
          // ACTIVE
          // ============================================

          case UserStatus.ACTIVE:

            await this.router.navigate([
              '/home'
            ]);

            break;

          // ============================================
          // DEFAULT
          // ============================================

          default:

            await this.router.navigate([
              '/login'
            ]);

            break;

        }

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
    // RESET AUTH READY
    // ============================================

    this.authReady = false;

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

    this.authReady = true;

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
      // USER REJECTED
      // ============================================

      if (

        this.currentUserData.estado ===
        UserStatus.REJECTED

      ) {

        await this.notification.error(

          AppMessageCode.ADC_AUTH_ERR_0008

        );

        await this.logout();

        return;

      }

      return;

    }

    // ============================================
    // USER NOT FOUND
    // ============================================

    this.currentUserData = null;

  }

}