[**functions**](../README.md)

***

[functions](../README.md) / borrarUsuarioPorEmailDev

# Function: borrarUsuarioPorEmailDev()

> **borrarUsuarioPorEmailDev**(`req`, `res`): `void` \| `Promise`\<`void`\>

Defined in: [src/functions/testing-helpers.ts:128](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/functions/src/functions/testing-helpers.ts#L128)

borrarUsuarioPorEmailDev

## Parameters

### req

`Request`

Objeto de petición HTTP conteniendo el payload en el body.

### res

`Response`

Objeto de respuesta HTTP nativo de Express provisto por Firebase v2.

## Returns

`void` \| `Promise`\<`void`\>

Confirma la purga radical del usuario al runner del test.

## Description

Cloud Function v2 (HTTP Request) exclusiva para el entorno de emuladores locales. 
Actúa como un limpiador atómico de base de datos entre ejecuciones de Cypress. Busca y purga 
por completo un correo electrónico de Firebase Authentication y remueve en cascada sus documentos 
vinculados mediante operaciones Batch en las colecciones 'users' e 'invitedUsers'.
Hereda la región global 'europe-west1' configurada en el archivo de índice.
