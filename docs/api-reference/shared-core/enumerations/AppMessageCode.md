[**shared-core**](../README.md)

***

[shared-core](../README.md) / AppMessageCode

# Enumeration: AppMessageCode

Defined in: [constants/app-message-code.enum.ts:6](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/constants/app-message-code.enum.ts#L6)

AppMessageCode

## Description

Catálogo unificado, estricto y centralizado de códigos alfanuméricos de error e información.
Gobierna las pasarelas de traducción, interceptores de red y flujos de excepciones visuales de todo el ecosistema ADC Los Locos V2.

## Enumeration Members

### ADC\_ADMIN\_ERR\_0001

> **ADC\_ADMIN\_ERR\_0001**: `"ADC_ADMIN_ERR_0001"`

Defined in: [constants/app-message-code.enum.ts:119](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/constants/app-message-code.enum.ts#L119)

#### Description

Excepción en aprobación: Error crítico al cambiar el estado del socio a 'active' en el módulo de solicitudes.

***

### ADC\_ADMIN\_ERR\_0002

> **ADC\_ADMIN\_ERR\_0002**: `"ADC_ADMIN_ERR_0002"`

Defined in: [constants/app-message-code.enum.ts:122](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/constants/app-message-code.enum.ts#L122)

#### Description

Excepción en denegación: Fallo al intentar destruir el documento o registrar el log de rechazo de una solicitud.

***

### ADC\_AUTH\_ERR\_0001

> **ADC\_AUTH\_ERR\_0001**: `"ADC_AUTH_ERR_0001"`

Defined in: [constants/app-message-code.enum.ts:13](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/constants/app-message-code.enum.ts#L13)

#### Description

Error de sesión: El token de autenticación de Firebase Auth no existe, ha expirado o es inválido.

***

### ADC\_AUTH\_ERR\_0002

> **ADC\_AUTH\_ERR\_0002**: `"ADC_AUTH_ERR_0002"`

Defined in: [constants/app-message-code.enum.ts:16](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/constants/app-message-code.enum.ts#L16)

#### Description

Autenticación fallida: Las credenciales introducidas no corresponden a ningún usuario activo.

***

### ADC\_AUTH\_ERR\_0003

> **ADC\_AUTH\_ERR\_0003**: `"ADC_AUTH_ERR_0003"`

Defined in: [constants/app-message-code.enum.ts:19](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/constants/app-message-code.enum.ts#L19)

#### Description

Seguridad: El correo electrónico proporcionado no se encuentra pre-aprobado ni invitado en el sistema.

***

### ADC\_AUTH\_ERR\_0004

> **ADC\_AUTH\_ERR\_0004**: `"ADC_AUTH_ERR_0004"`

Defined in: [constants/app-message-code.enum.ts:22](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/constants/app-message-code.enum.ts#L22)

#### Description

Registro fallido: Ya existe una cuenta civil o administrativa en uso con este correo electrónico.

***

### ADC\_AUTH\_ERR\_0005

> **ADC\_AUTH\_ERR\_0005**: `"ADC_AUTH_ERR_0005"`

Defined in: [constants/app-message-code.enum.ts:25](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/constants/app-message-code.enum.ts#L25)

#### Description

Validación: La contraseña suministrada vulnera los requisitos mínimos de longitud (mínimo 6 caracteres).

***

### ADC\_AUTH\_ERR\_0006

> **ADC\_AUTH\_ERR\_0006**: `"ADC_AUTH_ERR_0006"`

Defined in: [constants/app-message-code.enum.ts:28](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/constants/app-message-code.enum.ts#L28)

#### Description

Estructura: La sintaxis de la cadena del correo electrónico no cumple el estándar internacional RFC 5322.

***

### ADC\_AUTH\_ERR\_0007

> **ADC\_AUTH\_ERR\_0007**: `"ADC_AUTH_ERR_0007"`

Defined in: [constants/app-message-code.enum.ts:31](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/constants/app-message-code.enum.ts#L31)

#### Description

Excepción asíncrona: Error interno en la mutación o alta del usuario en los servidores de Firebase Auth.

***

### ADC\_AUTH\_ERR\_0008

> **ADC\_AUTH\_ERR\_0008**: `"ADC_AUTH_ERR_0008"`

Defined in: [constants/app-message-code.enum.ts:34](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/constants/app-message-code.enum.ts#L34)

#### Description

Validación: Argumentos obligatorios nulos o vacíos detectados en los campos de login o registro.

***

### ADC\_AUTH\_ERR\_0009

> **ADC\_AUTH\_ERR\_0009**: `"ADC_AUTH_ERR_0009"`

Defined in: [constants/app-message-code.enum.ts:37](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/constants/app-message-code.enum.ts#L37)

#### Description

Seguridad: Intento de inicio de sesión de un usuario cuya cuenta ha sido bloqueada lógicamente por la directiva.

***

### ADC\_AUTH\_ERR\_0010

> **ADC\_AUTH\_ERR\_0010**: `"ADC_AUTH_ERR_0010"`

Defined in: [constants/app-message-code.enum.ts:40](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/constants/app-message-code.enum.ts#L40)

#### Description

Excepción perimetral: Error crítico al intentar actualizar el correo o la contraseña en el proveedor de Auth.

***

### ADC\_AUTH\_ERR\_0011

> **ADC\_AUTH\_ERR\_0011**: `"ADC_AUTH_ERR_0011"`

Defined in: [constants/app-message-code.enum.ts:43](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/constants/app-message-code.enum.ts#L43)

#### Description

Autenticación: Identificador de cuenta o UID inexistente en los directorios lógicos de la plataforma.

***

### ADC\_AUTH\_ERR\_0012

> **ADC\_AUTH\_ERR\_0012**: `"ADC_AUTH_ERR_0012"`

Defined in: [constants/app-message-code.enum.ts:46](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/constants/app-message-code.enum.ts#L46)

#### Description

Autenticación: La contraseña flat introducida es errónea contra el hash de seguridad almacenado.

***

### ADC\_AUTH\_ERR\_0013

> **ADC\_AUTH\_ERR\_0013**: `"ADC_AUTH_ERR_0013"`

Defined in: [constants/app-message-code.enum.ts:49](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/constants/app-message-code.enum.ts#L49)

#### Description

Seguridad perimetral: Bloqueo temporal de solicitudes debido a una ráfaga excesiva de intentos fallidos (Anti-Bruteforce).

***

### ADC\_AUTH\_ERR\_0014

> **ADC\_AUTH\_ERR\_0014**: `"ADC_AUTH_ERR_0014"`

Defined in: [constants/app-message-code.enum.ts:52](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/constants/app-message-code.enum.ts#L52)

#### Description

Red/Hardware: Pérdida física de paquetes o latencia excesiva en el handshake de conexión con los servidores de Google.

***

### ADC\_AUTH\_INF\_0001

> **ADC\_AUTH\_INF\_0001**: `"ADC_AUTH_INF_0001"`

Defined in: [constants/app-message-code.enum.ts:129](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/constants/app-message-code.enum.ts#L129)

#### Description

Éxito de flujo: Cuenta civil dada de alta de forma correcta y sincronizada con los perfiles del backend.

***

### ADC\_EVENT\_ERR\_0001

> **ADC\_EVENT\_ERR\_0001**: `"ADC_EVENT_ERR_0001"`

Defined in: [constants/app-message-code.enum.ts:172](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/constants/app-message-code.enum.ts#L172)

#### Description

Excepción NoSQL: No se ha podido guardar o sincronizar el documento estructural del evento en `/events`.

***

### ADC\_EVENT\_ERR\_0002

> **ADC\_EVENT\_ERR\_0002**: `"ADC_EVENT_ERR_0002"`

Defined in: [constants/app-message-code.enum.ts:175](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/constants/app-message-code.enum.ts#L175)

#### Description

Excepción de red: Error asíncrono al inyectar el UID en la subcolección `/attendance` de confirmaciones.

***

### ADC\_EVENT\_ERR\_0003

> **ADC\_EVENT\_ERR\_0003**: `"ADC_EVENT_ERR_0003"`

Defined in: [constants/app-message-code.enum.ts:178](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/constants/app-message-code.enum.ts#L178)

#### Description

Excepción destructiva: Fallo al intentar borrar físicamente una convocatoria o limpiar sus asistencias huérfanas.

***

### ADC\_EVENT\_ERR\_0004

> **ADC\_EVENT\_ERR\_0004**: `"ADC_EVENT_ERR_0004"`

Defined in: [constants/app-message-code.enum.ts:181](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/constants/app-message-code.enum.ts#L181)

#### Description

Inexistencia: La convocatoria de destino solicitada por la URL ha sido eliminada de Firestore por otro directivo.

***

### ADC\_EVENT\_ERR\_0005

> **ADC\_EVENT\_ERR\_0005**: `"ADC_EVENT_ERR_0005"`

Defined in: [constants/app-message-code.enum.ts:184](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/constants/app-message-code.enum.ts#L184)

#### Description

Excepción de lectura: Error de red al intentar descargar los mapeos o traducciones de un evento específico.

***

### ADC\_EVENT\_ERR\_0006

> **ADC\_EVENT\_ERR\_0006**: `"ADC_EVENT_ERR_0006"`

Defined in: [constants/app-message-code.enum.ts:187](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/constants/app-message-code.enum.ts#L187)

#### Description

Coherencia temporal: Validación de formulario fallida porque la fecha de inicio pertenece al pasado del huso horario local.

***

### ADC\_EVENT\_ERR\_0007

> **ADC\_EVENT\_ERR\_0007**: `"ADC_EVENT_ERR_0007"`

Defined in: [constants/app-message-code.enum.ts:190](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/constants/app-message-code.enum.ts#L190)

#### Description

Coherencia temporal: Validación fallida porque el rango horario se encuentra cruzado (la fecha de fin es anterior al inicio).

***

### ADC\_EVENT\_ERR\_0008

> **ADC\_EVENT\_ERR\_0008**: `"ADC_EVENT_ERR_0008"`

Defined in: [constants/app-message-code.enum.ts:193](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/constants/app-message-code.enum.ts#L193)

#### Description

Restricción por concurrencia: El aforo de plazas máximas (`maxAttendees`) se encuentra saturado y completo.

***

### ADC\_EVENT\_ERR\_0009

> **ADC\_EVENT\_ERR\_0009**: `"ADC_EVENT_ERR_0009"`

Defined in: [constants/app-message-code.enum.ts:196](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/constants/app-message-code.enum.ts#L196)

#### Description

Validación estructural: Los eventos de tipo ferial exigen de forma obligatoria delimitar un cupo restrictivo de pases de externos.

***

### ADC\_EVENT\_INF\_0001

> **ADC\_EVENT\_INF\_0001**: `"ADC_EVENT_INF_0001"`

Defined in: [constants/app-message-code.enum.ts:203](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/constants/app-message-code.enum.ts#L203)

#### Description

Éxito de flujo: Nueva convocatoria de asamblea, comida, quedada o feria grabada y publicada correctamente.

***

### ADC\_EVENT\_INF\_0002

> **ADC\_EVENT\_INF\_0002**: `"ADC_EVENT_INF_0002"`

Defined in: [constants/app-message-code.enum.ts:206](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/constants/app-message-code.enum.ts#L206)

#### Description

Éxito de flujo: Modificaciones físicas del evento consolidadas y enviadas de forma limpia hacia la base de datos.

***

### ADC\_EVENT\_INF\_0003

> **ADC\_EVENT\_INF\_0003**: `"ADC_EVENT_INF_0003"`

Defined in: [constants/app-message-code.enum.ts:209](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/constants/app-message-code.enum.ts#L209)

#### Description

Éxito de flujo: Transacción de incremento atómico completada y plaza reservada para el socio de forma legítima.

***

### ADC\_FAIR\_ERR\_0001

> **ADC\_FAIR\_ERR\_0001**: `"ADC_FAIR_ERR_0001"`

Defined in: [constants/app-message-code.enum.ts:216](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/constants/app-message-code.enum.ts#L216)

#### Description

Restricción de cupo: El socio ha consumido el límite diario de invitaciones externas reguladas por el evento de feria.

***

### ADC\_FAIR\_ERR\_0002

> **ADC\_FAIR\_ERR\_0002**: `"ADC_FAIR_ERR_0002"`

Defined in: [constants/app-message-code.enum.ts:219](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/constants/app-message-code.enum.ts#L219)

#### Description

Terminal de portería: El string decodificado del código QR no responde al payload estricto de seguridad requerido.

***

### ADC\_FAIR\_ERR\_0003

> **ADC\_FAIR\_ERR\_0003**: `"ADC_FAIR_ERR_0003"`

Defined in: [constants/app-message-code.enum.ts:222](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/constants/app-message-code.enum.ts#L222)

#### Description

Validación en puerta: Código QR rechazado por el escáner debido a que la fecha actual está fuera del rango de vigencia.

***

### ADC\_FAIR\_ERR\_0004

> **ADC\_FAIR\_ERR\_0004**: `"ADC_FAIR_ERR_0004"`

Defined in: [constants/app-message-code.enum.ts:225](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/constants/app-message-code.enum.ts#L225)

#### Description

Excepción de emisión: Error asíncrono al intentar escribir o instanciar la credencial en la colección general.

***

### ADC\_FAIR\_ERR\_0005

> **ADC\_FAIR\_ERR\_0005**: `"ADC_FAIR_ERR_0005"`

Defined in: [constants/app-message-code.enum.ts:228](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/constants/app-message-code.enum.ts#L228)

#### Description

Excepción destructiva: Error al intentar anular o dar de baja un pase activo de caseta desde el menú del socio.

***

### ADC\_FAIR\_ERR\_0006

> **ADC\_FAIR\_ERR\_0006**: `"ADC_FAIR_ERR_0006"`

Defined in: [constants/app-message-code.enum.ts:231](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/constants/app-message-code.enum.ts#L231)

#### Description

Validación de formulario: Argumento nulo al intentar emitir un pase digital sin especificar una identidad o invitado.

***

### ADC\_FAIR\_ERR\_0007

> **ADC\_FAIR\_ERR\_0007**: `"ADC_FAIR_ERR_0007"`

Defined in: [constants/app-message-code.enum.ts:234](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/constants/app-message-code.enum.ts#L234)

#### Description

Restricción ferial: El menú lateral ha monitorizado la colección y determina que el usuario carece de pases válidos hoy.

***

### ADC\_FAIR\_ERR\_0008

> **ADC\_FAIR\_ERR\_0008**: `"ADC_FAIR_ERR_0008"`

Defined in: [constants/app-message-code.enum.ts:237](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/constants/app-message-code.enum.ts#L237)

#### Description

Validación en puerta: El pase QR pertenece a un socio que se encuentra suspendido, inactivo o en estado de impago.

***

### ADC\_FAIR\_ERR\_0009

> **ADC\_FAIR\_ERR\_0009**: `"ADC_FAIR_ERR_0009"`

Defined in: [constants/app-message-code.enum.ts:240](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/constants/app-message-code.enum.ts#L240)

#### Description

RBAC Ferial: El rol asignado al usuario que pretende cruzar la puerta no posee derecho de admisión de caseta.

***

### ADC\_FAIR\_INF\_0001

> **ADC\_FAIR\_INF\_0001**: `"ADC_FAIR_INF_0001"`

Defined in: [constants/app-message-code.enum.ts:247](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/constants/app-message-code.enum.ts#L247)

#### Description

Éxito de flujo: Registro relacional insertado con éxito en `/fair-access`, quedando disponible para el invitado.

***

### ADC\_FAIR\_INF\_0002

> **ADC\_FAIR\_INF\_0002**: `"ADC_FAIR_INF_0002"`

Defined in: [constants/app-message-code.enum.ts:250](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/constants/app-message-code.enum.ts#L250)

#### Description

Éxito de flujo: Destrucción de la credencial en lote ejecutada correctamente, desvinculando el QR en portería.

***

### ADC\_FAIR\_INF\_0003

> **ADC\_FAIR\_INF\_0003**: `"ADC_FAIR_INF_0003"`

Defined in: [constants/app-message-code.enum.ts:253](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/constants/app-message-code.enum.ts#L253)

#### Description

Éxito automático: Billetera inteligente reactiva activa; credencial de socio inyectada de forma transparente por el snapshot.

***

### ADC\_FEES\_ERR\_0001

> **ADC\_FEES\_ERR\_0001**: `"ADC_FEES_ERR_0001"`

Defined in: [constants/app-message-code.enum.ts:84](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/constants/app-message-code.enum.ts#L84)

#### Description

Restricción de negocio: El socio tiene bloqueada la confirmación de asistencia por impago de cuotas del club.

***

### ADC\_FEES\_ERR\_0002

> **ADC\_FEES\_ERR\_0002**: `"ADC_FEES_ERR_0002"`

Defined in: [constants/app-message-code.enum.ts:87](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/constants/app-message-code.enum.ts#L87)

#### Description

Restricción de acceso ferial: Bloqueo inmediato de emisión o despliegue de pases QR debido a falta de solvencia anual.

***

### ADC\_FEES\_ERR\_0003

> **ADC\_FEES\_ERR\_0003**: `"ADC_FEES_ERR_0003"`

Defined in: [constants/app-message-code.enum.ts:90](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/constants/app-message-code.enum.ts#L90)

#### Description

Excepción administrativa: Error asíncrono al intentar mutar o guardar la actualización financiera del socio en Firestore.

***

### ADC\_INV\_ERR\_0001

> **ADC\_INV\_ERR\_0001**: `"ADC_INV_ERR_0001"`

Defined in: [constants/app-message-code.enum.ts:97](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/constants/app-message-code.enum.ts#L97)

#### Description

Validación: Se ha intentado despachar una invitación sin suministrar una cadena de texto de correo electrónico.

***

### ADC\_INV\_ERR\_0002

> **ADC\_INV\_ERR\_0002**: `"ADC_INV_ERR_0002"`

Defined in: [constants/app-message-code.enum.ts:100](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/constants/app-message-code.enum.ts#L100)

#### Description

Estructura errónea: El correo introducido para la invitación web no posee una nomenclatura de email válida.

***

### ADC\_INV\_ERR\_0003

> **ADC\_INV\_ERR\_0003**: `"ADC_INV_ERR_0003"`

Defined in: [constants/app-message-code.enum.ts:103](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/constants/app-message-code.enum.ts#L103)

#### Description

Servidor/Functions: Fallo asíncrono en el trigger en la nube o pasarela SMTP al procesar la plantilla de correo.

***

### ADC\_INV\_ERR\_0004

> **ADC\_INV\_ERR\_0004**: `"ADC_INV_ERR_0004"`

Defined in: [constants/app-message-code.enum.ts:106](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/constants/app-message-code.enum.ts#L106)

#### Description

Regla de negocio: El correo electrónico de destino ya corresponde a un socio activo dentro de la base de datos.

***

### ADC\_INV\_ERR\_0005

> **ADC\_INV\_ERR\_0005**: `"ADC_INV_ERR_0005"`

Defined in: [constants/app-message-code.enum.ts:109](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/constants/app-message-code.enum.ts#L109)

#### Description

Duplicidad de token: Ya existe un documento activo en `invitedUsers` pendiente de uso para este mismo correo.

***

### ADC\_INV\_ERR\_0006

> **ADC\_INV\_ERR\_0006**: `"ADC_INV_ERR_0006"`

Defined in: [constants/app-message-code.enum.ts:112](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/constants/app-message-code.enum.ts#L112)

#### Description

Inexistencia: No se localizan invitaciones previas ni registros de pre-alta vinculados a este identificador.

***

### ADC\_INV\_INF\_0001

> **ADC\_INV\_INF\_0001**: `"ADC_INV_INF_0001"`

Defined in: [constants/app-message-code.enum.ts:146](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/constants/app-message-code.enum.ts#L146)

#### Description

Éxito de flujo: Token único generado en Firestore y correo electrónico despachado al usuario aspirante.

***

### ADC\_SYS\_ERR\_0001

> **ADC\_SYS\_ERR\_0001**: `"ADC_SYS_ERR_0001"`

Defined in: [constants/app-message-code.enum.ts:153](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/constants/app-message-code.enum.ts#L153)

#### Description

Excepción fallback: Captura por defecto para errores de código imprevistos o caídas descontroladas de la lógica.

***

### ADC\_SYS\_ERR\_0002

> **ADC\_SYS\_ERR\_0002**: `"ADC_SYS_ERR_0002"`

Defined in: [constants/app-message-code.enum.ts:156](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/constants/app-message-code.enum.ts#L156)

#### Description

Red/Offline: El dispositivo móvil no presenta conectividad física a internet o los sockets han sido rechazados.

***

### ADC\_SYS\_ERR\_0003

> **ADC\_SYS\_ERR\_0003**: `"ADC_SYS_ERR_0003"`

Defined in: [constants/app-message-code.enum.ts:159](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/constants/app-message-code.enum.ts#L159)

#### Description

Seguridad/RBAC: El token de sesión del usuario carece de los privilegios y roles necesarios para la petición.

***

### ADC\_SYS\_ERR\_0004

> **ADC\_SYS\_ERR\_0004**: `"ADC_SYS_ERR_0004"`

Defined in: [constants/app-message-code.enum.ts:162](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/constants/app-message-code.enum.ts#L162)

#### Description

Servidor/Cloud: Caída de las Cloud Functions o parada por mantenimiento en la infraestructura serverless de Firebase.

***

### ADC\_SYS\_ERR\_0005

> **ADC\_SYS\_ERR\_0005**: `"ADC_SYS_ERR_0005"`

Defined in: [constants/app-message-code.enum.ts:165](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/constants/app-message-code.enum.ts#L165)

#### Description

Excepción de hardware: El dispositivo no soporta o ha fallado al renderizar el Canvas optimizado local.

***

### ADC\_USER\_ERR\_0001

> **ADC\_USER\_ERR\_0001**: `"ADC_USER_ERR_0001"`

Defined in: [constants/app-message-code.enum.ts:59](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/constants/app-message-code.enum.ts#L59)

#### Description

Excepción NoSQL: Error genérico al intentar persistir o realizar un setDoc sobre el documento del usuario.

***

### ADC\_USER\_ERR\_0002

> **ADC\_USER\_ERR\_0002**: `"ADC_USER_ERR_0002"`

Defined in: [constants/app-message-code.enum.ts:62](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/constants/app-message-code.enum.ts#L62)

#### Description

Excepción de escritura: Fallo asíncrono durante la actualización de la ficha civil de datos personales.

***

### ADC\_USER\_ERR\_0003

> **ADC\_USER\_ERR\_0003**: `"ADC_USER_ERR_0003"`

Defined in: [constants/app-message-code.enum.ts:65](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/constants/app-message-code.enum.ts#L65)

#### Description

Validación de formulario: El correo de confirmación no coincide con el campo de email primario.

***

### ADC\_USER\_ERR\_0004

> **ADC\_USER\_ERR\_0004**: `"ADC_USER_ERR_0004"`

Defined in: [constants/app-message-code.enum.ts:68](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/constants/app-message-code.enum.ts#L68)

#### Description

Validación de formulario: La contraseña del campo espejo no coincide con la contraseña primaria introducida.

***

### ADC\_USER\_ERR\_0005

> **ADC\_USER\_ERR\_0005**: `"ADC_USER_ERR_0005"`

Defined in: [constants/app-message-code.enum.ts:71](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/constants/app-message-code.enum.ts#L71)

#### Description

Validación de negocio: Faltan campos obligatorios estructurales por rellenar en el chasis del formulario de perfil.

***

### ADC\_USER\_ERR\_0006

> **ADC\_USER\_ERR\_0006**: `"ADC_USER_ERR_0006"`

Defined in: [constants/app-message-code.enum.ts:74](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/constants/app-message-code.enum.ts#L74)

#### Description

Excepción legal de baja: Fallo en red o servidor al procesar la autodestrucción voluntaria de la cuenta

***

### ADC\_USER\_ERR\_0007

> **ADC\_USER\_ERR\_0007**: `"ADC_USER_ERR_0007"`

Defined in: [constants/app-message-code.enum.ts:77](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/constants/app-message-code.enum.ts#L77)

#### Description

Restricción de baja por deuda: Bloquea la eliminación voluntaria de la cuenta si existen cuotas pendientes

***

### ADC\_USER\_INF\_0001

> **ADC\_USER\_INF\_0001**: `"ADC_USER_INF_0001"`

Defined in: [constants/app-message-code.enum.ts:136](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/constants/app-message-code.enum.ts#L136)

#### Description

Éxito de flujo: Solicitud de pre-alta aprobada por la directiva, disparando el envío de notificaciones automáticas.

***

### ADC\_USER\_INF\_0002

> **ADC\_USER\_INF\_0002**: `"ADC_USER_INF_0002"`

Defined in: [constants/app-message-code.enum.ts:139](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/constants/app-message-code.enum.ts#L139)

#### Description

Éxito de flujo: Solicitud de onboarding web rechazada de forma oficial y eliminada del panel administrativo.
