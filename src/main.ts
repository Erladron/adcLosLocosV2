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

const originalWarn = console.warn;
console.warn = (...args) => {
  if (
    args[0] && 
    typeof args[0] === 'string' && 
    (args[0].includes('Calling Firebase APIs outside of an Injection context') || 
     args[0].includes('Firebase API called outside injection context'))
  ) {
    return;
  }
  originalWarn.apply(console, args);
};

registerLocaleData(localeEs, 'es');

// 🤖 CONSTANTE INTELIGENTE: ¿Debemos activar emuladores locales?
// Solo se activan si useEmulators es true en tu environment Y ADEMÁS estás en la WEB de tu PC.
// Si estás ejecutando la app en tu móvil (Android/iOS), esto pasará a ser "false" automáticamente.
const activarEmuladores = (environment as any).useEmulators && Capacitor.getPlatform() === 'web';

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
        const functions = getFunctions();
        if (activarEmuladores) {
          connectFunctionsEmulator(functions, 'localhost', 5001);
        }
        return functions;
      }),

      {
        provide: ENVIRONMENT,
        useValue: environment
      },

      { 
        provide: FIREBASE_OPTIONS, 
        useValue: environment.firebase 
      },

      // Ajustamos también la compatibilidad antigua de AngularFire en base a la constante inteligente
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