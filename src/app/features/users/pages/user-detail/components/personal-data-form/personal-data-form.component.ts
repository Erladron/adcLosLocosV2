import {
  Component,
  Input,
  EventEmitter,
  Output,
  OnChanges,
  SimpleChanges
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  normalizeName,
  formatDNI
} from '@core/utils/string.utils';

import {
  FormsModule
} from '@angular/forms';

import {
  IonicModule
} from '@ionic/angular';

import {
  ImageCropperComponent
} from 'ngx-image-cropper';

import {
  UserDetail
} from '@users/models/user-detail.model';

import {
  addIcons
} from 'ionicons';

import {
  imagesOutline,
  cameraOutline,
  checkmarkOutline,
  closeOutline,
  personOutline,
  informationCircleOutline
} from 'ionicons/icons';

@Component({

  selector: 'app-personal-data-form',

  standalone: true,

  templateUrl:
    './personal-data-form.component.html',

  styleUrls: [
    './personal-data-form.component.scss'
  ],

  imports: [

    CommonModule,

    FormsModule,

    IonicModule,

    ImageCropperComponent

  ]

})

export class PersonalDataFormComponent
  implements OnChanges {

  // =====================================
  // INPUTS
  // =====================================

  @Input()
  user!: UserDetail;

  @Input()
  imageChangedEvent: any = null;

  @Input()
  croppedImage = '';

  @Input()
  mostrarCropper = false;

  @Input()
  isEditMode = false;

  @Input()
  editing = false;

  @Input()
  canEdit = false;

  @Input()
  simpleMode = false;

  // =====================================
  // OUTPUTS
  // =====================================

  @Output()
  selectPhoto =
    new EventEmitter<void>();

  @Output()
  takePhoto =
    new EventEmitter<void>();

  @Output()
  imageCropped =
    new EventEmitter<any>();

  @Output()
  applyCropper =
    new EventEmitter<void>();

  @Output()
  cancelCropper =
    new EventEmitter<void>();

  @Output()
  toggleEdit =
    new EventEmitter<void>();

  @Output()
  cancelEdit =
    new EventEmitter<void>();

  // =====================================
  // ON CHANGES
  // =====================================

  ngOnChanges(
    changes: SimpleChanges
  ): void {

    if (
      changes['user']
      &&
      this.user
    ) {

      console.log(
        'PERSONAL FORM USER:',
        this.user
      );

    }

  }

  // =====================================
  // CONSTRUCTOR
  // =====================================

  constructor() {

    addIcons({

      imagesOutline,
      cameraOutline,
      checkmarkOutline,
      closeOutline,
      personOutline,
      informationCircleOutline

    });

  }

  // =====================================
  // CAPITALIZE NAME
  // =====================================

  onCapitalizeName(): void {

    if (!this.user) {

      return;

    }

    this.user.nombre =

      normalizeName(

        this.user?.nombre || ''

      );

  }

  // =====================================
  // DNI INPUT
  // =====================================

  onDniInput(): void {

    if (!this.user) {

      return;

    }

    this.user.dni =

      formatDNI(

        this.user?.dni || ''

      );

    this.actualizarLetraDni();

  }

  // =====================================
  // AUTO DNI LETTER
  // =====================================

  actualizarLetraDni(): void {

    if (

      !this.user

      ||

      !this.user?.dni

    ) {

      return;

    }

    // =================================
    // CLEAN
    // =================================

    let numeros =

      this.user.dni
        .replace(/\D/g, '');

    // =================================
    // MAX 8
    // =================================

    numeros = numeros.substring(0, 8);

    // =================================
    // EMPTY
    // =================================

    if (numeros.length === 0) {

      this.user.dni = '';

      return;

    }

    // =================================
    // CALCULATE LETTER
    // =================================

    const letras =

      'TRWAGMYFPDXBNJZSQVHLCKE';

    const letra =

      letras[
      parseInt(numeros, 10) % 23
      ];

    const dniCompleto =

      numeros + letra;

    // =================================
    // UPDATE
    // =================================

    if (

      this.user.dni !==
      dniCompleto

    ) {

      this.user.dni =
        dniCompleto;

    }

  }

}