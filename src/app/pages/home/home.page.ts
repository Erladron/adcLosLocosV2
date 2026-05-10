import { Component } from '@angular/core';

import {

  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonMenuButton,
  IonIcon,
  IonAlert

} from '@ionic/angular/standalone';

import { RouterModule } from '@angular/router';

import { addIcons } from 'ionicons';

import {

  peopleOutline,
  statsChartOutline,
  calendarOutline

} from 'ionicons/icons';

@Component({

  selector: 'app-home',

  templateUrl: './home.page.html',

  styleUrls: ['./home.page.scss'],

  standalone: true,

  imports: [

    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonMenuButton,
    IonIcon,
    IonAlert,

    RouterModule

  ]

})
export class HomePage {

  alertaVisible = false;

  constructor() {

    addIcons({

      peopleOutline,
      statsChartOutline,
      calendarOutline

    });

  }

  mostrarConstruccion() {

    this.alertaVisible = true;

  }

}