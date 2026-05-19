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
import { UserStatus } from '../models/user-status.enum';

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

    const snapshot =
      await getDocs(usersRef);

    return snapshot.docs

      .map(

        docItem => ({

          id:
            docItem.id,

          ...docItem.data()

        } as User)

      )

      .filter(user =>

        user.estado === 'activo'

        ||

        (

          user.aprobado === true

          &&

          user.estadoSolicitud ===
          RequestStatus.APROBADO

        )

      );

  }

  // =================================
  // USERS PENDIENTES
  // =================================

  async getPendingUsers():
    Promise<any[]> {

    const usersRef =

      collection(
        this.firestore,
        'users'
      );

    const preRegisterRef =

      collection(
        this.firestore,
        'preRegister'
      );

    // =================================
    // LOAD USERS
    // =================================

    const usersSnapshot =
      await getDocs(usersRef);

    const preSnapshot =
      await getDocs(preRegisterRef);

    // =================================
    // MAP PREREGISTER
    // =================================

    const preRegisterMap =
      new Map();

    preSnapshot.docs.forEach(docItem => {

      const data =
        docItem.data();

      preRegisterMap.set(

        data['email'],

        data

      );

    });

    // =================================
    // BUILD USERS
    // =================================

    const users = await Promise.all(

      usersSnapshot.docs.map(async docItem => {

        const user = {

          id:
            docItem.id,

          ...docItem.data()

        } as any;

        // =============================
        // GET PREREGISTER INFO
        // =============================

        const preData =

          preRegisterMap.get(
            user.email
          );

        if (preData) {

          user.fechaInvitacion =
            preData['fecha'];

          const invitadorUid =
            preData['invitadoPor'];

          // =============================
          // GET INVITER USER
          // =============================

          if (invitadorUid) {

            const inviterDoc =

              await getDoc(

                doc(

                  this.firestore,

                  'users',

                  invitadorUid

                )

              );

            if (inviterDoc.exists()) {

              user.invitadoPor =

                inviterDoc.data()['nombre']

                || 'Administrador';

            }

            else {

              user.invitadoPor =
                'Administrador';

            }

          }

        }

        return user;

      })

    );

    // =================================
    // FILTER PENDING USERS
    // =================================

    return users.filter(user =>

      user.estado ===
      'pendiente_aprobacion'

      ||

      (

        user.aprobado === false

        &&

        user.estadoSolicitud ===
        RequestStatus.PENDIENTE

      )

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


    // =================================
    // USERS
    // =================================

    await updateDoc(

      userRef,

      {

        estado:
          'activo',

        aprobado: true,

        estadoSolicitud:
          RequestStatus.APROBADO,

        fechaAprobacion:
          serverTimestamp()

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

    await updateDoc(

      userRef,

      {

        estado:
          UserStatus.CANCELADO,

        aprobado: false,

        estadoSolicitud:
          RequestStatus.RECHAZADO

      }

    );

  }

  async existsByEmail(
    email: string
  ): Promise<any> {

    const normalizedEmail =

      email
        .trim()
        .toLowerCase();

    // =========================
    // USERS
    // =========================

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

    // =========================
    // PREREGISTER
    // =========================

    const preRef =

      collection(
        this.firestore,
        'preRegister'
      );

    const qPre =

      query(

        preRef,

        where(
          'email',
          '==',
          normalizedEmail
        )

      );

    const preResult =

      await getDocs(qPre);

    if (!preResult.empty) {

      return {

        exists: true,

        source: 'preRegister',

        data:
          preResult.docs[0].data()

      };

    }

    return {

      exists: false

    };

  }

}