[**shared-core**](../README.md)

***

[shared-core](../README.md) / UserDetailPhotoService

# Class: UserDetailPhotoService

Defined in: [services/user-detail-photo.service.ts:14](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/user-detail-photo.service.ts#L14)

UserDetailPhotoService

## Description

Servicio core de soporte especializado en la gestión multimedia para la ficha de usuario.
Interactúa con los plugins por hardware de Capacitor Camera y gestiona la conversión de streams binarios
delegando la inserción final en el PhotoService de infraestructura.

## Constructors

### Constructor

> **new UserDetailPhotoService**(): `UserDetailPhotoService`

Defined in: [services/user-detail-photo.service.ts:23](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/user-detail-photo.service.ts#L23)

#### Returns

`UserDetailPhotoService`

#### Description

Inicializa el gestor de capturas multimedia del detalle de usuarios.

## Methods

### dataURLtoFile()

> **dataURLtoFile**(`dataurl`, `filename`): `File`

Defined in: [services/user-detail-photo.service.ts:79](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/user-detail-photo.service.ts#L79)

#### Parameters

##### dataurl

`string`

Cadena Base64 estructurada procedente de la API de la cámara.

##### filename

`string`

Nombre físico de salida que se le asignará al fichero binario.

#### Returns

`File`

Fichero binario listo para la manipulación de streams.

#### Method

dataURLtoFile

#### Description

Algoritmo de desestructuración que convierte una cadena DataURL en Base64 hacia un objeto binario File indexado.

***

### processCroppedImage()

> **processCroppedImage**(`event`): `string`

Defined in: [services/user-detail-photo.service.ts:99](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/user-detail-photo.service.ts#L99)

#### Parameters

##### event

`any`

Objeto evento resultante emitido por el cropper.

#### Returns

`string`

Cadena Base64 de la imagen limpia o un string vacío en caso de inconsistencia.

#### Method

processCroppedImage

#### Description

Sanea e independiza la porción de bits Base64 puros procedentes de los cortes del lienzo de ngx-image-cropper.

***

### selectPhoto()

> **selectPhoto**(): `Promise`\<`any`\>

Defined in: [services/user-detail-photo.service.ts:30](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/user-detail-photo.service.ts#L30)

#### Returns

`Promise`\<`any`\>

Promesa que resuelve el evento de cambio (`change`) del archivo multimedia seleccionado.

#### Method

selectPhoto

#### Description

Genera dinámicamente un elemento input de tipo archivo en el DOM del navegador para lanzar el explorador nativo.

***

### takePhoto()

> **takePhoto**(): `Promise`\<`any`\>

Defined in: [services/user-detail-photo.service.ts:48](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/user-detail-photo.service.ts#L48)

#### Returns

`Promise`\<`any`\>

Promesa asíncrona que resuelve el archivo empaquetado dentro de una simulación de estructura DataTransfer.

#### Method

takePhoto

#### Description

Despierta e inicializa los sensores de la cámara del chasis móvil. 
Pre-escala la resolución física por hardware a un ratio idóneo de 800x800px para aligerar la cuota de almacenamiento de Storage.

***

### uploadProfilePhoto()

> **uploadProfilePhoto**(`id`, `imageBase64`): `Promise`\<`string`\>

Defined in: [services/user-detail-photo.service.ts:113](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/user-detail-photo.service.ts#L113)

#### Parameters

##### id

`string`

Identificador único de usuario (UID) que se usará para nombrar al fichero en Storage.

##### imageBase64

`string`

Flujo de caracteres en Base64 de la fotografía de perfil solvente.

#### Returns

`Promise`\<`string`\>

Promesa que resuelve la URL pública de descarga emitida por el servidor de Storage.

#### Method

uploadProfilePhoto

#### Description

Invoca de forma asíncrona al PhotoService core para tramitar la subida física del binario del avatar a Firebase Storage.
