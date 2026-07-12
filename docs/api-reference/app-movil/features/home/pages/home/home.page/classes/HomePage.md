[**adcLosLocosV2**](../../../../../../README.md)

***

[adcLosLocosV2](../../../../../../README.md) / [features/home/pages/home/home.page](../README.md) / HomePage

# Class: HomePage

Defined in: [src/app/features/home/pages/home/home.page.ts:43](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/home/pages/home/home.page.ts#L43)

HomePage

## Description

Componente controlador de la pantalla de bienvenida principal de la aplicación.
Inicializa los servicios push con Capacitor e inyecta proactivamente las credenciales feriales del socio.

## Implements

- `OnInit`

## Constructors

### Constructor

> **new HomePage**(): `HomePage`

Defined in: [src/app/features/home/pages/home/home.page.ts:66](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/home/pages/home/home.page.ts#L66)

#### Returns

`HomePage`

#### Description

Registra de forma atómica e independiente la colección de iconos vectoriales.

## Accessors

### currentUser

#### Get Signature

> **get** **currentUser**(): `User`

Defined in: [src/app/features/home/pages/home/home.page.ts:58](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/home/pages/home/home.page.ts#L58)

##### Description

Vinculación directa con los datos del perfil hidratados desde Firestore.

##### Returns

`User`

## Methods

### irAEventos()

> **irAEventos**(): `void`

Defined in: [src/app/features/home/pages/home/home.page.ts:110](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/home/pages/home/home.page.ts#L110)

#### Returns

`void`

***

### irAPerfil()

> **irAPerfil**(`userId`): `void`

Defined in: [src/app/features/home/pages/home/home.page.ts:120](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/home/pages/home/home.page.ts#L120)

#### Parameters

##### userId

`string`

#### Returns

`void`

***

### irAUsuarios()

> **irAUsuarios**(): `void`

Defined in: [src/app/features/home/pages/home/home.page.ts:115](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/home/pages/home/home.page.ts#L115)

#### Returns

`void`

***

### ngOnInit()

> **ngOnInit**(): `Promise`\<`void`\>

Defined in: [src/app/features/home/pages/home/home.page.ts:82](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/home/pages/home/home.page.ts#L82)

#### Returns

`Promise`\<`void`\>

#### Method

ngOnInit

#### Description

Inicializa el sistema de notificaciones masivas y valida el circuito de acceso automático.

#### Implementation of

`OnInit.ngOnInit`
