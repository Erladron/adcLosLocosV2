[**shared-core**](../README.md)

***

[shared-core](../README.md) / AuthPermissionsService

# Class: AuthPermissionsService

Defined in: [services/auth-permissions.service.ts:15](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/auth-permissions.service.ts#L15)

AuthPermissionsService

## Description

Servicio especialista síncrono encargado de evaluar la matriz de capacidades, 
correspondencia de roles jerárquicos y estados transaccionales sobre los perfiles de usuario.
Diseñado como un motor de lógica puro libre de efectos secundarios o dependencias de infraestructura.

## Constructors

### Constructor

> **new AuthPermissionsService**(): `AuthPermissionsService`

Defined in: [services/auth-permissions.service.ts:21](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/auth-permissions.service.ts#L21)

#### Returns

`AuthPermissionsService`

#### Description

Inicializa el evaluador analítico de permisos.

## Methods

### getRole()

> **getRole**(`userData`): `string`

Defined in: [services/auth-permissions.service.ts:57](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/auth-permissions.service.ts#L57)

#### Parameters

##### userData

[`User`](../interfaces/User.md)

Instancia del modelo estructural de usuario.

#### Returns

`string`

Cadena correspondiente al rol o string vacío.

#### Method

getRole

#### Description

Recupera la propiedad tipo que define el rol asignado en el documento.

***

### getUid()

> **getUid**(`user`): `string`

Defined in: [services/auth-permissions.service.ts:43](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/auth-permissions.service.ts#L43)

#### Parameters

##### user

`any`

Instancia cruda de la cuenta en el SDK.

#### Returns

`string`

Cadena con el UID resultante o un string vacío en caso de inconsistencia.

#### Method

getUid

#### Description

Extrae de forma segura el identificador único alfanumérico (UID) de la sesión.

***

### hasStatus()

> **hasStatus**(`userData`, `status`): `boolean`

Defined in: [services/auth-permissions.service.ts:112](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/auth-permissions.service.ts#L112)

#### Parameters

##### userData

[`User`](../interfaces/User.md)

Instancia del modelo de usuario.

##### status

[`UserStatus`](../enumerations/UserStatus.md)

Constante del enumerado de control con el que contrastar.

#### Returns

`boolean`

True en caso de equivalencia atómica.

#### Method

hasStatus

#### Description

Compara de forma genérica el estado actual del documento frente a un token UserStatus determinado.

***

### isActivo()

> **isActivo**(`userData`): `boolean`

Defined in: [services/auth-permissions.service.ts:119](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/auth-permissions.service.ts#L119)

#### Parameters

##### userData

[`User`](../interfaces/User.md)

#### Returns

`boolean`

#### Description

Retorna true si el socio consta plenamente habilitado y activo en el sistema.

***

### isAdmin()

> **isAdmin**(`userData`): `boolean`

Defined in: [services/auth-permissions.service.ts:67](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/auth-permissions.service.ts#L67)

#### Parameters

##### userData

[`User`](../interfaces/User.md)

Instancia del modelo de usuario.

#### Returns

`boolean`

True si coincide con UserRole.ADMINISTRADOR.

#### Method

isAdmin

#### Description

Valida si el miembro ostenta privilegios totales de Administrador en el ecosistema.

***

### isDeshabilitado()

> **isDeshabilitado**(`userData`): `boolean`

Defined in: [services/auth-permissions.service.ts:147](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/auth-permissions.service.ts#L147)

#### Parameters

##### userData

[`User`](../interfaces/User.md)

#### Returns

`boolean`

#### Description

Retorna true si la cuenta presenta una baja lógica del sistema por impago o sanción.

***

### isDirectiva()

> **isDirectiva**(`userData`): `boolean`

Defined in: [services/auth-permissions.service.ts:77](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/auth-permissions.service.ts#L77)

#### Parameters

##### userData

[`User`](../interfaces/User.md)

Instancia del modelo de usuario.

#### Returns

`boolean`

True si coincide con UserRole.DIRECTIVA.

#### Method

isDirectiva

#### Description

Valida si el miembro pertenece formalmente al cuerpo operativo de la Junta Directiva.

***

### isInvitado()

> **isInvitado**(`userData`): `boolean`

Defined in: [services/auth-permissions.service.ts:97](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/auth-permissions.service.ts#L97)

#### Parameters

##### userData

[`User`](../interfaces/User.md)

Instancia del modelo de usuario.

#### Returns

`boolean`

True si coincide con UserRole.INVITADO.

#### Method

isInvitado

#### Description

Valida si el usuario se encuentra tipado como un Invitado externo en fase latente.

***

### isLogged()

> **isLogged**(`user`): `boolean`

Defined in: [services/auth-permissions.service.ts:33](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/auth-permissions.service.ts#L33)

#### Parameters

##### user

`any`

Instancia cruda de la cuenta en el SDK.

#### Returns

`boolean`

True si hay un operador autenticado en el cliente.

#### Method

isLogged

#### Description

Evalúa de forma lógica la presencia o nulidad de la instancia física de Firebase Auth.

***

### isPendienteAprobacion()

> **isPendienteAprobacion**(`userData`): `boolean`

Defined in: [services/auth-permissions.service.ts:133](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/auth-permissions.service.ts#L133)

#### Parameters

##### userData

[`User`](../interfaces/User.md)

#### Returns

`boolean`

#### Description

Retorna true si el alta del perfil está en cola a la espera de la revisión de la Junta.

***

### isPendienteDatos()

> **isPendienteDatos**(`userData`): `boolean`

Defined in: [services/auth-permissions.service.ts:126](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/auth-permissions.service.ts#L126)

#### Parameters

##### userData

[`User`](../interfaces/User.md)

#### Returns

`boolean`

#### Description

Retorna true si el aspirante tiene pendiente la cumplimentación civil de sus datos personales.

***

### isRechazado()

> **isRechazado**(`userData`): `boolean`

Defined in: [services/auth-permissions.service.ts:140](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/auth-permissions.service.ts#L140)

#### Parameters

##### userData

[`User`](../interfaces/User.md)

#### Returns

`boolean`

#### Description

Retorna true si la solicitud de alta del usuario fue desestimada y denegada.

***

### isSocio()

> **isSocio**(`userData`): `boolean`

Defined in: [services/auth-permissions.service.ts:87](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/auth-permissions.service.ts#L87)

#### Parameters

##### userData

[`User`](../interfaces/User.md)

Instancia del modelo de usuario.

#### Returns

`boolean`

True si coincide con UserRole.SOCIO.

#### Method

isSocio

#### Description

Valida si la cuenta corresponde a la ficha regular de un Socio de la peña.
