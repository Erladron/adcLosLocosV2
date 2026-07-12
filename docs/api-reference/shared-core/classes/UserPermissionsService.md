[**shared-core**](../README.md)

***

[shared-core](../README.md) / UserPermissionsService

# Class: UserPermissionsService

Defined in: [services/user-permissions.service.ts:13](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/user-permissions.service.ts#L13)

UserPermissionsService

## Description

Servicio especialista síncrono y puro encargado de evaluar la matriz de capacidades,
edición cruzada de fichas, borrado y gobernanza perimetral de usuarios en base a sus roles de organización.

## Constructors

### Constructor

> **new UserPermissionsService**(): `UserPermissionsService`

Defined in: [services/user-permissions.service.ts:19](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/user-permissions.service.ts#L19)

#### Returns

`UserPermissionsService`

#### Description

Inicializa el motor de evaluación de permisos sobre usuarios.

## Methods

### canAccessManagement()

> **canAccessManagement**(`user`): `boolean`

Defined in: [services/user-permissions.service.ts:153](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/user-permissions.service.ts#L153)

#### Parameters

##### user

[`User`](../interfaces/User.md)

#### Returns

`boolean`

#### Description

Concede o deniega la entrada al panel corporativo de control de gestión de socios.

***

### canApproveUsers()

> **canApproveUsers**(`user`): `boolean`

Defined in: [services/user-permissions.service.ts:96](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/user-permissions.service.ts#L96)

#### Parameters

##### user

[`User`](../interfaces/User.md)

#### Returns

`boolean`

#### Description

Determina si el operador puede visar u homologar solicitudes de onboarding pendientes.

***

### canChangeRole()

> **canChangeRole**(`currentUser`, `targetUser`): `boolean`

Defined in: [services/user-permissions.service.ts:138](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/user-permissions.service.ts#L138)

#### Parameters

##### currentUser

[`User`](../interfaces/User.md)

##### targetUser

[`User`](../interfaces/User.md)

#### Returns

`boolean`

#### Description

Evalúa si el operador tiene la facultad jerárquica de conmutar los roles de una cuenta.

***

### canCreateUsers()

> **canCreateUsers**(`user`): `boolean`

Defined in: [services/user-permissions.service.ts:102](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/user-permissions.service.ts#L102)

#### Parameters

##### user

[`User`](../interfaces/User.md)

#### Returns

`boolean`

#### Description

Determina si el operador posee permisos de invocación sobre altas manuales.

***

### canDeleteUser()

> **canDeleteUser**(`currentUser`, `targetUser`): `boolean`

Defined in: [services/user-permissions.service.ts:89](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/user-permissions.service.ts#L89)

#### Parameters

##### currentUser

[`User`](../interfaces/User.md)

##### targetUser

[`User`](../interfaces/User.md)

#### Returns

`boolean`

#### Method

canDeleteUser

#### Description

Regla destructiva atómica: Capacidad restrictiva exclusiva de administradores supremos.
Se prohíbe de forma taxativa el borrado de la propia cuenta activa.

***

### canEditCredentials()

> **canEditCredentials**(`currentUser`, `targetUser`): `boolean`

Defined in: [services/user-permissions.service.ts:171](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/user-permissions.service.ts#L171)

#### Parameters

##### currentUser

[`User`](../interfaces/User.md)

##### targetUser

[`User`](../interfaces/User.md)

#### Returns

`boolean`

#### Description

Regla de seguridad perimetral: Ningún usuario o directivo puede alterar las credenciales de acceso de un tercero.

***

### canEditMembership()

> **canEditMembership**(`currentUser`, `targetUser`): `boolean`

Defined in: [services/user-permissions.service.ts:70](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/user-permissions.service.ts#L70)

#### Parameters

##### currentUser

[`User`](../interfaces/User.md)

##### targetUser

[`User`](../interfaces/User.md)

#### Returns

`boolean`

#### Method

canEditMembership

#### Description

Regla organizativa: Los administradores mutan cualquier cuenta menos la suya propia.
Los directivos pueden alterar los metadatos organizativos de socios y otros directivos.

***

### canEditPersonalData()

> **canEditPersonalData**(`currentUser`, `targetUser`): `boolean`

Defined in: [services/user-permissions.service.ts:60](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/user-permissions.service.ts#L60)

#### Parameters

##### currentUser

[`User`](../interfaces/User.md)

Operador activo en la sesión.

##### targetUser

[`User`](../interfaces/User.md)

Usuario sobre el que se pretende aplicar la edición.

#### Returns

`boolean`

#### Method

canEditPersonalData

#### Description

Regla perimetral: Todos los perfiles civiles pueden modificar únicamente sus propios datos.

***

### canInviteUsers()

> **canInviteUsers**(`user`): `boolean`

Defined in: [services/user-permissions.service.ts:165](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/user-permissions.service.ts#L165)

#### Parameters

##### user

[`User`](../interfaces/User.md)

#### Returns

`boolean`

#### Description

Evalúa si la cuenta dispone de permisos para expedir invitaciones web de pre-alta.

***

### canManageEvents()

> **canManageEvents**(`user`): `boolean`

Defined in: [services/user-permissions.service.ts:159](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/user-permissions.service.ts#L159)

#### Parameters

##### user

[`User`](../interfaces/User.md)

#### Returns

`boolean`

#### Description

Otorga privilegios para crear, editar o purgar convocatorias en la agenda de eventos.

***

### getAvailableRoles()

> **getAvailableRoles**(`user`): [`UserRole`](../enumerations/UserRole.md)[]

Defined in: [services/user-permissions.service.ts:114](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/user-permissions.service.ts#L114)

#### Parameters

##### user

[`User`](../interfaces/User.md)

Operador que realiza la consulta.

#### Returns

[`UserRole`](../enumerations/UserRole.md)[]

Lista de roles disponibles.

#### Method

getAvailableRoles

#### Description

🚀 ACTULIZADO: Retorna los tokens de rol asignables por el operador de cara a formularios de altas o cambios de rango.
Incorpora el rol PORTERO al catálogo visible de la administración.

***

### isAdmin()

> **isAdmin**(`user`): `boolean`

Defined in: [services/user-permissions.service.ts:26](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/user-permissions.service.ts#L26)

#### Parameters

##### user

[`User`](../interfaces/User.md)

#### Returns

`boolean`

#### Description

Informa si el usuario ostenta el rango supremo de Administrador.

***

### isDirectiva()

> **isDirectiva**(`user`): `boolean`

Defined in: [services/user-permissions.service.ts:32](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/user-permissions.service.ts#L32)

#### Parameters

##### user

[`User`](../interfaces/User.md)

#### Returns

`boolean`

#### Description

Informa si el usuario pertenece al cuerpo operativo de la Junta Directiva.

***

### isInvitado()

> **isInvitado**(`user`): `boolean`

Defined in: [services/user-permissions.service.ts:44](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/user-permissions.service.ts#L44)

#### Parameters

##### user

[`User`](../interfaces/User.md)

#### Returns

`boolean`

#### Description

Informa si el usuario está catalogado como un Invitado externo latente.

***

### isSocio()

> **isSocio**(`user`): `boolean`

Defined in: [services/user-permissions.service.ts:38](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/user-permissions.service.ts#L38)

#### Parameters

##### user

[`User`](../interfaces/User.md)

#### Returns

`boolean`

#### Description

Informa si el usuario posee la ficha regular de Socio.
