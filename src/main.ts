import { bootstrapApplication }
  from '@angular/platform-browser';

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

import { routes }
  from './app/app.routes';

import { AppComponent }
  from './app/app.component';

import { environment }
  from './environments/environment';

bootstrapApplication(

  AppComponent,

  {

    providers: [

      provideIonicAngular({

        animated: true

      }),

      provideRouter(routes),

      {

        provide:
          RouteReuseStrategy,

        useClass:
          IonicRouteStrategy

      },

      // =================================
      // FIREBASE
      // =================================

      provideFirebaseApp(

        () => initializeApp(
          environment.firebase
        )

      ),

      provideAuth(
        () => getAuth()
      ),

      provideFirestore(
        () => getFirestore()
      )

    ]

  }

).catch(

  err => console.log(err)

);