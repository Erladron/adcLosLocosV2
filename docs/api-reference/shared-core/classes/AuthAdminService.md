[**shared-core**](../README.md)

***

[shared-core](../README.md) / AuthAdminService

# Class: AuthAdminService

Defined in: [services/auth-admin.service.ts:16](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/auth-admin.service.ts#L16)

AuthAdminService

## Description

Servicio de soporte especializado en la ejecución de procedimientos privilegiados de administración.
Consume de forma exclusiva Cloud Functions de Firebase mediante el protocolo seguro HTTPS Callable del SDK,
abstrayendo la lógica de tokens e infraestructura tanto en local (emuladores) como en producción.

## Constructors

### Constructor

> **new AuthAdminService**(): `AuthAdminService`

Defined in: [services/auth-admin.service.ts:31](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/auth-admin.service.ts#L31)

#### Returns

`AuthAdminService`

#### Description

Inicializa el gestor de llamadas privilegiadas de la directiva.

## Methods

### createUserAsAdmin()

> **createUserAsAdmin**(`user`): `Promise`\<`any`\>

Defined in: [services/auth-admin.service.ts:40](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/auth-admin.service.ts#L40)

#### Parameters

##### user

`any`

Datos estructurados del nuevo socio o portero.

#### Returns

`Promise`\<`any`\>

Promesa asíncrona con el resultado emitido por el backend.

#### Method

createUserAsAdmin

#### Description

🚀 REFACTORIZADO: Invoca la Cloud Function encargada de crear de forma síncrona un usuario en el servidor,
saltándose la pre-alta civil web. Refactorizado de Fetch manual a HTTPS Callable nativo para unificar el chasis.

***

### getToken()

> **getToken**(): `Promise`\<`string`\>

Defined in: [services/auth-admin.service.ts:82](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/auth-admin.service.ts#L82)

#### Returns

`Promise`\<`string`\>

Cadena alfanumérica del token de sesión.

#### Method

getToken

#### Description

Extrae de forma asíncrona la cadena del token Bearer JWT activo del usuario logueado.

***

### hasValidAdminSession()

> **hasValidAdminSession**(): `Promise`\<`boolean`\>

Defined in: [services/auth-admin.service.ts:62](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/auth-admin.service.ts#L62)

#### Returns

`Promise`\<`boolean`\>

True si la sesión es solvente, false en caso de revocación o desatención.

#### Method

hasValidAdminSession

#### Description

Comprueba mediante doble check de refresco forzado si los tokens de la sesión activa del 
operador administrador siguen vigentes y autorizados frente al servidor de identidades.

***

### sendCustomResetPasswordEmail()

> **sendCustomResetPasswordEmail**(`email`): `Promise`\<`any`\>

Defined in: [services/auth-admin.service.ts:96](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/auth-admin.service.ts#L96)

#### Parameters

##### email

`string`

Correo electrónico destino del socio aspirante.

#### Returns

`Promise`\<`any`\>

Promesa de resolución del canal de mensajería.

#### Method

sendCustomResetPasswordEmail

#### Description

Envía el enlace seguro y corporativo de reseteo de contraseñas a la dirección de correo indicada,
delegando el proceso en el disparador Cloud Function configurado.
