import {
  Component,
  Input,
  EventEmitter,
  Output,
  DoCheck
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
  ImageCropperComponent,
  ImageCroppedEvent
} from 'ngx-image-cropper';

import {
  UserDetail
} from '@users/models/user-detail.model';

import {
  UserValidationService
} from '@users/services/user-validation.service';

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
  implements DoCheck {

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

  constructor(
    private validationService:
      UserValidationService
  ) {

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

    const nuevoNombre =

      this.validationService
        .capitalizeName(

          this.user?.nombre || ''

        );

    this.user = {

      ...this.user,

      nombre: nuevoNombre

    };

  }

  // =====================================
  // FORMAT DNI
  // =====================================

  onFormatDNI(): void {

    this.user.dni =

      this.validationService
        .formatDNI(

          this.user.dni || ''

        );

  }

  actualizarLetraDni(): void {

    if (!this.user?.dni) {
      return;
    }

    // limpiar

    let numeros =
      this.user.dni.replace(/\D/g, '');

    // máximo 8 números

    numeros = numeros.substring(0, 8);

    // si no hay números salir

    if (numeros.length === 0) {

      this.user.dni = '';
      return;

    }

    const letras =
      'TRWAGMYFPDXBNJZSQVHLCKE';

    const letra =
      letras[parseInt(numeros, 10) % 23];

    const dniCompleto =
      numeros + letra;

    if (this.user.dni !== dniCompleto) {

      this.user.dni = dniCompleto;

    }

  }

  ngDoCheck(): void {

    this.actualizarLetraDni();

  }
}