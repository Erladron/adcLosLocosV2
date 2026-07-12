[**adcLosLocosV2**](../../../../../../README.md)

***

[adcLosLocosV2](../../../../../../README.md) / [features/events/pages/events/events.page](../README.md) / EventsPage

# Class: EventsPage

Defined in: [src/app/features/events/pages/events/events.page.ts:66](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/events/pages/events/events.page.ts#L66)

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

Defined in: [src/app/features/events/pages/events/events.page.ts:105](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/events/pages/events/events.page.ts#L105)

#### Returns

`EventsPage`

#### Description

Inicializa la iconografía atómica integrada de la peña.

## Properties

### currentFilter

> **currentFilter**: `string` = `'todos'`

Defined in: [src/app/features/events/pages/events/events.page.ts:92](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/events/pages/events/events.page.ts#L92)

***

### currentUserId

> **currentUserId**: `string` = `null`

Defined in: [src/app/features/events/pages/events/events.page.ts:97](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/events/pages/events/events.page.ts#L97)

***

### estadoTraduccion

> **estadoTraduccion**: `Record`\<`EventStatus`, `string`\> = `EVENT_STATUS_ES`

Defined in: [src/app/features/events/pages/events/events.page.ts:84](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/events/pages/events/events.page.ts#L84)

***

### events$

> **events$**: `Observable`\<`AppEvent`[]\>

Defined in: [src/app/features/events/pages/events/events.page.ts:86](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/events/pages/events/events.page.ts#L86)

***

### filteredEvents$

> **filteredEvents$**: `Observable`\<`AppEvent`[]\>

Defined in: [src/app/features/events/pages/events/events.page.ts:87](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/events/pages/events/events.page.ts#L87)

***

### highlightedDates

> **highlightedDates**: `any`[] = `[]`

Defined in: [src/app/features/events/pages/events/events.page.ts:94](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/events/pages/events/events.page.ts#L94)

***

### isAdmin

> **isAdmin**: `boolean` = `false`

Defined in: [src/app/features/events/pages/events/events.page.ts:96](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/events/pages/events/events.page.ts#L96)

***

### selectedDate

> **selectedDate**: `string`

Defined in: [src/app/features/events/pages/events/events.page.ts:93](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/events/pages/events/events.page.ts#L93)

***

### userAttendances

> **userAttendances**: `object` = `{}`

Defined in: [src/app/features/events/pages/events/events.page.ts:98](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/events/pages/events/events.page.ts#L98)

#### Index Signature

\[`eventId`: `string`\]: `"going"` \| `"not_going"` \| `"waitlist"` \| `"none"`

## Methods

### confirmAttendance()

> **confirmAttendance**(`eventId`, `event`): `Promise`\<`void`\>

Defined in: [src/app/features/events/pages/events/events.page.ts:317](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/events/pages/events/events.page.ts#L317)

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

Defined in: [src/app/features/events/pages/events/events.page.ts:338](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/events/pages/events/events.page.ts#L338)

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

### getIconForType()

> **getIconForType**(`type`): `string`

Defined in: [src/app/features/events/pages/events/events.page.ts:358](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/events/pages/events/events.page.ts#L358)

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

Defined in: [src/app/features/events/pages/events/events.page.ts:130](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/events/pages/events/events.page.ts#L130)

#### Returns

`void`

#### Method

ionViewWillEnter

#### Description

Ciclo de vida nativo de Ionic. Abre y acopla el canal de datos reactivos (onSnapshot).

***

### ionViewWillLeave()

> **ionViewWillLeave**(): `void`

Defined in: [src/app/features/events/pages/events/events.page.ts:141](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/events/pages/events/events.page.ts#L141)

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

Defined in: [src/app/features/events/pages/events/events.page.ts:304](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/events/pages/events/events.page.ts#L304)

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

Defined in: [src/app/features/events/pages/events/events.page.ts:284](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/events/pages/events/events.page.ts#L284)

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

Defined in: [src/app/features/events/pages/events/events.page.ts:294](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/events/pages/events/events.page.ts#L294)

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

Defined in: [src/app/features/events/pages/events/events.page.ts:153](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/events/pages/events/events.page.ts#L153)

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

Defined in: [src/app/features/events/pages/events/events.page.ts:118](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/events/pages/events/events.page.ts#L118)

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

Defined in: [src/app/features/events/pages/events/events.page.ts:239](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/events/pages/events/events.page.ts#L239)

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

Defined in: [src/app/features/events/pages/events/events.page.ts:250](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/events/pages/events/events.page.ts#L250)

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
