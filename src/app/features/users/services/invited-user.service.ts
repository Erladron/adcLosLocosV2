import { Injectable } from '@angular/core';

import {

  Firestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
  updateDoc,
  doc

} from '@angular/fire/firestore';

import {
  InvitedUser
} from '../models/invited-user.model';

@Injectable({
  providedIn: 'root'
})

export class InvitedUserService {

  // =================================
  // CONSTRUCTOR
  // =================================

  constructor(
    private firestore: Firestore
  ) {}

  // =================================
  // CREATE INVITATION
  // =================================

  async createInvitation(

    invitation: InvitedUser

  ) {

    const invitedRef =

      collection(
        this.firestore,
        'invitedUsers'
      );

    return await addDoc(

      invitedRef,

      {

        ...invitation,

        fechaInvitacion:
          serverTimestamp(),

        usado: false

      }

    );

  }

  // =================================
  // GET INVITATION BY EMAIL
  // =================================

  async getInvitationByEmail(
    email: string
  ) {

    const normalizedEmail =

      email
        .trim()
        .toLowerCase();

    const invitedRef =

      collection(
        this.firestore,
        'invitedUsers'
      );

    const q =

      query(

        invitedRef,

        where(
          'email',
          '==',
          normalizedEmail
        )

      );

    const snapshot =
      await getDocs(q);

    if (snapshot.empty) {

      return null;

    }

    const invitationDoc =
      snapshot.docs[0];

    return {

      id:
        invitationDoc.id,

      ...invitationDoc.data()

    } as InvitedUser;

  }

  // =================================
  // VALID INVITATION
  // =================================

  async isValidInvitation(
    email: string
  ): Promise<boolean> {

    const invitation =

      await this.getInvitationByEmail(
        email
      );

    if (!invitation) {

      return false;

    }

    return !invitation.usado;

  }

  // =================================
  // MARK INVITATION USED
  // =================================

  async markAsUsed(

    invitationId: string,

    uid: string

  ) {

    const invitationRef =

      doc(

        this.firestore,

        'invitedUsers',

        invitationId

      );

    await updateDoc(

      invitationRef,

      {

        usado: true,

        usadoPorUid: uid,

        fechaRegistro:
          serverTimestamp()

      }

    );

  }

}