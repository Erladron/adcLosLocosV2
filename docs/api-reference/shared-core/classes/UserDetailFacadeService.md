[**shared-core**](../README.md)

***

[shared-core](../README.md) / UserDetailFacadeService

# Class: UserDetailFacadeService

Defined in: [services/user-detail-facade.service.ts:16](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/user-detail-facade.service.ts#L16)

UserDetailFacadeService

## Description

Fachada arquitectónica de abstracción encargada de consolidar, unificar y simplificar
las llamadas del chasis del controlador de detalle (`UserDetailPage`) hacia los servicios 
especialistas de permisos, mutaciones de datos y hardware multimedia de fotografía.

## Constructors

### Constructor

> **new UserDetailFacadeService**(): `UserDetailFacadeService`

Defined in: [services/user-detail-facade.service.ts:31](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/user-detail-facade.service.ts#L31)

#### Returns

`UserDetailFacadeService`

#### Description

Inicializa la fachada unificada del detalle de usuarios.

## Methods

### createUser()

> **createUser**(`data`): `Promise`\<`boolean`\>

Defined in: [services/user-detail-facade.service.ts:88](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/user-detail-facade.service.ts#L88)

#### Parameters

##### data

Estructura con las contraseñas, emails y datos iniciales de la cuenta.

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

Promesa asíncrona de creación.

#### Method

createUser

#### Description

Canaliza hacia el DataService el flujo operativo completo de validación y alta manual administrativa de un nuevo socio.

***

### getPermissions()

> **getPermissions**(`user`): `any`

Defined in: [services/user-detail-facade.service.ts:39](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/user-detail-facade.service.ts#L39)

#### Parameters

##### user

[`User`](../interfaces/User.md)

Instancia del modelo de datos del usuario evaluado en la pantalla.

#### Returns

`any`

Objeto descriptor de permisos booleanos para el controlador visual.

#### Method

getPermissions

#### Description

Obtiene de forma síncrona la matriz indexada de capacidades, flags y derechos de edición de la ficha.

***

### processCroppedImage()

> **processCroppedImage**(`event`): `string`

Defined in: [services/user-detail-facade.service.ts:122](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/user-detail-facade.service.ts#L122)

#### Parameters

##### event

`any`

Evento nativo emitido por el componente `ngx-image-cropper`.

#### Returns

`string`

Cadena Base64 limpia de la imagen recortada.

#### Method

processCroppedImage

#### Description

Delega en el PhotoService el saneamiento y la extracción del string binario Base64 del lienzo del cropper.

***

### selectPhoto()

> **selectPhoto**(): `Promise`\<`any`\>

Defined in: [services/user-detail-facade.service.ts:103](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/user-detail-facade.service.ts#L103)

#### Returns

`Promise`\<`any`\>

Promesa con el evento de cambio (`change`) del archivo multimedia devuelto.

#### Method

selectPhoto

#### Description

Dispara a través del PhotoService la apertura dinámica del explorador nativo de archivos del sistema operativo.

***

### takePhoto()

> **takePhoto**(): `Promise`\<`any`\>

Defined in: [services/user-detail-facade.service.ts:112](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/user-detail-facade.service.ts#L112)

#### Returns

`Promise`\<`any`\>

Promesa asíncrona con el evento multimedia estructurado.

#### Method

takePhoto

#### Description

Invoca a través del PhotoService la inicialización y captura de los sensores de la cámara por hardware Capacitor.

***

### updateCredentials()

> **updateCredentials**(`data`): `Promise`\<`boolean`\>

Defined in: [services/user-detail-facade.service.ts:69](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/user-detail-facade.service.ts#L69)

#### Parameters

##### data

Parámetros y contraseñas del formulario de credenciales de seguridad.

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

Distribuye hacia el DataService la solicitud de validación y cambio de correos electrónicos o contraseñas primarias.

***

### updateMembership()

> **updateMembership**(`data`): `Promise`\<`boolean`\>

Defined in: [services/user-detail-facade.service.ts:59](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/user-detail-facade.service.ts#L59)

#### Parameters

##### data

Parámetros compuestos del usuario e identificador de documento.

###### user

[`User`](../interfaces/User.md)

###### userId

`string`

#### Returns

`Promise`\<`boolean`\>

Promesa asíncrona que resuelve a true tras el éxito del guardado jerárquico.

#### Method

updateMembership

#### Description

Transmite hacia el DataService la orden de actualización de roles corporativos y control financiero de cuotas.

***

### updatePersonalData()

> **updatePersonalData**(`data`): `Promise`\<`boolean`\>

Defined in: [services/user-detail-facade.service.ts:49](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/user-detail-facade.service.ts#L49)

#### Parameters

##### data

Objeto compuesto con el modelo de datos, ID del documento y Base64 de la imagen del recortador.

###### croppedImage

`string`

###### user

[`User`](../interfaces/User.md)

###### userId

`string`

#### Returns

`Promise`\<`boolean`\>

Promesa asíncrona que resuelve a true si la mutación civil fue consolidada con éxito.

#### Method

updatePersonalData

#### Description

Canaliza y delega en el DataService el saneamiento y la persistencia de los datos personales civiles.
