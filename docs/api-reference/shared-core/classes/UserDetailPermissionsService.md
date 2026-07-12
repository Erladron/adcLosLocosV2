[**shared-core**](../README.md)

***

[shared-core](../README.md) / UserDetailPermissionsService

# Class: UserDetailPermissionsService

Defined in: [services/user-detail-permissions.service.ts:14](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/user-detail-permissions.service.ts#L14)

UserDetailPermissionsService

## Description

Evaluador analítico síncrono encargado de resolver la matriz de capacidades, flags de navegación
y permisos visuales de los subformularios del detalle cruzando las variables de sesión del operador activo frente al socio en pantalla.

## Constructors

### Constructor

> **new UserDetailPermissionsService**(): `UserDetailPermissionsService`

Defined in: [services/user-detail-permissions.service.ts:23](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/user-detail-permissions.service.ts#L23)

#### Returns

`UserDetailPermissionsService`

#### Description

Inicializa el evaluador de privilegios del detalle de usuarios.

## Methods

### canEditCredentials()

> **canEditCredentials**(`user`): `boolean`

Defined in: [services/user-detail-permissions.service.ts:118](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/user-detail-permissions.service.ts#L118)

#### Parameters

##### user

[`User`](../interfaces/User.md)

Instancia del usuario en pantalla.

#### Returns

`boolean`

Retorna true si el operador es el titular legítimo de las credenciales.

#### Method

canEditCredentials

#### Description

Compuerta de seguridad para habilitar la edición de correos electrónicos de acceso de la cuenta.

***

### canEditMembership()

> **canEditMembership**(`user`): `boolean`

Defined in: [services/user-detail-permissions.service.ts:95](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/user-detail-permissions.service.ts#L95)

#### Parameters

##### user

[`User`](../interfaces/User.md)

Instancia del usuario en pantalla.

#### Returns

`boolean`

Retorna true si el operador posee rango suficiente para alterar la jerarquía del club.

#### Method

canEditMembership

#### Description

Delimita la capacidad operativa jerárquica para alterar roles o números de socio.

***

### canEditPassword()

> **canEditPassword**(`user`): `boolean`

Defined in: [services/user-detail-permissions.service.ts:128](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/user-detail-permissions.service.ts#L128)

#### Parameters

##### user

[`User`](../interfaces/User.md)

Instancia del usuario en pantalla.

#### Returns

`boolean`

Retorna true si es el propietario legítimo de la cuenta.

#### Method

canEditPassword

#### Description

Compuerta de permisos para autorizar flujos de re-ajuste de claves de inicio de sesión.

***

### canEditPersonalData()

> **canEditPersonalData**(`user`): `boolean`

Defined in: [services/user-detail-permissions.service.ts:85](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/user-detail-permissions.service.ts#L85)

#### Parameters

##### user

[`User`](../interfaces/User.md)

Instancia del usuario en pantalla.

#### Returns

`boolean`

Retorna true si la mutación civil está amparada por las reglas de negocio.

#### Method

canEditPersonalData

#### Description

Evalúa la capacidad del operador para abrir a flujos de escritura el bloque civil de datos personales.

***

### getPermissions()

> **getPermissions**(`user`): `any`

Defined in: [services/user-detail-permissions.service.ts:32](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/user-detail-permissions.service.ts#L32)

#### Parameters

##### user

[`User`](../interfaces/User.md)

Instancia de datos del usuario mapeado activamente en la pantalla.

#### Returns

`any`

Mapa indexado con los booleanos jerárquicos y capacidades de edición computados.

#### Method

getPermissions

#### Description

Compila de forma masiva el set completo de banderas condicionales booleanas requeridas por la interfaz gráfica.
Determina de forma automática el estado de roles y si el operador está consultando su propia ficha corporativa.

***

### isOwnProfile()

> **isOwnProfile**(`user`): `boolean`

Defined in: [services/user-detail-permissions.service.ts:75](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/user-detail-permissions.service.ts#L75)

#### Parameters

##### user

[`User`](../interfaces/User.md)

Instancia del usuario en pantalla.

#### Returns

`boolean`

Retorna true si el usuario se está consultando a sí mismo.

#### Method

isOwnProfile

#### Description

Evalúa la correspondencia biunívoca de la identidad del operador autenticado frente a la ficha consultada.
