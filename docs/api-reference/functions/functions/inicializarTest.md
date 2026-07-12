[**functions**](../README.md)

***

[functions](../README.md) / inicializarTest

# Function: inicializarTest()

> **inicializarTest**(`req`, `res`): `void` \| `Promise`\<`void`\>

Defined in: [src/functions/testing-helpers.ts:58](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/functions/src/functions/testing-helpers.ts#L58)

inicializarTest

## Parameters

### req

`Request`

Objeto de petición HTTP nativo de Express provisto por Firebase v2.

### res

`Response`

Objeto de respuesta HTTP nativo de Express provisto por Firebase v2.

## Returns

`void` \| `Promise`\<`void`\>

Despacha la respuesta HTTP de éxito o denegación al cliente de pruebas.

## Description

Cloud Function v2 (HTTP Request) exclusiva para el entorno de emuladores locales. 
Se encarga de sembrar la base de datos de desarrollo de forma determinista inyectando las identidades 
del archivo JSON JSON tanto en Firebase Authentication como en las colecciones correspondientes de Firestore.
Hereda la región global 'europe-west1' configurada en el archivo de índice.
