[**shared-core**](../README.md)

***

[shared-core](../README.md) / UserCredentialsForm

# Interface: UserCredentialsForm

Defined in: [models/user-detail.model.ts:70](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/user-detail.model.ts#L70)

UserCredentialsForm

## Description

Estructura de control utilizada para tipar el subformulario reactivo de cambio de credenciales.

## Properties

### currentPassword

> **currentPassword**: `string`

Defined in: [models/user-detail.model.ts:72](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/user-detail.model.ts#L72)

#### Description

Contraseña actual del operador, exigida por el servidor para procesos de re-autenticación crítica.

***

### newEmail

> **newEmail**: `string`

Defined in: [models/user-detail.model.ts:75](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/user-detail.model.ts#L75)

#### Description

Nueva dirección de correo electrónico que se pretende vincular a la cuenta.

***

### newPassword

> **newPassword**: `string`

Defined in: [models/user-detail.model.ts:78](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/user-detail.model.ts#L78)

#### Description

Nueva contraseña plana de acceso que se desea establecer.

***

### repeatPassword

> **repeatPassword**: `string`

Defined in: [models/user-detail.model.ts:81](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/user-detail.model.ts#L81)

#### Description

Caja espejo para el doble check de confirmación de la nueva clave.
