[**shared-core**](../README.md)

***

[shared-core](../README.md) / InvitedUser

# Interface: InvitedUser

Defined in: [models/invited-user.model.ts:7](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/invited-user.model.ts#L7)

InvitedUser

## Description

Modelo estructural para los documentos de la colección `/invitedUsers`.
Actúa como un token de pre-alta o "cerrojo de invitación". Ningún usuario externo puede completar 
su registro en la plataforma si su correo electrónico no ha sido sembrado previamente en esta colección por la directiva.

## Properties

### email

> **email**: `string`

Defined in: [models/invited-user.model.ts:19](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/invited-user.model.ts#L19)

#### Description

Correo electrónico unívoco autorizado para el onboarding.

***

### fechaInvitacion

> **fechaInvitacion**: `string` \| `Date` \| \{ `nanoseconds`: `number`; `seconds`: `number`; \}

Defined in: [models/invited-user.model.ts:37](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/invited-user.model.ts#L37)

#### Description

Fecha y hora exacta de expedición del token de invitación.
Soporta Date nativo, String ISO o el mapa estructural Timestamp de Firebase.

***

### fechaRegistro?

> `optional` **fechaRegistro?**: `string` \| `Date` \| \{ `nanoseconds`: `number`; `seconds`: `number`; \}

Defined in: [models/invited-user.model.ts:52](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/invited-user.model.ts#L52)

#### Description

Fecha y hora en la que el usuario consolidó su onboarding en la app.
Soporta Date nativo, String ISO o el mapa estructural Timestamp de Firebase.

***

### id?

> `optional` **id?**: `string`

Defined in: [models/invited-user.model.ts:9](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/invited-user.model.ts#L9)

#### Description

ID único autogenerado del documento en Firestore (coincide habitualmente con el email o un UUID).

***

### invitadoPor

> **invitadoPor**: `string`

Defined in: [models/invited-user.model.ts:29](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/invited-user.model.ts#L29)

#### Description

Nombre del miembro de la Junta Directiva o Administrador que emite la invitación.

***

### invitadoPorUid

> **invitadoPorUid**: `string`

Defined in: [models/invited-user.model.ts:32](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/invited-user.model.ts#L32)

#### Description

UID físico en Firebase Auth del directivo responsable de la emisión.

***

### nombre

> **nombre**: `string`

Defined in: [models/invited-user.model.ts:16](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/invited-user.model.ts#L16)

#### Description

Nombre completo del usuario invitado.

***

### telefono?

> `optional` **telefono?**: `string`

Defined in: [models/invited-user.model.ts:22](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/invited-user.model.ts#L22)

#### Description

Teléfono de contacto opcional del aspirante.

***

### usado

> **usado**: `boolean`

Defined in: [models/invited-user.model.ts:44](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/invited-user.model.ts#L44)

#### Description

Flag lógico; true si el aspirante ya ha consumido este token para completar su registro.

***

### usadoPorUid?

> `optional` **usadoPorUid?**: `string`

Defined in: [models/invited-user.model.ts:47](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/invited-user.model.ts#L47)

#### Description

UID asignado definitivamente al nuevo usuario en Firebase Auth tras canjear la invitación.
