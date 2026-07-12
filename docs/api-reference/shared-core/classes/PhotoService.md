[**shared-core**](../README.md)

***

[shared-core](../README.md) / PhotoService

# Class: PhotoService

Defined in: [services/photo.service.ts:24](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/photo.service.ts#L24)

PhotoService

## Description

Servicio core especialista de infraestructura encargado de administrar la persistencia de ficheros
binarios multimedia en Firebase Storage. Provee capacidades de transformación atómica (DataURL Base64 a Blobs binarios)
y gestiona las estructuras de directorios aislados para perfiles y cartelería de la peña.

## Constructors

### Constructor

> **new PhotoService**(): `PhotoService`

Defined in: [services/photo.service.ts:39](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/photo.service.ts#L39)

#### Returns

`PhotoService`

#### Description

Inicializa el gestor especialista de almacenamiento multimedia.

## Methods

### uploadEventPoster()

> **uploadEventPoster**(`eventId`, `base64`): `Promise`\<`string`\>

Defined in: [services/photo.service.ts:76](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/photo.service.ts#L76)

#### Parameters

##### eventId

`string`

Identificador único universal de la convocatoria de referencia.

##### base64

`string`

Cadena de caracteres de la imagen optimizada desde el canvas local en formato DataURL.

#### Returns

`Promise`\<`string`\>

Promesa que resuelve con la URL de descarga pública para inyectar en el documento de Firestore.

#### Method

uploadEventPoster

#### Description

Sube el póster, cartel publicitario o imagen de una convocatoria a la carpeta 'eventPosters'.
Mantiene el mismo flujo de conversión binaria eficiente que la foto de perfil para blindar la memoria móvil.

***

### uploadProfilePhoto()

> **uploadProfilePhoto**(`uid`, `base64`): `Promise`\<`string`\>

Defined in: [services/photo.service.ts:49](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/photo.service.ts#L49)

#### Parameters

##### uid

`string`

Identificador único universal del usuario titular.

##### base64

`string`

Cadena de caracteres de la imagen en formato DataURL codificada.

#### Returns

`Promise`\<`string`\>

Promesa que resuelve con la URL de descarga pública emitida por Firebase Storage.

#### Method

uploadProfilePhoto

#### Description

Sube la fotografía de avatar de un socio a la carpeta dedicada 'profilePhotos'.
Transforma el string DataURL en un Blob físico optimizado antes de realizar la transferencia de red.
