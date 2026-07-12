[**shared-core**](../README.md)

***

[shared-core](../README.md) / UserStatus

# Enumeration: UserStatus

Defined in: [models/user-status.enum.ts:6](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/user-status.enum.ts#L6)

UserStatus

## Description

Catálogo unificado y fuertemente tipado de los estados del ciclo de vida de un usuario.
Controla de forma secuencial las fases del onboarding, desde el registro inicial hasta el bloqueo por impagos.

## Enumeration Members

### ACTIVE

> **ACTIVE**: `"active"`

Defined in: [models/user-status.enum.ts:20](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/user-status.enum.ts#L20)

#### Description

Usuario plenamente verificado, activo y con plenos derechos de acceso a la plataforma.

***

### INACTIVE

> **INACTIVE**: `"inactive"`

Defined in: [models/user-status.enum.ts:30](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/user-status.enum.ts#L30)

#### Description

Usuario dado de baja lógica por un administrador o suspendido temporalmente por impago de cuotas.

***

### PENDING\_APPROVAL

> **PENDING\_APPROVAL**: `"pending_approval"`

Defined in: [models/user-status.enum.ts:15](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/user-status.enum.ts#L15)

*

#### Description

Datos completados por el aspirante. La solicitud está en cola de revisión para aprobación manual de la directiva.

***

### PENDING\_DATA

> **PENDING\_DATA**: `"pending_data"`

Defined in: [models/user-status.enum.ts:10](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/user-status.enum.ts#L10)

#### Description

Fase de pre-alta web. El aspirante ha sido invitado pero aún no ha completado sus datos personales civiles.

***

### REJECTED

> **REJECTED**: `"rejected"`

Defined in: [models/user-status.enum.ts:25](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/user-status.enum.ts#L25)

#### Description

Solicitud de alta web denegada de forma lógica por la directiva o la administración de la peña.
