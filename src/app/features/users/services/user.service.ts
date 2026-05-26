import { Injectable } from '@angular/core';

import {

  Firestore,
  collection,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  getDoc,
  setDoc,
  query,
  where

} from '@angular/fire/firestore';

import {

  Functions,
  httpsCallable

} from '@angular/fire/functions';

import {
  User
} from '../models/users.models';

import {
  UserStatus
} from '../models/user-status.enum';

import {
  UpdatePersonalDataRequest
} from '../models/update-personal-data-request.model';

@Injectable({
  providedIn: 'root'
})

export class UserService {

  // =================================
  // CONSTRUCTOR
  // =================================

  constructor(

    private firestore:
      Firestore,

    private functions:
      Functions

  ) { }

  // =================================
  // NUMERO SOCIO
  // =================================

  async existeNumeroSocio(

    numero: string,

    excluirUid?: string

  ): Promise<boolean> {

    if (!numero) {

      return false;

    }

    const usersRef =

      collection(
        this.firestore,
        'users'
      );

    const q =

      query(

        usersRef,

        where(
          'numeroSocio',
          '==',
          numero
        )

      );

    const snapshot =
      await getDocs(q);

    if (snapshot.empty) {

      return false;

    }

    // =================================
    // EDITANDO
    // =================================

    if (excluirUid) {

      return snapshot.docs.some(

        doc =>

          doc.id !== excluirUid

      );

    }

    return true;

  }

  // =================================
  // CREATE USER
  // =================================

  async create(

    uid: string,

    user: User

  ) {

    const ref =

      doc(

        this.firestore,

        'users',

        uid

      );

    return await setDoc(
      ref,
      user
    );

  }

  // =================================
  // GET ALL USERS
  // =================================

  async getAll():
    Promise<User[]> {

    const usersRef =

      collection(
        this.firestore,
        'users'
      );

    const snapshot =
      await getDocs(usersRef);

    return snapshot.docs.map(

      docItem => ({

        id:
          docItem.id,

        ...docItem.data()

      } as User)

    );

  }

  // =================================
  // ACTIVE USERS
  // =================================

  async getApprovedUsers():
    Promise<User[]> {

    const usersRef =

      collection(
        this.firestore,
        'users'
      );

    const q =

      query(

        usersRef,

        where(
          'estado',
          '==',
          UserStatus.ACTIVE
        )

      );

    const snapshot =
      await getDocs(q);

    return snapshot.docs.map(

      docItem => ({

        id:
          docItem.id,

        ...docItem.data()

      } as User)

    );

  }

  // =================================
  // INACTIVE USERS
  // =================================

  async getInactiveUsers():
    Promise<User[]> {

    const usersRef =

      collection(
        this.firestore,
        'users'
      );

    const q =

      query(

        usersRef,

        where(
          'estado',
          '==',
          UserStatus.INACTIVE
        )

      );

    const snapshot =
      await getDocs(q);

    return snapshot.docs.map(

      docItem => ({

        id:
          docItem.id,

        ...docItem.data()

      } as User)

    );

  }

  // =================================
  // PENDING USERS
  // =================================

  async getPendingUsers():
    Promise<User[]> {

    const usersRef =

      collection(
        this.firestore,
        'users'
      );

    const q =

      query(

        usersRef,

        where(
          'estado',
          '==',
          UserStatus.PENDING_APPROVAL
        )

      );

    const snapshot =
      await getDocs(q);

    return snapshot.docs.map(

      docItem => ({

        id:
          docItem.id,

        ...docItem.data()

      } as User)

    );

  }

  // =================================
  // GET USER
  // =================================

  async getById(uid: string) {

    const docRef =

      doc(
        this.firestore,
        'users',
        uid
      );

    const docSnap =
      await getDoc(docRef);

    if (docSnap.exists()) {

      return {

        id:
          docSnap.id,

        ...docSnap.data()

      } as User;

    }

    return null;

  }

  // =================================
  // UPDATE PERSONAL DATA
  // =================================

  async updatePersonalData(

    uid: string,

    data: UpdatePersonalDataRequest

  ) {

    const ref =

      doc(
        this.firestore,
        'users',
        uid
      );

    console.log(
      'UPDATE PERSONAL DATA PAYLOAD',
      data
    );

    return await updateDoc(
      ref,
      {
        nombre:
          data.nombre,

        telefono:
          data.telefono || '',

        dni:
          data.dni || '',

        direccion:
          data.direccion || '',

        foto:
          data.foto || '',

        estado:
          data.estado
      }
    );

  }

  // =================================
  // GENERIC UPDATE
  // TEMPORAL
  // =================================

  async update(

    uid: string,

    data: any

  ) {

    const ref =

      doc(
        this.firestore,
        'users',
        uid
      );

    return await updateDoc(
      ref,
      data
    );

  }

  // =================================
  // DEACTIVATE USER
  // CLOUD FUNCTION
  // =================================

  async deactivateUser(

    uid: string,

    adminUid: string,

    motivo: string

  ) {

    const callable =

      httpsCallable(

        this.functions,

        'deactivateUser'

      );

    return await callable({

      uid,

      adminUid,

      motivo

    });

  }

  // =================================
  // REACTIVATE USER
  // CLOUD FUNCTION
  // =================================

  async reactivateUser(

    uid: string,

    adminUid: string

  ) {

    const callable =

      httpsCallable(

        this.functions,

        'reactivateUser'

      );

    return await callable({

      uid,

      adminUid

    });

  }

  // =================================
  // HARD DELETE USER
  // SOLO USO ADMINISTRATIVO / DEBUG
  // =================================

  async delete(uid: string) {

    const ref =

      doc(
        this.firestore,
        'users',
        uid
      );

    return await deleteDoc(ref);

  }

  // =================================
  // APPROVE USER
  // CLOUD FUNCTION
  // =================================

  async approveUser(uid: string) {

    const callable =

      httpsCallable(

        this.functions,

        'approveUser'

      );

    return await callable({

      uid

    });

  }

  // =================================
  // REJECT USER
  // =================================

  async rejectUser(uid: string) {

    const userRef =

      doc(
        this.firestore,
        'users',
        uid
      );

    await updateDoc(

      userRef,

      {

        estado:
          UserStatus.REJECTED

      }

    );

  }

  // =================================
  // EXISTS EMAIL
  // =================================

  async existsByEmail(
    email: string
  ): Promise<any> {

    const normalizedEmail =

      email
        .trim()
        .toLowerCase();

    const usersRef =

      collection(
        this.firestore,
        'users'
      );

    const qUsers =

      query(

        usersRef,

        where(
          'email',
          '==',
          normalizedEmail
        )

      );

    const usersResult =

      await getDocs(qUsers);

    if (!usersResult.empty) {

      return {

        exists: true,

        source: 'users',

        data:
          usersResult.docs[0].data()

      };

    }

    return {

      exists: false

    };

  }

}