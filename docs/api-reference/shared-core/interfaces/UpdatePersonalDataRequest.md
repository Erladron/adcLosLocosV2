[**shared-core**](../README.md)

***

[shared-core](../README.md) / UpdatePersonalDataRequest

# Interface: UpdatePersonalDataRequest

Defined in: [models/update-personal-data-request.model.ts:9](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/update-personal-data-request.model.ts#L9)

UpdatePersonalDataRequest

## Description

Petición estructurada (DTO) para la mutación y actualización del perfil de datos personales.
Se utiliza de forma exclusiva en los flujos de "Complete Profile" (onboarding post-registro web) y en la edición civil ordinaria de la cuenta.
Aligera el payload aislando los campos editables de los parámetros inmutables de administración (roles, cuotas, números de socio).

## Properties

### detallesDireccion?

> `optional` **detallesDireccion?**: `string`

Defined in: [models/update-personal-data-request.model.ts:24](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/update-personal-data-request.model.ts#L24)

#### Description

Información habitacional secundaria u opcional (Piso, Puerta, Letra, Bloque).

***

### direccion

> **direccion**: `string`

Defined in: [models/update-personal-data-request.model.ts:21](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/update-personal-data-request.model.ts#L21)

#### Description

Dirección postal principal de residencia.

***

### dni

> **dni**: `string`

Defined in: [models/update-personal-data-request.model.ts:18](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/update-personal-data-request.model.ts#L18)

#### Description

Documento Nacional de Identidad (DNI/NIE) para el libro oficial de registro del club.

***

### estado?

> `optional` **estado?**: [`UserStatus`](../enumerations/UserStatus.md)

Defined in: [models/update-personal-data-request.model.ts:47](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/update-personal-data-request.model.ts#L47)

#### Description

Estado operativo del usuario. Se usa para transicionar automáticamente de PENDING_DATA a PENDING_APPROVAL.

***

### foto

> **foto**: `string`

Defined in: [models/update-personal-data-request.model.ts:27](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/update-personal-data-request.model.ts#L27)

#### Description

Cadena de caracteres con la URL de descarga de Storage o el string binario Base64 de la foto de perfil.

***

### nombre

> **nombre**: `string`

Defined in: [models/update-personal-data-request.model.ts:12](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/update-personal-data-request.model.ts#L12)

#### Description

Nombre completo del socio (normalizado en PascalCase por el orquestador de datos).

***

### profesion?

> `optional` **profesion?**: `string`

Defined in: [models/update-personal-data-request.model.ts:30](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/update-personal-data-request.model.ts#L30)

#### Description

Profesión, sector u ocupación laboral activa del socio (Opcional).

***

### publicarEmail

> **publicarEmail**: `boolean`

Defined in: [models/update-personal-data-request.model.ts:40](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/update-personal-data-request.model.ts#L40)

#### Description

Permiso explícito del usuario para exponer públicamente su email en el directorio de la peña.

***

### publicarTelefono

> **publicarTelefono**: `boolean`

Defined in: [models/update-personal-data-request.model.ts:37](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/update-personal-data-request.model.ts#L37)

#### Description

Permiso explícito del usuario para exponer públicamente su teléfono en el directorio de la peña.

***

### telefono

> **telefono**: `string`

Defined in: [models/update-personal-data-request.model.ts:15](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/update-personal-data-request.model.ts#L15)

#### Description

Teléfono móvil o fijo de contacto.
