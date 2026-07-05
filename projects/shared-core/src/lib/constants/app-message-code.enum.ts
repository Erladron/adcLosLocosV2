/**
 * @enum AppMessageCode
 * @description Catálogo unificado, estricto y centralizado de códigos alfanuméricos de error e información.
 * Gobierna las pasarelas de traducción, interceptores de red y flujos de excepciones visuales de todo el ecosistema ADC Los Locos V2.
 */
export enum AppMessageCode {

  // =========================================================================
  // AUTH ERRORS (Errores de Autenticación y Sesión)
  // =========================================================================

  /** @description Error de sesión: El token de autenticación de Firebase Auth no existe, ha expirado o es inválido. */
  ADC_AUTH_ERR_0001 = 'ADC_AUTH_ERR_0001',

  /** @description Autenticación fallida: Las credenciales introducidas no corresponden a ningún usuario activo. */
  ADC_AUTH_ERR_0002 = 'ADC_AUTH_ERR_0002',

  /** @description Seguridad: El correo electrónico proporcionado no se encuentra pre-aprobado ni invitado en el sistema. */
  ADC_AUTH_ERR_0003 = 'ADC_AUTH_ERR_0003',

  /** @description Registro fallido: Ya existe una cuenta civil o administrativa en uso con este correo electrónico. */
  ADC_AUTH_ERR_0004 = 'ADC_AUTH_ERR_0004',

  /** @description Validación: La contraseña suministrada vulnera los requisitos mínimos de longitud (mínimo 6 caracteres). */
  ADC_AUTH_ERR_0005 = 'ADC_AUTH_ERR_0005',

  /** @description Estructura: La sintaxis de la cadena del correo electrónico no cumple el estándar internacional RFC 5322. */
  ADC_AUTH_ERR_0006 = 'ADC_AUTH_ERR_0006',

  /** @description Excepción asíncrona: Error interno en la mutación o alta del usuario en los servidores de Firebase Auth. */
  ADC_AUTH_ERR_0007 = 'ADC_AUTH_ERR_0007',

  /** @description Validación: Argumentos obligatorios nulos o vacíos detectados en los campos de login o registro. */
  ADC_AUTH_ERR_0008 = 'ADC_AUTH_ERR_0008',

  /** @description Seguridad: Intento de inicio de sesión de un usuario cuya cuenta ha sido bloqueada lógicamente por la directiva. */
  ADC_AUTH_ERR_0009 = 'ADC_AUTH_ERR_0009',

  /** @description Excepción perimetral: Error crítico al intentar actualizar el correo o la contraseña en el proveedor de Auth. */
  ADC_AUTH_ERR_0010 = 'ADC_AUTH_ERR_0010',

  /** @description Autenticación: Identificador de cuenta o UID inexistente en los directorios lógicos de la plataforma. */
  ADC_AUTH_ERR_0011 = 'ADC_AUTH_ERR_0011',

  /** @description Autenticación: La contraseña flat introducida es errónea contra el hash de seguridad almacenado. */
  ADC_AUTH_ERR_0012 = 'ADC_AUTH_ERR_0012',

  /** @description Seguridad perimetral: Bloqueo temporal de solicitudes debido a una ráfaga excesiva de intentos fallidos (Anti-Bruteforce). */
  ADC_AUTH_ERR_0013 = 'ADC_AUTH_ERR_0013',

  /** @description Red/Hardware: Pérdida física de paquetes o latencia excesiva en el handshake de conexión con los servidores de Google. */
  ADC_AUTH_ERR_0014 = 'ADC_AUTH_ERR_0014',

  // =========================================================================
  // USER ERRORS (Errores de Manipulación de Usuarios)
  // =========================================================================

  /** @description Excepción NoSQL: Error genérico al intentar persistir o realizar un setDoc sobre el documento del usuario. */
  ADC_USER_ERR_0001 = 'ADC_USER_ERR_0001',

