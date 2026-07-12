[**shared-core**](../README.md)

***

[shared-core](../README.md) / AppEvent

# Interface: AppEvent

Defined in: [models/events.models.ts:27](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/events.models.ts#L27)

AppEvent

## Description

Modelo estructural maestro para los documentos alojados en la colección principal `/events`.

## Properties

### allDay?

> `optional` **allDay?**: `boolean`

Defined in: [models/events.models.ts:45](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/events.models.ts#L45)

#### Description

Flag opcional para delimitar eventos de jornada completa.

***

### attendeeCount

> **attendeeCount**: `number`

Defined in: [models/events.models.ts:67](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/events.models.ts#L67)

#### Description

Contador transaccional de plazas confirmadas en tiempo real.

***

### createdAt

> **createdAt**: `string`

Defined in: [models/events.models.ts:75](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/events.models.ts#L75)

#### Description

Timestamp ISO de creación del documento.

***

### createdBy

> **createdBy**: `string`

Defined in: [models/events.models.ts:73](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/events.models.ts#L73)

#### Description

UID del directivo o administrador instanciador.

***

### description

> **description**: `string`

Defined in: [models/events.models.ts:33](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/events.models.ts#L33)

#### Description

Memoria o descripción pormenorizada de las actividades.

***

### endDate

> **endDate**: `string`

Defined in: [models/events.models.ts:43](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/events.models.ts#L43)

#### Description

Fecha y hora de finalización del evento.

***

### id

> **id**: `string`

Defined in: [models/events.models.ts:29](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/events.models.ts#L29)

#### Description

ID único del documento persistido en Firestore.

***

### imageUrl?

> `optional` **imageUrl?**: `string`

Defined in: [models/events.models.ts:69](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/events.models.ts#L69)

#### Description

URL de descarga del cartel promocional alojado en Firebase Storage.

***

### isPrivate

> **isPrivate**: `boolean`

Defined in: [models/events.models.ts:47](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/events.models.ts#L47)

#### Description

Determina si el evento requiere filtros de visibilidad.

***

### limiteInvitadosPorSocio?

> `optional` **limiteInvitadosPorSocio?**: `number`

Defined in: [models/events.models.ts:52](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/events.models.ts#L52)

#### Description

Límite dinámico regulado de invitaciones feriales externas permitidas por socio.

***

### location

> **location**: `object`

Defined in: [models/events.models.ts:55](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/events.models.ts#L55)

#### address

> **address**: `string`

#### coordinates?

> `optional` **coordinates?**: `object`

##### coordinates.lat

> **lat**: `number`

##### coordinates.lng

> **lng**: `number`

#### name

> **name**: `string`

#### Description

Ubicación geográfica e identidad del emplazamiento estructurado para Mapbox.

***

### maxAttendees?

> `optional` **maxAttendees?**: `number`

Defined in: [models/events.models.ts:65](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/events.models.ts#L65)

#### Description

Capacidad de aforo máximo configurable por la Junta.

***

### requiresAccessControl

> **requiresAccessControl**: `boolean`

Defined in: [models/events.models.ts:49](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/events.models.ts#L49)

#### Description

Flag indicador para el disparo automático de pases QR.

***

### startDate

> **startDate**: `string`

Defined in: [models/events.models.ts:41](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/events.models.ts#L41)

#### Description

Fecha y hora de inicio de la convocatoria.

***

### status

> **status**: [`EventStatus`](../enumerations/EventStatus.md)

Defined in: [models/events.models.ts:37](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/events.models.ts#L37)

#### Description

Estado administrativo del enum EventStatus.

***

### title

> **title**: `string`

Defined in: [models/events.models.ts:31](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/events.models.ts#L31)

#### Description

Título comercializador de la convocatoria.

***

### type

> **type**: [`EventType`](../enumerations/EventType.md)

Defined in: [models/events.models.ts:35](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/events.models.ts#L35)

#### Description

Tipología vinculada del enum EventType.
