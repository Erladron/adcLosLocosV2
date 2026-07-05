import { AppMessageCode } from './app-message-code.enum';

/**
 * @description Matriz estricta de traducción y normalización de excepciones nativas de Firebase.
 * Mapea de forma unívoca las cadenas de error crudas emitidas por las APIs de Firebase Authentication
 * y Cloud Firestore hacia las constantes de tipado fuerte `AppMessageCode` de nuestro Shared Core.
 * Esto permite al `ErrorHandlerService` interceptar cualquier fallo del SDK y transformarlo en Toasts amigables.
 */
export const FIREBASE_ERROR_MAP: Record<string, AppMessageCode> = {

  // =========================================================================
  // 🔐 AUTH ERRORS (Pasarela de Firebase Authentication)
  // =========================================================================

  /** @description Credenciales nulas o inconsistentes interceptadas en el flujo de login. */
  'auth/invalid-credential': AppMessageCode.ADC_AUTH_ERR_0002,

  /** @description Intento de alta con un email que ya consta en los chasis del proveedor. */
  'auth/email-already-in-use': AppMessageCode.ADC_AUTH_ERR_0004,

  /** @description Contraseña suministrada que no supera los filtros mínimos de robustez. */
  'auth/weak-password': AppMessageCode.ADC_AUTH_ERR_0005,

  /** @description Error de sintaxis o formato ilegítimo detectado en la cadena del correo. */
  'auth/invalid-email': AppMessageCode.ADC_AUTH_ERR_0006,

  /** @description Intento de inicio de sesión de un UID o email inexistente en los directorios. */
  'auth/user-not-found': AppMessageCode.ADC_AUTH_ERR_0011,

  /** @description Contraseña errónea introducida en el formulario de login. */
  'auth/wrong-password': AppMessageCode.ADC_AUTH_ERR_0012,

  /** @description Bloqueo perimetral temporal provocado por ráfagas excesivas de reintentos fallidos. */
  'auth/too-many-requests': AppMessageCode.ADC_AUTH_ERR_0013,

  /** @description Caída física o latencia extrema en el handshake inicial con Firebase Auth. */
  'auth/network-request-failed': AppMessageCode.ADC_AUTH_ERR_0014,

  // =========================================================================
  // 🔥 FIRESTORE ERRORS (Motor de Persistencia NoSQL)
  // =========================================================================

  /** @description Intento de mutación que infringe de forma directa las Security Rules del servidor. */
  'permission-denied': AppMessageCode.ADC_SYS_ERR_0003,

  /** @description Caída temporal o parada por mantenimiento crítico de las infraestructuras de Google Run. */
  'unavailable': AppMessageCode.ADC_SYS_ERR_0004,

  /** * @description 🚀 NUEVO: Error físico por desconexión de red o pérdida de sockets en la base de datos NoSQL.
   * Transforma el fallo de red de Firestore directamente al Toast de "Error de conexión".
   */
  'network': AppMessageCode.ADC_SYS_ERR_0002
};