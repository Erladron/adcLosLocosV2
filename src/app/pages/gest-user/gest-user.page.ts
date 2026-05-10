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
  IonIcon

} from '@ionic/angular/standalone';

import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import { RouterModule, Router } from '@angular/router';

import { addIcons } from 'ionicons';

import {

  addOutline

} from 'ionicons/icons';

import { UserService } from 'src/app/services/user';

import { AuthService } from 'src/app/services/auth.service';

@Component({

  selector: 'app-gest-user',

  templateUrl: './gest-user.page.html',

  styleUrls: ['./gest-user.page.scss'],

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
    IonIcon

  ]

})
export class GestUserPage implements OnInit {

  users: any[] = [];

  filteredUsers: any[] = [];

  searchText = '';

  canAddUsers = false;

  constructor(

    private userService: UserService,

    private authService: AuthService,

    private router: Router

  ) {

    addIcons({

      addOutline

    });

  }

  async ngOnInit() {

    await this.loadUsers();

    this.loadPermissions();

  }

  async ionViewWillEnter() {

    await this.loadUsers();

    this.loadPermissions();

  }

  // CARGAR USUARIOS
  async loadUsers() {

    this.users =
      await this.userService.getAll();

    this.filteredUsers =
      [...this.users];

  }

  // PERMISOS
  loadPermissions() {

    const role =
      this.authService.getRole();

    this.canAddUsers =

      role === 'administrador'
      ||
      role === 'directiva'
      ||
      role === 'socio';

  }

  // FILTRO
  filterUsers() {

    const texto =
      this.searchText.toLowerCase();

    this.filteredUsers =
      this.users.filter((user: any) => {

        return (

          user.nombre
            ?.toLowerCase()
            .includes(texto)

          ||

          user.telefono
            ?.toLowerCase()
            .includes(texto)

          ||

          user.tipo
            ?.toLowerCase()
            .includes(texto)

        );

      });

  }

  // NUEVO USUARIO
  nuevoUsuario() {

    this.router.navigateByUrl(
      '/user-detail'
    );

  }

}