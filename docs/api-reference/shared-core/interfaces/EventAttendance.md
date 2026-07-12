[**shared-core**](../README.md)

***

[shared-core](../README.md) / EventAttendance

# Interface: EventAttendance

Defined in: [models/events.models.ts:82](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/events.models.ts#L82)

EventAttendance

## Description

Estructura transaccional de confirmación de asistencia para la subcolección interna `/events/{id}/attendance`.

## Properties

### companions

> **companions**: `number`

Defined in: [models/events.models.ts:94](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/events.models.ts#L94)

#### Description

Número de plazas adicionales añadidas para acompañantes.

***

### eventId

> **eventId**: `string`

Defined in: [models/events.models.ts:86](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/events.models.ts#L86)

#### Description

ID de la convocatoria vinculada.

***

### id

> **id**: `string`

Defined in: [models/events.models.ts:84](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/events.models.ts#L84)

#### Description

ID único del registro (coincide con el UID del socio para evitar colisiones).

***

### paymentMethod?

> `optional` **paymentMethod?**: `"bizum"` \| `"cash"`

Defined in: [models/events.models.ts:96](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/events.models.ts#L96)

#### Description

Pasarela de pago elegida si la convocatoria requiere desembolso.

***

### registeredAt

> **registeredAt**: `string`

Defined in: [models/events.models.ts:98](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/events.models.ts#L98)

#### Description

Timestamp de confirmación del botón de asistencia.

***

### status

> **status**: `"going"` \| `"not_going"` \| `"waitlist"`

Defined in: [models/events.models.ts:90](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/events.models.ts#L90)

#### Description

Veredicto transaccional de asistencia.

***

### userId

> **userId**: `string`

Defined in: [models/events.models.ts:88](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/events.models.ts#L88)

#### Description

UID del socio solicitante.
