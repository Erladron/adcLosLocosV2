[**adcLosLocosV2**](../../README.md)

***

[adcLosLocosV2](../../README.md) / [app.component](../README.md) / AppComponent

# Class: AppComponent

Defined in: [src/app/app.component.ts:74](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/app.component.ts#L74)

AppComponent

## Description

Componente raíz de la aplicación de la Peña A.D.C. Los Locos.
Se encarga de la orquestación del menú lateral dinámico, la gestión de sesiones en tiempo real
y el cálculo reactivo del estado de los pases digitales según las convocatorias de la caseta.

## Implements

- `OnInit`
- `OnDestroy`

## Constructors

### Constructor

> **new AppComponent**(): `AppComponent`

Defined in: [src/app/app.component.ts:126](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/app.component.ts#L126)

#### Returns

`AppComponent`

#### Description

Inicializa la carga de iconos nativos y vincula la instancia de base de datos.

## Properties

### hayEventosConControlActivos

> **hayEventosConControlActivos**: `boolean` = `false`

Defined in: [src/app/app.component.ts:112](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/app.component.ts#L112)

#### Description

Determina si existen eventos activos que requieran control de aforo por portería.

***

### menuGestionAbierto

> **menuGestionAbierto**: `boolean` = `false`

Defined in: [src/app/app.component.ts:108](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/app.component.ts#L108)

#### Description

Interruptor visual para desplegar la sección de administración de usuarios.

***

### pasesUsuario

> **pasesUsuario**: `any`[] = `[]`

Defined in: [src/app/app.component.ts:118](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/app.component.ts#L118)

#### Description

Array local con los pases calculados y listos para su uso por la interfaz.

***

### tienePasesActivos

> **tienePasesActivos**: `boolean` = `false`

Defined in: [src/app/app.component.ts:110](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/app.component.ts#L110)

#### Description

Bandera que determina si se pinta el acceso a "Mis Pases Digitales".

## Accessors

### role

#### Get Signature

> **get** **role**(): `string`

Defined in: [src/app/app.component.ts:350](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/app.component.ts#L350)

##### Get

role

##### Returns

`string`

Código del rol jerárquico del usuario actual ('tipo' en Firestore).

***

### status

#### Get Signature

> **get** **status**(): `string`

Defined in: [src/app/app.component.ts:355](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/app.component.ts#L355)

##### Get

status

##### Returns

`string`

Estado de admisión de la ficha del socio.

## Methods

### canShowMenu()

> **canShowMenu**(): `boolean`

Defined in: [src/app/app.component.ts:365](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/app.component.ts#L365)

#### Returns

`boolean`

#### Method

canShowMenu

***

### escucharPasesExistentesTiempoReal()

> **escucharPasesExistentesTiempoReal**(): `Promise`\<`void`\>

Defined in: [src/app/app.component.ts:241](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/app.component.ts#L241)

#### Returns

`Promise`\<`void`\>

Cobertura asíncrona de inicialización.

#### Method

escucharPasesExistentesTiempoReal

#### Async

#### Description

Abre la pasarela en tiempo real sobre la colección `/fair-access`. Calcula en caliente si
el pase está pendiente, activo o expirado cruzando cronologías con los eventos publicados de la Peña.

***

### esPorteroPuro()

> **esPorteroPuro**(): `boolean`

Defined in: [src/app/app.component.ts:360](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/app.component.ts#L360)

#### Returns

`boolean`

#### Method

esPorteroPuro

***

### logout()

> **logout**(): `Promise`\<`void`\>

Defined in: [src/app/app.component.ts:432](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/app.component.ts#L432)

#### Returns

`Promise`\<`void`\>

Promesa asíncrona de desvinculación completa.

#### Method

logout

#### Description

🛡️ VULNERABILIDAD RESUELTA: Cierra explícitamente el socket activo (onSnapshot) 
antes de revocar las credenciales. Esto previene excepciones repetidas de falta de permisos 
en la pantalla de login debido a tokens nulos.

***

### navegar()

> **navegar**(`ruta`): `void`

Defined in: [src/app/app.component.ts:420](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/app.component.ts#L420)

#### Parameters

##### ruta

`string`

Segmento destino (ej: '/home').

#### Returns

`void`

#### Method

navegar

#### Description

Ejecuta el enrutamiento y pliega el menú lateral deslizable nativo.

***

### ngOnDestroy()

> **ngOnDestroy**(): `void`

Defined in: [src/app/app.component.ts:143](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/app.component.ts#L143)

#### Returns

`void`

#### Method

ngOnDestroy

#### Description

Ciclo de vida de destrucción. Purga y mata los hilos abiertos para evitar fugas de memoria.

#### Implementation of

`OnDestroy.ngOnDestroy`

***

### ngOnInit()

> **ngOnInit**(): `void`

Defined in: [src/app/app.component.ts:135](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/app.component.ts#L135)

#### Returns

`void`

#### Method

ngOnInit

#### Description

Ciclo de vida inicial. Arranca el motor de escucha reactiva de credenciales.

#### Implementation of

`OnInit.ngOnInit`

***

### puedeEscanearEventos()

> **puedeEscanearEventos**(): `boolean`

Defined in: [src/app/app.component.ts:411](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/app.component.ts#L411)

#### Returns

`boolean`

#### Method

puedeEscanearEventos

***

### puedeGestionarCuotas()

> **puedeGestionarCuotas**(): `boolean`

Defined in: [src/app/app.component.ts:395](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/app.component.ts#L395)

#### Returns

`boolean`

#### Method

puedeGestionarCuotas

***

### puedeInvitar()

> **puedeInvitar**(): `boolean`

Defined in: [src/app/app.component.ts:385](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/app.component.ts#L385)

#### Returns

`boolean`

#### Method

puedeInvitar

***

### puedeVerEventos()

> **puedeVerEventos**(): `boolean`

Defined in: [src/app/app.component.ts:400](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/app.component.ts#L400)

#### Returns

`boolean`

#### Method

puedeVerEventos

***

### puedeVerInicio()

> **puedeVerInicio**(): `boolean`

Defined in: [src/app/app.component.ts:380](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/app.component.ts#L380)

#### Returns

`boolean`

#### Method

puedeVerInicio

***

### puedeVerPasesEventos()

> **puedeVerPasesEventos**(): `boolean`

Defined in: [src/app/app.component.ts:405](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/app.component.ts#L405)

#### Returns

`boolean`

#### Method

puedeVerPasesEventos

***

### puedeVerUsers()

> **puedeVerUsers**(): `boolean`

Defined in: [src/app/app.component.ts:390](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/app.component.ts#L390)

#### Returns

`boolean`

#### Method

puedeVerUsers
