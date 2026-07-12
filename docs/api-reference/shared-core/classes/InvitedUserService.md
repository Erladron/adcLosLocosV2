[**shared-core**](../README.md)

***

[shared-core](../README.md) / InvitedUserService

# Class: InvitedUserService

Defined in: [services/invited-user.service.ts:23](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/invited-user.service.ts#L23)

InvitedUserService

## Description

Servicio de infraestructura encargado de administrar las credenciales de siembra,
expedición de invitaciones de la Junta y canjes automáticos de tokens durante el onboarding.

## Constructors

### Constructor

> **new InvitedUserService**(): `InvitedUserService`

Defined in: [services/invited-user.service.ts:32](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/invited-user.service.ts#L32)

#### Returns

`InvitedUserService`

#### Description

Inicializa el servicio de gestión de pre-altas.

## Methods

### createInvitation()

> **createInvitation**(`invitation`): `Promise`\<`any`\>

Defined in: [services/invited-user.service.ts:40](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/invited-user.service.ts#L40)

#### Parameters

##### invitation

[`InvitedUser`](../interfaces/InvitedUser.md)

Payload estructural con los datos civiles del aspirante autorizados por la directiva.

#### Returns

`Promise`\<`any`\>

Referencia del documento generado en la base NoSQL.

#### Method

createInvitation

#### Description

Registra un nuevo token de pre-alta web en la colección del servidor adjudicándole marcas de tiempo nativas.

***

### getInvitationByEmail()

> **getInvitationByEmail**(`email`): `Promise`\<[`InvitedUser`](../interfaces/InvitedUser.md)\>

Defined in: [services/invited-user.service.ts:56](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/invited-user.service.ts#L56)

#### Parameters

##### email

`string`

Dirección de correo electrónico sujeta a escrutinio.

#### Returns

`Promise`\<[`InvitedUser`](../interfaces/InvitedUser.md)\>

Instancia del modelo tipado o null si no consta autorización previa.

#### Method

getInvitationByEmail

#### Description

Localiza el documento de siembra de un aspirante mediante su correo electrónico normalizado.

***

### isValidInvitation()

> **isValidInvitation**(`email`): `Promise`\<`boolean`\>

Defined in: [services/invited-user.service.ts:86](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/invited-user.service.ts#L86)

#### Parameters

##### email

`string`

Dirección de correo electrónico.

#### Returns

`Promise`\<`boolean`\>

True si el token existe y no ha sido canjeado aún por otra cuenta.

#### Method

isValidInvitation

#### Description

Evaluación perimetral rápida que confirma si un email posee un token apto para el registro.

***

### markAsUsed()

> **markAsUsed**(`invitationId`, `uid`): `Promise`\<`void`\>

Defined in: [services/invited-user.service.ts:103](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/invited-user.service.ts#L103)

#### Parameters

##### invitationId

`string`

ID del documento de la invitación en Firestore.

##### uid

`string`

UID definitivo generado por Firebase Authentication para el nuevo miembro.

#### Returns

`Promise`\<`void`\>

#### Method

markAsUsed

#### Description

Quema transaccionalmente un token de invitación asociándolo de forma inmutable al UID del socio recién registrado.
