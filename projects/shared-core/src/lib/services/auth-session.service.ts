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
  getDoc,
  doc,
  updateDoc
} from '@angular/fire/firestore';

import { Platform, NavController, MenuController } from '@ionic/angular/standalone';


import { NotificationService }
  from 'projects/shared-core/src/lib/services/notification.service';

import { UserStatus } from '../models/user-status.enum';
import { AppMessageCode } from '../constants/app-message-code.enum';

@Injectable({
  providedIn: 'root'
})
export class AuthSessionService {

  private _currentUser = signal<User | null>(null);
  private _currentUserData = signal<any | null>(null);
  private _authReady = signal<boolean>(false);

  readonly currentUser = computed(() => this._currentUser());
  readonly currentUserData = computed(() => this._currentUserData());
  readonly authReady = computed(() => this._authReady());

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private navCtrl: NavController,
    private notification: NotificationService,
    private ngZone: NgZone,
    private injector: EnvironmentInjector,
    private menuCtrl: MenuController,
    private platform: Platform,
  ) { }

  public initAuthListener(): void {
    onAuthStateChanged(
      this.auth,
      (user) => {
        runInInjectionContext(this.injector, () => {
          this.ngZone.run(async () => {
            console.log('🔄 [AuthSessionService] AUTH LISTENER EMISSION:', user);

            this._authReady.set(false);

            if (!user) {
              this._currentUser.set(null);
              this._currentUserData.set(null);
              this._authReady.set(true);
              return;
            }

            this._currentUser.set(user);
            this._currentUserData.set(null);

            await this.reloadUserData(user.uid);
            this._authReady.set(true);
          });
        });
      }
    );
  }

  public async waitForAuthReady(): Promise<void> {
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

  public isLogged(): boolean {
    return !!this.currentUser();
  }

  public async login(email: string, password: string): Promise<any> {
    this._authReady.set(false);

    if (!email || !password) {
      throw new Error(AppMessageCode.ADC_AUTH_ERR_0007);
    }

    return await signInWithEmailAndPassword(this.auth, email, password);
  }

  // ============================================
  // LOGOUT (CON ENVOLTORIO DE ZONA SEGURO)
  // ============================================
  public async logout(): Promise<void> {
  console.log('🚪 [AuthSessionService] Iniciando secuencia de cierre de sesión...');

  try {
    // 1. Cierre preventivo de elementos de interfaz de Ionic (menús/modales)
    await this.menuCtrl.close();
    console.log('🧹 [AuthSessionService] Elementos de UI globales replegados.');
  } catch (uiError) {
    console.warn('⚠️ [AuthSessionService] Aviso no crítico cerrando menús:', uiError);
  }

  try {
    // 2. signOut en Firebase Auth PRIMERO (para invalidar el token remoto)
    await signOut(this.auth);
    console.log('✅ [AuthSessionService] Cierre de sesión en Firebase completado.');
  } catch (error) {
    console.error('🚨 [AuthSessionService] Error en signOut remoto:', error);
  }

  // 3. Limpieza de los Signals locales
  this._currentUser.set(null);
  this._currentUserData.set(null);

  // 4. Redirección limpia garantizada dentro de NgZone (Sin reloads de ventana)
  this.ngZone.run(async () => {
    console.log('🚀 [AuthSessionService] Navegando a /login de forma segura...');

    // Usamos NavController para resetear el árbol de vistas en ambas plataformas
    await this.navCtrl.navigateRoot('/login', {
      animated: true,
      animationDirection: 'back'
    });

    // Marcamos el estado de Auth como listo tras asentar la pantalla de Login
    this._authReady.set(true);
  });
}

  public async reloadUserData(uid: string): Promise<any> {
    const userRef = doc(this.firestore, 'users', uid);

    const userResult = await runInInjectionContext(
      this.injector,
      () => getDoc(userRef)
    );

    if (userResult.exists()) {
      const userData: any = {
        id: userResult.id,
        ...userResult.data()
      };

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

      this._currentUserData.set(userData);

      if (userData.estado === UserStatus.REJECTED) {
        await this.notification.error(AppMessageCode.ADC_AUTH_ERR_0008);
        await this.logout();
        return null;
      }

      return userData;
    }

    this._currentUserData.set(null);
    return null;
  }
}