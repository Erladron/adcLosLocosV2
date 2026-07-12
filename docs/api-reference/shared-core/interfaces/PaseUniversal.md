[**shared-core**](../README.md)

***

[shared-core](../README.md) / PaseUniversal

# Interface: PaseUniversal

Defined in: [services/fair.service.ts:31](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/fair.service.ts#L31)

PaseUniversal

## Description

Extensión profesional del contrato base FairAccess para dar soporte estricto 
a la validez temporal multi-día de los pases en la caseta ferial.

## Extends

- [`FairAccess`](FairAccess.md)

## Properties

### createdAt

> **createdAt**: `string`

Defined in: [models/events.models.ts:133](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/events.models.ts#L133)

#### Description

Timestamp de expedición de la credencial.

#### Inherited from

[`FairAccess`](FairAccess.md).[`createdAt`](FairAccess.md#createdat)

***

### date

> **date**: `string`

Defined in: [models/events.models.ts:129](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/events.models.ts#L129)

#### Description

Código identificativo o fecha del pase (ej: "FERIA-2026").

#### Inherited from

[`FairAccess`](FairAccess.md).[`date`](FairAccess.md#date)

***

### dateEnd

> **dateEnd**: `string`

Defined in: [services/fair.service.ts:33](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/fair.service.ts#L33)

***

### dateStart

> **dateStart**: `string`

Defined in: [services/fair.service.ts:32](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/fair.service.ts#L32)

***

### eventId

> **eventId**: `string`

Defined in: [models/events.models.ts:135](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/events.models.ts#L135)

#### Description

ID único del evento ferial o convocatoria de adscripción.

#### Inherited from

[`FairAccess`](FairAccess.md).[`eventId`](FairAccess.md#eventid)

***

### hostId

> **hostId**: `string`

Defined in: [models/events.models.ts:125](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/events.models.ts#L125)

#### Description

UID del socio anfitrión (null si se trata del carnet propio del socio).

#### Inherited from

[`FairAccess`](FairAccess.md).[`hostId`](FairAccess.md#hostid)

***

### id

> **id**: `string`

Defined in: [models/events.models.ts:117](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/events.models.ts#L117)

#### Description

ID único del pase (coincide con el payload encriptado/leído del código QR).

#### Inherited from

[`FairAccess`](FairAccess.md).[`id`](FairAccess.md#id)

***

### invitedByName

> **invitedByName**: `string`

Defined in: [models/events.models.ts:127](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/events.models.ts#L127)

#### Description

Nombre completo del socio que emite e invita al tercero externo.

#### Inherited from

[`FairAccess`](FairAccess.md).[`invitedByName`](FairAccess.md#invitedbyname)

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

#### Inherited from

[`FairAccess`](FairAccess.md).[`scans`](FairAccess.md#scans)

***

### status

> **status**: [`FairAccessStatus`](../enumerations/FairAccessStatus.md)

Defined in: [models/events.models.ts:131](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/events.models.ts#L131)

#### Description

Sello o bandera del estado de la credencial utilizando el enumerado oficial.

#### Inherited from

[`FairAccess`](FairAccess.md).[`status`](FairAccess.md#status)

***

### userId

> **userId**: `string`

Defined in: [models/events.models.ts:119](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/events.models.ts#L119)

#### Description

UID del socio titular o beneficiario del pase.

#### Inherited from

[`FairAccess`](FairAccess.md).[`userId`](FairAccess.md#userid)

***

### userName

> **userName**: `string`

Defined in: [models/events.models.ts:121](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/events.models.ts#L121)

#### Description

Nombre completo visible en la interfaz del terminal de portería al escanear.

#### Inherited from

[`FairAccess`](FairAccess.md).[`userName`](FairAccess.md#username)

***

### userType

> **userType**: `string`

Defined in: [models/events.models.ts:123](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/events.models.ts#L123)

#### Description

Rol de acceso del usuario para control visual rápido en puerta.

#### Inherited from

[`FairAccess`](FairAccess.md).[`userType`](FairAccess.md#usertype)
