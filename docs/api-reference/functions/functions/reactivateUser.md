[**functions**](../README.md)

***

[functions](../README.md) / reactivateUser

# Function: reactivateUser()

> **reactivateUser**(`req`, `res`): `void` \| `Promise`\<`void`\>

Defined in: [src/functions/reactivateUser.ts:26](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/functions/src/functions/reactivateUser.ts#L26)

reactivateUser

## Parameters

### req

`Request`

An Express request object representing the HTTPS call to the function.

### res

`Response`

An Express response object, for this function to respond to callers.

## Returns

`void` \| `Promise`\<`void`\>

Retorno controlado confirmando el éxito de la restauración.

## Description

Cloud Function v2 (Callable) responsable de reincorporar o reactivar a un usuario 
previamente suspendido en el sistema. Habilita de nuevo la cuenta en Firebase Authentication, 
muta su estado a activo en Firestore registrando la traza detallada del administrador 
ejecutor, y dispara una notificación push informativa de bienvenida al socio.
Hereda la región global 'europe-west1' configurada en el archivo de índice.

## Throws

Excepciones de red y control de accesos mapeadas para su renderizado en el cliente.
