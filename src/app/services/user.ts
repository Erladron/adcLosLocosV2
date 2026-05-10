import { Injectable } from '@angular/core';

import { initializeApp } from 'firebase/app';

import {

  getFirestore,
  collection,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  getDoc

} from 'firebase/firestore';

import {

  getFunctions,
  httpsCallable

} from 'firebase/functions';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private app =
    initializeApp(environment.firebase);

  private db =
    getFirestore(this.app);

  private functions =
    getFunctions(this.app);

  private usersRef =
    collection(this.db, 'users');

  // CREAR USUARIO
  async create(user: any) {

    const response = await fetch(

      'https://us-central1-adcloslocos.cloudfunctions.net/createUser',

      {

        method: 'POST',

        headers: {

          'Content-Type':
            'application/json'

        },

        body: JSON.stringify({

          data: {

            nombre: user.nombre,

            email: user.email,

            password: user.password,

            telefono: user.telefono,

            dni: user.dni,

            tipo: user.tipo,

            foto: user.foto || ''

          }

        })

      }

    );

    if (!response.ok) {

      throw new Error(
        'Error creando usuario'
      );

    }

    return await response.json();

  }

  // READ ALL
  async getAll(): Promise<any[]> {

    const snapshot =
      await getDocs(this.usersRef);

    return snapshot.docs.map(doc => ({

      id: doc.id,

      ...doc.data()

    }));

  }

  // READ ONE
  async getById(id: string) {

    const docRef =
      doc(this.db, 'users', id);

    const docSnap =
      await getDoc(docRef);

    if (docSnap.exists()) {

      return {

        id,

        ...docSnap.data()

      };

    }

    return null;

  }

  // UPDATE
  async update(id: string, data: any) {

    const ref =
      doc(this.db, 'users', id);

    return await updateDoc(ref, data);

  }

  // DELETE
  async delete(id: string) {

    const ref =
      doc(this.db, 'users', id);

    return await deleteDoc(ref);

  }

}