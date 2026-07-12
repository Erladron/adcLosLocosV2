[**shared-core**](../README.md)

***

[shared-core](../README.md) / UserService

# Class: UserService

Defined in: [services/user.service.ts:34](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/user.service.ts#L34)

UserService

## Description

Servicio centralizado e inyectable de alta capacidad encargado de la gestión del padrón de socios.
Gobierna de forma directa las mutaciones NoSQL e interactúa con el satélite de tesorería core.

## Constructors

### Constructor

> **new UserService**(): `UserService`

Defined in: [services/user.service.ts:52](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/user.service.ts#L52)

#### Returns

`UserService`

#### Description

Constructor limpio y vacío conforme a las reglas modernas de Angular.

## Methods

### approveUser()

> **approveUser**(`uid`): `Promise`\<`any`\>

Defined in: [services/user.service.ts:327](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/user.service.ts#L327)

#### Parameters

##### uid

`string`

UID del usuario aspirante en estado de revisión.

#### Returns

`Promise`\<`any`\>

Promesa de retorno asíncrona de la función en la nube.

#### Method

approveUser

#### Description

Invoca la Cloud Function serverless encargada de aprobar e incorporar oficialmente un registro pendiente de onboarding al club.

***

### create()

> **create**(`uid`, `user`): `Promise`\<`void`\>

Defined in: [services/user.service.ts:100](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/user.service.ts#L100)

#### Parameters

##### uid

`string`

Identificador único de usuario procedente del registro en Firebase Authentication.

##### user

[`User`](../interfaces/User.md)

Instancia de datos estructurada con el modelo de la entidad de usuario.

#### Returns

`Promise`\<`void`\>

Promesa asíncrona de resolución de inserción.

#### Method

create

#### Description

Persiste por primera vez un documento de usuario estructurado dentro de la colección core `/users`.

***

### deactivateUser()

> **deactivateUser**(`uid`, `adminUid`, `motivo`): `Promise`\<`any`\>

Defined in: [services/user.service.ts:293](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/user.service.ts#L293)

#### Parameters

##### uid

`string`

UID del usuario que se pretende dar de baja.

##### adminUid

`string`

UID del directivo o administrador autenticado solicitante.

##### motivo

`string`

Texto descriptivo argumentando la razón física o justificación de la desactivación.

#### Returns

`Promise`\<`any`\>

Promesa asíncrona con el veredicto del servidor rematado por Node.js 24.

#### Method

deactivateUser

#### Description

Invoca de forma remota la Cloud Function serverless encargada de tramitar la baja de una cuenta.
El backend procesa las marcas administrativas e inhabilita las credenciales de sesión en la nube.

***

### delete()

> **delete**(`uid`): `Promise`\<`void`\>

Defined in: [services/user.service.ts:316](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/user.service.ts#L316)

#### Parameters

##### uid

`string`

UID del documento que se eliminará por completo de la colección principal.

#### Returns

`Promise`\<`void`\>

Promesa de resolución destructiva.

#### Method

delete

#### Description

Ejecuta de forma fulminante la destrucción física permanente de un documento de usuario en la base de datos NoSQL.

***

### existeNumeroSocio()

> **existeNumeroSocio**(`numero`, `excluirUid?`): `Promise`\<`boolean`\>

Defined in: [services/user.service.ts:72](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/user.service.ts#L72)

#### Parameters

##### numero

`string`

Cadena de texto correspondiente al número de socio que se pretende verificar.

##### excluirUid?

`string`

UID opcional del usuario en edición para omitir en la evaluación.

#### Returns

`Promise`\<`boolean`\>

Promesa asíncrona que resuelve a true si el número de socio ya se encuentra registrado.

#### Method

existeNumeroSocio

#### Description

Consulta en caliente en la base de datos la existencia de un número de socio asignado para evitar colisiones.
Permite inyectar de forma opcional un UID de exclusión para no autocollisionar durante flujos de edición.

***

### existsByEmail()

> **existsByEmail**(`email`): `Promise`\<`any`\>

Defined in: [services/user.service.ts:350](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/user.service.ts#L350)

#### Parameters

##### email

`string`

Cadena de texto correspondiente al correo electrónico que se pretende verificar.

#### Returns

`Promise`\<`any`\>

Promesa asíncrona con el descriptor de existencia y datos adjuntos.

#### Method

existsByEmail

#### Description

Ejecuta un escaneo indexado y normalizado en minúsculas en Firestore para verificar duplicidades de correos electrónicos.
Retorna un objeto descriptor con el origen de la cuenta y sus datos en caso de coincidencia positiva.

***

### generarUUID()

> **generarUUID**(): `string`

Defined in: [services/user.service.ts:60](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/user.service.ts#L60)

#### Returns

`string`

Cadena alfanumérica única resultante.

#### Method

generarUUID

#### Description

💡 CENTRALIZACIÓN UTALITARIA: Genera una cadena identificativa única de tipo UUID V4
para la asignación estable de IDs de documentos en operaciones del chasis de soporte y flujos multimedia.

***

### getAll()

> **getAll**(): `Promise`\<[`User`](../interfaces/User.md)[]\>

Defined in: [services/user.service.ts:111](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/user.service.ts#L111)

#### Returns

`Promise`\<[`User`](../interfaces/User.md)[]\>

Promesa que resuelve un array indexado con todos los usuarios registrados.

#### Method

getAll

#### Description

Descarga el directorio completo sin filtros de la colección de usuarios del club.
Uso exclusivo para tareas críticas administrativas de auditoría.

***

### getApprovedUsers()

> **getApprovedUsers**(): `Promise`\<[`User`](../interfaces/User.md)[]\>

Defined in: [services/user.service.ts:125](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/user.service.ts#L125)

#### Returns

`Promise`\<[`User`](../interfaces/User.md)[]\>

Promesa asíncrona que resuelve el catálogo de socios y usuarios activos.

#### Method

getApprovedUsers

#### Description

Recupera mediante una consulta indexada del servidor a todos los usuarios en estado oficial 'active'.

***

### getById()

> **getById**(`uid`): `Promise`\<[`User`](../interfaces/User.md)\>

Defined in: [services/user.service.ts:235](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/user.service.ts#L235)

#### Parameters

##### uid

`string`

Identificador único del documento solicitado.

#### Returns

`Promise`\<[`User`](../interfaces/User.md)\>

Promesa asíncrona con el objeto de datos del usuario o null si no se localiza en la base de datos.

#### Method

getById

#### Description

Busca de forma unívoca un documento de usuario en la base de datos según su UID físico.

***

### getInactiveUsers()

> **getInactiveUsers**(): `Promise`\<[`User`](../interfaces/User.md)[]\>

Defined in: [services/user.service.ts:184](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/user.service.ts#L184)

#### Returns

`Promise`\<[`User`](../interfaces/User.md)[]\>

Promesa asíncrona con el listado de usuarios inactivos.

#### Method

getInactiveUsers

#### Description

Recupera mediante consulta indexada del servidor el histórico total de bajas lógicas aplicadas.

***

### getPendingUsers()

> **getPendingUsers**(): `Promise`\<[`User`](../interfaces/User.md)[]\>

Defined in: [services/user.service.ts:199](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/user.service.ts#L199)

#### Returns

`Promise`\<[`User`](../interfaces/User.md)[]\>

Promesa asíncrona con el array de usuarios pendientes de aprobación por la directiva.

#### Method

getPendingUsers

#### Description

Descarga de forma asíncrona las solicitudes de pre-alta procedentes de invitaciones web completadas.

***

### getSociosActivosParaMantenimiento()

> **getSociosActivosParaMantenimiento**(): `Promise`\<[`User`](../interfaces/User.md)[]\>

Defined in: [services/user.service.ts:215](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/user.service.ts#L215)

#### Returns

`Promise`\<[`User`](../interfaces/User.md)[]\>

Promesa asíncrona con el listado financiero filtrado.

#### Method

getSociosActivosParaMantenimiento

#### Description

💡 CENTRALIZACIÓN OPERATIVA: Recupera mediante filtros en el servidor exclusivamente a los miembros
de la masa social activos (Roles socio y directiva) sujetos al abono de cuotas para el panel masivo de tesorería.

***

### getUsersForSocioComun()

> **getUsersForSocioComun**(): `Promise`\<[`User`](../interfaces/User.md)[]\>

Defined in: [services/user.service.ts:143](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/user.service.ts#L143)

#### Returns

`Promise`\<[`User`](../interfaces/User.md)[]\>

Catálogo de socios sanitizado y seguro.

#### Method

getUsersForSocioComun

#### Description

🛡️ PRIVACIDAD BLINDADA (RGPD): Descarga el censo de socios activos autorizado.
Aplica un filtrado sanitario riguroso en el servicio: si un miembro tiene desactivadas las opciones
'publicarTelefono' o 'publicarEmail', sus datos privados son destruidos antes de retornar el array,
impidiendo fugas de información a través del árbol de memoria del cliente.

***

### reactivateUser()

> **reactivateUser**(`uid`, `adminUid`): `Promise`\<`any`\>

Defined in: [services/user.service.ts:305](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/user.service.ts#L305)

#### Parameters

##### uid

`string`

UID del usuario suspendido que va a restaurarse a estado activo.

##### adminUid

`string`

UID del administrador autorizador.

#### Returns

`Promise`\<`any`\>

Promesa de retorno asíncrona de la función serverless.

#### Method

reactivateUser

#### Description

Despierta de forma reactiva una cuenta desactivada o bloqueada invocando la Cloud Function correspondiente.

***

### rejectUser()

> **rejectUser**(`uid`): `Promise`\<`void`\>

Defined in: [services/user.service.ts:338](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/user.service.ts#L338)

#### Parameters

##### uid

`string`

UID del usuario aspirante rechazado.

#### Returns

`Promise`\<`void`\>

Promesa asíncrona de actualización del estado lógico.

#### Method

rejectUser

#### Description

Aplica una actualización directa modificando el estado del usuario a 'rejected', denegando su onboarding.

***

### requestUserApproval()

> **requestUserApproval**(`data?`): `Promise`\<`any`\>

Defined in: [services/user.service.ts:372](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/user.service.ts#L372)

#### Parameters

##### data?

`any`

Payload o argumentos complementarios requeridos por la Cloud Function serverless.

#### Returns

`Promise`\<`any`\>

Promesa asíncrona de resolución del entorno Functions.

#### Method

requestUserApproval

#### Description

Despacha una solicitud estructurada de aprobación hacia el trigger en la nube para notificar a los teléfonos de la directiva.

***

### solicitarBajaVoluntariaCuenta()

> **solicitarBajaVoluntariaCuenta**(`uid`): `Promise`\<`void`\>

Defined in: [services/user.service.ts:385](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/user.service.ts#L385)

#### Parameters

##### uid

`string`

UID único del usuario que solicita la eliminación de su cuenta.

#### Returns

`Promise`\<`void`\>

#### Method

solicitarBajaVoluntariaCuenta

#### Description

🛡️ CUMPLIMIENTO LEGAL & CONTROL DE TESORERÍA: Permite tramitar la baja voluntaria.
Aplica un bloqueo de seguridad si el socio o directiva presenta deudas pendientes con el club.
Si es solvente, pasa su estado a 'inactive' y purga de inmediato toda su información personal (PII).

#### Throws

Lanza una excepción controlada si el socio debe la cuota anual.

***

### update()

> **update**(`uid`, `data`): `Promise`\<`void`\>

Defined in: [services/user.service.ts:279](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/user.service.ts#L279)

#### Parameters

##### uid

`string`

UID del documento destino.

##### data

`any`

JSON plano con las parejas clave-valor destinadas a impactar el registro.

#### Returns

`Promise`\<`void`\>

Promesa asíncrona de finalización.

#### Method

update

#### Description

Método genérico intermedio para mutaciones abstractas controladas sobre el documento de usuario.

***

### updatePersonalData()

> **updatePersonalData**(`uid`, `data`): `Promise`\<`void`\>

Defined in: [services/user.service.ts:254](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/user.service.ts#L254)

#### Parameters

##### uid

`string`

UID único del usuario que sufre la modificación.

##### data

[`UpdatePersonalDataRequest`](../interfaces/UpdatePersonalDataRequest.md)

Payload tipado con las mutaciones de datos autorizadas del formulario.

#### Returns

`Promise`\<`void`\>

Promesa asíncrona de persistencia.

#### Method

updatePersonalData

#### Description

Modifica de forma quirúrgica los campos de datos de carácter personal civiles y flags de privacidad.
