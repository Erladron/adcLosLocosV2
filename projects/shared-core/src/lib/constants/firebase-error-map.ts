import { AppMessageCode } from './app-message-code.enum';

/**
 * @description Matriz estricta de traducción y normalización de excepciones nativas de Firebase[cite: 8].
 * Mapea de forma unívoca las cadenas de error crudas emitidas por las APIs de Firebase Authentication,
 * Cloud Firestore y Cloud Functions v2 hacia las constantes de tipado fuerte `AppMessageCode` de nuestro Shared Core[cite: 8].
 * Esto permite al `ErrorHandlerService` interceptar cualquier fallo del SDK o backend y transformarlo en Toasts amigables[cite: 8, 9].
 */
export const FIREBASE_ERROR_MAP: Record<string, AppMessageCode> = {

  // =========================================================================
  // 🔐 AUTH ERRORS (Pasarela de Firebase Authentication - Client & Admin SDK)
  // =========================================================================

  /** @description Credenciales nulas o inconsistentes interceptadas en el flujo de login[cite: 8]. */
  'auth/invalid-credential': AppMessageCode.ADC_AUTH_ERR_0002,

  /** @description Intento de alta con un email que ya consta en los chasis del proveedor (Client SDK)[cite: 8]. */
  'auth/email-already-in-use': AppMessageCode.ADC_AUTH_ERR_0004,

  /** @description Intento de alta con un email que ya consta en los chasis del proveedor (Admin SDK / Cloud Functions)[cite: 8]. */
  'auth/email-already-exists': AppMessageCode.ADC_AUTH_ERR_0004,

  /** @description Intento de alta con un número de teléfono duplicado en Firebase Auth[cite: 8]. */
  'auth/phone-number-already-exists': AppMessageCode.ADC_AUTH_ERR_0004,

  /** @description Contraseña suministrada que no supera los filtros mínimos de robustez[cite: 8]. */
  'auth/weak-password': AppMessageCode.ADC_AUTH_ERR_0005,

  /** @description Error de sintaxis o formato ilegítimo detectado en la cadena del correo[cite: 8]. */
  'auth/invalid-email': AppMessageCode.ADC_AUTH_ERR_0006,

  /** @description Intento de inicio de sesión de un UID o email inexistente en los directorios[cite: 8]. */
  'auth/user-not-found': AppMessageCode.ADC_AUTH_ERR_0011,

  /** @description Contraseña errónea introducida en el formulario de login[cite: 8]. */
  'auth/wrong-password': AppMessageCode.ADC_AUTH_ERR_0012,

  /** @description Bloqueo perimetral temporal provocado por ráfagas excesivas de reintentos fallidos[cite: 8]. */
  'auth/too-many-requests': AppMessageCode.ADC_AUTH_ERR_0013,

  /** @description Caída física o latencia extrema en el handshake inicial con Firebase Auth[cite: 8]. */
  'auth/network-request-failed': AppMessageCode.ADC_AUTH_ERR_0014,

  // =========================================================================
  // ☁️ CLOUD FUNCTIONS ERRORS (Servicios Serverless / Endpoints HTTP)
  // =========================================================================

  /** @description Fallback de error interno de ejecución en el servidor serverless[cite: 8]. */
  'functions/internal': AppMessageCode.ADC_AUTH_ERR_0007,

  /** @description Envoltorio de error HTTP 500 plano de Firebase Functions[cite: 8]. */
  'internal': AppMessageCode.ADC_AUTH_ERR_0007,

  /** @description Recurso o documento ya existente reportado por la Cloud Function[cite: 8]. */
  'functions/already-exists': AppMessageCode.ADC_AUTH_ERR_0004,

  /** @description Argumentos requeridos ausentes o mal estructurados en la llamada[cite: 8]. */
  'functions/invalid-argument': AppMessageCode.ADC_USER_ERR_0005,

  /** @description Petición denegada por falta de credenciales de administrador o directiva[cite: 8]. */
  'functions/permission-denied': AppMessageCode.ADC_SYS_ERR_0003,

  /** @description Petición sin cabecera Bearer o token de sesión activo[cite: 8]. */
  'functions/unauthenticated': AppMessageCode.ADC_AUTH_ERR_0001,

  // =========================================================================
  // 🔥 FIRESTORE ERRORS (Motor de Persistencia NoSQL)
  // =========================================================================

  /** @description Intento de mutación que infringe de forma directa las Security Rules del servidor[cite: 8]. */
  'permission-denied': AppMessageCode.ADC_SYS_ERR_0003,

  /** @description Caída temporal o parada por mantenimiento crítico de las infraestructuras de Google Run[cite: 8]. */
  'unavailable': AppMessageCode.ADC_SYS_ERR_0004,

  /** @description Error físico por desconexión de red o pérdida de sockets en la base de datos NoSQL[cite: 8]. */
  'network': AppMessageCode.ADC_SYS_ERR_0002
};