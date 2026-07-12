[**adcLosLocosV2**](../../../../../../README.md)

***

[adcLosLocosV2](../../../../../../README.md) / [features/auth/pages/complete-profile/complete-profile.page](../README.md) / CompleteProfilePage

# Class: CompleteProfilePage

Defined in: [src/app/features/auth/pages/complete-profile/complete-profile.page.ts:50](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/auth/pages/complete-profile/complete-profile.page.ts#L50)

CompleteProfilePage

## Description

Pantalla controladora para el flujo autónomo de onboarding y completado
pos-registro de datos civiles de los nuevos miembros de la Peña.

## Implements

- `OnInit`

## Constructors

### Constructor

> **new CompleteProfilePage**(): `CompleteProfilePage`

Defined in: [src/app/features/auth/pages/complete-profile/complete-profile.page.ts:76](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/auth/pages/complete-profile/complete-profile.page.ts#L76)

#### Returns

`CompleteProfilePage`

#### Description

Registra la colección de iconos vectoriales necesarios para el Onboarding.

## Properties

### croppedImage

> **croppedImage**: `string` = `''`

Defined in: [src/app/features/auth/pages/complete-profile/complete-profile.page.ts:68](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/auth/pages/complete-profile/complete-profile.page.ts#L68)

***

### editing

> **editing**: `boolean` = `true`

Defined in: [src/app/features/auth/pages/complete-profile/complete-profile.page.ts:70](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/auth/pages/complete-profile/complete-profile.page.ts#L70)

***

### imageChangedEvent

> **imageChangedEvent**: `any` = `null`

Defined in: [src/app/features/auth/pages/complete-profile/complete-profile.page.ts:67](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/auth/pages/complete-profile/complete-profile.page.ts#L67)

***

### mostrarCropper

> **mostrarCropper**: `boolean` = `false`

Defined in: [src/app/features/auth/pages/complete-profile/complete-profile.page.ts:69](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/auth/pages/complete-profile/complete-profile.page.ts#L69)

***

### user

> **user**: `User`

Defined in: [src/app/features/auth/pages/complete-profile/complete-profile.page.ts:66](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/auth/pages/complete-profile/complete-profile.page.ts#L66)

## Accessors

### canSave

#### Get Signature

> **get** **canSave**(): `boolean`

Defined in: [src/app/features/auth/pages/complete-profile/complete-profile.page.ts:118](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/auth/pages/complete-profile/complete-profile.page.ts#L118)

##### Description

Valida los requisitos de campos civiles mínimos antes de habilitar la persistencia.

##### Returns

`boolean`

## Methods

### applyCropper()

> **applyCropper**(): `void`

Defined in: [src/app/features/auth/pages/complete-profile/complete-profile.page.ts:158](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/auth/pages/complete-profile/complete-profile.page.ts#L158)

#### Returns

`void`

***

### cancelCropper()

> **cancelCropper**(): `void`

Defined in: [src/app/features/auth/pages/complete-profile/complete-profile.page.ts:162](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/auth/pages/complete-profile/complete-profile.page.ts#L162)

#### Returns

`void`

***

### imageCropped()

> **imageCropped**(`event`): `void`

Defined in: [src/app/features/auth/pages/complete-profile/complete-profile.page.ts:153](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/auth/pages/complete-profile/complete-profile.page.ts#L153)

#### Parameters

##### event

`any`

#### Returns

`void`

***

### logout()

> **logout**(): `Promise`\<`void`\>

Defined in: [src/app/features/auth/pages/complete-profile/complete-profile.page.ts:178](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/auth/pages/complete-profile/complete-profile.page.ts#L178)

#### Returns

`Promise`\<`void`\>

***

### ngOnInit()

> **ngOnInit**(): `Promise`\<`void`\>

Defined in: [src/app/features/auth/pages/complete-profile/complete-profile.page.ts:92](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/auth/pages/complete-profile/complete-profile.page.ts#L92)

#### Returns

`Promise`\<`void`\>

#### Method

ngOnInit

#### Description

Ciclo de vida inicial. Gestiona la espera activa del estado de sesión 
en Firebase y normaliza las propiedades de identidad del usuario.

#### Implementation of

`OnInit.ngOnInit`

***

### save()

> **save**(): `Promise`\<`void`\>

Defined in: [src/app/features/auth/pages/complete-profile/complete-profile.page.ts:126](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/auth/pages/complete-profile/complete-profile.page.ts#L126)

#### Returns

`Promise`\<`void`\>

#### Method

save

#### Description

Empaqueta los cambios y despacha la transacción hacia el servidor para solicitar aprobación.

***

### selectPhoto()

> **selectPhoto**(): `Promise`\<`void`\>

Defined in: [src/app/features/auth/pages/complete-profile/complete-profile.page.ts:166](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/auth/pages/complete-profile/complete-profile.page.ts#L166)

#### Returns

`Promise`\<`void`\>

***

### takePhoto()

> **takePhoto**(): `Promise`\<`void`\>

Defined in: [src/app/features/auth/pages/complete-profile/complete-profile.page.ts:171](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/auth/pages/complete-profile/complete-profile.page.ts#L171)

#### Returns

`Promise`\<`void`\>
