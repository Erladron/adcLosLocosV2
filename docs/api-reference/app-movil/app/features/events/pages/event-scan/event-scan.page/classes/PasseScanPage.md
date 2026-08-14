[**adcLosLocosV2**](../../../../../../../index.md)

***

[adcLosLocosV2](../../../../../../../index.md) / [app/features/events/pages/event-scan/event-scan.page](../index.md) / PasseScanPage

# Class: PasseScanPage

Defined in: src/app/features/events/pages/event-scan/event-scan.page.ts:45

PasseScanPage

## Description

Pantalla controladora para el personal de portería y seguridad.
Controla el hardware de cámara mediante Capacitor para escanear y quemar pases digitales QR.

## Implements

- `OnInit`
- `OnDestroy`

## Constructors

### Constructor

> **new PasseScanPage**(): `PasseScanPage`

Defined in: src/app/features/events/pages/event-scan/event-scan.page.ts:71

#### Returns

`PasseScanPage`

#### Description

Inicializa la colección atómica de iconos vectoriales e interpreta el huso horario local.

## Properties

### currentPorteroId

> **currentPorteroId**: `string` = `null`

Defined in: src/app/features/events/pages/event-scan/event-scan.page.ts:61

***

### hoyFormateado

> **hoyFormateado**: `string` = `''`

Defined in: src/app/features/events/pages/event-scan/event-scan.page.ts:65

***

### isScanning

> **isScanning**: `boolean` = `false`

Defined in: src/app/features/events/pages/event-scan/event-scan.page.ts:62

***

### manualPaseId

> **manualPaseId**: `string` = `''`

Defined in: src/app/features/events/pages/event-scan/event-scan.page.ts:64

***

### scanStatus

> **scanStatus**: `"idle"` \| `"success"` \| `"error"` = `'idle'`

Defined in: src/app/features/events/pages/event-scan/event-scan.page.ts:63

## Methods

### activarEscaner()

> **activarEscaner**(): `Promise`\<`void`\>

Defined in: src/app/features/events/pages/event-scan/event-scan.page.ts:95

#### Returns

`Promise`\<`void`\>

#### Method

activarEscaner

#### Description

Verifica permisos de cámara nativos y activa el lector en segundo plano transparentando la vista.

***

### detenerEscaner()

> **detenerEscaner**(): `Promise`\<`void`\>

Defined in: src/app/features/events/pages/event-scan/event-scan.page.ts:129

#### Returns

`Promise`\<`void`\>

***

### ionViewWillLeave()

> **ionViewWillLeave**(): `void`

Defined in: src/app/features/events/pages/event-scan/event-scan.page.ts:87

#### Returns

`void`

***

### ngOnDestroy()

> **ngOnDestroy**(): `void`

Defined in: src/app/features/events/pages/event-scan/event-scan.page.ts:83

A callback method that performs custom clean-up, invoked immediately
before a directive, pipe, or service instance is destroyed.

#### Returns

`void`

#### Implementation of

`OnDestroy.ngOnDestroy`

***

### ngOnInit()

> **ngOnInit**(): `Promise`\<`void`\>

Defined in: src/app/features/events/pages/event-scan/event-scan.page.ts:78

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

Defined in: src/app/features/events/pages/event-scan/event-scan.page.ts:170

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

Defined in: src/app/features/events/pages/event-scan/event-scan.page.ts:157

#### Returns

`Promise`\<`void`\>
