import { Component }
  from '@angular/core';

import { CommonModule }
  from '@angular/common';

import {

  IonContent,
  IonIcon

} from '@ionic/angular/standalone';

import { RouterLink }
  from '@angular/router';

import { addIcons }
  from 'ionicons';

import {

  peopleOutline,
  calendarOutline,
  statsChartOutline,
  chevronForwardOutline,
  personOutline,
  checkmarkCircle,
  createOutline


} from 'ionicons/icons';

import { PageHeaderComponent }
  from '@shared/components/page-header/page-header.component';

import { AuthService }
  from 'projects/shared-core/src/lib/services/auth.service';

@Component({

  selector: 'app-home',

  templateUrl:
    './home.page.html',

  styleUrls:
    ['./home.page.scss'],

  standalone: true,

  imports: [

    CommonModule,

    IonContent,
    IonIcon,

    RouterLink,

    PageHeaderComponent

  ]

})

export class HomePage {

  // =========================================
  // CURRENT USER
  // =========================================

  get currentUser() {

    return this.authService
      .currentUserData;

  }

  // =========================================
  // CONSTRUCTOR
  // =========================================

  constructor(

    private authService:
      AuthService

  ) {

    addIcons({

      peopleOutline,
      calendarOutline,
      statsChartOutline,
      chevronForwardOutline,
      personOutline,
      checkmarkCircle,
      createOutline

    });

  }

}