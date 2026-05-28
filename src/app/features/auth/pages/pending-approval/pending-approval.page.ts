import {
  Component,
  OnInit
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  Router
} from '@angular/router';

import {

  IonContent,
  IonButton,
  IonIcon

} from '@ionic/angular/standalone';

import {
  addIcons
} from 'ionicons';

import {
  checkmarkCircleOutline,
  logOutOutline
} from 'ionicons/icons';

import {
  AuthService
} from 'projects/shared-core/src/lib/services/auth.service';

@Component({

  selector: 'app-pending-approval',

  templateUrl:
    './pending-approval.page.html',

  styleUrls: [
    './pending-approval.page.scss'
  ],

  standalone: true,

  imports: [

    CommonModule,

    IonContent,
    IonButton,
    IonIcon

  ]

})

export class PendingApprovalPage
  implements OnInit {

  // =================================
  // USER
  // =================================

  nombre = '';

  constructor(

    private authService:
      AuthService,

    private router:
      Router

  ) {

    addIcons({

      checkmarkCircleOutline,
      logOutOutline

    });

  }

  // =================================
  // INIT
  // =================================

  ngOnInit(): void {

    const userData =

      this.authService
        .currentUserData;

    this.nombre =

      userData?.nombre
      ||
      '';

  }

  // =================================
  // LOGOUT
  // =================================

  async logout(): Promise<void> {

    await this.authService.logout();

    await this.router.navigateByUrl(
      '/login'
    );

  }

}