import { Component } from '@angular/core';

import {

  IonApp,
  IonRouterOutlet,
  IonMenu,
  IonContent,
  IonList,
  IonItem,
  IonIcon,
  IonLabel,
  MenuController

} from '@ionic/angular/standalone';

import { Router } from '@angular/router';

import { addIcons } from 'ionicons';

import {

  homeOutline,
  peopleOutline,
  statsChartOutline,
  calendarOutline,
  logOutOutline

} from 'ionicons/icons';

import { AuthService } from './services/auth.service';

@Component({

  selector: 'app-root',

  templateUrl: 'app.component.html',

  styleUrls: ['app.component.scss'],

  standalone: true,

  imports: [

    IonApp,
    IonRouterOutlet,

    IonMenu,
    IonContent,
    IonList,
    IonItem,
    IonIcon,
    IonLabel

  ]

})
export class AppComponent {

  constructor(

    private router: Router,

    private menuCtrl: MenuController,

    private authService: AuthService

  ) {

    addIcons({

      homeOutline,
      peopleOutline,
      statsChartOutline,
      calendarOutline,
      logOutOutline

    });

    this.checkLogin();

  }

  // COMPROBAR SESION
  async checkLogin() {

    const interval = setInterval(() => {

      if (this.authService.authReady) {

        clearInterval(interval);

        if (this.authService.isLogged()) {

          this.router.navigateByUrl('/home');

        } else {

          this.router.navigateByUrl('/login');

        }

      }

    }, 100);

  }

  // NAVEGACION MENU
  async navegar(ruta: string) {

    await this.menuCtrl.close();

    this.router.navigate([ruta]);

  }

  // LOGOUT
  async logout() {

    await this.menuCtrl.close();

    await this.authService.logout();

    this.router.navigateByUrl('/login');

  }

}