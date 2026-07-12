[**shared-core**](../README.md)

***

[shared-core](../README.md) / NotificationService

# Class: NotificationService

Defined in: [services/notification.service.ts:25](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/notification.service.ts#L25)

NotificationService

## Description

Servicio core de UI especialista en la emisión, maquetación y renderizado
de notificaciones flotantes (Toasts contextuales) en la parte superior de la interfaz.
Centraliza el diccionario de traducción de códigos de error y el registro atómico de iconos nativos.

## Constructors

### Constructor

> **new NotificationService**(): `NotificationService`

Defined in: [services/notification.service.ts:34](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/notification.service.ts#L34)

#### Returns

`NotificationService`

#### Description

Registra de forma inmediata la matriz de iconos vectoriales requeridos por los Toasts corporativos.

## Methods

### error()

> **error**(`message`): `Promise`\<`void`\>

Defined in: [services/notification.service.ts:64](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/notification.service.ts#L64)

#### Parameters

##### message

`string`

Código oficial de la app o cadena textual explícita a traducir.

#### Returns

`Promise`\<`void`\>

#### Method

error

#### Description

Despacha una notificación flotante de error crítico con temática rojiza e icono de cierre.

***

### info()

> **info**(`message`): `Promise`\<`void`\>

Defined in: [services/notification.service.ts:92](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/notification.service.ts#L92)

#### Parameters

##### message

`string`

Código oficial de la app o cadena textual explícita a traducir.

#### Returns

`Promise`\<`void`\>

#### Method

info

#### Description

Despacha una notificación flotante informativa o neutral con temática azulada.

***

### success()

> **success**(`message`): `Promise`\<`void`\>

Defined in: [services/notification.service.ts:50](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/notification.service.ts#L50)

#### Parameters

##### message

`string`

Código oficial de la app o cadena textual explícita a traducir.

#### Returns

`Promise`\<`void`\>

#### Method

success

#### Description

Despacha una notificación flotante de éxito con temática verdosa e icono de verificación.

***

### warning()

> **warning**(`message`): `Promise`\<`void`\>

Defined in: [services/notification.service.ts:78](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/notification.service.ts#L78)

#### Parameters

##### message

`string`

Código oficial de la app o cadena textual explícita a traducir.

#### Returns

`Promise`\<`void`\>

#### Method

warning

#### Description

Despacha una notificación flotante de advertencia preventiva con temática anaranjada.
