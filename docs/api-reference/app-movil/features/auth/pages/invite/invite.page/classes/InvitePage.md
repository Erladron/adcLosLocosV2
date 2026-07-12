[**adcLosLocosV2**](../../../../../../README.md)

***

[adcLosLocosV2](../../../../../../README.md) / [features/auth/pages/invite/invite.page](../README.md) / InvitePage

# Class: InvitePage

Defined in: [src/app/features/auth/pages/invite/invite.page.ts:49](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/auth/pages/invite/invite.page.ts#L49)

InvitePage

## Description

Pantalla controladora encargada de la gestión operativa de invitaciones para nuevos miembros.
Valida la existencia previa en el censo, genera un token estructurado y despacha correos automáticos mediante Firestore Mail.

## Implements

- `OnInit`

## Constructors

### Constructor

> **new InvitePage**(): `InvitePage`

Defined in: [src/app/features/auth/pages/invite/invite.page.ts:71](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/auth/pages/invite/invite.page.ts#L71)

#### Returns

`InvitePage`

#### Description

Inicializa la pantalla y registra el icono de mensajería.

## Properties

### email

> **email**: `string` = `''`

Defined in: [src/app/features/auth/pages/invite/invite.page.ts:65](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/auth/pages/invite/invite.page.ts#L65)

## Methods

### invitar()

> **invitar**(): `Promise`\<`void`\>

Defined in: [src/app/features/auth/pages/invite/invite.page.ts:81](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/auth/pages/invite/invite.page.ts#L81)

#### Returns

`Promise`\<`void`\>

#### Method

invitar

#### Description

Normaliza, valida y despacha la invitación al correo electrónico proporcionado.

***

### ngOnInit()

> **ngOnInit**(): `void`

Defined in: [src/app/features/auth/pages/invite/invite.page.ts:75](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/auth/pages/invite/invite.page.ts#L75)

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

### validateExisting()

> **validateExisting**(`email`): `Promise`\<`boolean`\>

Defined in: [src/app/features/auth/pages/invite/invite.page.ts:150](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/auth/pages/invite/invite.page.ts#L150)

#### Parameters

##### email

`string`

#### Returns

`Promise`\<`boolean`\>

#### Method

validateExisting

#### Description

Verifica de forma asíncrona si el correo ya pertenece a un usuario registrado.
