import { Injectable } from '@angular/core';

import { User }
  from '../models/users.models';

import { UserDetailPermissionsService }
  from './user-detail-permissions.service';

import { UserDetailPhotoService }
  from './user-detail-photo.service';

import { UserDetailDataService }
  from './user-detail-data.service';

@Injectable({
  providedIn: 'root'
})

export class UserDetailFacadeService {

  constructor(

    // ============================================
    // SERVICES
    // ============================================

    private permissionsService:
      UserDetailPermissionsService,

    private photoService:
      UserDetailPhotoService,

    private dataService:
      UserDetailDataService

  ) { }

  // ============================================
  // GET PERMISSIONS
  // ============================================

  /**
   * Obtiene permisos usuario.
   */
  getPermissions(
    user: User
  ) {

    return this.permissionsService
      .getPermissions(user);

  }

  // ============================================
  // UPDATE PERSONAL DATA
  // ============================================

  /**
   * Actualizar datos personales.
   */
  async updatePersonalData(data: {

    user: User,
    userId: string | null,
    croppedImage: string

  }) {

    return await this.dataService
      .updatePersonalData(data);

  }

  // ============================================
  // UPDATE MEMBERSHIP
  // ============================================

  /**
   * Actualizar membresía.
   */
  async updateMembership(data: {

    user: User,
    userId: string | null

  }) {

    return await this.dataService
      .updateMembership(data);

  }

  // ============================================
  // UPDATE CREDENTIALS
  // ============================================

  /**
   * Actualizar credenciales.
   */
  async updateCredentials(data: {

    user: User,
    userId: string | null,
    originalEmail: string,
    repeatEmail: string,
    password: string,
    repeatPassword: string,
    currentPassword: string,
    isOwnProfile: boolean

  }) {

    return await this.dataService
      .updateCredentials(data);

  }

  // ============================================
  // CREATE USER
  // ============================================

  /**
   * Crear usuario.
   */
  async createUser(data: {

    user: User,
    repeatEmail: string,
    password: string,
    repeatPassword: string,
    croppedImage: string

  }) {

    return await this.dataService
      .createUser(data);

  }

  // ============================================
  // SELECT PHOTO
  // ============================================

  /**
   * Seleccionar foto.
   */
  async selectPhoto() {

    return await this.photoService
      .selectPhoto();

  }

  // ============================================
  // TAKE PHOTO
  // ============================================

  /**
   * Tomar foto cámara.
   */
  async takePhoto() {

    return await this.photoService
      .takePhoto();

  }

  // ============================================
  // PROCESS CROPPED IMAGE
  // ============================================

  /**
   * Procesar cropper.
   */
  processCroppedImage(
    event: any
  ) {

    return this.photoService
      .processCroppedImage(event);

  }

}