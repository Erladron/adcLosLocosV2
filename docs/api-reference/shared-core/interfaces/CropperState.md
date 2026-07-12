[**shared-core**](../README.md)

***

[shared-core](../README.md) / CropperState

# Interface: CropperState

Defined in: [models/user-detail.model.ts:92](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/user-detail.model.ts#L92)

CropperState

## Description

Estructura reguladora para gobernar el estado reactivo del modal ngx-image-cropper.

## Properties

### croppedImage

> **croppedImage**: `string`

Defined in: [models/user-detail.model.ts:97](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/user-detail.model.ts#L97)

#### Description

String Base64 resultante del procesamiento optimizado de recortes.

***

### imageChangedEvent

> **imageChangedEvent**: `any`

Defined in: [models/user-detail.model.ts:94](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/user-detail.model.ts#L94)

#### Description

Evento nativo del DOM de cambio de fichero disparado por el input file.

***

### mostrarCropper

> **mostrarCropper**: `boolean`

Defined in: [models/user-detail.model.ts:100](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/models/user-detail.model.ts#L100)

#### Description

Flag booleano para instanciar o destruir el panel del cropper de la vista.
