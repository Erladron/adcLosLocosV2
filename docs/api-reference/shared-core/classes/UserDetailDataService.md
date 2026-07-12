[**shared-core**](../README.md)

***

[shared-core](../README.md) / UserDetailDataService

# Class: UserDetailDataService

Defined in: [services/user-detail-data.service.ts:23](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/user-detail-data.service.ts#L23)

UserDetailDataService

## Description

Servicio intermedio de la capa core encargado de orquestar el procesamiento de datos,
las subidas multimedia de imágenes de perfil y la gestión del flujo de navegación pos-onboarding.
Saneado por completo para centralizar las mutaciones y auditorías de cuotas en el satélite financiero.

## Constructors

### Constructor

> **new UserDetailDataService**(): `UserDetailDataService`

Defined in: [services/user-detail-data.service.ts:50](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/user-detail-data.service.ts#L50)

#### Returns

`UserDetailDataService`

#### Description

Inicializa el servicio de procesamiento de datos de usuario.

## Methods

### createUser()

> **createUser**(`params`): `Promise`\<`boolean`\>

Defined in: [services/user-detail-data.service.ts:232](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/user-detail-data.service.ts#L232)

#### Parameters

##### params

Parámetros del chasis de alta compilados por el formulario de creación.

###### croppedImage

`string`

###### password

`string`

###### repeatEmail

`string`

###### repeatPassword

`string`

###### user

[`User`](../interfaces/User.md)

#### Returns

`Promise`\<`boolean`\>

Promesa asíncrona de alta exitosa.

#### Method

createUser

#### Description

Orquesta y valida la creación manual directa de un nuevo socio en el sistema por parte de la directiva.
Setea los valores por defecto de privacidad, fuerza la inicialización de la cuota y delega en el AuthService.

***

### updateCredentials()

> **updateCredentials**(`params`): `Promise`\<`boolean`\>

Defined in: [services/user-detail-data.service.ts:167](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/user-detail-data.service.ts#L167)

#### Parameters

##### params

Parámetros compuestos del subformulario de credenciales de seguridad.

###### currentPassword

`string`

###### isOwnProfile

`boolean`

###### originalEmail

`string`

###### password

`string`

###### repeatEmail

`string`

###### repeatPassword

`string`

###### user

[`User`](../interfaces/User.md)

###### userId

`string`

#### Returns

`Promise`\<`boolean`\>

Promesa asíncrona de resolución.

#### Method

updateCredentials

#### Description

Valida la equivalencia sintáctica e invoca la actualización asíncrona de correos o claves de inicio de sesión.

***

### updateMembership()

> **updateMembership**(`params`): `Promise`\<`boolean`\>

Defined in: [services/user-detail-data.service.ts:127](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/user-detail-data.service.ts#L127)

#### Parameters

##### params

Parámetros desestructurados que contienen el modelo del usuario y su identificador de documento.

###### user

[`User`](../interfaces/User.md)

###### userId

`string`

#### Returns

`Promise`\<`boolean`\>

Promesa asíncrona que resuelve a true si la persistencia fue consolidada correctamente.

#### Method

updateMembership

#### Description

🚀 REFACTORIZACIÓN CRÍTICA CENTRALIZADA: Actualiza el rango corporativo jerárquico y el número de socio.
Intercepta el flujo del cliente para discriminar si el rol asignado está sujeto al abono de membresías (Socio o Directiva).
En tal caso, delega el guardado en el método `updateCuotaStatus` del satélite `UserFeesService`, el cual encapsula
e inyecta las marcas inmutables de auditoría financiera exigidas en el servidor.

***

### updatePersonalData()

> **updatePersonalData**(`params`): `Promise`\<`boolean`\>

Defined in: [services/user-detail-data.service.ts:59](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/user-detail-data.service.ts#L59)

#### Parameters

##### params

Objeto desestructurado con el modelo del usuario, su identificador y la imagen Base64 del cropper.

###### croppedImage

`string`

###### user

[`User`](../interfaces/User.md)

###### userId

`string`

#### Returns

`Promise`\<`boolean`\>

Promesa asíncrona que resuelve a true si la mutación civil fue exitosa.

#### Method

updatePersonalData

#### Description

Procesa la normalización PascalCase del nombre, gestiona la subida asíncrona del archivo multimedia
a Storage y despacha el payload tipado hacia el endpoint limpio del UserService.
