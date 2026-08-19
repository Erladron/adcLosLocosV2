/**
 * @enum AppMessageCode
 * @description Catálogo unificado, estricto y centralizado de códigos alfanuméricos de error e información.
 * Gobierna las pasarelas de traducción, interceptores de red y flujos de excepciones visuales de todo el ecosistema ACD Los Locos V2.
 */
export enum AppMessageCode {

  // =========================================================================
  // AUTH ERRORS (Errores de Autenticación y Sesión)
  // =========================================================================

  /** @description Error de sesión: El token de autenticación de Firebase Auth no existe, ha expirado o es inválido. */
  ACD_AUTH_ERR_0001 = 'ACD_AUTH_ERR_0001',

  /** @description Autenticación fallida: Las credenciales introducidas no corresponden a ningún usuario activo. */
  ACD_AUTH_ERR_0002 = 'ACD_AUTH_ERR_0002',

  /** @description Seguridad: El correo electrónico proporcionado no se encuentra pre-aprobado ni invitado en el sistema. */
  ACD_AUTH_ERR_0003 = 'ACD_AUTH_ERR_0003',

  /** @description Registro fallido: Ya existe una cuenta civil o administrativa en uso con este correo electrónico. */
  ACD_AUTH_ERR_0004 = 'ACD_AUTH_ERR_0004',

  /** @description Validación: La contraseña suministrada vulnera los requisitos mínimos de longitud (mínimo 6 caracteres). */
  ACD_AUTH_ERR_0005 = 'ACD_AUTH_ERR_0005',

  /** @description Estructura: La sintaxis de la cadena del correo electrónico no cumple el estándar internacional RFC 5322. */
  ACD_AUTH_ERR_0006 = 'ACD_AUTH_ERR_0006',

  /** @description Excepción asíncrona: Error interno en la mutación o alta del usuario en los servidores de Firebase Auth. */
  ACD_AUTH_ERR_0007 = 'ACD_AUTH_ERR_0007',

  /** @description Validación: Argumentos obligatorios nulos o vacíos detectados en los campos de login o registro. */
  ACD_AUTH_ERR_0008 = 'ACD_AUTH_ERR_0008',

  /** @description Seguridad: Intento de inicio de sesión de un usuario cuya cuenta ha sido bloqueada lógicamente por la directiva. */
  ACD_AUTH_ERR_0009 = 'ACD_AUTH_ERR_0009',

  /** @description Excepción perimetral: Error crítico al intentar actualizar el correo o la contraseña en el proveedor de Auth. */
  ACD_AUTH_ERR_0010 = 'ACD_AUTH_ERR_0010',

  /** @description Autenticación: Identificador de cuenta o UID inexistente en los directorios lógicos de la plataforma. */
  ACD_AUTH_ERR_0011 = 'ACD_AUTH_ERR_0011',

  /** @description Autenticación: La contraseña flat introducida es errónea contra el hash de seguridad almacenado. */
  ACD_AUTH_ERR_0012 = 'ACD_AUTH_ERR_0012',

  /** @description Seguridad perimetral: Bloqueo temporal de solicitudes debido a una ráfaga excesiva de intentos fallidos (Anti-Bruteforce). */
  ACD_AUTH_ERR_0013 = 'ACD_AUTH_ERR_0013',

  /** @description Red/Hardware: Pérdida física de paquetes o latencia excesiva en el handshake de conexión con los servidores de Google. */
  ACD_AUTH_ERR_0014 = 'ACD_AUTH_ERR_0014',

  // =========================================================================
  // USER ERRORS (Errores de Manipulación de Usuarios)
  // =========================================================================

  /** @description Excepción NoSQL: Error genérico al intentar persistir o realizar un setDoc sobre el documento del usuario. */
  ACD_USER_ERR_0001 = 'ACD_USER_ERR_0001',

  /** @description Excepción de escritura: Fallo asíncrono durante la actualización de la ficha civil de datos personales. */
  ACD_USER_ERR_0002 = 'ACD_USER_ERR_0002',

  /** @description Validación de formulario: El correo de confirmación no coincide con el campo de email primario. */
  ACD_USER_ERR_0003 = 'ACD_USER_ERR_0003',

  /** @description Validación de formulario: La contraseña del campo espejo no coincide con la contraseña primaria introducida. */
  ACD_USER_ERR_0004 = 'ACD_USER_ERR_0004',

  /** @description Validación de negocio: Faltan campos obligatorios estructurales por rellenar en el chasis del formulario de perfil. */
  ACD_USER_ERR_0005 = 'ACD_USER_ERR_0005',

