[**shared-core**](../index.md)

***

[shared-core](../index.md) / PasseAccess

# Interface: PasseAccess

Defined in: [models/events.models.ts:114](https://github.com/Erladron/adcLosLocosV2/blob/ef8b35066458446779d596c924480fd02bae169f/projects/shared-core/src/lib/models/events.models.ts#L114)

PasseAccess

## Description

Credencial digital inmutable y pase QR analizado por las porterías en la colección `/event-access`.

## Extended by

- [`PaseUniversal`](PaseUniversal.md)

## Properties

### createdAt

> **createdAt**: `string`

Defined in: [models/events.models.ts:132](https://github.com/Erladron/adcLosLocosV2/blob/ef8b35066458446779d596c924480fd02bae169f/projects/shared-core/src/lib/models/events.models.ts#L132)

#### Description

Timestamp de expedición de la credencial.

***

### date

> **date**: `string`

Defined in: [models/events.models.ts:128](https://github.com/Erladron/adcLosLocosV2/blob/ef8b35066458446779d596c924480fd02bae169f/projects/shared-core/src/lib/models/events.models.ts#L128)

#### Description

Código identificativo o fecha del pase (ej: "FERIA-2026").

***

### eventId

> **eventId**: `string`

Defined in: [models/events.models.ts:134](https://github.com/Erladron/adcLosLocosV2/blob/ef8b35066458446779d596c924480fd02bae169f/projects/shared-core/src/lib/models/events.models.ts#L134)

#### Description

ID único del evento ferial o convocatoria de adscripción.

***

### hostId

> **hostId**: `string`

Defined in: [models/events.models.ts:124](https://github.com/Erladron/adcLosLocosV2/blob/ef8b35066458446779d596c924480fd02bae169f/projects/shared-core/src/lib/models/events.models.ts#L124)

#### Description

UID del socio anfitrión (null si se trata del carnet propio del socio).

***

### id

> **id**: `string`

Defined in: [models/events.models.ts:116](https://github.com/Erladron/adcLosLocosV2/blob/ef8b35066458446779d596c924480fd02bae169f/projects/shared-core/src/lib/models/events.models.ts#L116)

#### Description

ID único del pase (coincide con el payload encriptado/leído del código QR).

***

### invitedByName

> **invitedByName**: `string`

Defined in: [models/events.models.ts:126](https://github.com/Erladron/adcLosLocosV2/blob/ef8b35066458446779d596c924480fd02bae169f/projects/shared-core/src/lib/models/events.models.ts#L126)

#### Description

Nombre completo del socio que emite e invita al tercero externo.

***

### scans

> **scans**: `object`[]

Defined in: [models/events.models.ts:137](https://github.com/Erladron/adcLosLocosV2/blob/ef8b35066458446779d596c924480fd02bae169f/projects/shared-core/src/lib/models/events.models.ts#L137)

#### gatekeeperUid

> **gatekeeperUid**: `string`

#### scannedAt

> **scannedAt**: `string`

#### Description

Historial de picajes cronológicos para auditoría de aforo dinámico en puerta.

***

### status

> **status**: [`PasseAccessStatus`](../enumerations/PasseAccessStatus.md)

Defined in: [models/events.models.ts:130](https://github.com/Erladron/adcLosLocosV2/blob/ef8b35066458446779d596c924480fd02bae169f/projects/shared-core/src/lib/models/events.models.ts#L130)

#### Description

Sello o bandera del estado de la credencial utilizando el enumerado oficial.

***

### userId

> **userId**: `string`

Defined in: [models/events.models.ts:118](https://github.com/Erladron/adcLosLocosV2/blob/ef8b35066458446779d596c924480fd02bae169f/projects/shared-core/src/lib/models/events.models.ts#L118)

#### Description

UID del socio titular o beneficiario del pase.

***

### userName

> **userName**: `string`

Defined in: [models/events.models.ts:120](https://github.com/Erladron/adcLosLocosV2/blob/ef8b35066458446779d596c924480fd02bae169f/projects/shared-core/src/lib/models/events.models.ts#L120)

#### Description

Nombre completo visible en la interfaz del terminal de portería al escanear.

***

### userType

> **userType**: `string`

Defined in: [models/events.models.ts:122](https://github.com/Erladron/adcLosLocosV2/blob/ef8b35066458446779d596c924480fd02bae169f/projects/shared-core/src/lib/models/events.models.ts#L122)

#### Description

Rol de acceso del usuario para control visual rápido en puerta.