  /** @description Excepción de escritura: Fallo asíncrono durante la actualización de la ficha civil de datos personales. */
  ADC_USER_ERR_0002 = 'ADC_USER_ERR_0002',

  /** @description Validación de formulario: El correo de confirmación no coincide con el campo de email primario. */
  ADC_USER_ERR_0003 = 'ADC_USER_ERR_0003',

  /** @description Validación de formulario: La contraseña del campo espejo no coincide con la contraseña primaria introducida. */
  ADC_USER_ERR_0004 = 'ADC_USER_ERR_0004',

  /** @description Validación de negocio: Faltan campos obligatorios estructurales por rellenar en el chasis del formulario de perfil. */
  ADC_USER_ERR_0005 = 'ADC_USER_ERR_0005',

  /** @description Excepción legal de baja: Fallo en red o servidor al procesar la autodestrucción voluntaria de la cuenta */
  ADC_USER_ERR_0006 = 'ADC_USER_ERR_0006',

  /** @description Restricción de baja por deuda: Bloquea la eliminación voluntaria de la cuenta si existen cuotas pendientes */
  ADC_USER_ERR_0007 = 'ADC_USER_ERR_0007',

  // =========================================================================
  // FEES ERRORS (Cuotas y Mantenimiento de Tesorería)
  // =========================================================================

  /** @description Restricción de negocio: El socio tiene bloqueada la confirmación de asistencia por impago de cuotas del club. */
  ADC_FEES_ERR_0001 = 'ADC_FEES_ERR_0001',

  /** @description Restricción de acceso ferial: Bloqueo inmediato de emisión o despliegue de pases QR debido a falta de solvencia anual. */
  ADC_FEES_ERR_0002 = 'ADC_FEES_ERR_0002',

  /** @description Excepción administrativa: Error asíncrono al intentar mutar o guardar la actualización financiera del socio en Firestore. */
  ADC_FEES_ERR_0003 = 'ADC_FEES_ERR_0003',

  // =========================================================================
  // INVITATION ERRORS (Errores en el Flujo de Invitaciones Web)
  // =========================================================================

  /** @description Validación: Se ha intentado despachar una invitación sin suministrar una cadena de texto de correo electrónico. */
  ADC_INV_ERR_0001 = 'ADC_INV_ERR_0001',

  /** @description Estructura errónea: El correo introducido para la invitación web no posee una nomenclatura de email válida. */
  ADC_INV_ERR_0002 = 'ADC_INV_ERR_0002',

  /** @description Servidor/Functions: Fallo asíncrono en el trigger en la nube o pasarela SMTP al procesar la plantilla de correo. */
  ADC_INV_ERR_0003 = 'ADC_INV_ERR_0003',

  /** @description Regla de negocio: El correo electrónico de destino ya corresponde a un socio activo dentro de la base de datos. */
  ADC_INV_ERR_0004 = 'ADC_INV_ERR_0004',

  /** @description Duplicidad de token: Ya existe un documento activo en `invitedUsers` pendiente de uso para este mismo correo. */
  ADC_INV_ERR_0005 = 'ADC_INV_ERR_0005',

  /** @description Inexistencia: No se localizan invitaciones previas ni registros de pre-alta vinculados a este identificador. */
  ADC_INV_ERR_0006 = 'ADC_INV_ERR_0006',

  // =========================================================================
  // ADMIN ERRORS (Errores Operativos de la Directiva)
  // =========================================================================

  /** @description Excepción en aprobación: Error crítico al cambiar el estado del socio a 'active' en el módulo de solicitudes. */
  ADC_ADMIN_ERR_0001 = 'ADC_ADMIN_ERR_0001',

  /** @description Excepción en denegación: Fallo al intentar destruir el documento o registrar el log de rechazo de una solicitud. */
  ADC_ADMIN_ERR_0002 = 'ADC_ADMIN_ERR_0002',

  // =========================================================================
  // AUTH INFO (Mensajes Informativos de Autenticación)
  // =========================================================================