  /** @description Excepción legal de baja: Fallo en red o servidor al procesar la autodestrucción voluntaria de la cuenta */
  ACD_USER_ERR_0006 = 'ACD_USER_ERR_0006',

  /** @description Restricción de baja por deuda: Bloquea la eliminación voluntaria de la cuenta si existen cuotas pendientes */
  ACD_USER_ERR_0007 = 'ACD_USER_ERR_0007',

  // =========================================================================
  // FEES ERRORS (Cuotas y Mantenimiento de Tesorería)
  // =========================================================================

  /** @description Restricción de negocio: El socio tiene bloqueada la confirmación de asistencia por impago de cuotas del club. */
  ACD_FEES_ERR_0001 = 'ACD_FEES_ERR_0001',

  /** @description Restricción de acceso ferial: Bloqueo inmediato de emisión o despliegue de pases QR debido a falta de solvencia anual. */
  ACD_FEES_ERR_0002 = 'ACD_FEES_ERR_0002',

  /** @description Excepción administrativa: Error asíncrono al intentar mutar o guardar la actualización financiera del socio en Firestore. */
  ACD_FEES_ERR_0003 = 'ACD_FEES_ERR_0003',

  // =========================================================================
  // INVITATION ERRORS (Errores en el Flujo de Invitaciones Web)
  // =========================================================================

  /** @description Validación: Se ha intentado despachar una invitación sin suministrar una cadena de texto de correo electrónico. */
  ACD_INV_ERR_0001 = 'ACD_INV_ERR_0001',

  /** @description Estructura errónea: El correo introducido para la invitación web no posee una nomenclatura de email válida. */
  ACD_INV_ERR_0002 = 'ACD_INV_ERR_0002',

  /** @description Servidor/Functions: Fallo asíncrono en el trigger en la nube o pasarela SMTP al procesar la plantilla de correo. */
  ACD_INV_ERR_0003 = 'ACD_INV_ERR_0003',

  /** @description Regla de negocio: El correo electrónico de destino ya corresponde a un socio activo dentro de la base de datos. */
  ACD_INV_ERR_0004 = 'ACD_INV_ERR_0004',

  /** @description Duplicidad de token: Ya existe un documento activo en `invitedUsers` pendiente de uso para este mismo correo. */
  ACD_INV_ERR_0005 = 'ACD_INV_ERR_0005',

  /** @description Inexistencia: No se localizan invitaciones previas ni registros de pre-alta vinculados a este identificador. */
  ACD_INV_ERR_0006 = 'ACD_INV_ERR_0006',

  // =========================================================================
  // ADMIN ERRORS (Errores Operativos de la Directiva)
  // =========================================================================

  /** @description Excepción en aprobación: Error crítico al cambiar el estado del socio a 'active' en el módulo de solicitudes. */
  ACD_ADMIN_ERR_0001 = 'ACD_ADMIN_ERR_0001',

  /** @description Excepción en denegación: Fallo al intentar destruir el documento o registrar el log de rechazo de una solicitud. */
  ACD_ADMIN_ERR_0002 = 'ACD_ADMIN_ERR_0002',

  // =========================================================================
  // AUTH INFO (Mensajes Informativos de Autenticación)
  // =========================================================================

  /** @description Éxito de flujo: Cuenta civil dada de alta de forma correcta y sincronizada con los perfiles del backend. */
  ACD_AUTH_INF_0001 = 'ACD_AUTH_INF_0001',

  // =========================================================================
  // USER INFO (Mensajes Informativos de Gestión de Usuarios)
  // =========================================================================

  /** @description Éxito de flujo: Solicitud de pre-alta aprobada por la directiva, disparando el envío de notificaciones automáticas. */
  ACD_USER_INF_0001 = 'ACD_USER_INF_0001',

  /** @description Éxito de flujo: Solicitud de onboarding web rechazada de forma oficial y eliminada del panel administrativo. */
  ACD_USER_INF_0002 = 'ACD_USER_INF_0002',

  // =========================================================================
  // INVITATION INFO (Mensajes Informativos de Invitaciones)
  // =========================================================================

  /** @description Éxito de flujo: Token único generado en Firestore y correo electrónico despachado al usuario aspirante. */
  ACD_INV_INF_0001 = 'ACD_INV_INF_0001',

  // =========================================================================
  // SYSTEM ERRORS (Errores Estructurales de Infraestructura)
  // =========================================================================

  /** @description Excepción fallback: Captura por defecto para errores de código imprevistos o caídas descontroladas de la lógica. */
  ACD_SYS_ERR_0001 = 'ACD_SYS_ERR_0001',

