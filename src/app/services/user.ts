import { Injectable } from '@angular/core';

import { initializeApp } from 'firebase/app';

import {

  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  getDoc

} from 'firebase/firestore';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private app =
    initializeApp(environment.firebase);

  private db =
    getFirestore(this.app);

  private usersRef =
    collection(this.db, 'users');

  // CREATE
  async create(user: any) {

    return await addDoc(
      this.usersRef,
      user
    );

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

    return await updateDoc(
      ref,
      data
    );

  }

  // DELETE
  async delete(id: string) {

    const ref =
      doc(this.db, 'users', id);

    return await deleteDoc(ref);

  }

}