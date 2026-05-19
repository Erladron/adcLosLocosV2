import {
  Component,
  Input,
  Output,
  EventEmitter
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
} from '@users/models/user-detail.model';

import {
  Platform
} from '@ionic/angular';

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

  selectInterface:
    'popover'
    |
    'action-sheet'
    = 'popover';

  constructor(

    private platform: Platform

  ) {

    this.selectInterface =

      this.platform.is('mobile')

        ? 'action-sheet'

        : 'popover';

  }
  // =====================================
  // INPUTS
  // =====================================

  @Input()
  user: UserDetail | null = null;

  @Input()
  tiposDisponibles: string[] = [];

  @Input()
  isEditMode = false;

  @Input()
  editing = false;

  @Input()
  canEditMembership = false;

  // =====================================
  // OUTPUTS
  // =====================================

  @Output()
  toggleEdit =
    new EventEmitter<void>();

  @Output()
  cancelEdit =
    new EventEmitter<void>();
}