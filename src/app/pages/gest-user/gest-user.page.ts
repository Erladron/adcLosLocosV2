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

import { RouterModule } from '@angular/router';

import { addIcons } from 'ionicons';

import {

  addOutline

} from 'ionicons/icons';

import { UserService } from 'src/app/services/user';

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

  constructor(
    private userService: UserService
  ) {

    addIcons({

      addOutline

    });

  }

  async ngOnInit() {

    await this.loadUsers();

  }

  async ionViewWillEnter() {

    await this.loadUsers();

  }

  async loadUsers() {

    this.users =
      await this.userService.getAll();

    this.filteredUsers =
      [...this.users];

  }

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

}