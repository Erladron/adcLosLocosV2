import {
  Component,
  Input
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormsModule
} from '@angular/forms';

import {
  IonicModule
} from '@ionic/angular';

import {
  UserDetail
} from 'src/app/models/user-detail.model';

@Component({
  selector: 'app-membership-form',

  standalone: true,

  templateUrl:
    './membership-form.component.html',

  styleUrls: [
    './membership-form.component.scss'
  ],

  imports: [

    CommonModule,

    FormsModule,

    IonicModule
  ]
})
export class MembershipFormComponent {

  // =====================================
  // INPUTS
  // =====================================

  @Input()
  user: UserDetail | null = null;

  @Input()
  tiposDisponibles: string[] = [];
}