import { Injectable } from '@angular/core';

import { initializeApp } from 'firebase/app';

import {

  getFirestore,
  collection,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  getDoc,
  setDoc

} from 'firebase/firestore';

import { environment } from '../../environments/environment';

import { User } from '../models/users.models';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  // =================================
  // FIREBASE
  // =================================

  private app =
    initializeApp(environment.firebase);

  private db =
    getFirestore(this.app);

  // =================================
  // COLECCIONES
  // =================================

  private usersRef =
    collection(this.db, 'users');

  private registeredUsersRef =
    collection(this.db, 'registeredUsers');

  // =================================
  // USERS
  // =================================

  // CREATE
  async create(user: User) {

    const ref =
      doc(this.db, 'users', user.uid);

    return await setDoc(ref, user);

  }

  // READ ALL
  async getAll(): Promise<User[]> {

    const snapshot =
      await getDocs(this.usersRef);

    return snapshot.docs.map(doc => ({

      id: doc.id,

      ...doc.data()

    } as User));

  }

  // READ ONE
  async getById(uid: string) {

    const docRef =
      doc(this.db, 'users', uid);

    const docSnap =
      await getDoc(docRef);

    if (docSnap.exists()) {

      return {

        id: docSnap.id,

        ...docSnap.data()

      } as User;

    }

    return null;

  }

  // UPDATE
  async update(
    uid: string,
    data: Partial<User>
  ) {

    const ref =
      doc(this.db, 'users', uid);

    return await updateDoc(ref, data);

  }

  // DELETE
  async delete(uid: string) {

    const ref =
      doc(this.db, 'users', uid);

    return await deleteDoc(ref);

  }

  // =================================
  // REGISTERED USERS
  // =================================

  // CREATE REGISTERED USER
  async createRegisteredUser(
    user: User
  ) {

    const ref =
      doc(
        this.db,
        'registeredUsers',
        user.uid
      );

    return await setDoc(ref, user);

  }

  // GET REGISTERED USER
  async getRegisteredUser(
    uid: string
  ) {

    const ref =
      doc(
        this.db,
        'registeredUsers',
        uid
      );

    const snap =
      await getDoc(ref);

    if (snap.exists()) {

      return {

        id: snap.id,

        ...snap.data()

      } as User;

    }

    return null;

  }

  // UPDATE REGISTERED USER
  async updateRegisteredUser(
    uid: string,
    data: Partial<User>
  ) {

    const ref =
      doc(
        this.db,
        'registeredUsers',
        uid
      );

    return await updateDoc(ref, data);

  }

  // DELETE REGISTERED USER
  async deleteRegisteredUser(
    uid: string
  ) {

    const ref =
      doc(
        this.db,
        'registeredUsers',
        uid
      );

    return await deleteDoc(ref);

  }

  // GET ALL REGISTERED USERS
  async getAllRegisteredUsers():
  Promise<User[]> {

    const snapshot =
      await getDocs(
        this.registeredUsersRef
      );

    return snapshot.docs.map(doc => ({

      id: doc.id,

      ...doc.data()

    } as User));

  }

}