  /** @description Éxito de flujo: Cuenta civil dada de alta de forma correcta y sincronizada con los perfiles del backend. */
  ADC_AUTH_INF_0001 = 'ADC_AUTH_INF_0001',

  // =========================================================================
  // USER INFO (Mensajes Informativos de Gestión de Usuarios)
  // =========================================================================

  /** @description Éxito de flujo: Solicitud de pre-alta aprobada por la directiva, disparando el envío de notificaciones automáticas. */
  ADC_USER_INF_0001 = 'ADC_USER_INF_0001',

  /** @description Éxito de flujo: Solicitud de onboarding web rechazada de forma oficial y eliminada del panel administrativo. */
  ADC_USER_INF_0002 = 'ADC_USER_INF_0002',

  // =========================================================================
  // INVITATION INFO (Mensajes Informativos de Invitaciones)
  // =========================================================================

  /** @description Éxito de flujo: Token único generado en Firestore y correo electrónico despachado al usuario aspirante. */
  ADC_INV_INF_0001 = 'ADC_INV_INF_0001',

  // =========================================================================
  // SYSTEM ERRORS (Errores Estructurales de Infraestructura)
  // =========================================================================

  /** @description Excepción fallback: Captura por defecto para errores de código imprevistos o caídas descontroladas de la lógica. */
  ADC_SYS_ERR_0001 = 'ADC_SYS_ERR_0001',

  /** @description Red/Offline: El dispositivo móvil no presenta conectividad física a internet o los sockets han sido rechazados. */
  ADC_SYS_ERR_0002 = 'ADC_SYS_ERR_0002',

  /** @description Seguridad/RBAC: El token de sesión del usuario carece de los privilegios y roles necesarios para la petición. */
  ADC_SYS_ERR_0003 = 'ADC_SYS_ERR_0003',

  /** @description Servidor/Cloud: Caída de las Cloud Functions o parada por mantenimiento en la infraestructura serverless de Firebase. */
  ADC_SYS_ERR_0004 = 'ADC_SYS_ERR_0004',

  /** @description Excepción de hardware: El dispositivo no soporta o ha fallado al renderizar el Canvas optimizado local. */
  ADC_SYS_ERR_0005 = 'ADC_SYS_ERR_0005',

  // =========================================================================
  // EVENT ERRORS (Errores Operativos en la Agenda de Convocatorias)
  // =========================================================================

  /** @description Excepción NoSQL: No se ha podido guardar o sincronizar el documento estructural del evento en `/events`. */
  ADC_EVENT_ERR_0001 = 'ADC_EVENT_ERR_0001',

  /** @description Excepción de red: Error asíncrono al inyectar el UID en la subcolección `/attendance` de confirmaciones. */
  ADC_EVENT_ERR_0002 = 'ADC_EVENT_ERR_0002',

  /** @description Excepción destructiva: Fallo al intentar borrar físicamente una convocatoria o limpiar sus asistencias huérfanas. */
  ADC_EVENT_ERR_0003 = 'ADC_EVENT_ERR_0003',

  /** @description Inexistencia: La convocatoria de destino solicitada por la URL ha sido eliminada de Firestore por otro directivo. */
  ADC_EVENT_ERR_0004 = 'ADC_EVENT_ERR_0004',

  /** @description Excepción de lectura: Error de red al intentar descargar los mapeos o traducciones de un evento específico. */
  ADC_EVENT_ERR_0005 = 'ADC_EVENT_ERR_0005',

  /** @description Coherencia temporal: Validación de formulario fallida porque la fecha de inicio pertenece al pasado del huso horario local. */
  ADC_EVENT_ERR_0006 = 'ADC_EVENT_ERR_0006',

  /** @description Coherencia temporal: Validación fallida porque el rango horario se encuentra cruzado (la fecha de fin es anterior al inicio). */
  ADC_EVENT_ERR_0007 = 'ADC_EVENT_ERR_0007',

