import {
  Injectable,
  signal,
  computed,
  NgZone,
  EnvironmentInjector,
  runInInjectionContext
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
  getDoc,
  getDocs,
  doc,
  updateDoc
} from '@angular/fire/firestore';

import { Router }
  from '@angular/router';

import { NotificationService }
  from 'projects/shared-core/src/lib/services/notification.service';

import { UserStatus } from '../models/user-status.enum';
import { AppMessageCode } from '../constants/app-message-code.enum';

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

    private notification: NotificationService,

    private ngZone: NgZone,

    private injector: EnvironmentInjector

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

      (user) => {

        // 1. INYECTAMOS EL CONTEXTO DE ANGULAR
        runInInjectionContext(this.injector, () => {

          // 2. OBLIGAMOS A ENTRAR EN LA BURBUJA DE ANGULAR
          this.ngZone.run(async () => {

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

          });

        });

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

    if (typeof window !== 'undefined' && navigator.serviceWorker) {
      try {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const registration of registrations) {
          await registration.unregister();
          console.log('🧹 [AuthSessionService] Service Worker desregistrado limpiamente en Logout.');
        }
      } catch (e) {
        console.error('Error limpiando Service Workers en logout:', e);
      }
    }

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
  // RELOAD USER DATA (ENFOQUE PURISTA OPTIMIZADO)
  // ============================================

  /**
   * Recarga datos Firestore usuario.
   */
  async reloadUserData(uid: string): Promise<any> {

    // 1. Apuntamos DIRECTAMENTE al documento usando el UID
    const userRef = doc(this.firestore, 'users', uid);

    // 2. Leemos ese documento inyectando el contexto
    const userResult = await runInInjectionContext(
      this.injector,
      () => getDoc(userRef)
    );

    // ============================================
    // USER FOUND
    // ============================================

    if (userResult.exists()) {

      const userData: any = {
        id: userResult.id,
        ...userResult.data()
      };

      // ============================================
      // SYNC AUTH EMAIL -> FIRESTORE
      // ============================================

      if (
        this.auth.currentUser?.email &&
        userData.email !== this.auth.currentUser.email
      ) {

        await runInInjectionContext(this.injector, () =>
          updateDoc(userRef, {
            email: this.auth.currentUser!.email
          })
        );

        userData.email = this.auth.currentUser.email;

      }

      // ============================================
      // SAVE USER DATA
      // ============================================

      this._currentUserData.set(userData);

      // ============================================
      // USER REJECTED
      // ============================================

      if (userData.estado === UserStatus.REJECTED) {
        await this.notification.error(AppMessageCode.ADC_AUTH_ERR_0008);
        await this.logout();
        return null;
      }

      return userData;

    }

    // ============================================
    // USER NOT FOUND
    // ============================================

    this._currentUserData.set(null);
    return null;

  }

}