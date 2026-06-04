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
        console.log(app.options);
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