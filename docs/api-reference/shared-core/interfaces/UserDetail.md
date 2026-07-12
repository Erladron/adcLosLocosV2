[**shared-core**](../README.md)

***

[shared-core](../README.md) / UserDetail

# Interface: UserDetail

Defined in: [models/user-detail.model.ts:10](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/user-detail.model.ts#L10)

UserDetail

## Description

Modelo de presentación secundario utilizado para mapear la proyección de campos estructurados
en los subformularios de edición y visualización del chasis del detalle.

## Properties

### createdAt?

> `optional` **createdAt?**: `string` \| `Date` \| \{ `nanoseconds`: `number`; `seconds`: `number`; \}

Defined in: [models/user-detail.model.ts:59](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/user-detail.model.ts#L59)

#### Description

Timestamp o fecha de alta inicial en el sistema (Opcional).
🚀 Saneado: Purga absoluta de la importación de Timestamp de Firebase para blindar la abstracción core.

***

### direccion?

> `optional` **direccion?**: `string`

Defined in: [models/user-detail.model.ts:31](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/user-detail.model.ts#L31)

#### Description

Dirección postal de residencia (Opcional).

***

### dni?

> `optional` **dni?**: `string`

Defined in: [models/user-detail.model.ts:28](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/user-detail.model.ts#L28)

#### Description

Documento Nacional de Identidad o NIE (Opcional).

***

### email

> **email**: `string`

Defined in: [models/user-detail.model.ts:22](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/user-detail.model.ts#L22)

#### Description

Correo electrónico principal de acceso.

***

### empresa?

> `optional` **empresa?**: `string`

Defined in: [models/user-detail.model.ts:37](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/user-detail.model.ts#L37)

#### Description

🚀 Empresa de seguridad externa a la que pertenece (Exclusivo para el rol Portero).

***

### foto?

> `optional` **foto?**: `string`

Defined in: [models/user-detail.model.ts:34](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/user-detail.model.ts#L34)

#### Description

URL de descarga o string binario Base64 del avatar de perfil (Opcional).

***

### nombre

> **nombre**: `string`

Defined in: [models/user-detail.model.ts:19](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/user-detail.model.ts#L19)

#### Description

Nombre completo del usuario.

***

### numeroSocio?

> `optional` **numeroSocio?**: `string`

Defined in: [models/user-detail.model.ts:47](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/user-detail.model.ts#L47)

#### Description

Código identificativo único del miembro asignado por la Junta (Opcional).

***

### source?

> `optional` **source?**: `string`

Defined in: [models/user-detail.model.ts:54](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/user-detail.model.ts#L54)

#### Description

Canal de procedencia u origen del alta del registro (ej: 'web', 'manual').

***

### telefono?

> `optional` **telefono?**: `string`

Defined in: [models/user-detail.model.ts:25](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/user-detail.model.ts#L25)

#### Description

Teléfono de contacto (Opcional).

***

### tipo

> **tipo**: [`UserRole`](../enumerations/UserRole.md)

Defined in: [models/user-detail.model.ts:44](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/user-detail.model.ts#L44)

#### Description

Rol o nivel jerárquico asignado en el sistema.

***

### uid

> **uid**: `string`

Defined in: [models/user-detail.model.ts:12](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/user-detail.model.ts#L12)

#### Description

Identificador único universal (UID) del registro de usuario.
