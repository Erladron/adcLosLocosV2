import { AppMessageCode } from './app-message-code.enum';

/**
 * @description Diccionario centralizado de mapeos y traducciones en lenguaje natural para la plataforma ADC Los Locos V2.
 * Vincula de forma unívoca cada constante alfanumérica del enumerado `AppMessageCode` con su string representativo en español,
 * proveyendo los textos oficiales que el `NotificationService` renderizará en los Toasts o alertas del ecosistema.
 */
export const APP_MESSAGES = {

  // =========================================================================
  // AUTH ERRORS (Errores de Autenticación y Sesión)
  // =========================================================================

  /** @description Error emitido cuando una petición interceptada por el guard carece de token de sesión activo. */
  [AppMessageCode.ADC_AUTH_ERR_0001]: 'Usuario no autenticado.',

  /** @description Error genérico de login que evita dar pistas sobre si falló el correo o la clave por seguridad. */
  [AppMessageCode.ADC_AUTH_ERR_0002]: 'Credenciales inválidas.',

  /** @description Bloqueo en pre-alta: El email introducido no ha sido registrado previamente por la directiva en `invitedUsers`. */
  [AppMessageCode.ADC_AUTH_ERR_0003]: 'Tu correo no está autorizado para registrarse.',

  /** @description Error de duplicidad: Intento de alta con un email que ya existe en el chasis de Firebase Authentication. */
  [AppMessageCode.ADC_AUTH_ERR_0004]: 'Ya existe una cuenta registrada con este correo electrónico.',

  /** @description Validación de robustez: Longitud de caracteres de la contraseña inferior al mínimo exigido por las políticas. */
  [AppMessageCode.ADC_AUTH_ERR_0005]: 'La contraseña debe tener al menos 6 caracteres.',

  /** @description Estructura de formulario: La cadena de texto de entrada no supera los patrones de formato de un email legítimo. */
  [AppMessageCode.ADC_AUTH_ERR_0006]: 'El correo electrónico no es válido.',

  /** @description Fallo en el motor de Firebase Auth: Excepción no controlada durante el proceso de empaquetado del registro. */
  [AppMessageCode.ADC_AUTH_ERR_0007]: 'Error registrando usuario.',

  /** @description Validación rápida de login: El usuario ha dejado en blanco los inputs obligatorios de acceso de la pantalla. */
  [AppMessageCode.ADC_AUTH_ERR_0008]: 'Por favor, introduce tu email y contraseña.',

  /** @description Bloqueo perimetral: Intento de login de un socio con estado lógico 'inactive' o suspendido por el club. */
  [AppMessageCode.ADC_AUTH_ERR_0009]: 'Tu cuenta ha sido cancelada. Contacta con administración.',

  /** @description Excepción de credenciales: Fallo de persistencia al intentar mutar o re-autenticar la cuenta del usuario. */
  [AppMessageCode.ADC_AUTH_ERR_0010]: 'Error actualizando credenciales.',

  /** @description Error en pantalla de login: No hay concordancia biunívoca entre los campos introducidos y los registros. */
  [AppMessageCode.ADC_AUTH_ERR_0011]: 'Usuario o contraseña incorrectos.',

  /** @description Fallo de verificación de clave espejo: Doble check erróneo en el flujo de credenciales. */
  [AppMessageCode.ADC_AUTH_ERR_0012]: 'Usuario o contraseña incorrectos.',

  /** @description Defensa perimetral: Alerta Toast disparada tras saturar el umbral de reintentos permitidos por la API. */
  [AppMessageCode.ADC_AUTH_ERR_0013]: 'Demasiados intentos. Inténtalo más tarde.',

  /** @description Error físico de socket: Pérdida total de conexión o timeout con los balanceadores de carga de Google Cloud. */
  [AppMessageCode.ADC_AUTH_ERR_0014]: 'Error de conexión con Firebase.',

  // =========================================================================
  // USER ERRORS (Errores de Manipulación de Fichas de Usuarios)
  // =========================================================================

  /** @description Excepción NoSQL: No se ha podido consolidar la escritura del documento de datos del socio en Firestore. */
  [AppMessageCode.ADC_USER_ERR_0001]: 'Error guardando usuario.',

  /** @description Excepción de formulario: Fallo asíncrono al guardar el bloque civil editado por el usuario en su perfil. */
  [AppMessageCode.ADC_USER_ERR_0002]: 'Error actualizando datos personales.',

  /** @description Validación del frontend: Los correos suministrados en los dos inputs del formulario de alta discrepan. */
  [AppMessageCode.ADC_USER_ERR_0003]: 'Los emails no coinciden.',

  /** @description Validación del frontend: La contraseña y su campo de confirmación espejo no presentan idéntica cadena. */
  [AppMessageCode.ADC_USER_ERR_0004]: 'Las contraseñas no coinciden.',

  /** @description Validación de campos obligatorios: El usuario ha dejado vacíos inputs requeridos con asterisco (*) en la UI. */
  [AppMessageCode.ADC_USER_ERR_0005]: 'Complete todos los campos.',

  /** @description Traducción semántica oficial del fallo de autobaja */
  [AppMessageCode.ADC_USER_ERR_0006]: 'No se ha podido procesar la baja de tu cuenta. Por favor, inténtalo de nuevo o contacta con la directiva.',

  /** @description Traducción semántica para el bloqueo de baja por morosidad */
  [AppMessageCode.ADC_USER_ERR_0007]: 'Baja bloqueada. No puedes eliminar tu cuenta si tienes cuotas pendientes de pago. Ponte en contacto con tesorería.',

  // =========================================================================
  // FEES ERRORS (Restricciones Financieras y de Tesorería)
  // =========================================================================

  /** @description Bloqueo de agenda: Intercepta la confirmación de asistencia bloqueando el botón si el socio adeuda cuotas. */
  [AppMessageCode.ADC_FEES_ERR_0001]: 'Acceso denegado. Es necesario estar al corriente de pago de la cuota para poder apuntarse a este evento.',

  /** @description Bloqueo ferial: Impide generar pases de caseta en `fair-access` si se detecta estado de impago en el perfil. */
  [AppMessageCode.ADC_FEES_ERR_0002]: 'Operación bloqueada. No se permiten emitir o desplegar credenciales feriales si el socio presenta cuotas pendientes.',

  /** @description Excepción en consola de cuotas: Error asíncrono al intentar mutar el booleano financiero desde el panel masivo. */
  [AppMessageCode.ADC_FEES_ERR_0003]: 'No se pudo guardar la actualización financiera. Revisa tu conexión de red o permisos.',

  // =========================================================================
  // INVITATION ERRORS (Errores en el Flujo de Captación Web)
  // =========================================================================

  /** @description Validación administrativa: Se ha pulsado emitir invitación dejando vacío el campo del email destino. */
  [AppMessageCode.ADC_INV_ERR_0001]: 'Por favor, introduce un correo electrónico.',

  /** @description Validación de estructura: El email del aspirante introducido en la consola no supera la expresión regular. */
  [AppMessageCode.ADC_INV_ERR_0002]: 'Introduce un email válido.',

  /** @description Excepción de pasarela: Fallo en Cloud Functions o en el servidor SMTP al despachar el correo con diseño premium. */
  [AppMessageCode.ADC_INV_ERR_0003]: 'Error enviando invitación.',

  /** @description Regla de negocio: Intento de invitar a una persona cuyo email ya consta como cuenta activa en la peña. */
  [AppMessageCode.ADC_INV_ERR_0004]: 'El usuario ya pertenece a la aplicación.',

  /** @description Control de duplicidad: Ya se localiza un token inmutable en caliente emitido y pendiente para esa misma cuenta. */
  [AppMessageCode.ADC_INV_ERR_0005]: 'Ya existe una invitación para este correo.',

  /** @description Validación de token web: El enlace pulsado por el usuario no se corresponde con ningún UUID de `invitedUsers`. */
  [AppMessageCode.ADC_INV_ERR_0006]: 'No existe ninguna invitación para este correo.',

  // =========================================================================
  // ADMIN ERRORS (Errores Operativos del Panel de Gestión Directiva)
  // =========================================================================

  /** @description Excepción de flujo: Error asíncrono al intentar invocar la mutación de estado a 'active' sobre el usuario. */
  [AppMessageCode.ADC_ADMIN_ERR_0001]: 'Error aprobando usuario.',

  /** @description Excepción en denegación: Fallo de red al intentar destruir el token o registrar el log de motivo de rechazo. */
  [AppMessageCode.ADC_ADMIN_ERR_0002]: 'Error rechazando usuario.',

  // =========================================================================
  // AUTH INFO (Mensajes Informativos y de Éxito de Autenticación)
  // =========================================================================

  /** @description Notificación Toast de éxito: Flujo de alta y sincronización con el backend completado de forma correcta. */
  [AppMessageCode.ADC_AUTH_INF_0001]: 'Cuenta creada correctamente.',

  // =========================================================================
  // USER INFO (Mensajes Informativos de Gestión de Usuarios)
  // =========================================================================

  /** @description Notificación Toast de éxito: Solicitud de pre-alta web aprobada e ingreso oficial del socio consolidado. */
  [AppMessageCode.ADC_USER_INF_0001]: 'Usuario aprobado correctamente.',

  /** @description Notificación Toast de éxito: Registro pendiente destruído y purgado del panel operativo de la directiva. */
  [AppMessageCode.ADC_USER_INF_0002]: 'Usuario rechazado.',

  // =========================================================================
  // INVITATION INFO (Mensajes Informativos de Invitaciones)
  // =========================================================================

  /** @description Notificación Toast de éxito: Documento cerrojo lógico creado en Firestore y correo electrónico despachado. */
  [AppMessageCode.ADC_INV_INF_0001]: 'Invitación enviada correctamente.',

  // =========================================================================
  // SYSTEM ERRORS (Errores Estructurales de Infraestructura)
  // =========================================================================

  /** @description Interceptor fallback general: Excepción de software no controlada atrapada en el catch definitivo. */
  [AppMessageCode.ADC_SYS_ERR_0001]: 'Error inesperado del sistema.',

  /** @description Error físico offline: El hardware del dispositivo no presenta respuesta de red o sockets abiertos. */
  [AppMessageCode.ADC_SYS_ERR_0002]: 'Error de conexión.',

  /** @description Seguridad de Firebase rules: El token de sesión del usuario ha violado las restricciones perimetrales del servidor. */
  [AppMessageCode.ADC_SYS_ERR_0003]: 'No tienes permisos para realizar esta acción.',

  /** @description Error de Cloud Run: Caída del backend serverless en Node.js 24 o mantenimiento crítico de servicios de Firebase. */
  [AppMessageCode.ADC_SYS_ERR_0004]: 'Servicio temporalmente no disponible.',

  /** @description Fallo de hardware: El dispositivo no ha podido procesar u optimizar la fotografía seleccionada. */
  [AppMessageCode.ADC_SYS_ERR_0005]: 'Fallo de hardware: El dispositivo no ha podido procesar u optimizar la fotografía seleccionada.',

  // =========================================================================
  // EVENT ERRORS (Errores de Operación de Eventos y Agenda)
  // =========================================================================

  /** @description Excepción NoSQL: Fallo de concurrencia o red al intentar consolidar los formularios del evento en `/events`. */
  [AppMessageCode.ADC_EVENT_ERR_0001]: 'No se ha podido guardar el evento. Por favor, inténtalo de nuevo.',

  /** @description Excepción de asistencia: Error al insertar el UID del socio en la subcolección atómica `/attendance`. */
  [AppMessageCode.ADC_EVENT_ERR_0002]: 'Error al registrar tu asistencia. Revisa tu conexión.',

  /** @description Excepción destructiva: Error asíncrono al intentar borrar la convocatoria o ejecutar el lote en cascada. */
  [AppMessageCode.ADC_EVENT_ERR_0003]: 'No se ha podido eliminar el evento.',

  /** @description Error de navegación: El ID del evento solicitado por la URL de la app ha sido borrado físicamente por un directivo. */
  [AppMessageCode.ADC_EVENT_ERR_0004]: 'El evento no existe o ha sido eliminado.',

  /** @description Excepción de descarga: Error de red al intentar recuperar los detalles, imágenes o diccionarios del evento. */
  [AppMessageCode.ADC_EVENT_ERR_0005]: 'Error al cargar los datos del evento.',

  /** @description Coherencia temporal: El formulario de creación ha detectado que la fecha de inicio pertenece al pasado. */
  [AppMessageCode.ADC_EVENT_ERR_0006]: 'La fecha y hora inicio no puede ser menor a la actual.',

  /** @description Coherencia temporal: Validación fallida debido a rangos cruzados (la fecha de fin es previa al inicio). */
  [AppMessageCode.ADC_EVENT_ERR_0007]: 'La fecha y hora de fin del evento debe ser posterior a la de inicio.',

  /** @description Control de aforo atómico: El contador de plazas `attendeeCount` ha alcanzado el máximo configurable `maxAttendees`. */
  [AppMessageCode.ADC_EVENT_ERR_0008]: '¡Aforo completo! Lo sentimos, ya no quedan plazas libres para este evento.',

  /** @description Validación estructural: Los formularios exigen definir el cupo dinámico de pases permitidos para eventos tipo feria. */
  [AppMessageCode.ADC_EVENT_ERR_0009]: 'El límite de invitados por socio es obligatorio para los eventos de feria y debe ser igual o superior a 1.',

  // =========================================================================
  // EVENT INFO (Mensajes Informativos de la Agenda)
  // =========================================================================

  /** @description Notificación Toast de éxito: Convocatoria registrada y visible de forma instantánea en la app móvil. */
  [AppMessageCode.ADC_EVENT_INF_0001]: '¡Evento convocado con éxito!',

  /** @description Notificación Toast de éxito: Modificaciones consolidadas y enviadas de forma limpia hacia la base de datos Firestore. */
  [AppMessageCode.ADC_EVENT_INF_0002]: 'Datos del evento actualizados correctamente.',

  /** @description Notificación Toast de éxito: Transacción atómica completada con éxito y plaza en el evento asegurada. */
  [AppMessageCode.ADC_EVENT_INF_0003]: '¡Asistencia confirmada! Te esperamos.',

  // =========================================================================
  // FAIR ERRORS (Errores del Módulo Ferial y Pases QR)
  // =========================================================================

  /** @description Restricción de negocio: El socio ha superado el cupo estricto de invitaciones externas reguladas para el día de hoy. */
  [AppMessageCode.ADC_FAIR_ERR_0001]: 'Límite superado. Solo puedes invitar a un máximo de 6 personas por día.',

  /** @description Terminal de portería: El decodificador del plugin de la cámara arroja un payload ilegítimo o fraudulento. */
  [AppMessageCode.ADC_FAIR_ERR_0002]: 'El código QR escaneado no corresponde a ningún pase de feria válido.',

  /** @description Validación de acceso en puerta: El escáner rechaza el pase porque la fecha actual no cubre la vigencia del abono. */
  [AppMessageCode.ADC_FAIR_ERR_0003]: 'Acceso denegado. Este pase no es válido para la fecha de hoy.',

  /** @description Excepción de inserción: Error asíncrono de red al intentar insertar el pase digital en `fair-access`. */
  [AppMessageCode.ADC_FAIR_ERR_0004]: 'No se pudo emitir la invitación. Verifica tu conexión.',

  /** @description Excepción destructiva: Fallo al intentar borrar el documento de la credencial desde el listado del socio. */
  [AppMessageCode.ADC_FAIR_ERR_0005]: 'No se pudo anular el pase. Inténtalo de nuevo más tarde.',

  /** @description Validación de formulario ferial: Argumento obligatorio nulo al intentar generar un pase sin identidad destino. */
  [AppMessageCode.ADC_FAIR_ERR_0006]: 'Debes seleccionar un invitado del listado desplegable o escribir un nombre.',

  /** @description Monitorización reactiva: El snapshot determina que el usuario logueado carece de pases válidos vigentes hoy. */
  [AppMessageCode.ADC_FAIR_ERR_0007]: 'No tienes ningún pase de feria activo disponible para la jornada de hoy.',

  /** @description Control en puerta: El carnet escaneado pertenece a una cuenta suspendida o bloqueada por la directiva. */
  [AppMessageCode.ADC_FAIR_ERR_0008]: 'Acceso denegado. El socio no se encuentra en estado activo en el sistema.',

  /** @description Control de portería: El tipo de rol asignado al usuario carece por completo de permisos de admisión ferial. */
  [AppMessageCode.ADC_FAIR_ERR_0009]: 'Acceso denegado. El tipo de usuario no dispone de credenciales de acceso de socio.',

  // =========================================================================
  // FAIR INFO (Mensajes Informativos de Feria)
  // =========================================================================

  /** @description Notificación Toast de éxito: Pase relacional insertado y disponible para el despliegue del código QR del invitado. */
  [AppMessageCode.ADC_FAIR_INF_0001]: 'Pase de caseta emitido correctamente.',

  /** @description Notificación Toast de éxito: Credencial purgada del servidor, quedando inmediatamente desvinculada e invalidada. */
  [AppMessageCode.ADC_FAIR_INF_0002]: 'El pase ha sido anulado correctamente.',

  /** @description Inicialización de billetera: El onSnapshot detecta un abono vigente hoy y activa el acceso lateral de forma automática. */
  [AppMessageCode.ADC_FAIR_INF_0003]: '¡Pase de Feria disponible! Hemos generado automáticamente tu credencial de acceso para la caseta de feria.',
};