[**shared-core**](../README.md)

***

[shared-core](../README.md) / AuthPoliciesService

# Class: AuthPoliciesService

Defined in: [services/auth-policies.service.ts:15](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/auth-policies.service.ts#L15)

AuthPoliciesService

## Description

Servicio de nivel superior especialista en la resolución de políticas de negocio complejas
y restricciones de acceso perimetral. Utilizado por los Guards de enrutamiento y las directivas estructurales 
de la vista para determinar si un socio puede alterar el estado de un componente.

## Constructors

### Constructor

> **new AuthPoliciesService**(): `AuthPoliciesService`

Defined in: [services/auth-policies.service.ts:24](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/auth-policies.service.ts#L24)

#### Returns

`AuthPoliciesService`

#### Description

Inicializa el motor de evaluación de políticas y capacidades.

## Accessors

### currentUser

#### Get Signature

> **get** **currentUser**(): [`User`](../interfaces/User.md)

Defined in: [services/auth-policies.service.ts:47](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/auth-policies.service.ts#L47)

##### Description

Provee el documento completo de Firestore con los metadatos de auditoría del socio.

##### Returns

[`User`](../interfaces/User.md)

***

### role

#### Get Signature

> **get** **role**(): `string`

Defined in: [services/auth-policies.service.ts:55](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/auth-policies.service.ts#L55)

##### Description

Devuelve la cadena del rango jerárquico que ostenta el usuario logueado.

##### Returns

`string`

## Methods

### canAccessAdminArea()

> **canAccessAdminArea**(): `boolean`

Defined in: [services/auth-policies.service.ts:121](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/auth-policies.service.ts#L121)

#### Returns

`boolean`

True si el operador es Administrador o Directiva.

#### Method

canAccessAdminArea

#### Description

Regla de negocio que concede o deniega el acceso perimetral a las vistas de administración.

***

### canManageUsers()

> **canManageUsers**(): `boolean`

Defined in: [services/auth-policies.service.ts:130](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/auth-policies.service.ts#L130)

#### Returns

`boolean`

True si el operador es Administrador o Directiva.

#### Method

canManageUsers

#### Description

Regla de negocio que otorga privilegios de modificación de altas, bajas y estados en el padrón de socios.

***

### hasStatus()

> **hasStatus**(`status`): `boolean`

Defined in: [services/auth-policies.service.ts:93](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/auth-policies.service.ts#L93)

#### Parameters

##### status

[`UserStatus`](../enumerations/UserStatus.md)

Constante de verificación de estado.

#### Returns

`boolean`

#### Method

hasStatus

#### Description

Contrasta si el estado del chasis del perfil coincide con la directiva solicitada.

***

### isActive()

> **isActive**(): `boolean`

Defined in: [services/auth-policies.service.ts:98](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/auth-policies.service.ts#L98)

#### Returns

`boolean`

#### Description

Retorna true si el socio se encuentra en estado plenamente verificado y activo.

***

### isAdmin()

> **isAdmin**(): `boolean`

Defined in: [services/auth-policies.service.ts:64](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/auth-policies.service.ts#L64)

#### Returns

`boolean`

#### Description

Informa si el usuario posee privilegios de Administrador Supremo.

***

### isDirectiva()

> **isDirectiva**(): `boolean`

Defined in: [services/auth-policies.service.ts:69](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/auth-policies.service.ts#L69)

#### Returns

`boolean`

#### Description

Informa si el usuario pertenece formalmente a la Junta Directiva de la peña.

***

### isInvitado()

> **isInvitado**(): `boolean`

Defined in: [services/auth-policies.service.ts:79](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/auth-policies.service.ts#L79)

#### Returns

`boolean`

#### Description

Informa si la cuenta se encuentra tipada como un Invitado externo latente.

***

### isLogged()

> **isLogged**(): `boolean`

Defined in: [services/auth-policies.service.ts:35](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/auth-policies.service.ts#L35)

#### Returns

`boolean`

#### Method

isLogged

#### Description

Informa si consta un canal de autenticación autenticado en la sesión local.

***

### isPendingApproval()

> **isPendingApproval**(): `boolean`

Defined in: [services/auth-policies.service.ts:108](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/auth-policies.service.ts#L108)

#### Returns

`boolean`

#### Description

Retorna true si el alta civil está en la cola a la espera de aprobación formal de la junta.

***

### isPendingData()

> **isPendingData**(): `boolean`

Defined in: [services/auth-policies.service.ts:103](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/auth-policies.service.ts#L103)

#### Returns

`boolean`

#### Description

Retorna true si el aspirante tiene pendiente la cumplimentación de sus datos de onboarding.

***

### isSocio()

> **isSocio**(): `boolean`

Defined in: [services/auth-policies.service.ts:74](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/auth-policies.service.ts#L74)

#### Returns

`boolean`

#### Description

Informa si el usuario posee la ficha regular sujeta a cuotas de Socio.
