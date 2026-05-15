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

import { User }
  from '../models/users.models';

import { RequestStatus }
  from '../models/request-status.enum';

@Injectable({
  providedIn: 'root'
})

export class UserService {

  // =================================
  // CONSTRUCTOR
  // =================================

  constructor(
    private firestore: Firestore
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
  // USERS
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
  // USERS APROBADOS
  // =================================

  async getApprovedUsers():
    Promise<User[]> {

    const usersRef =

      collection(
        this.firestore,
        'users'
      );

    const q = query(

      usersRef,

      where(
        'aprobado',
        '==',
        true
      ),

      where(
        'estadoSolicitud',
        '==',
        RequestStatus.APROBADO
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
  // USERS PENDIENTES
  // =================================

  async getPendingUsers():
    Promise<User[]> {

    const usersRef =

      collection(
        this.firestore,
        'users'
      );

    const q = query(

      usersRef,

      where(
        'aprobado',
        '==',
        false
      ),

      where(
        'estadoSolicitud',
        '==',
        RequestStatus.PENDIENTE
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
  // APROBAR USER
  // =================================

  async approveUser(uid: string) {

    const userRef =

      doc(
        this.firestore,
        'users',
        uid
      );

    const registeredRef =

      doc(
        this.firestore,
        'registeredUsers',
        uid
      );

    // =================================
    // USERS
    // =================================

    await updateDoc(

      userRef,

      {

        aprobado: true,

        estadoSolicitud:
          RequestStatus.APROBADO,

        fechaAprobacion:
          serverTimestamp()

      }

    );

    // =================================
    // REGISTERED USERS
    // =================================

    await updateDoc(

      registeredRef,

      {

        aprobado: true,

        estadoSolicitud:
          RequestStatus.APROBADO

      }

    );

  }

  // =================================
  // RECHAZAR USER
  // =================================

  async rejectUser(uid: string) {

    const userRef =

      doc(
        this.firestore,
        'users',
        uid
      );

    const registeredRef =

      doc(
        this.firestore,
        'registeredUsers',
        uid
      );

    await updateDoc(

      userRef,

      {

        aprobado: false,

        estadoSolicitud:
          RequestStatus.RECHAZADO

      }

    );

    await updateDoc(

      registeredRef,

      {

        aprobado: false,

        estadoSolicitud:
          RequestStatus.RECHAZADO

      }

    );

  }

  // =================================
  // REGISTERED USERS
  // =================================

  async createRegisteredUser(
    user: User
  ) {

    const ref =

      doc(

        this.firestore,

        'registeredUsers',

        user.uid

      );

    return await setDoc(
      ref,
      user
    );

  }

  async getRegisteredUser(
    uid: string
  ) {

    const ref =

      doc(
        this.firestore,
        'registeredUsers',
        uid
      );

    const snap =
      await getDoc(ref);

    if (snap.exists()) {

      return {

        id:
          snap.id,

        ...snap.data()

      } as User;

    }

    return null;

  }

  async updateRegisteredUser(

    uid: string,

    data: Partial<User>

  ) {

    const ref =

      doc(
        this.firestore,
        'registeredUsers',
        uid
      );

    return await setDoc(

      ref,

      data,

      {

        merge: true

      }

    );

  }

  async deleteRegisteredUser(
    uid: string
  ) {

    const ref =

      doc(
        this.firestore,
        'registeredUsers',
        uid
      );

    return await deleteDoc(ref);

  }

  async getAllRegisteredUsers():
    Promise<User[]> {

    const registeredUsersRef =

      collection(
        this.firestore,
        'registeredUsers'
      );

    const snapshot =
      await getDocs(
        registeredUsersRef
      );

    return snapshot.docs.map(

      docItem => ({

        id:
          docItem.id,

        ...docItem.data()

      } as User)

    );

  }

}