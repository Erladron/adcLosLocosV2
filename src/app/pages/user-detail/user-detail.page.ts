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

import { AuthService } from 'src/app/services/auth.service';

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

  puedeEditar = false;

  currentUser: any = null;

  tiposDisponibles: any[] = [];

  user: any = {

    nombre: '',
    telefono: '',
    email: '',
    password: '',
    dni: '',
    direccion: '',
    tipo: 'invitado',
    foto: ''

  };

  imageChangedEvent: any = '';

  croppedImage: string = '';

  mostrarCropper = false;

  constructor(

    private route: ActivatedRoute,

    private router: Router,

    private userService: UserService,

    private authService: AuthService

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

    this.cargarTiposDisponibles();

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

      this.puedeEditar = true;

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

      // =================================
      // USUARIO LOGADO
      // =================================

      this.currentUser =
        this.authService
          .currentUserData;

      const myUid =
        this.currentUser?.uid;

      const myRole =
        this.currentUser?.tipo;

      const targetUid =
        this.userId;

      const targetRole =
        this.user?.tipo;

      // =================================
      // ADMIN
      // =================================

      if (
        myRole ===
        'administrador'
      ) {

        this.puedeEditar = true;

        return;

      }

      // =================================
      // DIRECTIVA
      // =================================

      if (
        myRole ===
        'directiva'
      ) {

        // ADMIN SOLO LECTURA
        if (
          targetRole ===
          'administrador'
        ) {

          this.editando = false;

          this.puedeEditar = false;

          return;

        }

        this.puedeEditar = true;

        return;

      }

      // =================================
      // SOCIO / INVITADO
      // =================================

      // SOLO SU PERFIL EDITABLE

      if (myUid !== targetUid) {

        this.editando = false;

        this.puedeEditar = false;

        return;

      }

      // SU PROPIO PERFIL

      this.puedeEditar = true;

    }

  }

  // =================================
  // CARGAR TIPOS SEGUN ROL
  // =================================

  cargarTiposDisponibles() {

    const role =
      this.authService.getRole();

    // ADMIN
    if (role === 'administrador') {

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

    }

    // DIRECTIVA
    else if (role === 'directiva') {

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

    // SOCIO
    else if (role === 'socio') {

      this.tiposDisponibles = [

        {
          value: 'invitado',
          label: 'Invitado'
        }

      ];

    }

    // INVITADO
    else {

      this.tiposDisponibles = [];

    }

  }

  // =================================
  // BOTON PRINCIPAL
  // =================================

  async accionPrincipal() {

    // PASAR A EDICION
    if (
      !this.editando &&
      !this.nuevoUsuario
    ) {

      // VALIDAR PERMISOS

      if (!this.puedeEditar) {

        return;

      }

      this.editando = true;

      return;

    }

    // VALIDAR NOMBRE
    if (
      !this.user.nombre ||
      this.user.nombre.trim() === ''
    ) {

      alert(
        'El nombre es obligatorio'
      );

      return;

    }

    // VALIDAR TELEFONO
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

    // VALIDAR EMAIL
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

    // VALIDAR PASSWORD
    if (

      this.nuevoUsuario &&
      !this.user.password

    ) {

      alert(
        'Debe introducir contraseña'
      );

      return;

    }

    // VALIDAR DNI
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

      // NUEVO USUARIO
      if (this.nuevoUsuario) {

        await this.userService.create(
          this.user
        );

      }

      // UPDATE
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

    } catch (error: any) {

      console.error(error);

      alert(

        'Error guardando usuario: '

        +

        (
          error?.message
          ||
          JSON.stringify(error)
        )

      );

    }

  }

  // =================================
  // FOTO GALERIA
  // =================================

  async seleccionarFoto() {

    if (!this.editando) return;

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

    if (!this.editando) return;

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