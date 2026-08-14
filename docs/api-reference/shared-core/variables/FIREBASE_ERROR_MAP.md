[**shared-core**](../index.md)

***

[shared-core](../index.md) / FIREBASE\_ERROR\_MAP

# Variable: FIREBASE\_ERROR\_MAP

> `const` **FIREBASE\_ERROR\_MAP**: `Record`\<`string`, [`AppMessageCode`](../enumerations/AppMessageCode.md)\>

Defined in: [constants/firebase-error-map.ts:9](https://github.com/Erladron/adcLosLocosV2/blob/ef8b35066458446779d596c924480fd02bae169f/projects/shared-core/src/lib/constants/firebase-error-map.ts#L9)

## Description

Matriz estricta de traducción y normalización de excepciones nativas de Firebase.
Mapea de forma unívoca las cadenas de error crudas emitidas por las APIs de Firebase Authentication
y Cloud Firestore hacia las constantes de tipado fuerte `AppMessageCode` de nuestro Shared Core.
Esto permite al `ErrorHandlerService` interceptar cualquier fallo del SDK y transformarlo en Toasts amigables.
