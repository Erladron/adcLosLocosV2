[**adcLosLocosV2**](../../../../../../../../README.md)

***

[adcLosLocosV2](../../../../../../../../README.md) / [features/users/pages/user-detail/components/membership-form/membership-form.component](../README.md) / MembershipFormComponent

# Class: MembershipFormComponent

Defined in: [src/app/features/users/pages/user-detail/components/membership-form/membership-form.component.ts:44](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/user-detail/components/membership-form/membership-form.component.ts#L44)

MembershipFormComponent

## Description

Componente de formulario secundario especializado en la visualización y edición de los parámetros jerárquicos
de membresía, números de socio y el estado financiero crítico del usuario frente a las cuotas del club.

## Constructors

### Constructor

> **new MembershipFormComponent**(): `MembershipFormComponent`

Defined in: [src/app/features/users/pages/user-detail/components/membership-form/membership-form.component.ts:87](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/user-detail/components/membership-form/membership-form.component.ts#L87)

#### Returns

`MembershipFormComponent`

## Properties

### cancelEdit

> **cancelEdit**: `EventEmitter`\<`void`\>

Defined in: [src/app/features/users/pages/user-detail/components/membership-form/membership-form.component.ts:85](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/user-detail/components/membership-form/membership-form.component.ts#L85)

***

### editing

> **editing**: `boolean` = `false`

Defined in: [src/app/features/users/pages/user-detail/components/membership-form/membership-form.component.ts:69](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/user-detail/components/membership-form/membership-form.component.ts#L69)

***

### selectInterface

> **selectInterface**: `"popover"` \| `"action-sheet"` = `'popover'`

Defined in: [src/app/features/users/pages/user-detail/components/membership-form/membership-form.component.ts:54](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/user-detail/components/membership-form/membership-form.component.ts#L54)

***

### tiposDisponibles

> **tiposDisponibles**: `string`[] = `[]`

Defined in: [src/app/features/users/pages/user-detail/components/membership-form/membership-form.component.ts:57](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/user-detail/components/membership-form/membership-form.component.ts#L57)

***

### toggleEdit

> **toggleEdit**: `EventEmitter`\<`void`\>

Defined in: [src/app/features/users/pages/user-detail/components/membership-form/membership-form.component.ts:84](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/user-detail/components/membership-form/membership-form.component.ts#L84)

***

### user

> **user**: `Partial`\<`User`\> = `null`

Defined in: [src/app/features/users/pages/user-detail/components/membership-form/membership-form.component.ts:56](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/user-detail/components/membership-form/membership-form.component.ts#L56)

## Accessors

### canEditMembership

#### Get Signature

> **get** **canEditMembership**(): `boolean`

Defined in: [src/app/features/users/pages/user-detail/components/membership-form/membership-form.component.ts:77](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/user-detail/components/membership-form/membership-form.component.ts#L77)

##### Returns

`boolean`

#### Set Signature

> **set** **canEditMembership**(`value`): `void`

Defined in: [src/app/features/users/pages/user-detail/components/membership-form/membership-form.component.ts:73](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/user-detail/components/membership-form/membership-form.component.ts#L73)

##### Parameters

###### value

`boolean`

##### Returns

`void`

***

### isEditMode

#### Get Signature

> **get** **isEditMode**(): `boolean`

Defined in: [src/app/features/users/pages/user-detail/components/membership-form/membership-form.component.ts:65](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/user-detail/components/membership-form/membership-form.component.ts#L65)

##### Returns

`boolean`

#### Set Signature

> **set** **isEditMode**(`value`): `void`

Defined in: [src/app/features/users/pages/user-detail/components/membership-form/membership-form.component.ts:61](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/user-detail/components/membership-form/membership-form.component.ts#L61)

##### Parameters

###### value

`boolean`

##### Returns

`void`
