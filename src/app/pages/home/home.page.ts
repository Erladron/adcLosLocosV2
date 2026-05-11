import { Component } from '@angular/core';

import { CommonModule }
from '@angular/common';

import {

  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonMenuButton,
  IonIcon,
  IonButton

} from '@ionic/angular/standalone';

import { RouterLink }
from '@angular/router';

import { addIcons }
from 'ionicons';

import {

  peopleOutline,
  statsChartOutline,
  calendarOutline,
  personOutline

} from 'ionicons/icons';

import { AuthService }
from 'src/app/services/auth.service';

@Component({

  selector: 'app-home',

  templateUrl: './home.page.html',

  styleUrls: ['./home.page.scss'],

  standalone: true,

  imports: [

    CommonModule,

    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonMenuButton,
    IonIcon,
    IonButton,

    RouterLink

  ]

})
export class HomePage {

  constructor(

    public authService:
      AuthService

  ) {

    addIcons({

      peopleOutline,
      statsChartOutline,
      calendarOutline,
      personOutline

    });

  }

  // =================================
  // REGISTERED
  // =================================

  isRegisteredUser(): boolean {

    return this.authService
      .isRegisteredUser();

  }

}