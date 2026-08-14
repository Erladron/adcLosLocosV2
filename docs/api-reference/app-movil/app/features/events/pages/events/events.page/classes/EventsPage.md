[**adcLosLocosV2**](../../../../../../../index.md)

***

[adcLosLocosV2](../../../../../../../index.md) / [app/features/events/pages/events/events.page](../index.md) / EventsPage

# Class: EventsPage

Defined in: [src/app/features/events/pages/events/events.page.ts:66](https://github.com/Erladron/adcLosLocosV2/blob/ef8b35066458446779d596c924480fd02bae169f/src/app/features/events/pages/events/events.page.ts#L66)

EventsPage

## Description

Pantalla unificada premium encargada de acoplar un calendario de navegación interactivo
con el catálogo dinámico de tarjetas de eventos en tiempo real (onSnapshot).

## Implements

- `OnInit`
- `OnDestroy`

## Constructors

### Constructor

> **new EventsPage**(): `EventsPage`

Defined in: [src/app/features/events/pages/events/events.page.ts:105](https://github.com/Erladron/adcLosLocosV2/blob/ef8b35066458446779d596c924480fd02bae169f/src/app/features/events/pages/events/events.page.ts#L105)

#### Returns

`EventsPage`

#### Description

Inicializa la iconografía atómica integrada de la peña.

## Properties

### currentFilter

> **currentFilter**: `string` = `'todos'`

Defined in: [src/app/features/events/pages/events/events.page.ts:92](https://github.com/Erladron/adcLosLocosV2/blob/ef8b35066458446779d596c924480fd02bae169f/src/app/features/events/pages/events/events.page.ts#L92)

***

### currentUserId

> **currentUserId**: `string` = `null`

Defined in: [src/app/features/events/pages/events/events.page.ts:97](https://github.com/Erladron/adcLosLocosV2/blob/ef8b35066458446779d596c924480fd02bae169f/src/app/features/events/pages/events/events.page.ts#L97)

***

### estadoTraduccion

> **estadoTraduccion**: `Record`\<`EventStatus`, `string`\> = `EVENT_STATUS_ES`

Defined in: [src/app/features/events/pages/events/events.page.ts:84](https://github.com/Erladron/adcLosLocosV2/blob/ef8b35066458446779d596c924480fd02bae169f/src/app/features/events/pages/events/events.page.ts#L84)

***

### events$

> **events$**: `Observable`\<`AppEvent`[]\>

Defined in: [src/app/features/events/pages/events/events.page.ts:86](https://github.com/Erladron/adcLosLocosV2/blob/ef8b35066458446779d596c924480fd02bae169f/src/app/features/events/pages/events/events.page.ts#L86)

***

### filteredEvents$

> **filteredEvents$**: `Observable`\<`AppEvent`[]\>

Defined in: [src/app/features/events/pages/events/events.page.ts:87](https://github.com/Erladron/adcLosLocosV2/blob/ef8b35066458446779d596c924480fd02bae169f/src/app/features/events/pages/events/events.page.ts#L87)

***

### highlightedDates

> **highlightedDates**: `any`[] = `[]`

Defined in: [src/app/features/events/pages/events/events.page.ts:94](https://github.com/Erladron/adcLosLocosV2/blob/ef8b35066458446779d596c924480fd02bae169f/src/app/features/events/pages/events/events.page.ts#L94)

***

### isAdmin

> **isAdmin**: `boolean` = `false`

Defined in: [src/app/features/events/pages/events/events.page.ts:96](https://github.com/Erladron/adcLosLocosV2/blob/ef8b35066458446779d596c924480fd02bae169f/src/app/features/events/pages/events/events.page.ts#L96)

***

### selectedDate

> **selectedDate**: `string`

Defined in: [src/app/features/events/pages/events/events.page.ts:93](https://github.com/Erladron/adcLosLocosV2/blob/ef8b35066458446779d596c924480fd02bae169f/src/app/features/events/pages/events/events.page.ts#L93)

***

### userAttendances

> **userAttendances**: `object` = `{}`

Defined in: [src/app/features/events/pages/events/events.page.ts:98](https://github.com/Erladron/adcLosLocosV2/blob/ef8b35066458446779d596c924480fd02bae169f/src/app/features/events/pages/events/events.page.ts#L98)

#### Index Signature

\[`eventId`: `string`\]: `"going"` \| `"not_going"` \| `"waitlist"` \| `"none"`

## Methods

### confirmAttendance()

> **confirmAttendance**(`eventId`, `event`): `Promise`\<`void`\>

Defined in: [src/app/features/events/pages/events/events.page.ts:351](https://github.com/Erladron/adcLosLocosV2/blob/ef8b35066458446779d596c924480fd02bae169f/src/app/features/events/pages/events/events.page.ts#L351)

#### Parameters

##### eventId

`string`

Identificador único de la convocatoria.

##### event

`Event`

Evento síncrono del DOM de Ionic utilizado para frenar la propagación de burbujeo (stopPropagation).

#### Returns

`Promise`\<`void`\>

#### Method

confirmAttendance

#### Description

Invoca de forma segura el método transaccional de shared-core para registrar la reserva de plaza.
Al ser reactivo en tiempo real, el incremento de asistentes impactará al instante en el resto de la peña.

***

### declineAttendance()

> **declineAttendance**(`eventId`, `event`): `Promise`\<`void`\>

Defined in: [src/app/features/events/pages/events/events.page.ts:372](https://github.com/Erladron/adcLosLocosV2/blob/ef8b35066458446779d596c924480fd02bae169f/src/app/features/events/pages/events/events.page.ts#L372)

#### Parameters

##### eventId

`string`

Identificador único de la convocatoria.

##### event

`Event`

Evento del DOM de Ionic para frenar la propagación en la tarjeta interactiva.

#### Returns

`Promise`\<`void`\>

#### Method

declineAttendance

#### Description

Invoca el método transaccional para liberar la plaza del socio, anulando simultáneamente su pase digital si procediera.

***

### getEventBgImage()

> **getEventBgImage**(`event`): `string`

Defined in: [src/app/features/events/pages/events/events.page.ts:415](https://github.com/Erladron/adcLosLocosV2/blob/ef8b35066458446779d596c924480fd02bae169f/src/app/features/events/pages/events/events.page.ts#L415)

#### Parameters

##### event

`any`

#### Returns

`string`

#### Method

getEventBgImage

#### Description

Resuelve dinámicamente qué imagen de fondo le toca a la tarjeta del evento[cite: 1].

***

### getIconForType()

> **getIconForType**(`type`): `string`

Defined in: [src/app/features/events/pages/events/events.page.ts:392](https://github.com/Erladron/adcLosLocosV2/blob/ef8b35066458446779d596c924480fd02bae169f/src/app/features/events/pages/events/events.page.ts#L392)

#### Parameters

##### type

`string`

Tipo de modalidad de la convocatoria.

#### Returns

`string`

Nombre unívoco del icono vectorial resultante (ej: 'wine-outline').

#### Method

getIconForType

#### Description

Mapeador utilitario de interfaz encargado de traducir el enumerado tecnológico del evento hacia un string kebab-case de Ionicons.

***

### ionViewWillEnter()

> **ionViewWillEnter**(): `void`

Defined in: [src/app/features/events/pages/events/events.page.ts:131](https://github.com/Erladron/adcLosLocosV2/blob/ef8b35066458446779d596c924480fd02bae169f/src/app/features/events/pages/events/events.page.ts#L131)

#### Returns

`void`

#### Method

ionViewWillEnter

#### Description

Ciclo de vida nativo de Ionic. Abre y acopla el canal de datos reactivos (onSnapshot).

***

### ionViewWillLeave()

> **ionViewWillLeave**(): `void`

Defined in: [src/app/features/events/pages/events/events.page.ts:142](https://github.com/Erladron/adcLosLocosV2/blob/ef8b35066458446779d596c924480fd02bae169f/src/app/features/events/pages/events/events.page.ts#L142)

#### Returns

`void`

#### Method

ionViewWillLeave

#### Description

Ciclo de vida nativo de Ionic. Intercepta la salida de la pantalla para apagar el socket,
anulando lecturas en segundo plano y fugas de memoria indeseadas.

***

### isEventFull()

> **isEventFull**(`event`): `boolean`

Defined in: [src/app/features/events/pages/events/events.page.ts:338](https://github.com/Erladron/adcLosLocosV2/blob/ef8b35066458446779d596c924480fd02bae169f/src/app/features/events/pages/events/events.page.ts#L338)

#### Parameters

##### event

`AppEvent`

Instancia del modelo de datos de la convocatoria sujeta a control de plazas.

#### Returns

`boolean`

True si las reservas igualan o superan la capacidad total autorizada.

#### Method

isEventFull

#### Description

Compara analíticamente si el aforo actual de confirmaciones ha cubierto el cupo máximo configurado.

***

### isUserGoing()

> **isUserGoing**(`eventId`): `boolean`

Defined in: [src/app/features/events/pages/events/events.page.ts:318](https://github.com/Erladron/adcLosLocosV2/blob/ef8b35066458446779d596c924480fd02bae169f/src/app/features/events/pages/events/events.page.ts#L318)

#### Parameters

##### eventId

`string`

Identificador único de la convocatoria NoSQL.

#### Returns

`boolean`

True si el estado del mapa local se corresponde con 'going'.

#### Method

isUserGoing

#### Description

Evalúa de forma síncrona si el socio logueado ha confirmado previamente su asistencia al evento.

***

### isUserNotGoing()

> **isUserNotGoing**(`eventId`): `boolean`

Defined in: [src/app/features/events/pages/events/events.page.ts:328](https://github.com/Erladron/adcLosLocosV2/blob/ef8b35066458446779d596c924480fd02bae169f/src/app/features/events/pages/events/events.page.ts#L328)

#### Parameters

##### eventId

`string`

Identificador único de la convocatoria NoSQL.

#### Returns

`boolean`

True si el estado se corresponde con 'not_going'.

#### Method

isUserNotGoing

#### Description

Evalúa de forma síncrona si el socio ha declinado o marcado como inasistencia el evento.

***

### ngOnDestroy()

> **ngOnDestroy**(): `void`

Defined in: [src/app/features/events/pages/events/events.page.ts:154](https://github.com/Erladron/adcLosLocosV2/blob/ef8b35066458446779d596c924480fd02bae169f/src/app/features/events/pages/events/events.page.ts#L154)

#### Returns

`void`

#### Method

ngOnDestroy

#### Description

Desvincula de forma radical los flujos de control locales y de memoria.

#### Implementation of

`OnDestroy.ngOnDestroy`

***

### ngOnInit()

> **ngOnInit**(): `Promise`\<`void`\>

Defined in: [src/app/features/events/pages/events/events.page.ts:118](https://github.com/Erladron/adcLosLocosV2/blob/ef8b35066458446779d596c924480fd02bae169f/src/app/features/events/pages/events/events.page.ts#L118)

#### Returns

`Promise`\<`void`\>

#### Method

ngOnInit

#### Description

Inicializa la consola maestra validando la sesión del socio o directiva.

#### Implementation of

`OnInit.ngOnInit`

***

### onDateChanged()

> **onDateChanged**(`event`): `void`

Defined in: [src/app/features/events/pages/events/events.page.ts:223](https://github.com/Erladron/adcLosLocosV2/blob/ef8b35066458446779d596c924480fd02bae169f/src/app/features/events/pages/events/events.page.ts#L223)

#### Parameters

##### event

`any`

Parámetros devueltos por el ion-datetime.

#### Returns

`void`

#### Method

onDateChanged

#### Description

Intercepta la selección interactiva de fechas y actualiza el renderizado del listado.

***

### setFilter()

> **setFilter**(`filter`): `void`

Defined in: [src/app/features/events/pages/events/events.page.ts:234](https://github.com/Erladron/adcLosLocosV2/blob/ef8b35066458446779d596c924480fd02bae169f/src/app/features/events/pages/events/events.page.ts#L234)

#### Parameters

##### filter

`any`

Valor del segmento.

#### Returns

`void`

#### Method

setFilter

#### Description

Altera el filtro secundario de categorías (segment).
