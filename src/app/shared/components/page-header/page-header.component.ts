import {
  Component,
  Input
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {

  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonMenuButton

} from '@ionic/angular/standalone';

@Component({

  selector: 'app-page-header',

  templateUrl:
    './page-header.component.html',

  styleUrls:
    ['./page-header.component.scss'],

  standalone: true,

  imports: [

    CommonModule,

    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonBackButton,
    IonMenuButton

  ]

})

export class PageHeaderComponent {

  // ============================================
  // INPUTS
  // ============================================

  @Input()
  title = '';

  @Input()
  showBack = false;

  @Input()
  backUrl = '/home';

  @Input()
  showMenu = false;

}