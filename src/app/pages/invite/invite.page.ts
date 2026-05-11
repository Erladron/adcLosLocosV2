import { Component } from '@angular/core';

import { CommonModule }
from '@angular/common';

import { FormsModule }
from '@angular/forms';

import {

  IonContent,
  IonButton,
  IonInput,
  IonItem,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton

} from '@ionic/angular/standalone';

import {

  Firestore,
  collection,
  addDoc,
  query,
  where,
  getDocs

} from '@angular/fire/firestore';

import { AuthService }
from 'src/app/services/auth.service';

@Component({

  selector: 'app-invite',

  templateUrl: './invite.page.html',

  styleUrls: ['./invite.page.scss'],

  standalone: true,

  imports: [

    CommonModule,
    FormsModule,

    IonContent,
    IonButton,
    IonInput,
    IonItem,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonBackButton

  ]

})
export class InvitePage {

  email = '';

  cargando = false;

  constructor(

    private firestore:
      Firestore,

    private authService:
      AuthService

  ) {

  }

  async invitar() {

    try {

      this.cargando = true;

      // VALIDAR EMAIL
      if (!this.email) {

        alert(
          'Introduzca un email'
        );

        return;

      }

      const email =
        this.email
          .trim()
          .toLowerCase();

      // VALIDAR FORMATO
      const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (
        !emailRegex.test(email)
      ) {

        alert(
          'Email incorrecto'
        );

        return;

      }

      // =================================
      // COMPROBAR DUPLICADO
      // =================================

      const preRegisterRef =
        collection(
          this.firestore,
          'preRegister'
        );

      const q = query(

        preRegisterRef,

        where(
          'email',
          '==',
          email
        )

      );

      const result =
        await getDocs(q);

      if (!result.empty) {

        alert(
          'Ese email ya está invitado'
        );

        return;

      }

      // =================================
      // GUARDAR INVITACION
      // =================================

      const currentUser =
        this.authService
          .currentUserData;

      await addDoc(

        preRegisterRef,

        {

          email,

          used: false,

          createdAt:
            new Date(),

          createdBy:
            currentUser?.uid
            || '',

          createdByName:
            currentUser?.nombre
            || ''

        }

      );

      alert(
        'Invitación creada correctamente'
      );

      this.email = '';

    } catch (error) {

      console.error(error);

      alert(
        'Error creando invitación'
      );

    } finally {

      this.cargando = false;

    }

  }

}