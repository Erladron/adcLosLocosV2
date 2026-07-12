[**shared-core**](../README.md)

***

[shared-core](../README.md) / CreateUserRequest

# Interface: CreateUserRequest

Defined in: [models/user-detail.model.ts:111](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/user-detail.model.ts#L111)

CreateUserRequest

## Description

Payload estructurado para la invocación del alta manual y bypass de invitación de la junta.

## Properties

### direccion?

> `optional` **direccion?**: `string`

Defined in: [models/user-detail.model.ts:128](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/user-detail.model.ts#L128)

#### Description

Dirección postal de residencia (Opcional).

***

### dni?

> `optional` **dni?**: `string`

Defined in: [models/user-detail.model.ts:125](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/user-detail.model.ts#L125)

#### Description

Documento Nacional de Identidad (Opcional).

***

### email

> **email**: `string`

Defined in: [models/user-detail.model.ts:116](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/user-detail.model.ts#L116)

#### Description

Email único de acceso y notificaciones push.

***

### empresa?

> `optional` **empresa?**: `string`

Defined in: [models/user-detail.model.ts:134](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/user-detail.model.ts#L134)

#### Description

Empresa de seguridad vinculada (Opcional).

***

### foto?

> `optional` **foto?**: `string`

Defined in: [models/user-detail.model.ts:131](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/user-detail.model.ts#L131)

#### Description

Foto inicial en string Base64 (Opcional).

***

### nombre

> **nombre**: `string`

Defined in: [models/user-detail.model.ts:113](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/user-detail.model.ts#L113)

#### Description

Nombre completo normalizado.

***

### numeroSocio?

> `optional` **numeroSocio?**: `string`

Defined in: [models/user-detail.model.ts:140](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/user-detail.model.ts#L140)

#### Description

Número identificativo de socio formalizado en el libro del club (Opcional).

***

### password

> **password**: `string`

Defined in: [models/user-detail.model.ts:119](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/user-detail.model.ts#L119)

#### Description

Contraseña provisional plana asignada por el directivo.

***

### telefono?

> `optional` **telefono?**: `string`

Defined in: [models/user-detail.model.ts:122](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/user-detail.model.ts#L122)

#### Description

Teléfono de contacto (Opcional).

***

### tipo

> **tipo**: [`UserRole`](../enumerations/UserRole.md)

Defined in: [models/user-detail.model.ts:137](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/user-detail.model.ts#L137)

#### Description

Rango asignado de la peña.
