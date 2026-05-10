import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {

  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonButton,
  IonIcon,
  IonInput,
  IonItem,
  IonSelect,
  IonSelectOption

} from '@ionic/angular/standalone';

import {

  ActivatedRoute,
  Router

} from '@angular/router';

import {

  Camera,
  CameraResultType,
  CameraSource

} from '@capacitor/camera';

import { UserService } from 'src/app/services/user';

import { addIcons } from 'ionicons';

import {

  cameraOutline,
  imagesOutline,
  saveOutline,
  personOutline,
  createOutline

} from 'ionicons/icons';

import {

  ImageCropperComponent,
  ImageCroppedEvent

} from 'ngx-image-cropper';

@Component({

  selector: 'app-user-detail',

  templateUrl: './user-detail.page.html',

  styleUrls: ['./user-detail.page.scss'],

  standalone: true,

  imports: [

    CommonModule,
    FormsModule,

    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonBackButton,
    IonButton,
    IonIcon,
    IonInput,
    IonItem,
    IonSelect,
    IonSelectOption,

    ImageCropperComponent

  ]

})
export class UserDetailPage
implements OnInit {

  userId: string | null = null;

  nuevoUsuario = false;

  editando = false;

  user: any = {

    nombre: '',
    telefono: '',
    email: '',
    dni: '',
    direccion: '',
    tipo: 'Invitado',
    foto: ''

  };

  imageChangedEvent: any = '';

  croppedImage: string = '';

  mostrarCropper = false;

  constructor(

    private route: ActivatedRoute,

    private router: Router,

    private userService: UserService

  ) {

    addIcons({

      cameraOutline,
      imagesOutline,
      saveOutline,
      personOutline,
      createOutline

    });

  }

  async ngOnInit() {

    this.userId =
      this.route.snapshot.paramMap.get('id');

    // =================================
    // NUEVO USUARIO
    // =================================

    if (
      !this.userId ||
      this.userId === 'new'
    ) {

      this.nuevoUsuario = true;

      this.editando = true;

      return;

    }

    // =================================
    // USUARIO EXISTENTE
    // =================================

    this.editando = false;

    const data =
      await this.userService.getById(
        this.userId
      );

    if (data) {

      this.user = data;

    }

  }

  // =================================
  // BOTON PRINCIPAL
  // =================================

  async accionPrincipal() {

    // ============================
    // PASAR A EDICION
    // ============================

    if (
      !this.editando &&
      !this.nuevoUsuario
    ) {

      this.editando = true;

      return;

    }

    // ============================
    // VALIDACIONES
    // ============================

    if (
      !this.user.nombre ||
      this.user.nombre.trim() === ''
    ) {

      alert(
        'El nombre es obligatorio'
      );

      return;

    }

    const telefonoRegex =
      /^[0-9]{9}$/;

    if (
      !telefonoRegex.test(
        this.user.telefono
      )
    ) {

      alert(
        'Teléfono incorrecto'
      );

      return;

    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (

      this.user.email &&
      !emailRegex.test(
        this.user.email
      )

    ) {

      alert(
        'Email incorrecto'
      );

      return;

    }

    if (
      !this.validarDNI(
        this.user.dni
      )
    ) {

      alert(
        'DNI incorrecto'
      );

      return;

    }

    try {

      // ============================
      // NUEVO
      // ============================

      if (this.nuevoUsuario) {

        await this.userService.create(
          this.user
        );

      }

      // ============================
      // UPDATE
      // ============================

      else {

        await this.userService.update(

          this.userId!,

          this.user

        );

      }

      alert(
        'Usuario guardado'
      );

      this.router.navigate([
        '/gest-user'
      ]);

    } catch (error) {

      console.error(error);

      alert(
        'Error guardando usuario'
      );

    }

  }

  // =================================
  // FOTO GALERIA
  // =================================

  async seleccionarFoto() {

    const image = await Camera.getPhoto({

      quality: 90,

      allowEditing: false,

      resultType: CameraResultType.DataUrl,

      source: CameraSource.Photos

    });

    if (image.dataUrl) {

      this.imageChangedEvent =
        image.dataUrl;

      this.mostrarCropper = true;

    }

  }

  // =================================
  // FOTO CAMARA
  // =================================

  async hacerFoto() {

    const image = await Camera.getPhoto({

      quality: 90,

      allowEditing: false,

      resultType: CameraResultType.DataUrl,

      source: CameraSource.Camera

    });

    if (image.dataUrl) {

      this.imageChangedEvent =
        image.dataUrl;

      this.mostrarCropper = true;

    }

  }

  // =================================
  // CROPPER
  // =================================

  imageCropped(event: ImageCroppedEvent) {

    if (event.blob) {

      const reader = new FileReader();

      reader.readAsDataURL(event.blob);

      reader.onloadend = () => {

        this.croppedImage =
          reader.result as string;

      };

    }

  }

  aplicarCrop() {

    if (this.croppedImage) {

      this.user = {

        ...this.user,

        foto: this.croppedImage

      };

    }

    setTimeout(() => {

      this.mostrarCropper = false;

    }, 100);

  }

  cancelarCrop() {

    this.mostrarCropper = false;

  }

  // =================================
  // FORMATEAR NOMBRE
  // =================================

  formatearNombre() {

    if (!this.user.nombre) return;

    this.user.nombre =

      this.user.nombre

        .toLowerCase()

        .split(' ')

        .filter(
          (palabra: string) =>
            palabra.trim() !== ''
        )

        .map((palabra: string) => {

          return (

            palabra.charAt(0)
              .toUpperCase()

            +

            palabra.slice(1)

          );

        })

        .join(' ');

  }

  // =================================
  // DNI
  // =================================

  calcularDNI() {

    if (!this.user.dni) return;

    let numeros =
      this.user.dni.replace(/\D/g, '');

    numeros =
      numeros.substring(0, 8);

    if (numeros.length === 0) {

      this.user.dni = '';

      return;

    }

    const letras =
      'TRWAGMYFPDXBNJZSQVHLCKE';

    const numero =
      parseInt(numeros, 10);

    const letra =
      letras[numero % 23];

    this.user.dni =
      numeros + letra;

  }

  validarDNI(dni: string): boolean {

    if (!dni) return false;

    dni =
      dni.toUpperCase().trim();

    const regex =
      /^([0-9]{1,8})([A-Z])$/;

    const match =
      dni.match(regex);

    if (!match) {

      return false;

    }

    const numero =
      parseInt(match[1], 10);

    const letra =
      match[2];

    const letras =
      'TRWAGMYFPDXBNJZSQVHLCKE';

    const letraCorrecta =
      letras[numero % 23];

    return letra === letraCorrecta;

  }

}