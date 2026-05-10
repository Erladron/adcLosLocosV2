import { bootstrapApplication } from '@angular/platform-browser';

import {
  RouteReuseStrategy,
  provideRouter
} from '@angular/router';

import {
  IonicRouteStrategy,
  provideIonicAngular
} from '@ionic/angular/standalone';

import { routes } from './app/app.routes';

import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {

  providers: [

    provideIonicAngular({

      animated: true

    }),

    provideRouter(routes),

    {
      provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy
    }

  ]

}).catch(err => console.log(err));