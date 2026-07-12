[**adcLosLocosV2**](../../../../../../README.md)

***

[adcLosLocosV2](../../../../../../README.md) / [features/events/pages/fair-scan/fair-scan.page](../README.md) / FairScanPage

# Class: FairScanPage

Defined in: [src/app/features/events/pages/fair-scan/fair-scan.page.ts:45](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/events/pages/fair-scan/fair-scan.page.ts#L45)

FairScanPage

## Description

Pantalla controladora para el personal de portería y seguridad.
Controla el hardware de cámara mediante Capacitor para escanear y quemar pases digitales QR.

## Implements

- `OnInit`
- `OnDestroy`

## Constructors

### Constructor

> **new FairScanPage**(): `FairScanPage`

Defined in: [src/app/features/events/pages/fair-scan/fair-scan.page.ts:71](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/events/pages/fair-scan/fair-scan.page.ts#L71)

#### Returns

`FairScanPage`

#### Description

Inicializa la colección atómica de iconos vectoriales e interpreta el huso horario local.

## Properties

### currentPorteroId

> **currentPorteroId**: `string` = `null`

Defined in: [src/app/features/events/pages/fair-scan/fair-scan.page.ts:61](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/events/pages/fair-scan/fair-scan.page.ts#L61)

***

### hoyFormateado

> **hoyFormateado**: `string` = `''`

Defined in: [src/app/features/events/pages/fair-scan/fair-scan.page.ts:65](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/events/pages/fair-scan/fair-scan.page.ts#L65)

***

### isScanning

> **isScanning**: `boolean` = `false`

Defined in: [src/app/features/events/pages/fair-scan/fair-scan.page.ts:62](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/events/pages/fair-scan/fair-scan.page.ts#L62)

***

### manualPaseId

> **manualPaseId**: `string` = `''`

Defined in: [src/app/features/events/pages/fair-scan/fair-scan.page.ts:64](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/events/pages/fair-scan/fair-scan.page.ts#L64)

***

### scanStatus

> **scanStatus**: `"idle"` \| `"success"` \| `"error"` = `'idle'`

Defined in: [src/app/features/events/pages/fair-scan/fair-scan.page.ts:63](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/events/pages/fair-scan/fair-scan.page.ts#L63)

## Methods

### activarEscaner()

> **activarEscaner**(): `Promise`\<`void`\>

Defined in: [src/app/features/events/pages/fair-scan/fair-scan.page.ts:95](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/events/pages/fair-scan/fair-scan.page.ts#L95)

#### Returns

`Promise`\<`void`\>

#### Method

activarEscaner

#### Description

Verifica permisos de cámara nativos y activa el lector en segundo plano transparentando la vista.

***

### detenerEscaner()

> **detenerEscaner**(): `Promise`\<`void`\>

Defined in: [src/app/features/events/pages/fair-scan/fair-scan.page.ts:129](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/events/pages/fair-scan/fair-scan.page.ts#L129)

#### Returns

`Promise`\<`void`\>

***

### ionViewWillLeave()

> **ionViewWillLeave**(): `void`

Defined in: [src/app/features/events/pages/fair-scan/fair-scan.page.ts:87](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/events/pages/fair-scan/fair-scan.page.ts#L87)

#### Returns

`void`

***

### ngOnDestroy()

> **ngOnDestroy**(): `void`

Defined in: [src/app/features/events/pages/fair-scan/fair-scan.page.ts:83](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/events/pages/fair-scan/fair-scan.page.ts#L83)

A callback method that performs custom clean-up, invoked immediately
before a directive, pipe, or service instance is destroyed.

#### Returns

`void`

#### Implementation of

`OnDestroy.ngOnDestroy`

***

### ngOnInit()

> **ngOnInit**(): `Promise`\<`void`\>

Defined in: [src/app/features/events/pages/fair-scan/fair-scan.page.ts:78](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/events/pages/fair-scan/fair-scan.page.ts#L78)

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

### procesarAcceso()

> **procesarAcceso**(`rawPayload`): `Promise`\<`void`\>

Defined in: [src/app/features/events/pages/fair-scan/fair-scan.page.ts:170](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/events/pages/fair-scan/fair-scan.page.ts#L170)

#### Parameters

##### rawPayload

`string`

#### Returns

`Promise`\<`void`\>

#### Method

procesarAcceso

#### Description

Motor transaccional de validación en puerta. Analiza la procedencia del QR y registra el acceso.

***

### validarEntradaManual()

> **validarEntradaManual**(): `Promise`\<`void`\>

Defined in: [src/app/features/events/pages/fair-scan/fair-scan.page.ts:157](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/events/pages/fair-scan/fair-scan.page.ts#L157)

#### Returns

`Promise`\<`void`\>
