[**shared-core**](../README.md)

***

[shared-core](../README.md) / User

# Interface: User

Defined in: [models/users.models.ts:14](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/users.models.ts#L14)

User

## Description

Modelo representativo maestro de un Usuario/Socio en la plataforma de la peña.
Centraliza de forma unificada los datos de identificación, perfil civil, preferencias de visibilidad, 
estado financiero transaccional y la traza completa de auditoría multinivel del ciclo de vida del miembro.

## Properties

### approvedAt?

> `optional` **approvedAt?**: `string` \| `Date` \| \{ `nanoseconds`: `number`; `seconds`: `number`; \}

Defined in: [models/users.models.ts:127](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/users.models.ts#L127)

#### Description

Fecha y hora exacta de la aprobación e ingreso oficial al club.

***

### aprobadoPorNombre?

> `optional` **aprobadoPorNombre?**: `string`

Defined in: [models/users.models.ts:124](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/users.models.ts#L124)

#### Description

Nombre del miembro de la directiva que aprobó la solicitud de onboarding.

***

### aprobadoPorUid?

> `optional` **aprobadoPorUid?**: `string`

Defined in: [models/users.models.ts:121](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/users.models.ts#L121)

#### Description

UID del miembro de la directiva que aprobó la solicitud de onboarding.

***

### bajaRealizadaPorNombre?

> `optional` **bajaRealizadaPorNombre?**: `string`

Defined in: [models/users.models.ts:153](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/users.models.ts#L153)

#### Description

Nombre del miembro de la directiva que ejecutó la baja del usuario.

***

### bajaRealizadaPorUid?

> `optional` **bajaRealizadaPorUid?**: `string`

Defined in: [models/users.models.ts:150](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/users.models.ts#L150)

#### Description

UID del miembro de la directiva que ejecutó la baja del usuario.

***

### creadoPorNombre?

> `optional` **creadoPorNombre?**: `string`

Defined in: [models/users.models.ts:101](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/users.models.ts#L101)

#### Description

Nombre del usuario administrador que dio de alta el perfil directamente.

***

### creadoPorUid?

> `optional` **creadoPorUid?**: `string`

Defined in: [models/users.models.ts:98](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/users.models.ts#L98)

#### Description

UID del usuario administrador que dio de alta el perfil directamente.

***

### createdAt?

> `optional` **createdAt?**: `string` \| `Date` \| \{ `nanoseconds`: `number`; `seconds`: `number`; \}

Defined in: [models/users.models.ts:95](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/users.models.ts#L95)

#### Description

Fecha y hora de creación del registro. Soporta Date nativo, String ISO o el mapa estructural Timestamp de Firebase.

***

### cuotaActualizadaAt?

> `optional` **cuotaActualizadaAt?**: `string` \| `Date` \| \{ `nanoseconds`: `number`; `seconds`: `number`; \}

Defined in: [models/users.models.ts:140](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/users.models.ts#L140)

#### Description

Fecha y hora de la última modificación del estado financiero.

***

### cuotaActualizadaPorNombre?

> `optional` **cuotaActualizadaPorNombre?**: `string`

Defined in: [models/users.models.ts:137](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/users.models.ts#L137)

#### Description

Nombre del administrador o directivo que realizó la última actualización sobre la cuota.

***

### cuotaActualizadaPorUid?

> `optional` **cuotaActualizadaPorUid?**: `string`

Defined in: [models/users.models.ts:134](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/users.models.ts#L134)

#### Description

UID del administrador o directivo que realizó la última actualización sobre la cuota.

***

### cuotaAlCorriente?

> `optional` **cuotaAlCorriente?**: `boolean`

Defined in: [models/users.models.ts:65](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/users.models.ts#L65)

#### Description

Determina si el socio se encuentra al corriente de pago de las cuotas del club.
Campo opcional (?): Exclusivo para roles 'socio' y 'directiva'. No aplica a invitados ni porteros.
Modificable exclusivamente por los roles 'administrador' y 'directiva' de forma controlada.

***

### deactivatedAt?

> `optional` **deactivatedAt?**: `string` \| `Date` \| \{ `nanoseconds`: `number`; `seconds`: `number`; \}

Defined in: [models/users.models.ts:147](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/users.models.ts#L147)

#### Description

Fecha y hora en la que el usuario fue suspendido o dado de baja de forma lógica.

***

### detallesDireccion?

> `optional` **detallesDireccion?**: `string`

Defined in: [models/users.models.ts:46](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/users.models.ts#L46)

#### Description

Información aclaratoria o complementaria del domicilio (Opcional).

***

### direccion

> **direccion**: `string`

Defined in: [models/users.models.ts:43](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/users.models.ts#L43)

#### Description

Dirección postal física del domicilio principal (Validada mediante API Mapbox).

***

### dni

> **dni**: `string`

Defined in: [models/users.models.ts:40](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/users.models.ts#L40)

#### Description

Documento Nacional de Identidad (DNI/NIE) validado sintácticamente.

***

### email

> **email**: `string`

Defined in: [models/users.models.ts:37](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/users.models.ts#L37)

#### Description

Correo electrónico unívoco de acceso (Sincronizado con Firebase Auth).

***

### empresa?

> `optional` **empresa?**: `string`

Defined in: [models/users.models.ts:55](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/users.models.ts#L55)

#### Description

Empresa de seguridad externa a la que pertenece el usuario (Exclusivo para el rol 'portero').

***

### estado?

> `optional` **estado?**: [`UserStatus`](../enumerations/UserStatus.md)

Defined in: [models/users.models.ts:88](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/users.models.ts#L88)

#### Description

Estado actual del flujo de vida del usuario en el sistema.

***

### fechaInvitacion?

> `optional` **fechaInvitacion?**: `string` \| `Date` \| \{ `nanoseconds`: `number`; `seconds`: `number`; \}

Defined in: [models/users.models.ts:114](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/users.models.ts#L114)

#### Description

Fecha y hora en la que se generó o consumió el token de invitación.

***

### foto

> **foto**: `string`

Defined in: [models/users.models.ts:49](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/users.models.ts#L49)

#### Description

URL de descarga de Storage o representación en Base64 de la fotografía de perfil del socio.

***

### id?

> `optional` **id?**: `string`

Defined in: [models/users.models.ts:21](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/users.models.ts#L21)

#### Description

Identificador único del usuario (UID procedente de Firebase Authentication).

***

### invitadoPorNombre?

> `optional` **invitadoPorNombre?**: `string`

Defined in: [models/users.models.ts:111](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/users.models.ts#L111)

#### Description

Nombre del socio o administrador anfitrión que emitió la invitación web.

***

### invitadoPorUid?

> `optional` **invitadoPorUid?**: `string`

Defined in: [models/users.models.ts:108](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/users.models.ts#L108)

#### Description

UID del socio o administrador anfitrión que emitió la invitación web.

***

### motivoBaja?

> `optional` **motivoBaja?**: `string`

Defined in: [models/users.models.ts:156](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/users.models.ts#L156)

#### Description

Texto detallado con la justificación o motivo de la baja del socio.

***

### nombre

> **nombre**: `string`

Defined in: [models/users.models.ts:31](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/users.models.ts#L31)

#### Description

Nombre y apellidos completos del usuario en formato PascalCase.

***

### numeroSocio?

> `optional` **numeroSocio?**: `string`

Defined in: [models/users.models.ts:24](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/users.models.ts#L24)

#### Description

Número identificativo oficial asignado manualmente al socio por la Junta Directiva.

***

### password?

> `optional` **password?**: `string`

Defined in: [models/users.models.ts:85](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/users.models.ts#L85)

#### Description

Contraseña temporal utilizada únicamente en procesos de pre-alta o reseteo (No persiste de forma plana).

***

### profesion?

> `optional` **profesion?**: `string`

Defined in: [models/users.models.ts:52](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/users.models.ts#L52)

#### Description

Profesión, oficio u ocupación actual del socio (Opcional).

***

### publicarEmail

> **publicarEmail**: `boolean`

Defined in: [models/users.models.ts:75](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/users.models.ts#L75)

#### Description

Define si el socio autoriza a que otros socios comunes visualicen su correo electrónico en el directorio.

***

### publicarTelefono

> **publicarTelefono**: `boolean`

Defined in: [models/users.models.ts:72](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/users.models.ts#L72)

#### Description

Define si el socio autoriza a que otros socios comunes visualicen su número de teléfono en el directorio.

***

### reactivadoPorNombre?

> `optional` **reactivadoPorNombre?**: `string`

Defined in: [models/users.models.ts:169](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/users.models.ts#L169)

#### Description

Nombre del administrador que reactivó la cuenta del usuario.

***

### reactivatedAt?

> `optional` **reactivatedAt?**: `string` \| `Date` \| \{ `nanoseconds`: `number`; `seconds`: `number`; \}

Defined in: [models/users.models.ts:163](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/users.models.ts#L163)

#### Description

Fecha y hora de la última reactivación de una cuenta inactiva o rechazada.

***

### reactivóPorUid?

> `optional` **reactivóPorUid?**: `string`

Defined in: [models/users.models.ts:166](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/users.models.ts#L166)

#### Description

UID del administrador que reactivó la cuenta del usuario.

***

### telefono

> **telefono**: `string`

Defined in: [models/users.models.ts:34](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/users.models.ts#L34)

#### Description

Número de teléfono móvil o fijo de contacto.

***

### tipo

> **tipo**: [`UserRole`](../enumerations/UserRole.md)

Defined in: [models/users.models.ts:82](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/users.models.ts#L82)

#### Description

Rol asignado dentro del ecosistema que delimita la matriz de permisos de navegación.
