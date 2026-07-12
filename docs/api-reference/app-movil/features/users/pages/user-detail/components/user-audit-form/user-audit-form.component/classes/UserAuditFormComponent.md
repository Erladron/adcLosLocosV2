[**adcLosLocosV2**](../../../../../../../../README.md)

***

[adcLosLocosV2](../../../../../../../../README.md) / [features/users/pages/user-detail/components/user-audit-form/user-audit-form.component](../README.md) / UserAuditFormComponent

# Class: UserAuditFormComponent

Defined in: [src/app/features/users/pages/user-detail/components/user-audit-form/user-audit-form.component.ts:22](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/user-detail/components/user-audit-form/user-audit-form.component.ts#L22)

UserAuditFormComponent

## Description

Formulario consultor de auditorías de marcas de tiempo del servidor y control de bajas/reactivaciones.

## Constructors

### Constructor

> **new UserAuditFormComponent**(): `UserAuditFormComponent`

Defined in: [src/app/features/users/pages/user-detail/components/user-audit-form/user-audit-form.component.ts:31](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/user-detail/components/user-audit-form/user-audit-form.component.ts#L31)

#### Returns

`UserAuditFormComponent`

## Properties

### canDeactivate

> **canDeactivate**: `boolean` = `false`

Defined in: [src/app/features/users/pages/user-detail/components/user-audit-form/user-audit-form.component.ts:25](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/user-detail/components/user-audit-form/user-audit-form.component.ts#L25)

***

### canReactivate

> **canReactivate**: `boolean` = `false`

Defined in: [src/app/features/users/pages/user-detail/components/user-audit-form/user-audit-form.component.ts:26](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/user-detail/components/user-audit-form/user-audit-form.component.ts#L26)

***

### deactivate

> **deactivate**: `EventEmitter`\<`void`\>

Defined in: [src/app/features/users/pages/user-detail/components/user-audit-form/user-audit-form.component.ts:28](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/user-detail/components/user-audit-form/user-audit-form.component.ts#L28)

***

### reactivate

> **reactivate**: `EventEmitter`\<`void`\>

Defined in: [src/app/features/users/pages/user-detail/components/user-audit-form/user-audit-form.component.ts:29](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/user-detail/components/user-audit-form/user-audit-form.component.ts#L29)

***

### user

> **user**: `User`

Defined in: [src/app/features/users/pages/user-detail/components/user-audit-form/user-audit-form.component.ts:24](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/user-detail/components/user-audit-form/user-audit-form.component.ts#L24)

## Accessors

### isActive

#### Get Signature

> **get** **isActive**(): `boolean`

Defined in: [src/app/features/users/pages/user-detail/components/user-audit-form/user-audit-form.component.ts:38](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/user-detail/components/user-audit-form/user-audit-form.component.ts#L38)

##### Returns

`boolean`

***

### isInactive

#### Get Signature

> **get** **isInactive**(): `boolean`

Defined in: [src/app/features/users/pages/user-detail/components/user-audit-form/user-audit-form.component.ts:39](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/user-detail/components/user-audit-form/user-audit-form.component.ts#L39)

##### Returns

`boolean`

***

### isPending

#### Get Signature

> **get** **isPending**(): `boolean`

Defined in: [src/app/features/users/pages/user-detail/components/user-audit-form/user-audit-form.component.ts:40](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/user-detail/components/user-audit-form/user-audit-form.component.ts#L40)

##### Returns

`boolean`

***

### statusLabel

#### Get Signature

> **get** **statusLabel**(): `string`

Defined in: [src/app/features/users/pages/user-detail/components/user-audit-form/user-audit-form.component.ts:43](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/user-detail/components/user-audit-form/user-audit-form.component.ts#L43)

##### Description

Traductor semántico de Enums de estado a lenguaje natural para el Badge de interfaz.

##### Returns

`string`

## Methods

### formatDeactivatedAt()

> **formatDeactivatedAt**(): `any`

Defined in: [src/app/features/users/pages/user-detail/components/user-audit-form/user-audit-form.component.ts:58](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/user-detail/components/user-audit-form/user-audit-form.component.ts#L58)

#### Returns

`any`

#### Description

Sanea objetos de tipo Timestamp de Firebase convirtiéndolos de forma segura a objetos Date.

***

### formatReactivatedAt()

> **formatReactivatedAt**(): `any`

Defined in: [src/app/features/users/pages/user-detail/components/user-audit-form/user-audit-form.component.ts:65](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/user-detail/components/user-audit-form/user-audit-form.component.ts#L65)

#### Returns

`any`

#### Description

Sanea el Timestamp de reactivación a Date para formateadores Pipes.

***

### onDeactivate()

> **onDeactivate**(): `void`

Defined in: [src/app/features/users/pages/user-detail/components/user-audit-form/user-audit-form.component.ts:54](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/user-detail/components/user-audit-form/user-audit-form.component.ts#L54)

#### Returns

`void`

***

### onReactivate()

> **onReactivate**(): `void`

Defined in: [src/app/features/users/pages/user-detail/components/user-audit-form/user-audit-form.component.ts:55](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/user-detail/components/user-audit-form/user-audit-form.component.ts#L55)

#### Returns

`void`
