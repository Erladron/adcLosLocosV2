import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http'; // <-- IMPORTANTE: Necesario para que Mapbox funcione

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
  getAuth
} from '@angular/fire/auth';

import {
  provideFirestore,
  getFirestore
} from '@angular/fire/firestore';

import {
  provideFunctions,
  getFunctions
} from '@angular/fire/functions';

import {
  provideStorage,
  getStorage
} from '@angular/fire/storage';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
import { ENVIRONMENT } from '../projects/shared-core/src/lib/env.token';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';

import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';

// ==========================================================================
// 🔥 INTERCEPTOR DE CONSOLA: Limpieza radical de falsos positivos de Firebase
// ==========================================================================
const originalWarn = console.warn;
console.warn = (...args) => {
  // Si el aviso habla sobre el contexto de inyección (asincronía interna de transacciones), lo omitimos
  if (
    args[0] && 
    typeof args[0] === 'string' && 
    (args[0].includes('Calling Firebase APIs outside of an Injection context') || 
     args[0].includes('Firebase API called outside injection context'))
  ) {
    return;
  }
  // Dejamos pasar cualquier otra advertencia legítima del ecosistema o de tu código
  originalWarn.apply(console, args);
};

// Registramos el pack de datos en castellano para toda la App
registerLocaleData(localeEs, 'es');

bootstrapApplication(
  AppComponent,
  {
    providers: [
      provideHttpClient(), // ==========================================
                           // HTTP CLIENT (Requisito para Mapbox API)
                           // ==========================================

      provideIonicAngular({
        animated: true
      }),

      provideRouter(routes),

      {
        provide: RouteReuseStrategy,
        useClass: IonicRouteStrategy
      },

      // =================================
      // FIREBASE
      // =================================
      provideFirebaseApp(() => {
        const app = initializeApp(environment.firebase);
        console.log(environment);
        return app;
      }),

      provideAuth(() => getAuth()),
      provideFirestore(() => getFirestore()),
      provideStorage(() => getStorage()),
      provideFunctions(() => getFunctions()),

      // =================================
      // ENVIRONMENT FOR SHARED-CORE
      // =================================
      {
        provide: ENVIRONMENT,
        useValue: environment
      },

      // =================================
      // COMPATIBILITY BRIDGE FOR FIREBASE
      // =================================
      { 
        provide: FIREBASE_OPTIONS, 
        useValue: environment.firebase 
      }
    ]
  }
).catch(
  err => console.log(err)
);