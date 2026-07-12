[**adcLosLocosV2**](../../../../../../README.md)

***

[adcLosLocosV2](../../../../../../README.md) / [features/events/pages/fair/fair.page](../README.md) / FairPage

# Class: FairPage

Defined in: [src/app/features/events/pages/fair/fair.page.ts:93](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/events/pages/fair/fair.page.ts#L93)

FairPage

## Description

Componente controlador maestro encargado de listar los pases digitales del usuario activo,
autogenerar los identificadores criptográficos en formato QR y coordinar los accesos de la Peña.

## Implements

- `OnInit`
- `OnDestroy`

## Constructors

### Constructor

> **new FairPage**(): `FairPage`

Defined in: [src/app/features/events/pages/fair/fair.page.ts:138](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/events/pages/fair/fair.page.ts#L138)

#### Returns

`FairPage`

#### Description

Inicializa la carga de iconos nativos e interpreta el huso horario local de la peña.

## Properties

### anioActual

> **anioActual**: `number`

Defined in: [src/app/features/events/pages/fair/fair.page.ts:118](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/events/pages/fair/fair.page.ts#L118)

#### Description

Año en curso para las de la temporada del abono de la peña.

***

### currentUserData

> **currentUserData**: `any` = `null`

Defined in: [src/app/features/events/pages/fair/fair.page.ts:111](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/events/pages/fair/fair.page.ts#L111)

#### Description

Documento completo con los metadatos de perfil del socio de la peña.

***

### currentUserId

> **currentUserId**: `string` = `null`

Defined in: [src/app/features/events/pages/fair/fair.page.ts:109](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/events/pages/fair/fair.page.ts#L109)

#### Description

Identificador de la cuenta del usuario activo en la sesión.

***

### hoyFormateado

> **hoyFormateado**: `string` = `''`

Defined in: [src/app/features/events/pages/fair/fair.page.ts:115](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/events/pages/fair/fair.page.ts#L115)

#### Description

Fecha actual estandarizada en formato de España (YYYY-MM-DD).

***

### isInvitado

> **isInvitado**: `boolean` = `false`

Defined in: [src/app/features/events/pages/fair/fair.page.ts:113](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/events/pages/fair/fair.page.ts#L113)

#### Description

Flag indicador de rol Invitado.

***

### isQrModalOpen

> **isQrModalOpen**: `boolean` = `false`

Defined in: [src/app/features/events/pages/fair/fair.page.ts:127](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/events/pages/fair/fair.page.ts#L127)

***

### misPasesHoy

> **misPasesHoy**: `PaseUniversal`[] = `[]`

Defined in: [src/app/features/events/pages/fair/fair.page.ts:120](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/events/pages/fair/fair.page.ts#L120)

#### Description

Catálogo final de pases computados activos de la peña para el HTML.

***

### paseSeleccionadoModal

> **paseSeleccionadoModal**: `PaseUniversal` = `null`

Defined in: [src/app/features/events/pages/fair/fair.page.ts:128](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/events/pages/fair/fair.page.ts#L128)

***

### qrPayload

> **qrPayload**: `string` = `null`

Defined in: [src/app/features/events/pages/fair/fair.page.ts:126](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/events/pages/fair/fair.page.ts#L126)

## Methods

### abrirCodigoQR()

> **abrirCodigoQR**(`pase`): `void`

Defined in: [src/app/features/events/pages/fair/fair.page.ts:294](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/events/pages/fair/fair.page.ts#L294)

#### Parameters

##### pase

`PaseUniversal`

#### Returns

`void`

***

### cargarPasesUniversales()

> **cargarPasesUniversales**(): `Promise`\<`void`\>

Defined in: [src/app/features/events/pages/fair/fair.page.ts:235](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/events/pages/fair/fair.page.ts#L235)

#### Returns

`Promise`\<`void`\>

#### Method

cargarPasesUniversales

#### Async

#### Description

Se conecta mediante onSnapshot vivo a la colección de la peña, calculando vigencias
de forma limpia y elástica utilizando el motor unificado DateEsUtils.

***

### cerrarCodigoQR()

> **cerrarCodigoQR**(): `void`

Defined in: [src/app/features/events/pages/fair/fair.page.ts:301](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/events/pages/fair/fair.page.ts#L301)

#### Returns

`void`

***

### desconectarEscuchaPases()

> **desconectarEscuchaPases**(): `void`

Defined in: [src/app/features/events/pages/fair/fair.page.ts:183](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/events/pages/fair/fair.page.ts#L183)

#### Returns

`void`

#### Method

desconectarEscuchaPases

#### Description

Expone la desconexión del Snapshot para que el AuthService pueda invocarlo 
un milisegundo antes de destruir el token de Firebase.

***

### generarColorUnicoPorId()

> **generarColorUnicoPorId**(`eventId`): `string`

Defined in: [src/app/features/events/pages/fair/fair.page.ts:201](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/events/pages/fair/fair.page.ts#L201)

#### Parameters

##### eventId

`string`

ID único de la convocatoria.

#### Returns

`string`

#### Method

generarColorUnicoPorId

#### Description

Algoritmo matemático hash modular para autogenerar un gradiente visual HSL exclusivo por cada ID de convocatoria.

***

### irAGestionInvitados()

> **irAGestionInvitados**(`pase`): `void`

Defined in: [src/app/features/events/pages/fair/fair.page.ts:308](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/events/pages/fair/fair.page.ts#L308)

#### Parameters

##### pase

`PaseUniversal`

#### Returns

`void`

***

### ngOnDestroy()

> **ngOnDestroy**(): `void`

Defined in: [src/app/features/events/pages/fair/fair.page.ts:191](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/events/pages/fair/fair.page.ts#L191)

A callback method that performs custom clean-up, invoked immediately
before a directive, pipe, or service instance is destroyed.

#### Returns

`void`

#### Implementation of

`OnDestroy.ngOnDestroy`

***

### ngOnInit()

> **ngOnInit**(): `Promise`\<`void`\>

Defined in: [src/app/features/events/pages/fair/fair.page.ts:166](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/events/pages/fair/fair.page.ts#L166)

#### Returns

`Promise`\<`void`\>

#### Method

ngOnInit

#### Description

Ciclo de vida inicial. Recupera credenciales y dispara las escuchas relacionales.

#### Implementation of

`OnInit.ngOnInit`
