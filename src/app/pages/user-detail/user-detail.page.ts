import {
  Component,
  OnInit
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormsModule
} from '@angular/forms';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonButton,
  IonIcon
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';

import {
  saveOutline
} from 'ionicons/icons';

import {
  PersonalDataFormComponent
} from './components/personal-data-form/personal-data-form.component';

import {
  MembershipFormComponent
} from './components/membership-form/membership-form.component';

import {
  CredentialsFormComponent
} from './components/credentials-form/credentials-form.component';

import {
  UserService
} from '../../services/user.service';

import {
  UserValidationService
} from '../../services/user-validation.service';

import {
  User
} from '../../models/users.models';

import {
  AuthService
} from '../../services/auth.service';

import {
  PhotoService
} from '../../services/photo.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.page.html',
  styleUrls: ['./user-detail.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonButton,
    IonIcon,
    PersonalDataFormComponent,
    MembershipFormComponent,
    CredentialsFormComponent
  ]
})

export class UserDetailPage
  implements OnInit {

  user: User = {} as User;

  userId: string | null = null;

  isEditMode = false;

  tiposDisponibles: string[] = [
    'administrador',
    'directiva',
    'socio',
    'invitado'
  ];

  repeatEmail = '';

  password = '';

  repeatPassword = '';

  imageChangedEvent: any = '';

  croppedImage = '';

  mostrarCropper = false;

  constructor(

    private route: ActivatedRoute,

    private router: Router,

    private userService: UserService,

    private validationService:
      UserValidationService,

    private authService: AuthService,

    private photoService:
      PhotoService,
  ) {

    addIcons({
      saveOutline
    });

  }

  // =================================
  // INIT
  // =================================

  async ngOnInit(): Promise<void> {

    this.userId =

      this.route.snapshot.paramMap.get(
        'id'
      );

    this.isEditMode =
      !!this.userId;

    if (
      this.isEditMode &&
      this.userId
    ) {

      await this.loadUser();
    }

  }

  // =================================
  // LOAD USER
  // =================================

  async loadUser(): Promise<void> {

    try {

      const data =

        await this.userService.getById(
          this.userId!
        );

      if (data) {

        this.user = data;

        this.repeatEmail =

          this.user.email || '';
      }

    } catch (error) {

      console.error(error);
    }

  }

  // =================================
  // SAVE
  // =================================

  async save(): Promise<void> {

    try {

      // CAPITALIZAR NOMBRE

      this.user.nombre =

        this.validationService
          .capitalizeName(

            this.user.nombre || ''

          );

      // EMAILS

      if (

        !this.validationService.validateEmail(

          this.user.email || '',

          this.repeatEmail

        )

      ) {

        alert(
          'Los emails no coinciden'
        );

        return;
      }

      // PASSWORDS

      if (

        this.password !==
        this.repeatPassword

      ) {

        alert(
          'Las contraseñas no coinciden'
        );

        return;
      }

      // PASSWORD

      if (!this.isEditMode) {

        this.user.password =
          this.password;
      }

      // =========================
      // UPLOAD PHOTO
      // =========================

      if (this.croppedImage) {

        const tempUid =
          crypto.randomUUID();

        this.user.foto =

          await this.photoService
            .uploadProfilePhoto(

              tempUid,

              this.croppedImage

            );

      }

      // UPDATE

      if (

        this.isEditMode &&
        this.userId

      ) {

        await this.userService.update(

          this.userId,

          this.user

        );

      }

      // CREATE

      else {

        await this.authService
          .createUserAsAdmin(

            this.user

          );

      }

      console.log(
        'USUARIO GUARDADO:',
        this.user
      );

      // NAVIGATE

      this.router.navigate([
        '/gest-user'
      ]);

    }

    catch (error) {

      console.error(error);

      alert(
        'Error guardando usuario'
      );

    }

  }

  // =================================
  // PHOTO
  // =================================

  selectPhoto(): void {

    const input = document.createElement(
      'input'
    );

    input.type = 'file';

    input.accept = 'image/*';

    input.onchange = (event: any) => {

      this.imageChangedEvent = event;

      this.mostrarCropper = true;

    };

    input.click();

  }

  takePhoto(): void {

    this.selectPhoto();

  }

  imageCropped(event: any): void {

    if (!event?.base64) {
      return;
    }

    this.croppedImage =
      event.base64;

  }

  applyCropper(): void {

    this.user.foto =
      this.croppedImage;

    this.mostrarCropper = false;

  }

  cancelCropper(): void {

    this.mostrarCropper = false;

  }

}