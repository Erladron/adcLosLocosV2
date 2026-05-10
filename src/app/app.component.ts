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

import { RouterLink } from '@angular/router';

import { addIcons } from 'ionicons';

import {

  homeOutline,
  peopleOutline,
  statsChartOutline,
  calendarOutline

} from 'ionicons/icons';

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
    IonLabel,

    RouterLink

  ]

})
export class AppComponent {

  constructor(

    private router: Router,

    private menuCtrl: MenuController

  ) {

    addIcons({

      homeOutline,
      peopleOutline,
      statsChartOutline,
      calendarOutline

    });

  }

  async navegar(ruta: string) {

    // CERRAR MENU
    await this.menuCtrl.close();

    // NAVEGAR
    this.router.navigate([ruta]);

  }

}