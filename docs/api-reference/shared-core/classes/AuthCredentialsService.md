[**shared-core**](../README.md)

***

[shared-core](../README.md) / AuthCredentialsService

# Class: AuthCredentialsService

Defined in: [services/auth-credentials.service.ts:20](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/auth-credentials.service.ts#L20)

AuthCredentialsService

## Description

Servicio core de seguridad perimetral encargado de gestionar las mutaciones críticas
de credenciales de acceso (email y contraseñas). Implementa los protocolos obligatorios de
re-autenticación en caliente exigidos por el proveedor Firebase Auth.

## Constructors

### Constructor

> **new AuthCredentialsService**(): `AuthCredentialsService`

Defined in: [services/auth-credentials.service.ts:29](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/auth-credentials.service.ts#L29)

#### Returns

`AuthCredentialsService`

#### Description

Inicializa el gestor especialista de credenciales de acceso.

## Methods

### reauthenticate()

> **reauthenticate**(`currentEmail`, `currentPassword`): `Promise`\<`void`\>

Defined in: [services/auth-credentials.service.ts:39](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/auth-credentials.service.ts#L39)

#### Parameters

##### currentEmail

`string`

Correo electrónico activo actual del usuario.

##### currentPassword

`string`

Contraseña plana actual introducida en el formulario.

#### Returns

`Promise`\<`void`\>

#### Method

reauthenticate

#### Description

Eleva los privilegios de la sesión actual validando la contraseña del socio contra el servidor de identidades.
Requisito de seguridad obligatorio antes de aplicar cambios en correos o claves de acceso.

***

### updateCredentials()

> **updateCredentials**(`currentEmail`, `currentPassword`, `newEmail`, `newPassword`): `Promise`\<`void`\>

Defined in: [services/auth-credentials.service.ts:114](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/auth-credentials.service.ts#L114)

#### Parameters

##### currentEmail

`string`

Email actual de la cuenta.

##### currentPassword

`string`

Contraseña actual verificadora.

##### newEmail

`string`

Nuevo email en edición.

##### newPassword

`string`

Nueva contraseña en edición.

#### Returns

`Promise`\<`void`\>

#### Method

updateCredentials

#### Description

🚀 REFACTORIZACIÓN TRANSACCIONAL ATÓMICA: Orquesta el cambio simultáneo de email y contraseña.
Ejecuta una única re-autenticación inicial compartida para blindar el flujo contra excepciones de token expirado.

***

### updateEmail()

> **updateEmail**(`currentEmail`, `currentPassword`, `newEmail`, `bypassReauth?`): `Promise`\<`void`\>

Defined in: [services/auth-credentials.service.ts:58](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/auth-credentials.service.ts#L58)

#### Parameters

##### currentEmail

`string`

Email actual.

##### currentPassword

`string`

Contraseña actual.

##### newEmail

`string`

Dirección del nuevo correo electrónico que se pretende asociar.

##### bypassReauth?

`boolean` = `false`

Opcional; evita la duplicidad de re-autenticación en flujos transaccionales combinados.

#### Returns

`Promise`\<`void`\>

#### Method

updateEmail

#### Description

Setea el idioma de mensajería en castellano e inicia el flujo seguro de pre-verificación de correo.
Envía un enlace de confirmación al nuevo email sin alterar el acceso original hasta que el socio lo valide.

***

### updateUserPassword()

> **updateUserPassword**(`currentEmail`, `currentPassword`, `newPassword`, `bypassReauth?`): `Promise`\<`void`\>

Defined in: [services/auth-credentials.service.ts:88](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/auth-credentials.service.ts#L88)

#### Parameters

##### currentEmail

`string`

Email actual.

##### currentPassword

`string`

Contraseña actual.

##### newPassword

`string`

Nueva contraseña de acceso.

##### bypassReauth?

`boolean` = `false`

Opcional; anula re-autenticaciones redundantes en llamadas masivas.

#### Returns

`Promise`\<`void`\>

#### Method

updateUserPassword

#### Description

Modifica de forma inmediata la contraseña plana de acceso del usuario autenticado.
