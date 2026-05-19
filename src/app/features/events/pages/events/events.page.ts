import { Component } from '@angular/core';

import {

  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonMenuButton

} from '@ionic/angular/standalone';

@Component({

  selector: 'app-events',

  templateUrl: './events.page.html',

  standalone: true,

  imports: [

    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonMenuButton

  ]

})
export class EventsPage {}