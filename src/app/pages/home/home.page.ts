import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';

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

import {

  Router,
  RouterLink

} from '@angular/router';

import { addIcons }
  from 'ionicons';

import {

  peopleOutline,
  statsChartOutline,
  calendarOutline,
  timeOutline,
  alertCircleOutline

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

    public authService: AuthService,

    private router: Router

  ) {

    addIcons({

      peopleOutline,
      statsChartOutline,
      calendarOutline,
      timeOutline,
      alertCircleOutline

    });

  }

  // =================================
  // REGISTERED USER
  // =================================

  isRegisteredUser(): boolean {

    return this.authService
      .isRegisteredUser();

  }

  // =================================
  // PERFIL COMPLETO
  // =================================

  hasCompletedProfile(): boolean {

    return this.authService
      .currentUserData
      ?.perfilCompleto === true;

  }

  // =================================
  // COMPLETAR PERFIL
  // =================================

  completarPerfil() {

    const uid =
      this.authService
        .currentUser?.uid;

    if (!uid) {

      return;

    }

    this.router.navigate([

      '/user-detail',

      uid

    ]);

  }

}