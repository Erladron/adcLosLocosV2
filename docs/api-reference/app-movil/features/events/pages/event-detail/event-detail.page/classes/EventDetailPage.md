[**adcLosLocosV2**](../../../../../../README.md)

***

[adcLosLocosV2](../../../../../../README.md) / [features/events/pages/event-detail/event-detail.page](../README.md) / EventDetailPage

# Class: EventDetailPage

Defined in: [src/app/features/events/pages/event-detail/event-detail.page.ts:86](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/events/pages/event-detail/event-detail.page.ts#L86)

EventDetailPage

## Description

Componente controlador inteligente para la visualización detallada, control de asistencia perimetral
excluyente por cuotas/cronología y consola de administración de eventos de la peña.

## Implements

- `OnInit`
- `OnDestroy`

## Constructors

### Constructor

> **new EventDetailPage**(): `EventDetailPage`

Defined in: [src/app/features/events/pages/event-detail/event-detail.page.ts:138](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/events/pages/event-detail/event-detail.page.ts#L138)

#### Returns

`EventDetailPage`

#### Description

Registra la colección de iconos vectoriales e inicializa el esquema del formulario.

## Properties

### authService

> **authService**: `AuthService`

Defined in: [src/app/features/events/pages/event-detail/event-detail.page.ts:101](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/events/pages/event-detail/event-detail.page.ts#L101)

***

### direccionSubject

> **direccionSubject**: `Subject`\<`string`\>

Defined in: [src/app/features/events/pages/event-detail/event-detail.page.ts:123](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/events/pages/event-detail/event-detail.page.ts#L123)

***

### event?

> `optional` **event?**: `AppEvent`

Defined in: [src/app/features/events/pages/event-detail/event-detail.page.ts:117](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/events/pages/event-detail/event-detail.page.ts#L117)

***

### eventForm

> **eventForm**: `FormGroup`

Defined in: [src/app/features/events/pages/event-detail/event-detail.page.ts:116](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/events/pages/event-detail/event-detail.page.ts#L116)

***

### isAdmin

> **isAdmin**: `boolean` = `false`

Defined in: [src/app/features/events/pages/event-detail/event-detail.page.ts:114](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/events/pages/event-detail/event-detail.page.ts#L114)

***

### isEditing

> **isEditing**: `boolean` = `false`

Defined in: [src/app/features/events/pages/event-detail/event-detail.page.ts:113](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/events/pages/event-detail/event-detail.page.ts#L113)

***

### isNewEvent

> **isNewEvent**: `boolean` = `false`

Defined in: [src/app/features/events/pages/event-detail/event-detail.page.ts:112](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/events/pages/event-detail/event-detail.page.ts#L112)

***

### mostrarSugerencias

> **mostrarSugerencias**: `boolean` = `false`

Defined in: [src/app/features/events/pages/event-detail/event-detail.page.ts:125](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/events/pages/event-detail/event-detail.page.ts#L125)

***

### popoverEnd

> **popoverEnd**: `IonPopover`

Defined in: [src/app/features/events/pages/event-detail/event-detail.page.ts:105](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/events/pages/event-detail/event-detail.page.ts#L105)

***

### popoverStart

> **popoverStart**: `IonPopover`

Defined in: [src/app/features/events/pages/event-detail/event-detail.page.ts:104](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/events/pages/event-detail/event-detail.page.ts#L104)

***

### selectedEndDate

> **selectedEndDate**: `string` = `''`

Defined in: [src/app/features/events/pages/event-detail/event-detail.page.ts:121](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/events/pages/event-detail/event-detail.page.ts#L121)

***

### selectedStartDate

> **selectedStartDate**: `string` = `''`

Defined in: [src/app/features/events/pages/event-detail/event-detail.page.ts:120](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/events/pages/event-detail/event-detail.page.ts#L120)

***

### sugerencias

> **sugerencias**: `any`[] = `[]`

Defined in: [src/app/features/events/pages/event-detail/event-detail.page.ts:124](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/events/pages/event-detail/event-detail.page.ts#L124)

***

### temporaryPreviewBase64

> **temporaryPreviewBase64**: `string` = `''`

Defined in: [src/app/features/events/pages/event-detail/event-detail.page.ts:118](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/events/pages/event-detail/event-detail.page.ts#L118)

***

### tipoTraduccion

> **tipoTraduccion**: `Record`\<`EventType`, `string`\> = `EVENT_TYPE_ES`

Defined in: [src/app/features/events/pages/event-detail/event-detail.page.ts:110](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/events/pages/event-detail/event-detail.page.ts#L110)

***

### userStatusAsistencia

> **userStatusAsistencia**: `"going"` \| `"not_going"` \| `"unconfirmed"` = `'unconfirmed'`

Defined in: [src/app/features/events/pages/event-detail/event-detail.page.ts:127](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/events/pages/event-detail/event-detail.page.ts#L127)

## Methods

### cancelEdit()

> **cancelEdit**(): `void`

Defined in: [src/app/features/events/pages/event-detail/event-detail.page.ts:554](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/events/pages/event-detail/event-detail.page.ts#L554)

#### Returns

`void`

***

### clickEliminarConvocatoria()

> **clickEliminarConvocatoria**(): `Promise`\<`void`\>

Defined in: [src/app/features/events/pages/event-detail/event-detail.page.ts:565](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/events/pages/event-detail/event-detail.page.ts#L565)

#### Returns

`Promise`\<`void`\>

***

### esEventoCaducado()

> **esEventoCaducado**(): `boolean`

Defined in: [src/app/features/events/pages/event-detail/event-detail.page.ts:363](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/events/pages/event-detail/event-detail.page.ts#L363)

#### Returns

`boolean`

***

### esUsuarioSolvente()

> **esUsuarioSolvente**(): `boolean`

Defined in: [src/app/features/events/pages/event-detail/event-detail.page.ts:356](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/events/pages/event-detail/event-detail.page.ts#L356)

#### Returns

`boolean`

***

### ngOnDestroy()

> **ngOnDestroy**(): `void`

Defined in: [src/app/features/events/pages/event-detail/event-detail.page.ts:199](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/events/pages/event-detail/event-detail.page.ts#L199)

A callback method that performs custom clean-up, invoked immediately
before a directive, pipe, or service instance is destroyed.

#### Returns

`void`

#### Implementation of

`OnDestroy.ngOnDestroy`

***

### ngOnInit()

> **ngOnInit**(): `Promise`\<`void`\>

Defined in: [src/app/features/events/pages/event-detail/event-detail.page.ts:147](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/events/pages/event-detail/event-detail.page.ts#L147)

A callback method that is invoked immediately after the
default change detector has checked the directive's
data-bound properties for the first time,
and before any of the view or content children have been checked.
It is invoked only once when the directive is instantiated.

#### Returns

`Promise`\<`void`\>

#### Implementation of

`OnInit.ngOnInit`

***

### ocultarSugerencias()

> **ocultarSugerencias**(): `void`

Defined in: [src/app/features/events/pages/event-detail/event-detail.page.ts:405](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/events/pages/event-detail/event-detail.page.ts#L405)

#### Returns

`void`

***

### onAddressInput()

> **onAddressInput**(`event`): `void`

Defined in: [src/app/features/events/pages/event-detail/event-detail.page.ts:387](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/events/pages/event-detail/event-detail.page.ts#L387)

#### Parameters

##### event

`any`

#### Returns

`void`

***

### onDateConfirmNative()

> **onDateConfirmNative**(`controlName`, `event`): `Promise`\<`void`\>

Defined in: [src/app/features/events/pages/event-detail/event-detail.page.ts:412](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/events/pages/event-detail/event-detail.page.ts#L412)

#### Parameters

##### controlName

`string`

##### event

`any`

#### Returns

`Promise`\<`void`\>

***

### onSubmit()

> **onSubmit**(): `Promise`\<`void`\>

Defined in: [src/app/features/events/pages/event-detail/event-detail.page.ts:594](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/events/pages/event-detail/event-detail.page.ts#L594)

#### Returns

`Promise`\<`void`\>

***

### puedeApuntarse()

> **puedeApuntarse**(): `boolean`

Defined in: [src/app/features/events/pages/event-detail/event-detail.page.ts:376](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/events/pages/event-detail/event-detail.page.ts#L376)

#### Returns

`boolean`

***

### selectAddressSuggestion()

> **selectAddressSuggestion**(`sugerencia`): `void`

Defined in: [src/app/features/events/pages/event-detail/event-detail.page.ts:397](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/events/pages/event-detail/event-detail.page.ts#L397)

#### Parameters

##### sugerencia

`any`

#### Returns

`void`

***

### selectFromGallery()

> **selectFromGallery**(): `Promise`\<`void`\>

Defined in: [src/app/features/events/pages/event-detail/event-detail.page.ts:495](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/events/pages/event-detail/event-detail.page.ts#L495)

#### Returns

`Promise`\<`void`\>

***

### takePhoto()

> **takePhoto**(): `Promise`\<`void`\>

Defined in: [src/app/features/events/pages/event-detail/event-detail.page.ts:505](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/events/pages/event-detail/event-detail.page.ts#L505)

#### Returns

`Promise`\<`void`\>

***

### toggleAsistenciaSocio()

> **toggleAsistenciaSocio**(`confirmarAsistencia`): `Promise`\<`void`\>

Defined in: [src/app/features/events/pages/event-detail/event-detail.page.ts:320](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/events/pages/event-detail/event-detail.page.ts#L320)

#### Parameters

##### confirmarAsistencia

`boolean`

#### Returns

`Promise`\<`void`\>

***

### toggleEdit()

> **toggleEdit**(): `void`

Defined in: [src/app/features/events/pages/event-detail/event-detail.page.ts:544](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/events/pages/event-detail/event-detail.page.ts#L544)

#### Returns

`void`
