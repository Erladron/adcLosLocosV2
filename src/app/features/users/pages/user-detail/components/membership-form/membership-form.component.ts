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

import { addIcons }
  from 'ionicons';

import {
  createOutline,
  saveOutline,
  closeOutline
} from 'ionicons/icons';

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

    addIcons({

      createOutline,
      saveOutline,
      closeOutline

    });

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

  private _isEditMode = false;

  @Input()
  set isEditMode(value: boolean) {

    this._isEditMode = value;

    console.log('MEMBERSHIP isEditMode', value);

  }

  get isEditMode(): boolean {

    return this._isEditMode;

  }

  @Input()
  editing = false;


  private _canEditMembership = false;

  @Input()
  set canEditMembership(value: boolean) {

    console.log(
      'MEMBERSHIP canEditMembership',
      value
    );

    this._canEditMembership = value;

  }

  get canEditMembership(): boolean {

    return this._canEditMembership;

  }
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