  /** @description Red/Offline: El dispositivo móvil no presenta conectividad física a internet o los sockets han sido rechazados. */
  ACD_SYS_ERR_0002 = 'ACD_SYS_ERR_0002',

  /** @description Seguridad/RBAC: El token de sesión del usuario carece de los privilegios y roles necesarios para la petición. */
  ACD_SYS_ERR_0003 = 'ACD_SYS_ERR_0003',

  /** @description Servidor/Cloud: Caída de las Cloud Functions o parada por mantenimiento en la infraestructura serverless de Firebase. */
  ACD_SYS_ERR_0004 = 'ACD_SYS_ERR_0004',

  /** @description Excepción de hardware: El dispositivo no soporta o ha fallado al renderizar el Canvas optimizado local. */
  ACD_SYS_ERR_0005 = 'ACD_SYS_ERR_0005',

  // =========================================================================
  // EVENT ERRORS (Errores Operativos en la Agenda de Convocatorias)
  // =========================================================================

  /** @description Excepción NoSQL: No se ha podido guardar o sincronizar el documento estructural del evento en `/events`. */
  ACD_EVENT_ERR_0001 = 'ACD_EVENT_ERR_0001',

  /** @description Excepción de red: Error asíncrono al inyectar el UID en la subcolección `/attendance` de confirmaciones. */
  ACD_EVENT_ERR_0002 = 'ACD_EVENT_ERR_0002',

  /** @description Excepción destructiva: Fallo al intentar borrar físicamente una convocatoria o limpiar sus asistencias huérfanas. */
  ACD_EVENT_ERR_0003 = 'ACD_EVENT_ERR_0003',

  /** @description Inexistencia: La convocatoria de destino solicitada por la URL ha sido eliminada de Firestore por otro directivo. */
  ACD_EVENT_ERR_0004 = 'ACD_EVENT_ERR_0004',

  /** @description Excepción de lectura: Error de red al intentar descargar los mapeos o traducciones de un evento específico. */
  ACD_EVENT_ERR_0005 = 'ACD_EVENT_ERR_0005',

  /** @description Coherencia temporal: Validación de formulario fallida porque la fecha de inicio pertenece al pasado del huso horario local. */
  ACD_EVENT_ERR_0006 = 'ACD_EVENT_ERR_0006',

  /** @description Coherencia temporal: Validación fallida porque el rango horario se encuentra cruzado (la fecha de fin es anterior al inicio). */
  ACD_EVENT_ERR_0007 = 'ACD_EVENT_ERR_0007',

  /** @description Restricción por concurrencia: El aforo de plazas máximas (`maxAttendees`) se encuentra saturado y completo. */
  ACD_EVENT_ERR_0008 = 'ACD_EVENT_ERR_0008',

  /** @description Validación estructural: Los eventos de tipo ferial exigen de forma obligatoria delimitar un cupo restrictivo de pases de externos. */
  ACD_EVENT_ERR_0009 = 'ACD_EVENT_ERR_0009',

  /** @description Inexistencia en transacción: Intento de confirmar/cancelar asistencia en un evento eliminado. */
  ACD_EVENT_ERR_0010 = 'ACD_EVENT_ERR_0010',

  /** @description Validación estructural: Intento de eliminar un evento con un identificador (ID) nulo o inválido. */
  ACD_EVENT_ERR_0011 = 'ACD_EVENT_ERR_0011',

  // =========================================================================
  // EVENT INFO (Mensajes Informativos de la Agenda)
  // =========================================================================

  /** @description Éxito de flujo: Nueva convocatoria de asamblea, comida, quedada o feria grabada y publicada correctamente. */
  ACD_EVENT_INF_0001 = 'ACD_EVENT_INF_0001',

  /** @description Éxito de flujo: Modificaciones físicas del evento consolidadas y enviadas de forma limpia hacia la base de datos. */
  ACD_EVENT_INF_0002 = 'ACD_EVENT_INF_0002',

  /** @description Éxito de flujo: Transacción de incremento atómico completada y plaza reservada para el socio de forma legítima. */
  ACD_EVENT_INF_0003 = 'ACD_EVENT_INF_0003',

  // =========================================================================
  // PASS ERRORS (Errores Específicos del Módulo Ferial y Pases QR)
  // =========================================================================

  /** @description Restricción de cupo: El socio ha consumido el límite diario de invitaciones externas reguladas por el evento de feria. */
  ACD_PASS_ERR_0001 = 'ACD_PASS_ERR_0001',

  /** @description Terminal de portería: El string decodificado del código QR no responde al payload estricto de seguridad requerido. */
  ACD_PASS_ERR_0002 = 'ACD_PASS_ERR_0002',

