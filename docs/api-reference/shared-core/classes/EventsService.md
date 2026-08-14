[**shared-core**](../index.md)

***

[shared-core](../index.md) / EventsService

# Class: EventsService

Defined in: [services/events.service.ts:32](https://github.com/Erladron/adcLosLocosV2/blob/ef8b35066458446779d596c924480fd02bae169f/projects/shared-core/src/lib/services/events.service.ts#L32)

EventsService

## Description

Servicio core de nivel de infraestructura encargado de la gestión, publicación, 
control de aforos de la agenda de eventos y orquestación de subcolecciones de asistencia.

## Constructors

### Constructor

> **new EventsService**(): `EventsService`

#### Returns

`EventsService`

## Methods

### createEvent()

> **createEvent**(`eventData`): `Promise`\<`string`\>

Defined in: [services/events.service.ts:241](https://github.com/Erladron/adcLosLocosV2/blob/ef8b35066458446779d596c924480fd02bae169f/projects/shared-core/src/lib/services/events.service.ts#L241)

#### Parameters

##### eventData

`Partial`\<[`AppEvent`](../interfaces/AppEvent.md)\>

#### Returns

`Promise`\<`string`\>

#### Method

createEvent

#### Description

Persiste un nuevo documento estructural de evento en la colección principal `/events`.

***

### deleteEvent()

> **deleteEvent**(`event`): `Promise`\<`void`\>

Defined in: [services/events.service.ts:279](https://github.com/Erladron/adcLosLocosV2/blob/ef8b35066458446779d596c924480fd02bae169f/projects/shared-core/src/lib/services/events.service.ts#L279)

#### Parameters

##### event

[`AppEvent`](../interfaces/AppEvent.md)

#### Returns

`Promise`\<`void`\>

#### Method

deleteEvent

#### Description

Elimina físicamente en cascada el evento, sus sub-asistencias y credenciales feriales emitidas.

***

### getEventById()

> **getEventById**(`eventId`): `Observable`\<[`AppEvent`](../interfaces/AppEvent.md)\>

Defined in: [services/events.service.ts:105](https://github.com/Erladron/adcLosLocosV2/blob/ef8b35066458446779d596c924480fd02bae169f/projects/shared-core/src/lib/services/events.service.ts#L105)

#### Parameters

##### eventId

`string`

#### Returns

`Observable`\<[`AppEvent`](../interfaces/AppEvent.md)\>

#### Method

getEventById

#### Description

Recupera los datos de una convocatoria específica mediante Snapshot estático (getDoc).

***

### getEventLive()

> **getEventLive**(`eventId`): `Observable`\<[`AppEvent`](../interfaces/AppEvent.md)\>

Defined in: [services/events.service.ts:304](https://github.com/Erladron/adcLosLocosV2/blob/ef8b35066458446779d596c924480fd02bae169f/projects/shared-core/src/lib/services/events.service.ts#L304)

#### Parameters

##### eventId

`string`

#### Returns

`Observable`\<[`AppEvent`](../interfaces/AppEvent.md)\>

#### Method

getEventLive

#### Description

Inicializa un socket onSnapshot en tiempo real para sincronizar variaciones asíncronas de aforo.

***

### getEvents()

> **getEvents**(): `Observable`\<[`AppEvent`](../interfaces/AppEvent.md)[]\>

Defined in: [services/events.service.ts:81](https://github.com/Erladron/adcLosLocosV2/blob/ef8b35066458446779d596c924480fd02bae169f/projects/shared-core/src/lib/services/events.service.ts#L81)

#### Returns

`Observable`\<[`AppEvent`](../interfaces/AppEvent.md)[]\>

#### Method

getEvents

#### Description

Descarga mediante snapshot directo a un solo golpe la colección completa de eventos del servidor.

***

### getEventsStream()

> **getEventsStream**(`fechaSeleccionada`): `Observable`\<`any`[]\>

Defined in: [services/events.service.ts:329](https://github.com/Erladron/adcLosLocosV2/blob/ef8b35066458446779d596c924480fd02bae169f/projects/shared-core/src/lib/services/events.service.ts#L329)

#### Parameters

##### fechaSeleccionada

`Date`

Fecha del calendario elegida por el usuario.

#### Returns

`Observable`\<`any`[]\>

#### Method

getEventsStream

#### Description

Escucha en tiempo real los eventos que caen dentro del rango del día seleccionado.

***

### getUserAttendanceForEvent()

> **getUserAttendanceForEvent**(`eventId`, `userId`): `Observable`\<[`EventAttendance`](../interfaces/EventAttendance.md)\>

Defined in: [services/events.service.ts:129](https://github.com/Erladron/adcLosLocosV2/blob/ef8b35066458446779d596c924480fd02bae169f/projects/shared-core/src/lib/services/events.service.ts#L129)

#### Parameters

##### eventId

`string`

##### userId

`string`

#### Returns

`Observable`\<[`EventAttendance`](../interfaces/EventAttendance.md)\>

#### Method

getUserAttendanceForEvent

#### Description

Recupera el documento de confirmación individual de asistencia de un socio mediante getDoc.

***

### obtenerPasesActivosLive()

> **obtenerPasesActivosLive**(`userUid`): `Observable`\<`any`[]\>

Defined in: [services/events.service.ts:69](https://github.com/Erladron/adcLosLocosV2/blob/ef8b35066458446779d596c924480fd02bae169f/projects/shared-core/src/lib/services/events.service.ts#L69)

#### Parameters

##### userUid

`string`

#### Returns

`Observable`\<`any`[]\>

#### Method

obtenerPasesActivosLive

#### Description

Escucha en tiempo real la subcolección de pases emitidos vinculados a un usuario.

***

### registerAttendance()

> **registerAttendance**(`eventId`, `userId`, `confirmarAsistencia`): `Promise`\<`void`\>

Defined in: [services/events.service.ts:153](https://github.com/Erladron/adcLosLocosV2/blob/ef8b35066458446779d596c924480fd02bae169f/projects/shared-core/src/lib/services/events.service.ts#L153)

#### Parameters

##### eventId

`string`

ID único del evento en Firestore.

##### userId

`string`

UID del socio o directivo operador.

##### confirmarAsistencia

`boolean`

True si confirma ("Asistiré"), False si revoca plaza ("No iré").

#### Returns

`Promise`\<`void`\>

#### Method

registerAttendance

#### Description

🚀 OPTIMIZACIÓN DE INTEGRIDAD DE NO-REDUNDANCIA: Registra la asistencia del socio de forma transaccional.
Al emitir el pase digital en `event-access`, se eliminan por completo los campos duplicados 'eventTitle' y 'locationName'.
Esto garantiza de forma absoluta que si la junta edita los datos de la convocatoria, las credenciales QR del socio 
no queden desactualizadas, resolviéndose en caliente en las vistas gracias al ID relacional.

***

### updateEvent()

> **updateEvent**(`eventId`, `eventData`): `Promise`\<`void`\>

Defined in: [services/events.service.ts:264](https://github.com/Erladron/adcLosLocosV2/blob/ef8b35066458446779d596c924480fd02bae169f/projects/shared-core/src/lib/services/events.service.ts#L264)

#### Parameters

##### eventId

`string`

##### eventData

`Partial`\<[`AppEvent`](../interfaces/AppEvent.md)\>

#### Returns

`Promise`\<`void`\>

#### Method

updateEvent

#### Description

Modifica campos de texto e imagen de una convocatoria sin interferir en los contadores.
