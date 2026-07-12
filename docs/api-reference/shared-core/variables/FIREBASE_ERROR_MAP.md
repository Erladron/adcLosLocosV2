[**shared-core**](../README.md)

***

[shared-core](../README.md) / FIREBASE\_ERROR\_MAP

# Variable: FIREBASE\_ERROR\_MAP

> `const` **FIREBASE\_ERROR\_MAP**: `Record`\<`string`, [`AppMessageCode`](../enumerations/AppMessageCode.md)\>

Defined in: [constants/firebase-error-map.ts:9](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/constants/firebase-error-map.ts#L9)

## Description

Matriz estricta de traducción y normalización de excepciones nativas de Firebase.
Mapea de forma unívoca las cadenas de error crudas emitidas por las APIs de Firebase Authentication
y Cloud Firestore hacia las constantes de tipado fuerte `AppMessageCode` de nuestro Shared Core.
Esto permite al `ErrorHandlerService` interceptar cualquier fallo del SDK y transformarlo en Toasts amigables.
