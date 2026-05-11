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
  logOutOutline,
  personAddOutline

} from 'ionicons/icons';

import { AuthService } from './services/auth.service';

import { CommonModule } from '@angular/common';

@Component({

  selector: 'app-root',

  templateUrl: 'app.component.html',

  styleUrls: ['app.component.scss'],

  standalone: true,

  imports: [

    IonApp,
    IonRouterOutlet,

    CommonModule,

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

    public authService: AuthService

  ) {

    addIcons({

      homeOutline,
      peopleOutline,
      statsChartOutline,
      calendarOutline,
      logOutOutline,
      personAddOutline

    });

    this.checkLogin();

  }

  // =================================
  // COMPROBAR SESION
  // =================================

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

  // =================================
  // NAVEGAR
  // =================================

  async navegar(ruta: string) {

    await this.menuCtrl.close();

    this.router.navigate([ruta]);

  }

  // =================================
  // LOGOUT
  // =================================

  async logout() {

    await this.menuCtrl.close();

    await this.authService.logout();

    this.router.navigateByUrl('/login');

  }

  // =================================
  // ROLES
  // =================================

  get role(): string {

    return this.authService
      .currentUserData?.tipo
      || '';

  }

  // =================================
  // INVITAR
  // =================================

  puedeInvitar(): boolean {

    return [

      'socio',
      'directiva',
      'administrador'

    ].includes(this.role);

  }

  // =================================
  // REGISTERED
  // =================================

  isRegistered(): boolean {

    return this.role === 'registrado';

  }

}