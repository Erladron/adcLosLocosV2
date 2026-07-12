[**adcLosLocosV2**](../../../../../../../../README.md)

***

[adcLosLocosV2](../../../../../../../../README.md) / [features/users/pages/user-detail/components/personal-data-form/personal-data-form.component](../README.md) / PersonalDataFormComponent

# Class: PersonalDataFormComponent

Defined in: [src/app/features/users/pages/user-detail/components/personal-data-form/personal-data-form.component.ts:59](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/user-detail/components/personal-data-form/personal-data-form.component.ts#L59)

PersonalDataFormComponent

## Description

Componente secundario de presentación encargado del formulario de datos civiles,
geolocalización predictiva mediante la API de Mapbox e integración de flujos multimedia de captura de avatar.

## Implements

- `OnChanges`
- `OnInit`

## Constructors

### Constructor

> **new PersonalDataFormComponent**(): `PersonalDataFormComponent`

Defined in: [src/app/features/users/pages/user-detail/components/personal-data-form/personal-data-form.component.ts:100](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/user-detail/components/personal-data-form/personal-data-form.component.ts#L100)

#### Returns

`PersonalDataFormComponent`

## Properties

### applyCropper

> **applyCropper**: `EventEmitter`\<`void`\>

Defined in: [src/app/features/users/pages/user-detail/components/personal-data-form/personal-data-form.component.ts:91](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/user-detail/components/personal-data-form/personal-data-form.component.ts#L91)

***

### cancelCropper

> **cancelCropper**: `EventEmitter`\<`void`\>

Defined in: [src/app/features/users/pages/user-detail/components/personal-data-form/personal-data-form.component.ts:92](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/user-detail/components/personal-data-form/personal-data-form.component.ts#L92)

***

### cancelEdit

> **cancelEdit**: `EventEmitter`\<`void`\>

Defined in: [src/app/features/users/pages/user-detail/components/personal-data-form/personal-data-form.component.ts:94](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/user-detail/components/personal-data-form/personal-data-form.component.ts#L94)

***

### canEdit

> **canEdit**: `boolean` = `false`

Defined in: [src/app/features/users/pages/user-detail/components/personal-data-form/personal-data-form.component.ts:77](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/user-detail/components/personal-data-form/personal-data-form.component.ts#L77)

***

### croppedImage

> **croppedImage**: `string` = `''`

Defined in: [src/app/features/users/pages/user-detail/components/personal-data-form/personal-data-form.component.ts:73](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/user-detail/components/personal-data-form/personal-data-form.component.ts#L73)

***

### direccionSubject

> **direccionSubject**: `Subject`\<`string`\>

Defined in: [src/app/features/users/pages/user-detail/components/personal-data-form/personal-data-form.component.ts:96](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/user-detail/components/personal-data-form/personal-data-form.component.ts#L96)

***

### editing

> **editing**: `boolean` = `false`

Defined in: [src/app/features/users/pages/user-detail/components/personal-data-form/personal-data-form.component.ts:76](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/user-detail/components/personal-data-form/personal-data-form.component.ts#L76)

***

### imageChangedEvent

> **imageChangedEvent**: `any` = `null`

Defined in: [src/app/features/users/pages/user-detail/components/personal-data-form/personal-data-form.component.ts:72](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/user-detail/components/personal-data-form/personal-data-form.component.ts#L72)

***

### imageCropped

> **imageCropped**: `EventEmitter`\<`any`\>

Defined in: [src/app/features/users/pages/user-detail/components/personal-data-form/personal-data-form.component.ts:90](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/user-detail/components/personal-data-form/personal-data-form.component.ts#L90)

***

### internalImageBase64

> **internalImageBase64**: `string` = `''`

Defined in: [src/app/features/users/pages/user-detail/components/personal-data-form/personal-data-form.component.ts:84](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/user-detail/components/personal-data-form/personal-data-form.component.ts#L84)

***

### internalImageEvent

> **internalImageEvent**: `any` = `null`

Defined in: [src/app/features/users/pages/user-detail/components/personal-data-form/personal-data-form.component.ts:83](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/user-detail/components/personal-data-form/personal-data-form.component.ts#L83)

***

### isEditMode

> **isEditMode**: `boolean` = `false`

Defined in: [src/app/features/users/pages/user-detail/components/personal-data-form/personal-data-form.component.ts:75](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/user-detail/components/personal-data-form/personal-data-form.component.ts#L75)

***

### latestCroppedEvent

> **latestCroppedEvent**: `any` = `null`

Defined in: [src/app/features/users/pages/user-detail/components/personal-data-form/personal-data-form.component.ts:85](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/user-detail/components/personal-data-form/personal-data-form.component.ts#L85)

***

### mostrarCropper

> **mostrarCropper**: `boolean` = `false`

Defined in: [src/app/features/users/pages/user-detail/components/personal-data-form/personal-data-form.component.ts:74](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/user-detail/components/personal-data-form/personal-data-form.component.ts#L74)

***

### mostrarSugerencias

> **mostrarSugerencias**: `boolean` = `false`

Defined in: [src/app/features/users/pages/user-detail/components/personal-data-form/personal-data-form.component.ts:98](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/user-detail/components/personal-data-form/personal-data-form.component.ts#L98)

***

### selectPhoto

> **selectPhoto**: `EventEmitter`\<`void`\>

Defined in: [src/app/features/users/pages/user-detail/components/personal-data-form/personal-data-form.component.ts:88](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/user-detail/components/personal-data-form/personal-data-form.component.ts#L88)

***

### simpleMode

> **simpleMode**: `boolean` = `false`

Defined in: [src/app/features/users/pages/user-detail/components/personal-data-form/personal-data-form.component.ts:78](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/user-detail/components/personal-data-form/personal-data-form.component.ts#L78)

***

### sugerencias

> **sugerencias**: `any`[] = `[]`

Defined in: [src/app/features/users/pages/user-detail/components/personal-data-form/personal-data-form.component.ts:97](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/user-detail/components/personal-data-form/personal-data-form.component.ts#L97)

***

### takePhoto

> **takePhoto**: `EventEmitter`\<`void`\>

Defined in: [src/app/features/users/pages/user-detail/components/personal-data-form/personal-data-form.component.ts:89](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/user-detail/components/personal-data-form/personal-data-form.component.ts#L89)

***

### toggleEdit

> **toggleEdit**: `EventEmitter`\<`void`\>

Defined in: [src/app/features/users/pages/user-detail/components/personal-data-form/personal-data-form.component.ts:93](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/user-detail/components/personal-data-form/personal-data-form.component.ts#L93)

***

### transform

> **transform**: `any`

Defined in: [src/app/features/users/pages/user-detail/components/personal-data-form/personal-data-form.component.ts:86](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/user-detail/components/personal-data-form/personal-data-form.component.ts#L86)

***

### user

> **user**: `Partial`\<`User`\>

Defined in: [src/app/features/users/pages/user-detail/components/personal-data-form/personal-data-form.component.ts:71](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/user-detail/components/personal-data-form/personal-data-form.component.ts#L71)

## Accessors

### dniParaMostrar

#### Get Signature

> **get** **dniParaMostrar**(): `string`

Defined in: [src/app/features/users/pages/user-detail/components/personal-data-form/personal-data-form.component.ts:215](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/user-detail/components/personal-data-form/personal-data-form.component.ts#L215)

##### Returns

`string`

***

### isPortero

#### Get Signature

> **get** **isPortero**(): `boolean`

Defined in: [src/app/features/users/pages/user-detail/components/personal-data-form/personal-data-form.component.ts:108](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/user-detail/components/personal-data-form/personal-data-form.component.ts#L108)

##### Returns

`boolean`

***

### isReadonlyMode

#### Get Signature

> **get** **isReadonlyMode**(): `boolean`

Defined in: [src/app/features/users/pages/user-detail/components/personal-data-form/personal-data-form.component.ts:213](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/user-detail/components/personal-data-form/personal-data-form.component.ts#L213)

##### Returns

`boolean`

***

### letraDni

#### Get Signature

> **get** **letraDni**(): `string`

Defined in: [src/app/features/users/pages/user-detail/components/personal-data-form/personal-data-form.component.ts:221](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/user-detail/components/personal-data-form/personal-data-form.component.ts#L221)

##### Returns

`string`

## Methods

### fastProcessImage()

> **fastProcessImage**(`file`): `Promise`\<`string`\>

Defined in: [src/app/features/users/pages/user-detail/components/personal-data-form/personal-data-form.component.ts:236](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/user-detail/components/personal-data-form/personal-data-form.component.ts#L236)

#### Parameters

##### file

`File`

#### Returns

`Promise`\<`string`\>

***

### fileChangeEvent()

> **fileChangeEvent**(`event`): `void`

Defined in: [src/app/features/users/pages/user-detail/components/personal-data-form/personal-data-form.component.ts:249](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/user-detail/components/personal-data-form/personal-data-form.component.ts#L249)

#### Parameters

##### event

`any`

#### Returns

`void`

***

### limpiarCropper()

> **limpiarCropper**(): `void`

Defined in: [src/app/features/users/pages/user-detail/components/personal-data-form/personal-data-form.component.ts:269](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/user-detail/components/personal-data-form/personal-data-form.component.ts#L269)

#### Returns

`void`

***

### ngOnChanges()

> **ngOnChanges**(`changes`): `void`

Defined in: [src/app/features/users/pages/user-detail/components/personal-data-form/personal-data-form.component.ts:151](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/user-detail/components/personal-data-form/personal-data-form.component.ts#L151)

A callback method that is invoked immediately after the
default change detector has checked data-bound properties
if at least one has changed, and before the view and content
children are checked.

#### Parameters

##### changes

`SimpleChanges`

The changed properties.

#### Returns

`void`

#### Implementation of

`OnChanges.ngOnChanges`

***

### ngOnInit()

> **ngOnInit**(): `void`

Defined in: [src/app/features/users/pages/user-detail/components/personal-data-form/personal-data-form.component.ts:112](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/user-detail/components/personal-data-form/personal-data-form.component.ts#L112)

A callback method that is invoked immediately after the
default change detector has checked the directive's
data-bound properties for the first time,
and before any of the view or content children have been checked.
It is invoked only once when the directive is instantiated.

#### Returns

`void`

#### Implementation of

`OnInit.ngOnInit`

***

### ocultarSugerencias()

> **ocultarSugerencias**(): `void`

Defined in: [src/app/features/users/pages/user-detail/components/personal-data-form/personal-data-form.component.ts:144](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/user-detail/components/personal-data-form/personal-data-form.component.ts#L144)

#### Returns

`void`

***

### onAceptarRecorte()

> **onAceptarRecorte**(): `void`

Defined in: [src/app/features/users/pages/user-detail/components/personal-data-form/personal-data-form.component.ts:177](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/user-detail/components/personal-data-form/personal-data-form.component.ts#L177)

#### Returns

`void`

***

### onCapitalizeName()

> **onCapitalizeName**(): `void`

Defined in: [src/app/features/users/pages/user-detail/components/personal-data-form/personal-data-form.component.ts:208](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/user-detail/components/personal-data-form/personal-data-form.component.ts#L208)

#### Returns

`void`

***

### onDireccionChange()

> **onDireccionChange**(`nuevaDireccion`): `void`

Defined in: [src/app/features/users/pages/user-detail/components/personal-data-form/personal-data-form.component.ts:131](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/user-detail/components/personal-data-form/personal-data-form.component.ts#L131)

#### Parameters

##### nuevaDireccion

`string`

#### Returns

`void`

***

### onDniChange()

> **onDniChange**(`valor`): `void`

Defined in: [src/app/features/users/pages/user-detail/components/personal-data-form/personal-data-form.component.ts:227](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/user-detail/components/personal-data-form/personal-data-form.component.ts#L227)

#### Parameters

##### valor

`string`

#### Returns

`void`

***

### onImageCropped()

> **onImageCropped**(`event`): `void`

Defined in: [src/app/features/users/pages/user-detail/components/personal-data-form/personal-data-form.component.ts:175](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/user-detail/components/personal-data-form/personal-data-form.component.ts#L175)

#### Parameters

##### event

`any`

#### Returns

`void`

***

### procesarEventoEntrada()

> **procesarEventoEntrada**(`val`): `void`

Defined in: [src/app/features/users/pages/user-detail/components/personal-data-form/personal-data-form.component.ts:157](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/user-detail/components/personal-data-form/personal-data-form.component.ts#L157)

#### Parameters

##### val

`any`

#### Returns

`void`

***

### seleccionarDireccion()

> **seleccionarDireccion**(`sugerencia`): `void`

Defined in: [src/app/features/users/pages/user-detail/components/personal-data-form/personal-data-form.component.ts:137](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/user-detail/components/personal-data-form/personal-data-form.component.ts#L137)

#### Parameters

##### sugerencia

`any`

#### Returns

`void`

***

### zoomIn()

> **zoomIn**(): `void`

Defined in: [src/app/features/users/pages/user-detail/components/personal-data-form/personal-data-form.component.ts:172](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/user-detail/components/personal-data-form/personal-data-form.component.ts#L172)

#### Returns

`void`

***

### zoomOut()

> **zoomOut**(): `void`

Defined in: [src/app/features/users/pages/user-detail/components/personal-data-form/personal-data-form.component.ts:173](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/user-detail/components/personal-data-form/personal-data-form.component.ts#L173)

#### Returns

`void`
