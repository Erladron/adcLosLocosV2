[**adcLosLocosV2**](../../../../../../../index.md)

***

[adcLosLocosV2](../../../../../../../index.md) / [app/features/home/pages/home/home.page](../index.md) / HomePage

# Class: HomePage

Defined in: [src/app/features/home/pages/home/home.page.ts:43](https://github.com/Erladron/adcLosLocosV2/blob/ef8b35066458446779d596c924480fd02bae169f/src/app/features/home/pages/home/home.page.ts#L43)

HomePage

## Description

Componente controlador de la pantalla de bienvenida principal de la aplicación.

## Implements

- `OnInit`

## Constructors

### Constructor

> **new HomePage**(): `HomePage`

Defined in: [src/app/features/home/pages/home/home.page.ts:65](https://github.com/Erladron/adcLosLocosV2/blob/ef8b35066458446779d596c924480fd02bae169f/src/app/features/home/pages/home/home.page.ts#L65)

#### Returns

`HomePage`

## Properties

### currentUser

> **currentUser**: `User` = `null`

Defined in: [src/app/features/home/pages/home/home.page.ts:63](https://github.com/Erladron/adcLosLocosV2/blob/ef8b35066458446779d596c924480fd02bae169f/src/app/features/home/pages/home/home.page.ts#L63)

#### Description

Variable local donde almacenaremos el usuario de forma estricta para forzar el repintado

## Methods

### ionViewWillEnter()

> **ionViewWillEnter**(): `Promise`\<`void`\>

Defined in: [src/app/features/home/pages/home/home.page.ts:93](https://github.com/Erladron/adcLosLocosV2/blob/ef8b35066458446779d596c924480fd02bae169f/src/app/features/home/pages/home/home.page.ts#L93)

#### Returns

`Promise`\<`void`\>

#### Method

ionViewWillEnter

#### Description

Se ejecuta cada vez que la página vuelve a estar en primer plano (crucial tras el login)

***

### irAEventos()

> **irAEventos**(): `void`

Defined in: [src/app/features/home/pages/home/home.page.ts:161](https://github.com/Erladron/adcLosLocosV2/blob/ef8b35066458446779d596c924480fd02bae169f/src/app/features/home/pages/home/home.page.ts#L161)

#### Returns

`void`

***

### irAPerfil()

> **irAPerfil**(`userId`): `void`

Defined in: [src/app/features/home/pages/home/home.page.ts:171](https://github.com/Erladron/adcLosLocosV2/blob/ef8b35066458446779d596c924480fd02bae169f/src/app/features/home/pages/home/home.page.ts#L171)

#### Parameters

##### userId

`string`

#### Returns

`void`

***

### irAUsuarios()

> **irAUsuarios**(): `void`

Defined in: [src/app/features/home/pages/home/home.page.ts:166](https://github.com/Erladron/adcLosLocosV2/blob/ef8b35066458446779d596c924480fd02bae169f/src/app/features/home/pages/home/home.page.ts#L166)

#### Returns

`void`

***

### ngOnInit()

> **ngOnInit**(): `Promise`\<`void`\>

Defined in: [src/app/features/home/pages/home/home.page.ts:77](https://github.com/Erladron/adcLosLocosV2/blob/ef8b35066458446779d596c924480fd02bae169f/src/app/features/home/pages/home/home.page.ts#L77)

A callback method that is invoked immediately after the
default change detector has checked the directive's
data-bound properties for the first time,
and before any of the view or content children have been checked.
It is invoked only once when the directive is instantiated.

#### Returns

`Promise`\<`void`\>

#### Implementation of

`OnInit.ngOnInit`
