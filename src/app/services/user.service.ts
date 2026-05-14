import { Injectable } from '@angular/core';

// ¡FÍJATE AQUÍ! Hemos añadido 'query' y 'where' a la importación
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

import { User } from '../models/users.models';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  // INYECTAMOS FIRESTORE DE ANGULARFIRE (Comparte el Auth)
  constructor(private firestore: Firestore) {}

  // NUEVO: Comprobar si el número de socio ya existe
  async existeNumeroSocio(numero: string, excluirUid?: string): Promise<boolean> {
    if (!numero) return false;
    
    const usersRef = collection(this.firestore, 'users');
    const q = query(usersRef, where('numeroSocio', '==', numero));
    const snapshot = await getDocs(q);

    if (snapshot.empty) return false;

    // Si estamos editando, comprobamos que el número no pertenezca a OTRO usuario
    if (excluirUid) {
      return snapshot.docs.some(doc => doc.id !== excluirUid);
    }

    return true;
  }
  
  // =================================
  // USERS
  // =================================

  async create(user: User) {
    const ref = doc(this.firestore, 'users', user.uid);
    return await setDoc(ref, user);
  }

  async getAll(): Promise<User[]> {
    const usersRef = collection(this.firestore, 'users');
    const snapshot = await getDocs(usersRef);
    return snapshot.docs.map(docItem => ({
      id: docItem.id,
      ...docItem.data()
    } as User));
  }

  async getById(uid: string) {
    const docRef = doc(this.firestore, 'users', uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as User;
    }
    return null;
  }

  async update(uid: string, data: Partial<User>) {
    const ref = doc(this.firestore, 'users', uid);
    return await updateDoc(ref, data);
  }

  async delete(uid: string) {
    const ref = doc(this.firestore, 'users', uid);
    return await deleteDoc(ref);
  }

  // =================================
  // REGISTERED USERS
  // =================================

  async createRegisteredUser(user: User) {
    const ref = doc(this.firestore, 'registeredUsers', user.uid);
    return await setDoc(ref, user);
  }

  async getRegisteredUser(uid: string) {
    const ref = doc(this.firestore, 'registeredUsers', uid);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      return {
        id: snap.id,
        ...snap.data()
      } as User;
    }
    return null;
  }

  async updateRegisteredUser(uid: string, data: Partial<User>) {
    const ref = doc(this.firestore, 'registeredUsers', uid);
    // Usamos setDoc con merge para evitar errores si no existe
    return await setDoc(ref, data, { merge: true });
  }

  async deleteRegisteredUser(uid: string) {
    const ref = doc(this.firestore, 'registeredUsers', uid);
    return await deleteDoc(ref);
  }

  async getAllRegisteredUsers(): Promise<User[]> {
    const registeredUsersRef = collection(this.firestore, 'registeredUsers');
    const snapshot = await getDocs(registeredUsersRef);
    return snapshot.docs.map(docItem => ({
      id: docItem.id,
      ...docItem.data()
    } as User));
  }

}