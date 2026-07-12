[**shared-core**](../README.md)

***

[shared-core](../README.md) / FcmService

# Class: FcmService

Defined in: [services/fcm.service.ts:23](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/fcm.service.ts#L23)

FcmService

## Description

Servicio core de infraestructura encargado de gobernar el ecosistema de notificaciones push
a través de Firebase Cloud Messaging (FCM). Inicializa los componentes nativos de Capacitor en móviles,
y orquesta de forma asíncrona la inicialización segura del Service Worker en entornos web de escritorio.

## Constructors

### Constructor

> **new FcmService**(): `FcmService`

Defined in: [services/fcm.service.ts:48](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/fcm.service.ts#L48)

#### Returns

`FcmService`

#### Description

Inicializa la estructura base del servicio de mensajería push.

## Methods

### guardarTokenEnFirestore()

> **guardarTokenEnFirestore**(`userId`, `nuevoToken`): `Promise`\<`void`\>

Defined in: [services/fcm.service.ts:238](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/fcm.service.ts#L238)

#### Parameters

##### userId

`string`

UID único del usuario dueño del dispositivo.

##### nuevoToken

`string`

Token alfanumérico generado por FCM.

#### Returns

`Promise`\<`void`\>

Promesa asíncrona de guardado.

#### Method

guardarTokenEnFirestore

#### Description

🚀 OPTIMIZACIÓN DE IDEMPOTENCIA NATIVA: Registra el token del dispositivo móvil o web.
Utiliza el propio string del token saneado como ID del documento en la colección NoSQL.
Al mapearlo de esta manera, se elimina por completo la necesidad de hacer lecturas previas (getDocs),
garantizando que no existan duplicados por concurrencia y optimizando drásticamente la velocidad de carga.

***

### inicializarFCM()

> **inicializarFCM**(`currentEnvironment`): `Promise`\<`void`\>

Defined in: [services/fcm.service.ts:57](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/fcm.service.ts#L57)

#### Parameters

##### currentEnvironment

`any`

El archivo de entorno activo.

#### Returns

`Promise`\<`void`\>

#### Method

inicializarFCM

#### Description

Dispara la secuencia de arranque de notificaciones push nativas si se ejecuta
en un hardware móvil híbrido (iOS / Android). Si detecta navegador web de escritorio, inicializa Web Push.
