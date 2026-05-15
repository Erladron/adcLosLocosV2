import { Component, OnInit } from '@angular/core';

import {

  IonContent,
  IonButton,
  IonIcon

} from '@ionic/angular/standalone';

import { CommonModule }
from '@angular/common';

import { Router }
from '@angular/router';

import { addIcons }
from 'ionicons';

import {

  hourglassOutline,
  closeCircleOutline,
  refreshOutline,
  logOutOutline

} from 'ionicons/icons';

import { AuthService }
from 'src/app/services/auth.service';

import { RequestStatus }
from 'src/app/models/request-status.enum';

@Component({

  selector: 'app-pending-approval',

  templateUrl:
    './pending-approval.page.html',

  styleUrls:
    ['./pending-approval.page.scss'],

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
  // UI
  // =================================

  estado = '';

  nombre = '';

  constructor(

    private authService: AuthService,

    private router: Router

  ) {

    addIcons({

      hourglassOutline,
      closeCircleOutline,
      refreshOutline,
      logOutOutline

    });

  }

  // =================================
  // INIT
  // =================================

  ngOnInit() {

    this.loadUserData();

  }

  // =================================
  // USER DATA
  // =================================

  loadUserData() {

    const userData =
      this.authService.currentUserData;

    if (!userData) {

      return;

    }

    this.nombre =
      userData.nombre || '';

    this.estado =
      userData.estadoSolicitud
      ||
      RequestStatus.PENDIENTE;

  }

  // =================================
  // REFRESH
  // =================================

  async refrescarEstado() {

    window.location.reload();

  }

  // =================================
  // LOGOUT
  // =================================

  async logout() {

    await this.authService.logout();

    this.router.navigateByUrl(
      '/login'
    );

  }

}