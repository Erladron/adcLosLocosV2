[**shared-core**](../README.md)

***

[shared-core](../README.md) / UserPhotoService

# Class: UserPhotoService

Defined in: [services/user-photo.service.ts:18](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/user-photo.service.ts#L18)

UserPhotoService

## Description

Servicio core de UI especialista en la orquestación e interacción con el hardware multimedia del dispositivo.
Provee pasarelas síncronas y asíncronas para disparar la cámara nativa, abrir el carrete de fotos del sistema,
procesar lienzos de recorte (ngx-image-cropper) y formatear estructuras binarias.

## Constructors

### Constructor

> **new UserPhotoService**(): `UserPhotoService`

Defined in: [services/user-photo.service.ts:30](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/user-photo.service.ts#L30)

#### Returns

`UserPhotoService`

#### Description

Inicializa el gestor periférico multimedia.

## Methods

### processCroppedImage()

> **processCroppedImage**(`event`): `Promise`\<`string`\>

Defined in: [services/user-photo.service.ts:82](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/user-photo.service.ts#L82)

#### Parameters

##### event

`ImageCroppedEvent`

Instancia estructural del evento devuelto por el ngx-image-cropper.

#### Returns

`Promise`\<`string`\>

Cadena binaria Base64 de la imagen recortada.

#### Method

processCroppedImage

#### Description

Procesa de forma atómica el evento emitido por el canvas del recortador visual.
Extrae el Blob resultante y lo conmutará a una cadena Base64 apta para el hilo de red.

***

### resetCropper()

> **resetCropper**(): [`CropperState`](../interfaces/CropperState.md)

Defined in: [services/user-photo.service.ts:131](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/user-photo.service.ts#L131)

#### Returns

[`CropperState`](../interfaces/CropperState.md)

Estructura inicializada conforme al contrato de interfaz oficial corporativo.

#### Method

resetCropper

#### Description

🚀 TIPADO: Genera un objeto de estado unificado e inicializado para limpiar el lienzo del recortador visual en la pantalla.

***

### selectFromGallery()

> **selectFromGallery**(): `Promise`\<`string`\>

Defined in: [services/user-photo.service.ts:38](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/user-photo.service.ts#L38)

#### Returns

`Promise`\<`string`\>

Cadena en formato DataURL Base64 o null en caso de cancelación del socio.

#### Method

selectFromGallery

#### Description

Lanza el selector nativo de la galería de fotos del sistema operativo.
Captura la imagen seleccionada y la extrae optimizada en una cadena con formato DataURL.

***

### takePhoto()

> **takePhoto**(): `Promise`\<`string`\>

Defined in: [services/user-photo.service.ts:59](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/user-photo.service.ts#L59)

#### Returns

`Promise`\<`string`\>

Cadena con la imagen codificada en formato DataURL Base64 o null si se desiste.

#### Method

takePhoto

#### Description

Invoca el disparador de la cámara fotográfica nativa del hardware del terminal.

***

### uploadUserPhoto()

> **uploadUserPhoto**(`uid`, `imageBase64`): `Promise`\<`string`\>

Defined in: [services/user-photo.service.ts:102](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/user-photo.service.ts#L102)

#### Parameters

##### uid

`string`

Identificador único universal del usuario titular.

##### imageBase64

`string`

Cadena codificada en formato DataURL de la imagen consolidada.

#### Returns

`Promise`\<`string`\>

URL de descarga pública emitida por el servidor NoSQL.

#### Method

uploadUserPhoto

#### Description

Delega de forma directa la subida física del avatar del socio hacia las carpetas protegidas del Storage.