  /** @description Restricción por concurrencia: El aforo de plazas máximas (`maxAttendees`) se encuentra saturado y completo. */
  ADC_EVENT_ERR_0008 = 'ADC_EVENT_ERR_0008',

  /** @description Validación estructural: Los eventos de tipo ferial exigen de forma obligatoria delimitar un cupo restrictivo de pases de externos. */
  ADC_EVENT_ERR_0009 = 'ADC_EVENT_ERR_0009',

  // =========================================================================
  // EVENT INFO (Mensajes Informativos de la Agenda)
  // =========================================================================

  /** @description Éxito de flujo: Nueva convocatoria de asamblea, comida, quedada o feria grabada y publicada correctamente. */
  ADC_EVENT_INF_0001 = 'ADC_EVENT_INF_0001',

  /** @description Éxito de flujo: Modificaciones físicas del evento consolidadas y enviadas de forma limpia hacia la base de datos. */
  ADC_EVENT_INF_0002 = 'ADC_EVENT_INF_0002',

  /** @description Éxito de flujo: Transacción de incremento atómico completada y plaza reservada para el socio de forma legítima. */
  ADC_EVENT_INF_0003 = 'ADC_EVENT_INF_0003',

  // =========================================================================
  // FAIR ERRORS (Errores Específicos del Módulo Ferial y Pases QR)
  // =========================================================================

  /** @description Restricción de cupo: El socio ha consumido el límite diario de invitaciones externas reguladas por el evento de feria. */
  ADC_FAIR_ERR_0001 = 'ADC_FAIR_ERR_0001',

  /** @description Terminal de portería: El string decodificado del código QR no responde al payload estricto de seguridad requerido. */
  ADC_FAIR_ERR_0002 = 'ADC_FAIR_ERR_0002',

  /** @description Validación en puerta: Código QR rechazado por el escáner debido a que la fecha actual está fuera del rango de vigencia. */
  ADC_FAIR_ERR_0003 = 'ADC_FAIR_ERR_0003',

  /** @description Excepción de emisión: Error asíncrono al intentar escribir o instanciar la credencial en la colección general. */
  ADC_FAIR_ERR_0004 = 'ADC_FAIR_ERR_0004',

  /** @description Excepción destructiva: Error al intentar anular o dar de baja un pase activo de caseta desde el menú del socio. */
  ADC_FAIR_ERR_0005 = 'ADC_FAIR_ERR_0005',

  /** @description Validación de formulario: Argumento nulo al intentar emitir un pase digital sin especificar una identidad o invitado. */
  ADC_FAIR_ERR_0006 = 'ADC_FAIR_ERR_0006',

  /** @description Restricción ferial: El menú lateral ha monitorizado la colección y determina que el usuario carece de pases válidos hoy. */
  ADC_FAIR_ERR_0007 = 'ADC_FAIR_ERR_0007',

  /** @description Validación en puerta: El pase QR pertenece a un socio que se encuentra suspendido, inactivo o en estado de impago. */
  ADC_FAIR_ERR_0008 = 'ADC_FAIR_ERR_0008',

  /** @description RBAC Ferial: El rol asignado al usuario que pretende cruzar la puerta no posee derecho de admisión de caseta. */
  ADC_FAIR_ERR_0009 = 'ADC_FAIR_ERR_0009',

  // =========================================================================
  // FAIR INFO (Mensajes Informativos de Feria)
  // =========================================================================

  /** @description Éxito de flujo: Registro relacional insertado con éxito en `/fair-access`, quedando disponible para el invitado. */
  ADC_FAIR_INF_0001 = 'ADC_FAIR_INF_0001',

  /** @description Éxito de flujo: Destrucción de la credencial en lote ejecutada correctamente, desvinculando el QR en portería. */
  ADC_FAIR_INF_0002 = 'ADC_FAIR_INF_0002',

  /** @description Éxito automático: Billetera inteligente reactiva activa; credencial de socio inyectada de forma transparente por el snapshot. */
  ADC_FAIR_INF_0003 = 'ADC_FAIR_INF_0003',
}