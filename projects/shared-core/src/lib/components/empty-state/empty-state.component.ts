import { Component, Input }
from '@angular/core';

import { CommonModule }
from '@angular/common';

import {

  IonIcon

} from '@ionic/angular/standalone';

import { addIcons }
from 'ionicons';

import {

  alertCircleOutline

} from 'ionicons/icons';

@Component({

  selector: 'app-empty-state',

  templateUrl:
    './empty-state.component.html',

  styleUrls:
    ['./empty-state.component.scss'],

  standalone: true,

  imports: [

    CommonModule,
    IonIcon

  ]

})

export class EmptyStateComponent {

  // ============================================
  // INPUTS
  // ============================================

  @Input()
  icon = 'alert-circle-outline';

  @Input()
  title = 'Sin datos';

  @Input()
  message =
    'No hay información disponible';

  constructor() {

    addIcons({

      alertCircleOutline

    });

  }

}