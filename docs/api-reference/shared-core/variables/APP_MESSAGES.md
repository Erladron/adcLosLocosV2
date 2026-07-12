[**shared-core**](../README.md)

***

[shared-core](../README.md) / APP\_MESSAGES

# Variable: APP\_MESSAGES

> `const` **APP\_MESSAGES**: `object`

Defined in: [constants/app-messages.ts:8](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/constants/app-messages.ts#L8)

## Type Declaration

### ADC\_ADMIN\_ERR\_0001

> **ADC\_ADMIN\_ERR\_0001**: `string` = `'Error aprobando usuario.'`

#### Description

Excepción de flujo: Error asíncrono al intentar invocar la mutación de estado a 'active' sobre el usuario.

### ADC\_ADMIN\_ERR\_0002

> **ADC\_ADMIN\_ERR\_0002**: `string` = `'Error rechazando usuario.'`

#### Description

Excepción en denegación: Fallo de red al intentar destruir el token o registrar el log de motivo de rechazo.

### ADC\_AUTH\_ERR\_0001

> **ADC\_AUTH\_ERR\_0001**: `string` = `'Usuario no autenticado.'`

#### Description

Error emitido cuando una petición interceptada por el guard carece de token de sesión activo.

### ADC\_AUTH\_ERR\_0002

> **ADC\_AUTH\_ERR\_0002**: `string` = `'Credenciales inválidas.'`

#### Description

Error genérico de login que evita dar pistas sobre si falló el correo o la clave por seguridad.

### ADC\_AUTH\_ERR\_0003

> **ADC\_AUTH\_ERR\_0003**: `string` = `'Tu correo no está autorizado para registrarse.'`

#### Description

Bloqueo en pre-alta: El email introducido no ha sido registrado previamente por la directiva en `invitedUsers`.

### ADC\_AUTH\_ERR\_0004

> **ADC\_AUTH\_ERR\_0004**: `string` = `'Ya existe una cuenta registrada con este correo electrónico.'`

#### Description

Error de duplicidad: Intento de alta con un email que ya existe en el chasis de Firebase Authentication.

### ADC\_AUTH\_ERR\_0005

> **ADC\_AUTH\_ERR\_0005**: `string` = `'La contraseña debe tener al menos 6 caracteres.'`

#### Description

Validación de robustez: Longitud de caracteres de la contraseña inferior al mínimo exigido por las políticas.

### ADC\_AUTH\_ERR\_0006

> **ADC\_AUTH\_ERR\_0006**: `string` = `'El correo electrónico no es válido.'`

#### Description

Estructura de formulario: La cadena de texto de entrada no supera los patrones de formato de un email legítimo.

### ADC\_AUTH\_ERR\_0007

> **ADC\_AUTH\_ERR\_0007**: `string` = `'Error registrando usuario.'`

#### Description

Fallo en el motor de Firebase Auth: Excepción no controlada durante el proceso de empaquetado del registro.

### ADC\_AUTH\_ERR\_0008

> **ADC\_AUTH\_ERR\_0008**: `string` = `'Por favor, introduce tu email y contraseña.'`

#### Description

Validación rápida de login: El usuario ha dejado en blanco los inputs obligatorios de acceso de la pantalla.

### ADC\_AUTH\_ERR\_0009

> **ADC\_AUTH\_ERR\_0009**: `string` = `'Tu cuenta ha sido cancelada. Contacta con administración.'`

#### Description

Bloqueo perimetral: Intento de login de un socio con estado lógico 'inactive' o suspendido por el club.

### ADC\_AUTH\_ERR\_0010

> **ADC\_AUTH\_ERR\_0010**: `string` = `'Error actualizando credenciales.'`

#### Description

Excepción de credenciales: Fallo de persistencia al intentar mutar o re-autenticar la cuenta del usuario.

### ADC\_AUTH\_ERR\_0011

> **ADC\_AUTH\_ERR\_0011**: `string` = `'Usuario o contraseña incorrectos.'`

#### Description

Error en pantalla de login: No hay concordancia biunívoca entre los campos introducidos y los registros.

### ADC\_AUTH\_ERR\_0012

> **ADC\_AUTH\_ERR\_0012**: `string` = `'Usuario o contraseña incorrectos.'`

#### Description

Fallo de verificación de clave espejo: Doble check erróneo en el flujo de credenciales.

### ADC\_AUTH\_ERR\_0013

> **ADC\_AUTH\_ERR\_0013**: `string` = `'Demasiados intentos. Inténtalo más tarde.'`

#### Description

Defensa perimetral: Alerta Toast disparada tras saturar el umbral de reintentos permitidos por la API.

### ADC\_AUTH\_ERR\_0014

> **ADC\_AUTH\_ERR\_0014**: `string` = `'Error de conexión con Firebase.'`

#### Description

Error físico de socket: Pérdida total de conexión o timeout con los balanceadores de carga de Google Cloud.

### ADC\_AUTH\_INF\_0001

> **ADC\_AUTH\_INF\_0001**: `string` = `'Cuenta creada correctamente.'`

#### Description

Notificación Toast de éxito: Flujo de alta y sincronización con el backend completado de forma correcta.

### ADC\_EVENT\_ERR\_0001

> **ADC\_EVENT\_ERR\_0001**: `string` = `'No se ha podido guardar el evento. Por favor, inténtalo de nuevo.'`

#### Description

Excepción NoSQL: Fallo de concurrencia o red al intentar consolidar los formularios del evento en `/events`.

### ADC\_EVENT\_ERR\_0002

> **ADC\_EVENT\_ERR\_0002**: `string` = `'Error al registrar tu asistencia. Revisa tu conexión.'`

#### Description

Excepción de asistencia: Error al insertar el UID del socio en la subcolección atómica `/attendance`.

### ADC\_EVENT\_ERR\_0003

> **ADC\_EVENT\_ERR\_0003**: `string` = `'No se ha podido eliminar el evento.'`

#### Description

Excepción destructiva: Error asíncrono al intentar borrar la convocatoria o ejecutar el lote en cascada.

### ADC\_EVENT\_ERR\_0004

> **ADC\_EVENT\_ERR\_0004**: `string` = `'El evento no existe o ha sido eliminado.'`

#### Description

Error de navegación: El ID del evento solicitado por la URL de la app ha sido borrado físicamente por un directivo.

### ADC\_EVENT\_ERR\_0005

> **ADC\_EVENT\_ERR\_0005**: `string` = `'Error al cargar los datos del evento.'`

#### Description

Excepción de descarga: Error de red al intentar recuperar los detalles, imágenes o diccionarios del evento.

### ADC\_EVENT\_ERR\_0006

> **ADC\_EVENT\_ERR\_0006**: `string` = `'La fecha y hora inicio no puede ser menor a la actual.'`

#### Description

Coherencia temporal: El formulario de creación ha detectado que la fecha de inicio pertenece al pasado.

### ADC\_EVENT\_ERR\_0007

> **ADC\_EVENT\_ERR\_0007**: `string` = `'La fecha y hora de fin del evento debe ser posterior a la de inicio.'`

#### Description

Coherencia temporal: Validación fallida debido a rangos cruzados (la fecha de fin es previa al inicio).

### ADC\_EVENT\_ERR\_0008

> **ADC\_EVENT\_ERR\_0008**: `string` = `'¡Aforo completo! Lo sentimos, ya no quedan plazas libres para este evento.'`

#### Description

Control de aforo atómico: El contador de plazas `attendeeCount` ha alcanzado el máximo configurable `maxAttendees`.

### ADC\_EVENT\_ERR\_0009

> **ADC\_EVENT\_ERR\_0009**: `string` = `'El límite de invitados por socio es obligatorio para los eventos de feria y debe ser igual o superior a 1.'`

#### Description

Validación estructural: Los formularios exigen definir el cupo dinámico de pases permitidos para eventos tipo feria.

### ADC\_EVENT\_INF\_0001

> **ADC\_EVENT\_INF\_0001**: `string` = `'¡Evento convocado con éxito!'`

#### Description

Notificación Toast de éxito: Convocatoria registrada y visible de forma instantánea en la app móvil.

### ADC\_EVENT\_INF\_0002

> **ADC\_EVENT\_INF\_0002**: `string` = `'Datos del evento actualizados correctamente.'`

#### Description

Notificación Toast de éxito: Modificaciones consolidadas y enviadas de forma limpia hacia la base de datos Firestore.

### ADC\_EVENT\_INF\_0003

> **ADC\_EVENT\_INF\_0003**: `string` = `'¡Asistencia confirmada! Te esperamos.'`

#### Description

Notificación Toast de éxito: Transacción atómica completada con éxito y plaza en el evento asegurada.

### ADC\_FAIR\_ERR\_0001

> **ADC\_FAIR\_ERR\_0001**: `string` = `'Límite superado. Solo puedes invitar a un máximo de 6 personas por día.'`

#### Description

Restricción de negocio: El socio ha superado el cupo estricto de invitaciones externas reguladas para el día de hoy.

### ADC\_FAIR\_ERR\_0002

> **ADC\_FAIR\_ERR\_0002**: `string` = `'El código QR escaneado no corresponde a ningún pase de feria válido.'`

#### Description

Terminal de portería: El decodificador del plugin de la cámara arroja un payload ilegítimo o fraudulento.

### ADC\_FAIR\_ERR\_0003

> **ADC\_FAIR\_ERR\_0003**: `string` = `'Acceso denegado. Este pase no es válido para la fecha de hoy.'`

#### Description

Validación de acceso en puerta: El escáner rechaza el pase porque la fecha actual no cubre la vigencia del abono.

### ADC\_FAIR\_ERR\_0004

> **ADC\_FAIR\_ERR\_0004**: `string` = `'No se pudo emitir la invitación. Verifica tu conexión.'`

#### Description

Excepción de inserción: Error asíncrono de red al intentar insertar el pase digital en `fair-access`.

### ADC\_FAIR\_ERR\_0005

> **ADC\_FAIR\_ERR\_0005**: `string` = `'No se pudo anular el pase. Inténtalo de nuevo más tarde.'`

#### Description

Excepción destructiva: Fallo al intentar borrar el documento de la credencial desde el listado del socio.

### ADC\_FAIR\_ERR\_0006

> **ADC\_FAIR\_ERR\_0006**: `string` = `'Debes seleccionar un invitado del listado desplegable o escribir un nombre.'`

#### Description

Validación de formulario ferial: Argumento obligatorio nulo al intentar generar un pase sin identidad destino.

### ADC\_FAIR\_ERR\_0007

> **ADC\_FAIR\_ERR\_0007**: `string` = `'No tienes ningún pase de feria activo disponible para la jornada de hoy.'`

#### Description

Monitorización reactiva: El snapshot determina que el usuario logueado carece de pases válidos vigentes hoy.

### ADC\_FAIR\_ERR\_0008

> **ADC\_FAIR\_ERR\_0008**: `string` = `'Acceso denegado. El socio no se encuentra en estado activo en el sistema.'`

#### Description

Control en puerta: El carnet escaneado pertenece a una cuenta suspendida o bloqueada por la directiva.

### ADC\_FAIR\_ERR\_0009

> **ADC\_FAIR\_ERR\_0009**: `string` = `'Acceso denegado. El tipo de usuario no dispone de credenciales de acceso de socio.'`

#### Description

Control de portería: El tipo de rol asignado al usuario carece por completo de permisos de admisión ferial.

### ADC\_FAIR\_INF\_0001

> **ADC\_FAIR\_INF\_0001**: `string` = `'Pase de caseta emitido correctamente.'`

#### Description

Notificación Toast de éxito: Pase relacional insertado y disponible para el despliegue del código QR del invitado.

### ADC\_FAIR\_INF\_0002

> **ADC\_FAIR\_INF\_0002**: `string` = `'El pase ha sido anulado correctamente.'`

#### Description

Notificación Toast de éxito: Credencial purgada del servidor, quedando inmediatamente desvinculada e invalidada.

### ADC\_FAIR\_INF\_0003

> **ADC\_FAIR\_INF\_0003**: `string` = `'¡Pase de Feria disponible! Hemos generado automáticamente tu credencial de acceso para la caseta de feria.'`

#### Description

Inicialización de billetera: El onSnapshot detecta un abono vigente hoy y activa el acceso lateral de forma automática.

### ADC\_FEES\_ERR\_0001

> **ADC\_FEES\_ERR\_0001**: `string` = `'Acceso denegado. Es necesario estar al corriente de pago de la cuota para poder apuntarse a este evento.'`

#### Description

Bloqueo de agenda: Intercepta la confirmación de asistencia bloqueando el botón si el socio adeuda cuotas.

### ADC\_FEES\_ERR\_0002

> **ADC\_FEES\_ERR\_0002**: `string` = `'Operación bloqueada. No se permiten emitir o desplegar credenciales feriales si el socio presenta cuotas pendientes.'`

#### Description

Bloqueo ferial: Impide generar pases de caseta en `fair-access` si se detecta estado de impago en el perfil.

### ADC\_FEES\_ERR\_0003

> **ADC\_FEES\_ERR\_0003**: `string` = `'No se pudo guardar la actualización financiera. Revisa tu conexión de red o permisos.'`

#### Description

Excepción en consola de cuotas: Error asíncrono al intentar mutar el booleano financiero desde el panel masivo.

### ADC\_INV\_ERR\_0001

> **ADC\_INV\_ERR\_0001**: `string` = `'Por favor, introduce un correo electrónico.'`

#### Description

Validación administrativa: Se ha pulsado emitir invitación dejando vacío el campo del email destino.

### ADC\_INV\_ERR\_0002

> **ADC\_INV\_ERR\_0002**: `string` = `'Introduce un email válido.'`

#### Description

Validación de estructura: El email del aspirante introducido en la consola no supera la expresión regular.

### ADC\_INV\_ERR\_0003

> **ADC\_INV\_ERR\_0003**: `string` = `'Error enviando invitación.'`

#### Description

Excepción de pasarela: Fallo en Cloud Functions o en el servidor SMTP al despachar el correo con diseño premium.

### ADC\_INV\_ERR\_0004

> **ADC\_INV\_ERR\_0004**: `string` = `'El usuario ya pertenece a la aplicación.'`

#### Description

Regla de negocio: Intento de invitar a una persona cuyo email ya consta como cuenta activa en la peña.

### ADC\_INV\_ERR\_0005

> **ADC\_INV\_ERR\_0005**: `string` = `'Ya existe una invitación para este correo.'`

#### Description

Control de duplicidad: Ya se localiza un token inmutable en caliente emitido y pendiente para esa misma cuenta.

### ADC\_INV\_ERR\_0006

> **ADC\_INV\_ERR\_0006**: `string` = `'No existe ninguna invitación para este correo.'`

#### Description

Validación de token web: El enlace pulsado por el usuario no se corresponde con ningún UUID de `invitedUsers`.

### ADC\_INV\_INF\_0001

> **ADC\_INV\_INF\_0001**: `string` = `'Invitación enviada correctamente.'`

#### Description

Notificación Toast de éxito: Documento cerrojo lógico creado en Firestore y correo electrónico despachado.

### ADC\_SYS\_ERR\_0001

> **ADC\_SYS\_ERR\_0001**: `string` = `'Error inesperado del sistema.'`

#### Description

Interceptor fallback general: Excepción de software no controlada atrapada en el catch definitivo.

### ADC\_SYS\_ERR\_0002

> **ADC\_SYS\_ERR\_0002**: `string` = `'Error de conexión.'`

#### Description

Error físico offline: El hardware del dispositivo no presenta respuesta de red o sockets abiertos.

### ADC\_SYS\_ERR\_0003

> **ADC\_SYS\_ERR\_0003**: `string` = `'No tienes permisos para realizar esta acción.'`

#### Description

Seguridad de Firebase rules: El token de sesión del usuario ha violado las restricciones perimetrales del servidor.

### ADC\_SYS\_ERR\_0004

> **ADC\_SYS\_ERR\_0004**: `string` = `'Servicio temporalmente no disponible.'`

#### Description

Error de Cloud Run: Caída del backend serverless en Node.js 24 o mantenimiento crítico de servicios de Firebase.

### ADC\_SYS\_ERR\_0005

> **ADC\_SYS\_ERR\_0005**: `string` = `'Fallo de hardware: El dispositivo no ha podido procesar u optimizar la fotografía seleccionada.'`

#### Description

Fallo de hardware: El dispositivo no ha podido procesar u optimizar la fotografía seleccionada.

### ADC\_USER\_ERR\_0001

> **ADC\_USER\_ERR\_0001**: `string` = `'Error guardando usuario.'`

#### Description

Excepción NoSQL: No se ha podido consolidar la escritura del documento de datos del socio en Firestore.

### ADC\_USER\_ERR\_0002

> **ADC\_USER\_ERR\_0002**: `string` = `'Error actualizando datos personales.'`

#### Description

Excepción de formulario: Fallo asíncrono al guardar el bloque civil editado por el usuario en su perfil.

### ADC\_USER\_ERR\_0003

> **ADC\_USER\_ERR\_0003**: `string` = `'Los emails no coinciden.'`

#### Description

Validación del frontend: Los correos suministrados en los dos inputs del formulario de alta discrepan.

### ADC\_USER\_ERR\_0004

> **ADC\_USER\_ERR\_0004**: `string` = `'Las contraseñas no coinciden.'`

#### Description

Validación del frontend: La contraseña y su campo de confirmación espejo no presentan idéntica cadena.

### ADC\_USER\_ERR\_0005

> **ADC\_USER\_ERR\_0005**: `string` = `'Complete todos los campos.'`

#### Description

Validación de campos obligatorios: El usuario ha dejado vacíos inputs requeridos con asterisco (*) en la UI.

### ADC\_USER\_ERR\_0006

> **ADC\_USER\_ERR\_0006**: `string` = `'No se ha podido procesar la baja de tu cuenta. Por favor, inténtalo de nuevo o contacta con la directiva.'`

#### Description

Traducción semántica oficial del fallo de autobaja

### ADC\_USER\_ERR\_0007

> **ADC\_USER\_ERR\_0007**: `string` = `'Baja bloqueada. No puedes eliminar tu cuenta si tienes cuotas pendientes de pago. Ponte en contacto con tesorería.'`

#### Description

Traducción semántica para el bloqueo de baja por morosidad

### ADC\_USER\_INF\_0001

> **ADC\_USER\_INF\_0001**: `string` = `'Usuario aprobado correctamente.'`

#### Description

Notificación Toast de éxito: Solicitud de pre-alta web aprobada e ingreso oficial del socio consolidado.

### ADC\_USER\_INF\_0002

> **ADC\_USER\_INF\_0002**: `string` = `'Usuario rechazado.'`

#### Description

Notificación Toast de éxito: Registro pendiente destruído y purgado del panel operativo de la directiva.

## Description

Diccionario centralizado de mapeos y traducciones en lenguaje natural para la plataforma ADC Los Locos V2.
Vincula de forma unívoca cada constante alfanumérica del enumerado `AppMessageCode` con su string representativo en español,
proveyendo los textos oficiales que el `NotificationService` renderizará en los Toasts o alertas del ecosistema.
