import { Component, OnInit } from '@angular/core';

import {

  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonMenuButton,
  IonSearchbar,
  IonFab,
  IonFabButton,
  IonIcon,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonButton

} from '@ionic/angular/standalone';

import { CommonModule }
from '@angular/common';

import { FormsModule }
from '@angular/forms';

import {

  RouterModule,
  Router

} from '@angular/router';

import { addIcons }
from 'ionicons';

import {

  addOutline,
  personOutline,
  chevronForwardOutline,
  checkmarkOutline,
  closeOutline

} from 'ionicons/icons';

import { UserService }
from 'src/app/services/user.service';

import { AuthService }
from 'src/app/services/auth.service';

import { User }
from 'src/app/models/users.models';

import { UserRole }
from 'src/app/models/user-role.enum';

@Component({

  selector: 'app-gest-user',

  templateUrl:
    './gest-user.page.html',

  styleUrls:
    ['./gest-user.page.scss'],

  standalone: true,

  imports: [

    CommonModule,
    FormsModule,
    RouterModule,

    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonMenuButton,
    IonSearchbar,
    IonFab,
    IonFabButton,
    IonIcon,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonButton

  ]

})

export class GestUserPage
implements OnInit {

  // =================================
  // USERS
  // =================================

  users: User[] = [];

  filteredUsers: User[] = [];

  pendingUsers: User[] = [];

  filteredPendingUsers: User[] = [];

  // =================================
  // UI
  // =================================

  searchText = '';

  canAddUsers = false;

  canApproveUsers = false;

  tabActual = 'activos';

  // =================================
  // CONSTRUCTOR
  // =================================

  constructor(

    private userService: UserService,

    private authService: AuthService,

    private router: Router

  ) {

    addIcons({

      addOutline,
      personOutline,
      chevronForwardOutline,
      checkmarkOutline,
      closeOutline

    });

  }

  // =================================
  // INIT
  // =================================

  async ngOnInit() {

    this.loadPermissions();

    await this.loadUsers();

  }

  async ionViewWillEnter() {

    this.loadPermissions();

    await this.loadUsers();

  }

  // =================================
  // LOAD USERS
  // =================================

  async loadUsers() {

    // =============================
    // APROBADOS
    // =============================

    this.users =

      await this.userService
        .getApprovedUsers();

    this.filteredUsers = [
      ...this.users
    ];

    // =============================
    // PENDIENTES
    // =============================

    if (this.canApproveUsers) {

      this.pendingUsers =

        await this.userService
          .getPendingUsers();

      this.filteredPendingUsers = [
        ...this.pendingUsers
      ];

    }

  }

  // =================================
  // PERMISOS
  // =================================

  loadPermissions() {

    const role =
      this.authService.getRole();

    this.canAddUsers =

      role === UserRole.ADMINISTRADOR
      ||
      role === UserRole.DIRECTIVA
      ||
      role === UserRole.SOCIO;

    this.canApproveUsers =

      role === UserRole.ADMINISTRADOR
      ||
      role === UserRole.DIRECTIVA;

  }

  // =================================
  // FILTRAR
  // =================================

  filterUsers() {

    const texto =
      this.searchText
        .toLowerCase()
        .trim();

    // =============================
    // ACTIVOS
    // =============================

    this.filteredUsers =

      this.users.filter(

        (user: User) => {

          return (

            user.nombre
              ?.toLowerCase()
              .includes(texto)

            ||

            user.telefono
              ?.toLowerCase()
              .includes(texto)

            ||

            user.email
              ?.toLowerCase()
              .includes(texto)

            ||

            user.dni
              ?.toLowerCase()
              .includes(texto)

            ||

            user.numeroSocio
              ?.toLowerCase()
              .includes(texto)

            ||

            user.tipo
              ?.toLowerCase()
              .includes(texto)

          );

        }

      );

    // =============================
    // PENDIENTES
    // =============================

    this.filteredPendingUsers =

      this.pendingUsers.filter(

        (user: User) => {

          return (

            user.nombre
              ?.toLowerCase()
              .includes(texto)

            ||

            user.telefono
              ?.toLowerCase()
              .includes(texto)

            ||

            user.email
              ?.toLowerCase()
              .includes(texto)

            ||

            user.dni
              ?.toLowerCase()
              .includes(texto)

          );

        }

      );

  }

  // =================================
  // NUEVO USUARIO
  // =================================

  nuevoUsuario() {

    this.router.navigate([
      '/user-detail'
    ]);

  }

  // =================================
  // APROBAR
  // =================================

  async aprobarUsuario(
    user: User
  ) {

    try {

      await this.userService
        .approveUser(
          user.uid
        );

      alert(
        'Usuario aprobado correctamente'
      );

      await this.loadUsers();

    } catch (error) {

      console.error(error);

      alert(
        'Error aprobando usuario'
      );

    }

  }

  // =================================
  // RECHAZAR
  // =================================

  async rechazarUsuario(
    user: User
  ) {

    const confirmar = confirm(

      `¿Rechazar solicitud de ${user.nombre}?`

    );

    if (!confirmar) {

      return;

    }

    try {

      await this.userService
        .rejectUser(
          user.uid
        );

      alert(
        'Usuario rechazado'
      );

      await this.loadUsers();

    } catch (error) {

      console.error(error);

      alert(
        'Error rechazando usuario'
      );

    }

  }

}