  /** @description Validación en puerta: Código QR rechazado por el escáner debido a que la fecha actual está fuera del rango de vigencia. */
  ACD_PASS_ERR_0003 = 'ACD_PASS_ERR_0003',

  /** @description Excepción de emisión: Error asíncrono al intentar escribir o instanciar la credencial en la colección general. */
  ACD_PASS_ERR_0004 = 'ACD_PASS_ERR_0004',

  /** @description Excepción destructiva: Error al intentar anular o dar de baja un pase activo de caseta desde el menú del socio. */
  ACD_PASS_ERR_0005 = 'ACD_PASS_ERR_0005',

  /** @description Validación de formulario: Argumento nulo al intentar emitir un pase digital sin especificar una identidad o invitado. */
  ACD_PASS_ERR_0006 = 'ACD_PASS_ERR_0006',

  /** @description Restricción ferial: El menú lateral ha monitorizado la colección y determina que el usuario carece de pases válidos hoy. */
  ACD_PASS_ERR_0007 = 'ACD_PASS_ERR_0007',

  /** @description Validación en puerta: El pase QR pertenece a un socio que se encuentra suspendido, inactivo o en estado de impago. */
  ACD_PASS_ERR_0008 = 'ACD_PASS_ERR_0008',

  /** @description RBAC Ferial: El rol asignado al usuario que pretende cruzar la puerta no posee derecho de admisión de caseta. */
  ACD_PASS_ERR_0009 = 'ACD_PASS_ERR_0009',

  // =========================================================================
  // PASS INFO (Mensajes Informativos de Feria)
  // =========================================================================

  /** @description Éxito de flujo: Registro relacional insertado con éxito en `/event-access`, quedando disponible para el invitado. */
  ACD_PASS_INF_0001 = 'ACD_PASS_INF_0001',

  /** @description Éxito de flujo: Destrucción de la credencial en lote ejecutada correctamente, desvinculando el QR en portería. */
  ACD_PASS_INF_0002 = 'ACD_PASS_INF_0002',

  /** @description Éxito automático: Billetera inteligente reactiva activa; credencial de socio inyectada de forma transparente por el snapshot. */
  ACD_PASS_INF_0003 = 'ACD_PASS_INF_0003',

  // =========================================================================
  // DATE PICKER COMPONENT ERRORS (Errores Específicos del Selector DatePicker)
  // =========================================================================

  /** @description Excepción DatePicker: Fallo de renderizado o inicialización de la fecha/hora recibida. */
  ACD_DP_ERR_0001 = 'ACD_DP_ERR_0001',

  /** @description Excepción DatePicker: Error al intentar cancelar o desvanecer el modal del selector. */
  ACD_DP_ERR_0002 = 'ACD_DP_ERR_0002',

  /** @description Excepción DatePicker: Error durante la selección, parsing o estructuración del objeto Date a retornar. */
  ACD_DP_ERR_0003 = 'ACD_DP_ERR_0003',

  /** @description Excepción DatePicker: Error al invocar, instanciar o abrir el modal DatePicker desde un formulario externo. */
  ACD_DP_ERR_0004 = 'ACD_DP_ERR_0004',

  // =========================================================================
  // FCM / PUSH NOTIFICATION ERRORS (Notificaciones Push y Service Worker)
  // =========================================================================

  /** @description Permisos: El usuario ha bloqueado o denegado los permisos de notificación Push en el dispositivo o navegador. */
  ACD_FCM_ERR_0001 = 'ACD_FCM_ERR_0001',

  /** @description Excepción de registro: Error crítico al intentar registrar o enlazar el Service Worker en el navegador. */
  ACD_FCM_ERR_0002 = 'ACD_FCM_ERR_0002',

  /** @description Excepción de token: Fallo asíncrono al obtener el token de mensajería (FCM Token) desde los servidores de Google. */
  ACD_FCM_ERR_0003 = 'ACD_FCM_ERR_0003',

  /** @description Excepción NoSQL: Error de red o permisos al guardar o actualizar el token FCM en la subcolección Firestore del usuario. */
  ACD_FCM_ERR_0004 = 'ACD_FCM_ERR_0004',

  /** @description Compatibilidad/Hardware: El navegador o entorno de ejecución carece de soporte para Service Workers o Web Push APIs. */
  ACD_FCM_ERR_0005 = 'ACD_FCM_ERR_0005',

  // =========================================================================
  // FCM / PUSH NOTIFICATION INFO (Mensajes Informativos de FCM)
  // =========================================================================

  /** @description Éxito de flujo: Registro nativo o Web Push completado correctamente y token persistido de forma idempotente. */
  ACD_FCM_INF_0001 = 'ACD_FCM_INF_0001',
}
