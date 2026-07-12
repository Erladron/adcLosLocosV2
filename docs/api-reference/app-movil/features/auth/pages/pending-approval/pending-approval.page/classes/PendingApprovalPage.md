[**adcLosLocosV2**](../../../../../../README.md)

***

[adcLosLocosV2](../../../../../../README.md) / [features/auth/pages/pending-approval/pending-approval.page](../README.md) / PendingApprovalPage

# Class: PendingApprovalPage

Defined in: [src/app/features/auth/pages/pending-approval/pending-approval.page.ts:29](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/auth/pages/pending-approval/pending-approval.page.ts#L29)

PendingApprovalPage

## Description

Pantalla de bloqueo informativo para usuarios en estado de aprobación pendiente.
Inicializa los listeners de notificaciones Push para reaccionar al alta en tiempo real.

## Implements

- `OnInit`

## Constructors

### Constructor

> **new PendingApprovalPage**(): `PendingApprovalPage`

Defined in: [src/app/features/auth/pages/pending-approval/pending-approval.page.ts:47](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/auth/pages/pending-approval/pending-approval.page.ts#L47)

#### Returns

`PendingApprovalPage`

#### Description

Registra los iconos vectoriales de control de estado.

## Properties

### nombre

> **nombre**: `string` = `''`

Defined in: [src/app/features/auth/pages/pending-approval/pending-approval.page.ts:41](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/auth/pages/pending-approval/pending-approval.page.ts#L41)

## Methods

### logout()

> **logout**(): `Promise`\<`void`\>

Defined in: [src/app/features/auth/pages/pending-approval/pending-approval.page.ts:72](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/auth/pages/pending-approval/pending-approval.page.ts#L72)

#### Returns

`Promise`\<`void`\>

#### Method

logout

#### Description

Destruye la sesión del operador y redirige a la zona de acceso.

***

### ngOnInit()

> **ngOnInit**(): `void`

Defined in: [src/app/features/auth/pages/pending-approval/pending-approval.page.ts:59](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/auth/pages/pending-approval/pending-approval.page.ts#L59)

#### Returns

`void`

#### Method

ngOnInit

#### Description

Inicializa la vista capturando la identidad del usuario y activando
el puente nativo de notificaciones Push con Capacitor.

#### Implementation of

`OnInit.ngOnInit`
