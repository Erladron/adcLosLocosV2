[**shared-core**](../README.md)

***

[shared-core](../README.md) / FairAccess

# Interface: FairAccess

Defined in: [models/events.models.ts:115](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/events.models.ts#L115)

FairAccess

## Description

Credencial digital inmutable y pase QR analizado por las porterías en la colección `/fair-access`.

## Extended by

- [`PaseUniversal`](PaseUniversal.md)

## Properties

### createdAt

> **createdAt**: `string`

Defined in: [models/events.models.ts:133](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/events.models.ts#L133)

#### Description

Timestamp de expedición de la credencial.

***

### date

> **date**: `string`

Defined in: [models/events.models.ts:129](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/events.models.ts#L129)

#### Description

Código identificativo o fecha del pase (ej: "FERIA-2026").

***

### eventId

> **eventId**: `string`

Defined in: [models/events.models.ts:135](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/events.models.ts#L135)

#### Description

ID único del evento ferial o convocatoria de adscripción.

***

### hostId

> **hostId**: `string`

Defined in: [models/events.models.ts:125](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/events.models.ts#L125)

#### Description

UID del socio anfitrión (null si se trata del carnet propio del socio).

***

### id

> **id**: `string`

Defined in: [models/events.models.ts:117](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/events.models.ts#L117)

#### Description

ID único del pase (coincide con el payload encriptado/leído del código QR).

***

### invitedByName

> **invitedByName**: `string`

Defined in: [models/events.models.ts:127](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/events.models.ts#L127)

#### Description

Nombre completo del socio que emite e invita al tercero externo.

***

### scans

> **scans**: `object`[]

Defined in: [models/events.models.ts:138](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/events.models.ts#L138)

#### gatekeeperUid

> **gatekeeperUid**: `string`

#### scannedAt

> **scannedAt**: `string`

#### Description

Historial de picajes cronológicos para auditoría de aforo dinámico en puerta.

***

### status

> **status**: [`FairAccessStatus`](../enumerations/FairAccessStatus.md)

Defined in: [models/events.models.ts:131](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/events.models.ts#L131)

#### Description

Sello o bandera del estado de la credencial utilizando el enumerado oficial.

***

### userId

> **userId**: `string`

Defined in: [models/events.models.ts:119](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/events.models.ts#L119)

#### Description

UID del socio titular o beneficiario del pase.

***

### userName

> **userName**: `string`

Defined in: [models/events.models.ts:121](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/events.models.ts#L121)

#### Description

Nombre completo visible en la interfaz del terminal de portería al escanear.

***

### userType

> **userType**: `string`

Defined in: [models/events.models.ts:123](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/events.models.ts#L123)

#### Description

Rol de acceso del usuario para control visual rápido en puerta.
