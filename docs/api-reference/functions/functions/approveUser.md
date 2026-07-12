[**functions**](../README.md)

***

[functions](../README.md) / approveUser

# Function: approveUser()

> **approveUser**(`req`, `res`): `void` \| `Promise`\<`void`\>

Defined in: [src/functions/approveUser.ts:25](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/functions/src/functions/approveUser.ts#L25)

approveUser

## Parameters

### req

`Request`

An Express request object representing the HTTPS call to the function.

### res

`Response`

An Express response object, for this function to respond to callers.

## Returns

`void` \| `Promise`\<`void`\>

Retorno síncrono que confirma la persistencia de los cambios.

## Description

Cloud Function v2 (Callable) que gestiona la aprobación formal de un nuevo socio
en la plataforma por parte de un miembro de la junta directiva o administrador. Actualiza el estado
transaccional a activo en Firestore y despacha una notificación push a través de FCM.
Hereda la región global 'europe-west1' configurada en el archivo de índice.

## Throws

Excepciones de red controladas para su procesamiento nativo en el Front-end.
