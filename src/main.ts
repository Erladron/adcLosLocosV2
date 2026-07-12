import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';

import {
  RouteReuseStrategy,
  provideRouter
} from '@angular/router';

import {
  IonicRouteStrategy,
  provideIonicAngular
} from '@ionic/angular/standalone';

import {
  provideFirebaseApp,
  initializeApp
} from '@angular/fire/app';

import {
  provideAuth,
  getAuth,
  connectAuthEmulator
} from '@angular/fire/auth';

import {
  provideFirestore,
  getFirestore,
  connectFirestoreEmulator
} from '@angular/fire/firestore';

import {
  provideStorage,
  getStorage,
  connectStorageEmulator
} from '@angular/fire/storage';

import {
  provideFunctions,
  getFunctions,
  connectFunctionsEmulator
} from '@angular/fire/functions';

// 🚀 IMPORTS AÑADIDOS: Proveedor nativo de mensajería web de AngularFire
import {
  provideMessaging,
  getMessaging
} from '@angular/fire/messaging';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
import { ENVIRONMENT } from '../projects/shared-core/src/lib/env.token';

import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { SETTINGS as AUTH_SETTINGS } from '@angular/fire/compat/auth';
import { SETTINGS as FIRESTORE_SETTINGS } from '@angular/fire/compat/firestore';

import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';

// 📱 IMPORTACIÓN NATIVA DE CAPACITOR PARA DETECTAR LA PLATAFORMA
import { Capacitor } from '@capacitor/core';

/**
 * Interceptor de Logs y Advertencias de la Consola
 * Silencia advertencias internas del ciclo de vida y falsos positivos de tipos.
 */
const originalWarn = console.warn;
console.warn = (...args) => {
  if (args[0] && typeof args[0] === 'string') {
    if (args[0].includes('Calling Firebase APIs outside of an Injection context') ||
      args[0].includes('Firebase API called outside injection context')) {
      return;
    }
    if (args[0].includes('Sincronizando contextos de datos feriales en el monorrepo')) {
      return;
    }
  }
  originalWarn.apply(console, args);
};

registerLocaleData(localeEs, 'es');

/** * @description CONSTANTE INTELIGENTE: ¿Debemos activar los emuladores locales de Firebase?
 * Comprueba el flag del environment y valida que estemos en ejecución web de escritorio.
 */
const activarEmuladores = (environment as any).useEmulators && Capacitor.getPlatform() === 'web';

/**
 * Inicialización asíncrona del framework Angular y arranque del AppComponent.
 * Configura la inyección de dependencias modular unificada para toda la Peña.
 */
bootstrapApplication(
  AppComponent,
  {
    providers: [
      provideHttpClient(),

      provideIonicAngular({
        animated: true
      }),

      provideRouter(routes),

      {
        provide: RouteReuseStrategy,
        useClass: IonicRouteStrategy
      },

      provideFirebaseApp(() => initializeApp(environment.firebase)),

      provideAuth(() => {
        const auth = getAuth();
        if (activarEmuladores) {
          connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
        }
        return auth;
      }),

      provideFirestore(() => {
        const firestore = getFirestore();
        if (activarEmuladores) {
          connectFirestoreEmulator(firestore, 'localhost', 8080);
        }
        return firestore;
      }),

      provideStorage(() => {
        const storage = getStorage();
        if (activarEmuladores) {
          connectStorageEmulator(storage, 'localhost', 9199);
        }
        return storage;
      }),

      provideFunctions(() => {
        // 🎯 OBLIGAMOS AL SDK WEB A APUNTAR A LA REGIÓN EUROPEA CORRECTA
        const functions = getFunctions(undefined, 'europe-west1'); 
        
        if (activarEmuladores) {
          connectFunctionsEmulator(functions, 'localhost', 5001);
        }
        return functions;
      }),

      // 🍏 INYECCIÓN AÑADIDA: Habilita el canal de mensajería en la nube para la web de la Peña
      provideMessaging(() => {
        return getMessaging();
      }),

      {
        provide: 'ENVIRONMENT_INITIALIZER',
        useValue: () => {
          const originalError = console.error;
          console.error = function (...args) {
            if (args[0] && args[0].toString().includes('NG01203')) {
              originalError.apply(console, ['🚨 DETECTOR DE CRASH REAL:', args[0]]);
              console.trace('🔍 SEGUIMIENTO DE LA PILA DE COMPILACIÓN:');
            } else {
              originalError.apply(console, args);
            }
          };
        },
        multi: true
      },

      {
        provide: ENVIRONMENT,
        useValue: environment
      },

      {
        provide: FIREBASE_OPTIONS,
        useValue: environment.firebase
      },

      // Ajustamos también la compatibilidad antigua de AngularFire
      ...activarEmuladores ? [
        {
          provide: AUTH_SETTINGS,
          useValue: { emulator: 'http://localhost:9099' }
        },
        {
          provide: FIRESTORE_SETTINGS,
          useValue: { host: 'localhost:8080', ssl: false }
        }
      ] : []
    ]
  }
).catch(
  err => console.log(err)
);