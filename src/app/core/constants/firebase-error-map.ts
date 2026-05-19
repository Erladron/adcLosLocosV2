import { AppMessageCode }
from '@core/constants/messages/app-message-code.enum';

export const FIREBASE_ERROR_MAP:
Record<string, string> = {

  // ============================================
  // AUTH
  // ============================================

  'auth/invalid-credential':

    AppMessageCode
      .ADC_AUTH_ERR_0002,

  'auth/email-already-in-use':

    AppMessageCode
      .ADC_AUTH_ERR_0004,

  'auth/weak-password':

    AppMessageCode
      .ADC_AUTH_ERR_0005,

  'auth/invalid-email':

    AppMessageCode
      .ADC_AUTH_ERR_0006,

  'auth/user-not-found':

    AppMessageCode
      .ADC_AUTH_ERR_0011,

  'auth/wrong-password':

    AppMessageCode
      .ADC_AUTH_ERR_0012,

  'auth/too-many-requests':

    AppMessageCode
      .ADC_AUTH_ERR_0013,

  'auth/network-request-failed':

    AppMessageCode
      .ADC_AUTH_ERR_0014,

  // ============================================
  // FIRESTORE
  // ============================================

  'permission-denied':

    AppMessageCode
      .ADC_SYS_ERR_0003,

  'unavailable':

    AppMessageCode
      .ADC_SYS_ERR_0004

};