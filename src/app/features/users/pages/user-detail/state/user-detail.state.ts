import {
  CropperState
} from '@users/els/user-detail.model';

// =========================================
// STATE PRINCIPAL
// =========================================

export interface UserDetailState {

  // =====================================
  // CARGA
  // =====================================

  loading: boolean;

  saving: boolean;

  uploadingPhoto: boolean;

  // =====================================
  // MODOS
  // =====================================

  nuevoUsuario: boolean;

  puedeEditar: boolean;

  esRegistrado: boolean;

  // =====================================
  // TABS
  // =====================================

  tabActual: string;

  // =====================================
  // EDICION
  // =====================================

  editandoPersonales: boolean;

  editandoMembresia: boolean;

  editandoCredenciales: boolean;

  // =====================================
  // PASSWORDS
  // =====================================

  mostrarPassword: boolean;

  mostrarRepeatPassword: boolean;

  mostrarCurrentPassword: boolean;

  mostrarNewPassword: boolean;

  // =====================================
  // CROPPER
  // =====================================

  cropper: CropperState;
}

// =========================================
// ESTADO INICIAL
// =========================================

export const INITIAL_USER_DETAIL_STATE:
  UserDetailState = {

  // =====================================
  // CARGA
  // =====================================

  loading: false,

  saving: false,

  uploadingPhoto: false,

  // =====================================
  // MODOS
  // =====================================

  nuevoUsuario: false,

  puedeEditar: false,

  esRegistrado: false,

  // =====================================
  // TABS
  // =====================================

  tabActual: 'personales',

  // =====================================
  // EDICION
  // =====================================

  editandoPersonales: false,

  editandoMembresia: false,

  editandoCredenciales: false,

  // =====================================
  // PASSWORDS
  // =====================================

  mostrarPassword: false,

  mostrarRepeatPassword: false,

  mostrarCurrentPassword: false,

  mostrarNewPassword: false,

  // =====================================
  // CROPPER
  // =====================================

  cropper: {

    imageChangedEvent: '',

    croppedImage: '',

    mostrarCropper: false
  }
};

// =========================================
// HELPERS STATE
// =========================================

export function resetEditModes(
  state: UserDetailState
): UserDetailState {

  return {

    ...state,

    editandoPersonales: false,

    editandoMembresia: false,

    editandoCredenciales: false
  };
}

// =========================================
// ACTIVAR TAB
// =========================================

export function setActiveTab(
  state: UserDetailState,
  tab: string
): UserDetailState {

  return {

    ...state,

    tabActual: tab
  };
}

// =========================================
// TOGGLE PASSWORD
// =========================================

export function togglePasswordVisibility(
  value: boolean
): boolean {

  return !value;
}

// =========================================
// RESET CROPPER
// =========================================

export function resetCropperState(
  state: UserDetailState
): UserDetailState {

  return {

    ...state,

    cropper: {

      imageChangedEvent: '',

      croppedImage: '',

      mostrarCropper: false
    }
  };
}

// =========================================
// ACTIVAR LOADING
// =========================================

export function setLoading(
  state: UserDetailState,
  loading: boolean
): UserDetailState {

  return {

    ...state,

    loading
  };
}

// =========================================
// ACTIVAR SAVING
// =========================================

export function setSaving(
  state: UserDetailState,
  saving: boolean
): UserDetailState {

  return {

    ...state,

    saving
  };
}

// =========================================
// ACTIVAR UPLOAD FOTO
// =========================================

export function setUploadingPhoto(
  state: UserDetailState,
  uploadingPhoto: boolean
): UserDetailState {

  return {

    ...state,

    uploadingPhoto
  };
}