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
  IonSelectOption,
  IonSegment,
  IonSegmentButton,
  IonLabel

} from '@ionic/angular/standalone';

import { PhotoService }
  from 'src/app/services/photo.service';

import {

  ActivatedRoute,
  Router

} from '@angular/router';

import {

  Camera,
  CameraResultType,
  CameraSource

} from '@capacitor/camera';

import {

  ImageCropperComponent,
  ImageCroppedEvent

} from 'ngx-image-cropper';

import { addIcons } from 'ionicons';

import {

  cameraOutline,
  imagesOutline,
  saveOutline,
  personOutline,
  createOutline,
  shieldOutline,
  keyOutline

} from 'ionicons/icons';

import { UserService }
  from 'src/app/services/user.service';

import { AuthService }
  from 'src/app/services/auth.service';

@Component({

  selector: 'app-user-detail',

  templateUrl:
    './user-detail.page.html',

  styleUrls:
    ['./user-detail.page.scss'],

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
    IonSegment,
    IonSegmentButton,
    IonLabel,

    ImageCropperComponent

  ]

})
export class UserDetailPage
  implements OnInit {

  // =================================
  // ESTADO
  // =================================

  userId: string | null = null;

  nuevoUsuario = false;

  puedeEditar = false;

  esRegistrado = false;

  // =================================
  // TABS
  // =================================

  tabActual =
    'personales';

  // =================================
  // EDICION
  // =================================

  editandoPersonales =
    false;

  editandoCredenciales =
    false;

  editandoMembresia =
    false;

  // =================================
  // USERS
  // =================================

  currentUser: any = null;

  user: any = {

    uid: '',

    numeroSocio: '',

    nombre: '',
    telefono: '',
    email: '',
    password: '',
    dni: '',
    direccion: '',
    foto: '',

    tipo: 'invitado',

    source: '',

    perfilCompleto: false

  };

  // =================================
  // CREDENCIALES
  // =================================

  credenciales = {

    currentPassword: '',

    newEmail: '',

    newPassword: '',

    repeatPassword: ''

  };

  // =================================
  // TIPOS
  // =================================

  tiposDisponibles: any[] = [];

  // =================================
  // FOTO
  // =================================

  imageChangedEvent: any = '';

  croppedImage = '';

  mostrarCropper = false;

  constructor(

    private route: ActivatedRoute,

    private router: Router,

    private userService: UserService,

    private authService: AuthService,

    private photoService: PhotoService

  ) {

    addIcons({

      cameraOutline,
      imagesOutline,
      saveOutline,
      personOutline,
      createOutline,
      shieldOutline,
      keyOutline

    });

  }

  // =================================
  // INIT
  // =================================

  async ngOnInit() {

    this.currentUser =
      this.authService.currentUserData;

    this.cargarTiposDisponibles();

    this.userId =
      this.route.snapshot
        .paramMap
        .get('id');

    if (

      this.authService
        .isRegisteredUser()

    ) {

      this.esRegistrado = true;

    }

    if (

      !this.userId ||

      this.userId === 'new'

    ) {

      this.nuevoUsuario = true;

      this.editandoPersonales =
        true;

      return;

    }

    let data =

      await this.userService
        .getById(this.userId);

    // =================================
    // REGISTERED USERS
    // =================================

    if (!data) {

      data =

        await this.userService
          .getRegisteredUser(
            this.userId
          );

      // =================================
      // MARCAR SOURCE
      // =================================

      if (!data) {

        data =

          await this.userService
            .getRegisteredUser(
              this.userId
            );

        if (data) {

          (data as any).source =
            'registeredUsers';

        }

      }

    }

    if (!data) {

      this.router.navigate([
        '/home'
      ]);

      return;

    }

    this.user = data;

    this.validarPermisos();

  }

  // =================================
  // PERMISOS
  // =================================

  validarPermisos() {

    const myUid =
      this.currentUser?.uid;

    const myRole =
      this.currentUser?.tipo;

    const targetUid =
      this.user?.uid;

    const targetRole =
      this.user?.tipo;

    if (
      myRole === 'administrador'
    ) {

      this.puedeEditar = true;

      return;

    }

    if (
      myRole === 'directiva'
    ) {

      if (
        targetRole ===
        'administrador'
      ) {

        this.puedeEditar = false;

        return;

      }

      this.puedeEditar = true;

      return;

    }

    if (

      myRole === 'socio' ||

      myRole === 'invitado' ||

      myRole === 'registrado'

    ) {

      this.puedeEditar =
        myUid === targetUid;

    }

  }

  // =================================
  // TIPOS
  // =================================

  cargarTiposDisponibles() {

    const role =
      this.authService
        .getRole();

    if (
      role === 'administrador'
    ) {

      this.tiposDisponibles = [

        {
          value: 'administrador',
          label: 'Administrador'
        },

        {
          value: 'directiva',
          label: 'Directiva'
        },

        {
          value: 'socio',
          label: 'Socio'
        },

        {
          value: 'invitado',
          label: 'Invitado'
        }

      ];

      return;

    }

    if (
      role === 'directiva'
    ) {

      this.tiposDisponibles = [

        {
          value: 'directiva',
          label: 'Directiva'
        },

        {
          value: 'socio',
          label: 'Socio'
        },

        {
          value: 'invitado',
          label: 'Invitado'
        }

      ];

    }

  }

  // =================================
  // GUARDAR PERSONALES
  // =================================

  async guardarPersonales() {

    if (!this.user.nombre) {

      alert(
        'Nombre obligatorio'
      );

      return;

    }

    try {

      // =============================
      // REGISTERED USER
      // =============================

      if (

        this.authService
          .currentUserData
          ?.source ===
        'registeredUsers'

      ) {

        await this.userService
          .updateRegisteredUser(

            this.user.uid,

            {

              ...this.user,

              perfilCompleto: true

            }

          );

      }

      // =============================
      // USER NORMAL
      // =============================

      else {

        await this.userService.update(

          this.user.uid,

          this.user

        );

      }

      alert(
        'Datos guardados'
      );

      this.editandoPersonales =
        false;

    } catch (error) {

      console.error(error);

      alert(
        'Error guardando datos'
      );

    }

  }

  // =================================
  // GUARDAR MEMBRESIA
  // =================================

  async guardarMembresia() {

    if (

      this.user.tipo === 'socio'

      ||

      this.user.tipo === 'directiva'

    ) {

      if (

        !this.user.numeroSocio

      ) {

        alert(
          'Debe indicar número de socio'
        );

        return;

      }

      const existe =

        await this.userService
          .existeNumeroSocio(

            this.user.numeroSocio,

            this.user.uid

          );

      if (existe) {

        alert(
          'Número de socio ya existe'
        );

        return;

      }

    }

    // =============================
    // REGISTERED USER
    // =============================

    if (

      this.user.source ===
      'registeredUsers'

    ) {

      await this.userService
        .updateRegisteredUser(

          this.user.uid,

          this.user

        );

    }

    // =============================
    // USER NORMAL
    // =============================

    else {

      await this.userService.update(

        this.user.uid,

        this.user

      );

    }

    alert(
      'Membresía actualizada'
    );

    this.editandoMembresia =
      false;

  }

  // =================================
  // GUARDAR CREDENCIALES
  // =================================

  async guardarCredenciales() {

    const cambiarEmail =

      this.credenciales.newEmail
      &&
      this.credenciales.newEmail
      !== this.user.email;

    const cambiarPassword =

      this.credenciales.newPassword
      &&
      this.credenciales.newPassword
        .trim() !== '';

    if (

      !cambiarEmail &&

      !cambiarPassword

    ) {

      alert(
        'No hay cambios'
      );

      return;

    }

    if (

      !this.credenciales
        .currentPassword

    ) {

      alert(
        'Debe indicar contraseña actual'
      );

      return;

    }

    if (

      cambiarPassword &&

      this.credenciales.newPassword
      !==
      this.credenciales.repeatPassword

    ) {

      alert(
        'Las contraseñas no coinciden'
      );

      return;

    }

    if (

      cambiarPassword &&

      this.credenciales.newPassword
        .length < 6

    ) {

      alert(
        'La contraseña debe tener al menos 6 caracteres'
      );

      return;

    }

    try {

      await this.authService
        .updateCredentials(

          this.user.uid,

          this.user.email,

          this.credenciales
            .currentPassword,

          cambiarEmail
            ? this.credenciales
              .newEmail
            : this.user.email,

          cambiarPassword
            ? this.credenciales
              .newPassword
            : ''

        );

      if (cambiarEmail) {

        this.user.email =

          this.credenciales
            .newEmail;

      }

      alert(
        'Credenciales actualizadas'
      );

      this.editandoCredenciales =
        false;

      this.credenciales = {

        currentPassword: '',
        newEmail: '',
        newPassword: '',
        repeatPassword: ''

      };

    } catch (error: any) {

      console.error(error);

      alert(
        error?.message
        ||
        'Error actualizando credenciales'
      );

    }

  }

  // =================================
  // FORMATEAR DNI
  // =================================

  formatearDNI() {

    if (!this.user.dni) {

      return;

    }

    let dni =

      this.user.dni
        .toUpperCase()
        .replace(/[^0-9A-Z]/g, '');

    const numeros =
      dni.replace(/[A-Z]/g, '');

    if (

      numeros.length < 8

    ) {

      this.user.dni =
        numeros;

      return;

    }

    const letras =
      'TRWAGMYFPDXBNJZSQVHLCKE';

    const letra =
      letras[
      parseInt(numeros, 10) % 23
      ];

    this.user.dni =

      numeros.substring(0, 8)
      + letra;

  }

  // =================================
  // FOTO GALERIA
  // =================================

  async seleccionarFoto() {

    const image =
      await Camera.getPhoto({

        quality: 90,

        allowEditing: false,

        resultType:
          CameraResultType.DataUrl,

        source:
          CameraSource.Photos

      });

    if (image.dataUrl) {

      this.imageChangedEvent =
        image.dataUrl;

      this.mostrarCropper =
        true;

    }

  }

  // =================================
  // FOTO CAMARA
  // =================================

  async hacerFoto() {

    const image =
      await Camera.getPhoto({

        quality: 90,

        allowEditing: false,

        resultType:
          CameraResultType.DataUrl,

        source:
          CameraSource.Camera

      });

    if (image.dataUrl) {

      this.imageChangedEvent =
        image.dataUrl;

      this.mostrarCropper =
        true;

    }

  }

  // =================================
  // CROPPER
  // =================================

  imageCropped(
    event: ImageCroppedEvent
  ) {

    if (!event.blob) {

      return;

    }

    const reader =
      new FileReader();

    reader.onload = () => {

      this.croppedImage =
        reader.result as string;

    };

    reader.readAsDataURL(
      event.blob
    );

  }

  cancelarCrop() {

    this.mostrarCropper =
      false;

    this.imageChangedEvent =
      '';

    this.croppedImage =
      '';

  }

  async aplicarCrop() {

    if (!this.croppedImage) {

      return;

    }

    try {

      const photoUrl =

        await this.photoService
          .uploadProfilePhoto(

            this.user.uid ||

            this.currentUser.uid,

            this.croppedImage

          );

      this.user.foto =
        photoUrl;

      this.user = {
        ...this.user
      };

      this.mostrarCropper =
        false;

      this.imageChangedEvent =
        '';

      this.croppedImage =
        '';

    } catch (error) {

      console.error(error);

      alert(
        'Error subiendo imagen'
      );

    }

  }

}