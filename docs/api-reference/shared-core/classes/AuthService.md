[**shared-core**](../README.md)

***

[shared-core](../README.md) / AuthService

# Class: AuthService

Defined in: [services/auth.service.ts:20](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/auth.service.ts#L20)

AuthService

## Description

Fachada orquestadora central (Facade Pattern) para todo el ecosistema de autenticación,
control perimetral de sesiones y mapeo de roles jerárquicos de la peña.
No contiene lógica directa de infraestructura, delegando la operatividad de forma exclusiva en 
subservicios especialistas inyectados para mitigar ficheros monstruo.

## Constructors

### Constructor

> **new AuthService**(`sessionService`, `registerService`, `credentialsService`, `permissionsService`, `adminService`): `AuthService`

Defined in: [services/auth.service.ts:31](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/auth.service.ts#L31)

#### Parameters

##### sessionService

[`AuthSessionService`](AuthSessionService.md)

Gestor de estados de la sesión activa y recargas de tokens.

##### registerService

[`AuthRegisterService`](AuthRegisterService.md)

Orquestador de flujos de alta y canjes de invitaciones web.

##### credentialsService

[`AuthCredentialsService`](AuthCredentialsService.md)

Especialista en modificaciones críticas de correos y passwords.

##### permissionsService

[`AuthPermissionsService`](AuthPermissionsService.md)

Evaluador síncrono de matrices de políticas, roles y estados.

##### adminService

[`AuthAdminService`](AuthAdminService.md)

Pasarela de Cloud Functions administrativas y reseteos corporativos.

#### Returns

`AuthService`

#### Description

Inicializa la pasarela unificada e invoca el arranque inmediato del listener de Firebase Auth.

## Accessors

### authReady

#### Get Signature

> **get** **authReady**(): `boolean`

Defined in: [services/auth.service.ts:66](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/auth.service.ts#L66)

##### Description

Informa si el motor interno de Firebase ha concluido el handshake de inicialización.

##### Returns

`boolean`

***

### currentUser

#### Get Signature

> **get** **currentUser**(): `User`

Defined in: [services/auth.service.ts:50](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/auth.service.ts#L50)

##### Description

Obtiene la instancia cruda del usuario autenticado en el SDK de Firebase Auth.

##### Returns

`User`

***

### currentUserData

#### Get Signature

> **get** **currentUserData**(): [`User`](../interfaces/User.md)

Defined in: [services/auth.service.ts:58](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/auth.service.ts#L58)

##### Description

Provee la proyección de datos del socio almacenada en la colección principal `/users` de Firestore.

##### Returns

[`User`](../interfaces/User.md)

## Methods

### createUserAsAdmin()

> **createUserAsAdmin**(`user`): `Promise`\<`any`\>

Defined in: [services/auth.service.ts:215](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/auth.service.ts#L215)

#### Parameters

##### user

`any`

Instancia con los datos y contraseñas del socio.

#### Returns

`Promise`\<`any`\>

#### Method

createUserAsAdmin

#### Description

Invoca el alta manual directa de un usuario a través del administrador saltándose el proceso de pre-alta web.

***

### getRole()

> **getRole**(): `string`

Defined in: [services/auth.service.ts:274](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/auth.service.ts#L274)

#### Returns

`string`

#### Description

Recupera de forma síncrona la cadena del rango de rol asignado al documento.

***

### getToken()

> **getToken**(): `Promise`\<`string`\>

Defined in: [services/auth.service.ts:233](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/auth.service.ts#L233)

#### Returns

`Promise`\<`string`\>

#### Method

getToken

#### Description

Extrae el JsonWebToken (JWT) de Firebase Auth activo en la sesión del dispositivo.

***

### getUid()

> **getUid**(): `string`

Defined in: [services/auth.service.ts:269](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/auth.service.ts#L269)

#### Returns

`string`

#### Description

Recupera de forma síncrona el string del UID del canal de autenticación.

***

### hasValidAdminSession()

> **hasValidAdminSession**(): `Promise`\<`boolean`\>

Defined in: [services/auth.service.ts:224](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/auth.service.ts#L224)

#### Returns

`Promise`\<`boolean`\>

#### Method

hasValidAdminSession

#### Description

Verifica si la sesión del administrador posee los tokens vigentes requeridos por los interceptores.

***

### isActivo()

> **isActivo**(): `boolean`

Defined in: [services/auth.service.ts:299](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/auth.service.ts#L299)

#### Returns

`boolean`

#### Description

Retorna true si el usuario se encuentra plenamente habilitado y activo en la app.

***

### isAdmin()

> **isAdmin**(): `boolean`

Defined in: [services/auth.service.ts:279](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/auth.service.ts#L279)

#### Returns

`boolean`

#### Description

Retorna true si el operador ostenta privilegios totales de Administrador.

***

### isDirectiva()

> **isDirectiva**(): `boolean`

Defined in: [services/auth.service.ts:284](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/auth.service.ts#L284)

#### Returns

`boolean`

#### Description

Retorna true si el operador pertenece al cuerpo de la Junta Directiva.

***

### isInactive()

> **isInactive**(): `boolean`

Defined in: [services/auth.service.ts:309](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/auth.service.ts#L309)

#### Returns

`boolean`

#### Description

Retorna true si la cuenta presenta una baja lógica del sistema.

***

### isInvitado()

> **isInvitado**(): `boolean`

Defined in: [services/auth.service.ts:294](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/auth.service.ts#L294)

#### Returns

`boolean`

#### Description

Retorna true si la cuenta es un perfil externo o Invitado web.

***

### isLogged()

> **isLogged**(): `boolean`

Defined in: [services/auth.service.ts:264](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/auth.service.ts#L264)

#### Returns

`boolean`

#### Description

Retorna true si consta un usuario autenticado activo en el chasis local.

***

### isPendienteAprobacion()

> **isPendienteAprobacion**(): `boolean`

Defined in: [services/auth.service.ts:304](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/auth.service.ts#L304)

#### Returns

`boolean`

#### Description

Retorna true si el alta civil del aspirante está en cola a la espera del veredicto de la directiva.

***

### isSocio()

> **isSocio**(): `boolean`

Defined in: [services/auth.service.ts:289](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/auth.service.ts#L289)

#### Returns

`boolean`

#### Description

Retorna true si el operador posee la ficha ordinaria sujeta a cuotas de Socio.

***

### login()

> **login**(`email`, `password`): `Promise`\<`any`\>

Defined in: [services/auth.service.ts:119](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/auth.service.ts#L119)

#### Parameters

##### email

`string`

Correo electrónico.

##### password

`string`

Contraseña plana.

#### Returns

`Promise`\<`any`\>

Resultado de la promesa de autenticación.

#### Method

login

#### Description

Autentica al operador, recarga el perfil y valida de forma inmediata si se encuentra en estado INACTIVE 
para denegar el acceso instantáneamente en caso de baja lógica por impago o expulsión.

***

### logout()

> **logout**(): `Promise`\<`void`\>

Defined in: [services/auth.service.ts:140](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/auth.service.ts#L140)

#### Returns

`Promise`\<`void`\>

#### Method

logout

#### Description

Destruye los tokens y cierra la sesión activa en el cliente.

***

### refreshUserDataFromServer()

> **refreshUserDataFromServer**(): `Promise`\<`any`\>

Defined in: [services/auth.service.ts:242](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/auth.service.ts#L242)

#### Returns

`Promise`\<`any`\>

Perfil del usuario actualizado.

#### Method

refreshUserDataFromServer

#### Description

Fuerza la recarga de datos inyectando el resultado directamente sobre los Guards de enrutamiento.

***

### register()

> **register**(`user`, `checkPreRegister?`): `Promise`\<`any`\>

Defined in: [services/auth.service.ts:165](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/auth.service.ts#L165)

#### Parameters

##### user

`any`

Datos del formulario de alta.

##### checkPreRegister?

`boolean` = `true`

True si exige la presencia del token de invitación previa.

#### Returns

`Promise`\<`any`\>

#### Method

register

#### Description

Procesa las solicitudes de registro web, validando opcionalmente si el email ha sido sembrado previamente en invitaciones.

***

### reloadUserData()

> **reloadUserData**(`uid`): `Promise`\<`any`\>

Defined in: [services/auth.service.ts:150](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/auth.service.ts#L150)

#### Parameters

##### uid

`string`

Identificador único de usuario.

#### Returns

`Promise`\<`any`\>

#### Method

reloadUserData

#### Description

Sincroniza y fuerza la re-lectura del documento del socio desde Firestore hacia el chasis reactivo.

***

### sendCustomResetPasswordEmail()

> **sendCustomResetPasswordEmail**(`email`): `Promise`\<`any`\>

Defined in: [services/auth.service.ts:255](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/auth.service.ts#L255)

#### Parameters

##### email

`string`

Correo destino.

#### Returns

`Promise`\<`any`\>

#### Method

sendCustomResetPasswordEmail

#### Description

Lanza el envío del enlace de configuración de contraseñas personalizado a través de la Cloud Function.

***

### updateCredentials()

> **updateCredentials**(`uid`, `currentEmail`, `currentPassword`, `newEmail`, `newPassword`): `Promise`\<`void`\>

Defined in: [services/auth.service.ts:190](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/auth.service.ts#L190)

#### Parameters

##### uid

`string`

UID del usuario afectado.

##### currentEmail

`string`

Email actual exigido para re-autenticación.

##### currentPassword

`string`

Password actual exigida para re-autenticación.

##### newEmail

`string`

Nuevo email de acceso.

##### newPassword

`string`

Nueva contraseña de acceso.

#### Returns

`Promise`\<`void`\>

#### Method

updateCredentials

#### Description

Ejecuta de forma segura cambios en el correo electrónico o contraseñas primarias delegando en el subservicio.

***

### waitForAuthReady()

> **waitForAuthReady**(): `Promise`\<`void`\>

Defined in: [services/auth.service.ts:79](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/auth.service.ts#L79)

#### Returns

`Promise`\<`void`\>

#### Method

waitForAuthReady

#### Description

Detiene el flujo de ejecución de forma asíncrona hasta que el canal de Auth esté listo.

***

### waitForUserData()

> **waitForUserData**(): `Promise`\<`void`\>

Defined in: [services/auth.service.ts:89](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/auth.service.ts#L89)

#### Returns

`Promise`\<`void`\>

#### Method

waitForUserData

#### Description

Implementa un bucle de reintentos controlados con gracia para asegurar la descarga del documento 
de Firestore del socio post-login, mitigando condiciones de carrera y loops infinitos en la UI.
