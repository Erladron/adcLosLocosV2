[**adcLosLocosV2**](../../../../../../../index.md)

***

[adcLosLocosV2](../../../../../../../index.md) / [app/features/events/pages/event-passes/event-passes.page](../index.md) / PassePage

# Class: PassePage

Defined in: src/app/features/events/pages/event-passes/event-passes.page.ts:93

PassePage

## Description

Componente controlador maestro encargado de listar los pases digitales del usuario activo,
autogenerar los identificadores criptográficos en formato QR y coordinar los accesos de la Peña.

## Implements

- `OnInit`
- `OnDestroy`

## Constructors

### Constructor

> **new PassePage**(): `PassePage`

Defined in: src/app/features/events/pages/event-passes/event-passes.page.ts:138

#### Returns

`PassePage`

#### Description

Inicializa la carga de iconos nativos e interpreta el huso horario local de la peña.

## Properties

### anioActual

> **anioActual**: `number`

Defined in: src/app/features/events/pages/event-passes/event-passes.page.ts:118

#### Description

Año en curso para las de la temporada del abono de la peña.

***

### currentUserData

> **currentUserData**: `any` = `null`

Defined in: src/app/features/events/pages/event-passes/event-passes.page.ts:111

#### Description

Documento completo con los metadatos de perfil del socio de la peña.

***

### currentUserId

> **currentUserId**: `string` = `null`

Defined in: src/app/features/events/pages/event-passes/event-passes.page.ts:109

#### Description

Identificador de la cuenta del usuario activo en la sesión.

***

### hoyFormateado

> **hoyFormateado**: `string` = `''`

Defined in: src/app/features/events/pages/event-passes/event-passes.page.ts:115

#### Description

Fecha actual estandarizada en formato de España (YYYY-MM-DD).

***

### isInvitado

> **isInvitado**: `boolean` = `false`

Defined in: src/app/features/events/pages/event-passes/event-passes.page.ts:113

#### Description

Flag indicador de rol Invitado.

***

### isQrModalOpen

> **isQrModalOpen**: `boolean` = `false`

Defined in: src/app/features/events/pages/event-passes/event-passes.page.ts:127

***

### misPasesHoy

> **misPasesHoy**: `PaseUniversal`[] = `[]`

Defined in: src/app/features/events/pages/event-passes/event-passes.page.ts:120

#### Description

Catálogo final de pases computados activos de la peña para el HTML.

***

### paseSeleccionadoModal

> **paseSeleccionadoModal**: `PaseUniversal` = `null`

Defined in: src/app/features/events/pages/event-passes/event-passes.page.ts:128

***

### qrPayload

> **qrPayload**: `string` = `null`

Defined in: src/app/features/events/pages/event-passes/event-passes.page.ts:126

## Methods

### abrirCodigoQR()

> **abrirCodigoQR**(`pase`): `void`

Defined in: src/app/features/events/pages/event-passes/event-passes.page.ts:313

#### Parameters

##### pase

`PaseUniversal`

#### Returns

`void`

***

### cargarPasesUniversales()

> **cargarPasesUniversales**(): `Promise`\<`void`\>

Defined in: src/app/features/events/pages/event-passes/event-passes.page.ts:247

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

Defined in: src/app/features/events/pages/event-passes/event-passes.page.ts:320

#### Returns

`void`

***

### desconectarEscuchaPases()

> **desconectarEscuchaPases**(): `void`

Defined in: src/app/features/events/pages/event-passes/event-passes.page.ts:191

#### Returns

`void`

#### Method

desconectarEscuchaPases

#### Description

Expone la desconexión del Snapshot de forma atómica para el recolector de basura o acciones de Auth.

***

### generarColorUnicoPorId()

> **generarColorUnicoPorId**(`eventId`): `string`

Defined in: src/app/features/events/pages/event-passes/event-passes.page.ts:213

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

### ionViewWillLeave()

> **ionViewWillLeave**(): `void`

Defined in: src/app/features/events/pages/event-passes/event-passes.page.ts:181

#### Returns

`void`

#### Method

ionViewWillLeave

#### Description

Ciclo de vida nativo de Ionic. Se ejecuta inmediatamente en cuanto la app 
inicia la transición de salida de esta pantalla (útil para deslogueos rápidos).

***

### irAGestionInvitados()

> **irAGestionInvitados**(`pase`): `void`

Defined in: src/app/features/events/pages/event-passes/event-passes.page.ts:327

#### Parameters

##### pase

`PaseUniversal`

#### Returns

`void`

***

### ngOnDestroy()

> **ngOnDestroy**(): `void`

Defined in: src/app/features/events/pages/event-passes/event-passes.page.ts:203

#### Returns

`void`

#### Method

ngOnDestroy

#### Description

Destruye las suscripciones abiertas en memoria previniendo pérdidas de rendimiento.

#### Implementation of

`OnDestroy.ngOnDestroy`

***

### ngOnInit()

> **ngOnInit**(): `Promise`\<`void`\>

Defined in: src/app/features/events/pages/event-passes/event-passes.page.ts:165

#### Returns

`Promise`\<`void`\>

#### Method

ngOnInit

#### Description

Ciclo de vida inicial. Recupera credenciales y dispara las escuchas relacionales.

#### Implementation of

`OnInit.ngOnInit`
