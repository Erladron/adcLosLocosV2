[**shared-core**](../README.md)

***

[shared-core](../README.md) / UserRole

# Enumeration: UserRole

Defined in: [models/user-role.enum.ts:7](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/user-role.enum.ts#L7)

UserRole

## Description

Catálogo unificado y fuertemente tipado de los roles y rangos jerárquicos de acceso.
Delimita de forma perimetral las capacidades visuales en las pantallas, la obligatoriedad de cuotas financieras 
y los privilegios de escaneo en los accesos de la peña.

## Enumeration Members

### ADMINISTRADOR

> **ADMINISTRADOR**: `"administrador"`

Defined in: [models/user-role.enum.ts:9](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/user-role.enum.ts#L9)

#### Description

Privilegios totales sobre el sistema, bases de datos, pasarelas de autenticación y auditorías.

***

### DIRECTIVA

> **DIRECTIVA**: `"directiva"`

Defined in: [models/user-role.enum.ts:12](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/user-role.enum.ts#L12)

#### Description

Miembro de la Junta Directiva con facultades de alta manual, aprobación de socios y gestión de eventos.

***

### INVITADO

> **INVITADO**: `"invitado"`

Defined in: [models/user-role.enum.ts:18](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/user-role.enum.ts#L18)

#### Description

Usuario externo pre-autenticado en fase de onboarding o completado de perfil.

***

### PORTERO

> **PORTERO**: `"portero"`

Defined in: [models/user-role.enum.ts:21](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/user-role.enum.ts#L21)

#### Description

Personal de control de acceso contratado con permisos exclusivos de escaneo de códigos QR en puerta.

***

### SOCIO

> **SOCIO**: `"socio"`

Defined in: [models/user-role.enum.ts:15](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/user-role.enum.ts#L15)

#### Description

Socio ordinario de la peña sujeto al pago de cuotas anuales, con derechos de reserva y pases feriales.
