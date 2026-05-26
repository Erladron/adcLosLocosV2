import { Component, OnInit } from '@angular/core';

import { CommonModule }
  from '@angular/common';

import { FormsModule }
  from '@angular/forms';

import {

  RouterModule,
  Router

} from '@angular/router';

import {

  IonContent,
  IonSearchbar,
  IonFab,
  IonFabButton,
  IonIcon,
  IonSegment,
  IonSegmentButton,
  IonLabel

} from '@ionic/angular/standalone';

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
  from '@users/services/user.service';

import { User }
  from '@users/models/users.models';

import { NotificationService }
  from '@core/services/notification.service';

import { DialogService }
  from '@core/services/dialog.service';

import { LoadingService }
  from '@core/services/loading.service';

import { ErrorHandlerService }
  from '@core/services/error-handler.service';

import { AuthPoliciesService }
  from '@auth/services/auth-policies.service';

import { AppMessageCode }
  from '@core/constants/messages/app-message-code.enum';

import { EmptyStateComponent }
  from '@shared/components/empty-state/empty-state.component';

import { PageHeaderComponent }
  from '@shared/components/page-header/page-header.component';

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
    IonSearchbar,
    IonFab,
    IonFabButton,
    IonIcon,
    IonSegment,
    IonSegmentButton,
    IonLabel,

    EmptyStateComponent,
    PageHeaderComponent

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

  inactiveUsers: User[] = [];

  filteredInactiveUsers: User[] = [];

  // =================================
  // UI
  // =================================

  searchText = '';

  canAddUsers = false;

  canApproveUsers = false;

  canViewInactiveUsers = false;

  tabActual = 'activos';

  // =================================
  // CONSTRUCTOR
  // =================================

  constructor(

    private userService:
      UserService,

    private notification:
      NotificationService,

    private router:
      Router,

    private policies:
      AuthPoliciesService,

    private dialog:
      DialogService,

    private loading:
      LoadingService,

    private errorHandler:
      ErrorHandlerService

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

    // =================================
    // ACTIVE USERS
    // =================================

    this.users =

      await this.userService
        .getApprovedUsers();

    this.filteredUsers = [
      ...this.users
    ];

    // =================================
    // PENDING USERS
    // =================================

    if (this.canApproveUsers) {

      this.pendingUsers =

        await this.userService
          .getPendingUsers();

      this.filteredPendingUsers = [
        ...this.pendingUsers
      ];

    }

    // =================================
    // INACTIVE USERS
    // =================================

    if (this.canViewInactiveUsers) {

      this.inactiveUsers =

        await this.userService
          .getInactiveUsers();

      this.filteredInactiveUsers = [
        ...this.inactiveUsers
      ];

    }

  }

  // =================================
  // LOAD PERMISSIONS
  // =================================

  loadPermissions() {

    this.canAddUsers =

      this.policies.isAdmin()

      ||

      this.policies.isDirectiva()

      ||

      this.policies.isSocio();

    this.canApproveUsers =

      this.policies.canManageUsers();

    this.canViewInactiveUsers =

      this.policies.isAdmin()

      ||

      this.policies.isDirectiva();

  }

  // =================================
  // FILTER USERS
  // =================================

  filterUsers() {

    const texto =

      this.searchText
        .toLowerCase()
        .trim();

    // =================================
    // ACTIVE USERS
    // =================================

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

    // =================================
    // PENDING USERS
    // =================================

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

    // =================================
    // INACTIVE USERS
    // =================================

    this.filteredInactiveUsers =

      this.inactiveUsers.filter(

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

  }

  // =================================
  // NUEVO USUARIO
  // =================================

  nuevoUsuario() {

    this.router.navigate(

      ['/user-detail'],

      {

        queryParams: {

          adminCreate: true

        }

      }

    );

  }

  // =================================
  // APROBAR USUARIO
  // =================================

  async aprobarUsuario(
    user: User
  ) {

    try {

      await this.loading.wrap(

        async () => {

          await this.userService
            .approveUser(
              user.uid
            );

          await this.notification.success(

            AppMessageCode
              .ADC_USER_INF_0001

          );

          await this.loadUsers();

        },

        'Aprobando usuario...'

      );

    }

    catch (error) {

      await this.errorHandler.handle(

        error,

        AppMessageCode
          .ADC_ADMIN_ERR_0001

      );

    }

  }

  // =================================
  // RECHAZAR USUARIO
  // =================================

  async rechazarUsuario(
    user: User
  ) {

    const confirmar =

      await this.dialog.confirm({

        header:
          'Rechazar usuario',

        message:
          `¿Rechazar solicitud de ${user.nombre}?`,

        confirmText:
          'Rechazar',

        cancelText:
          'Cancelar'

      });

    if (!confirmar) {

      return;

    }

    try {

      await this.loading.wrap(

        async () => {

          await this.userService
            .rejectUser(
              user.uid
            );

          await this.notification.success(

            AppMessageCode
              .ADC_USER_INF_0002

          );

          await this.loadUsers();

        },

        'Rechazando usuario...'

      );

    }

    catch (error) {

      await this.errorHandler.handle(

        error,

        AppMessageCode
          .ADC_ADMIN_ERR_0002

      );

    }

  }

}