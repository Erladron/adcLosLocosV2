[**adcLosLocosV2**](../../../../../../../index.md)

***

[adcLosLocosV2](../../../../../../../index.md) / [app/features/auth/pages/login/login.page](../index.md) / LoginPage

# Class: LoginPage

Defined in: [src/app/features/auth/pages/login/login.page.ts:43](https://github.com/Erladron/adcLosLocosV2/blob/ef8b35066458446779d596c924480fd02bae169f/src/app/features/auth/pages/login/login.page.ts#L43)

## Constructors

### Constructor

> **new LoginPage**(`cdRef`, `zone`): `LoginPage`

Defined in: [src/app/features/auth/pages/login/login.page.ts:58](https://github.com/Erladron/adcLosLocosV2/blob/ef8b35066458446779d596c924480fd02bae169f/src/app/features/auth/pages/login/login.page.ts#L58)

#### Parameters

##### cdRef

`ChangeDetectorRef`

##### zone

`NgZone`

#### Returns

`LoginPage`

## Properties

### cargando

> **cargando**: `boolean` = `false`

Defined in: [src/app/features/auth/pages/login/login.page.ts:55](https://github.com/Erladron/adcLosLocosV2/blob/ef8b35066458446779d596c924480fd02bae169f/src/app/features/auth/pages/login/login.page.ts#L55)

***

### email

> **email**: `string` = `''`

Defined in: [src/app/features/auth/pages/login/login.page.ts:53](https://github.com/Erladron/adcLosLocosV2/blob/ef8b35066458446779d596c924480fd02bae169f/src/app/features/auth/pages/login/login.page.ts#L53)

***

### password

> **password**: `string` = `''`

Defined in: [src/app/features/auth/pages/login/login.page.ts:54](https://github.com/Erladron/adcLosLocosV2/blob/ef8b35066458446779d596c924480fd02bae169f/src/app/features/auth/pages/login/login.page.ts#L54)

***

### showPassword

> **showPassword**: `boolean` = `false`

Defined in: [src/app/features/auth/pages/login/login.page.ts:56](https://github.com/Erladron/adcLosLocosV2/blob/ef8b35066458446779d596c924480fd02bae169f/src/app/features/auth/pages/login/login.page.ts#L56)

## Methods

### ingresar()

> **ingresar**(): `Promise`\<`void`\>

Defined in: [src/app/features/auth/pages/login/login.page.ts:94](https://github.com/Erladron/adcLosLocosV2/blob/ef8b35066458446779d596c924480fd02bae169f/src/app/features/auth/pages/login/login.page.ts#L94)

#### Returns

`Promise`\<`void`\>

***

### ionViewWillEnter()

> **ionViewWillEnter**(): `void`

Defined in: [src/app/features/auth/pages/login/login.page.ts:76](https://github.com/Erladron/adcLosLocosV2/blob/ef8b35066458446779d596c924480fd02bae169f/src/app/features/auth/pages/login/login.page.ts#L76)

#### Returns

`void`

#### Method

ionViewWillEnter

#### Description

Ciclo de vida nativo de Ionic. Se ejecuta JUSTO ANTES de que la pantalla 
aparezca en primer plano. Forzamos el desbloqueo del botón dentro de la NgZone de Angular
para evitar que se quede congelado tras un logout asíncrono.
