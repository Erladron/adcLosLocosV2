[**adcLosLocosV2**](../../../../../../README.md)

***

[adcLosLocosV2](../../../../../../README.md) / [features/auth/pages/login/login.page](../README.md) / LoginPage

# Class: LoginPage

Defined in: [src/app/features/auth/pages/login/login.page.ts:39](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/auth/pages/login/login.page.ts#L39)

## Constructors

### Constructor

> **new LoginPage**(): `LoginPage`

Defined in: [src/app/features/auth/pages/login/login.page.ts:52](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/auth/pages/login/login.page.ts#L52)

#### Returns

`LoginPage`

## Properties

### cargando

> **cargando**: `boolean` = `false`

Defined in: [src/app/features/auth/pages/login/login.page.ts:49](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/auth/pages/login/login.page.ts#L49)

***

### email

> **email**: `string` = `''`

Defined in: [src/app/features/auth/pages/login/login.page.ts:47](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/auth/pages/login/login.page.ts#L47)

***

### password

> **password**: `string` = `''`

Defined in: [src/app/features/auth/pages/login/login.page.ts:48](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/auth/pages/login/login.page.ts#L48)

***

### showPassword

> **showPassword**: `boolean` = `false`

Defined in: [src/app/features/auth/pages/login/login.page.ts:50](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/auth/pages/login/login.page.ts#L50)

## Methods

### ingresar()

> **ingresar**(): `Promise`\<`void`\>

Defined in: [src/app/features/auth/pages/login/login.page.ts:88](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/auth/pages/login/login.page.ts#L88)

#### Returns

`Promise`\<`void`\>

***

### ionViewDidEnter()

> **ionViewDidEnter**(): `void`

Defined in: [src/app/features/auth/pages/login/login.page.ts:66](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/auth/pages/login/login.page.ts#L66)

#### Returns

`void`

#### Method

ionViewDidEnter

#### Description

Ciclo de vida nativo de Ionic. Se ejecuta SIEMPRE que la pantalla 
de login aparece en primer plano, solucionando el bloqueo de caché tras un logout.
