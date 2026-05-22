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
  where,
  serverTimestamp

} from '@angular/fire/firestore';

import {
  User
} from '../models/users.models';

import {
  UserStatus
} from '../models/user-status.enum';

@Injectable({
  providedIn: 'root'
})

export class UserService {

  // =================================
  // CONSTRUCTOR
  // =================================

  constructor(
    private firestore: Firestore
  ) {}

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
  // UPDATE USER
  // =================================

  async update(

    uid: string,

    data: Partial<User>

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
  // DELETE USER
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
  // =================================

  async approveUser(uid: string) {

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
          UserStatus.ACTIVE,

        fechaAprobacion:
          serverTimestamp()

      }

    );

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