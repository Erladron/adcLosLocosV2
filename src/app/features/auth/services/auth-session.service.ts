import {
  Injectable,
  signal,
  computed
} from '@angular/core';

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
  // INTERNAL SIGNAL STATE
  // ============================================

  private _currentUser =
    signal<User | null>(null);

  private _currentUserData =
    signal<any | null>(null);

  private _authReady =
    signal<boolean>(false);

  // ============================================
  // PUBLIC READONLY STATE
  // ============================================

  readonly currentUser =
    computed(() =>
      this._currentUser()
    );

  readonly currentUserData =
    computed(() =>
      this._currentUserData()
    );

  readonly authReady =
    computed(() =>
      this._authReady()
    );

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
        // RESET READY
        // ============================================

        this._authReady.set(false);

        // ============================================
        // NO USER
        // ============================================

        if (!user) {

          this._currentUser.set(null);

          this._currentUserData.set(null);

          this._authReady.set(true);

          return;

        }

        // ============================================
        // USER AUTH
        // ============================================

        this._currentUser.set(user);

        // ============================================
        // RESET USER DATA
        // ============================================

        this._currentUserData.set(null);

        // ============================================
        // LOAD FIRESTORE USER
        // ============================================

        await this.reloadUserData(
          user.uid
        );

        // ============================================
        // READY
        // ============================================

        this._authReady.set(true);

      }

    );

  }

  // ============================================
  // WAIT AUTH READY
  // ============================================

  async waitForAuthReady(): Promise<void> {

    if (this.authReady()) {

      return;

    }

    await new Promise<void>((resolve) => {

      const interval = setInterval(() => {

        if (this.authReady()) {

          clearInterval(interval);

          resolve();

        }

      }, 50);

    });

  }

  // ============================================
  // IS LOGGED
  // ============================================

  isLogged(): boolean {

    return !!this.currentUser();

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
    // RESET READY
    // ============================================

    this._authReady.set(false);

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

    return await signInWithEmailAndPassword(

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
    // RESET STATE
    // ============================================

    this._currentUser.set(null);

    this._currentUserData.set(null);

    this._authReady.set(true);

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

      this._currentUserData.set(
        userData
      );

      // ============================================
      // USER REJECTED
      // ============================================

      if (

        userData.estado ===
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

    this._currentUserData.set(null);

  }

}