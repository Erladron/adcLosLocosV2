[**functions**](../README.md)

***

[functions](../README.md) / deactivateUser

# Function: deactivateUser()

> **deactivateUser**(`req`, `res`): `void` \| `Promise`\<`void`\>

Defined in: [src/functions/deactivateUser.ts:27](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/functions/src/functions/deactivateUser.ts#L27)

deactivateUser

## Parameters

### req

`Request`

An Express request object representing the HTTPS call to the function.

### res

`Response`

An Express response object, for this function to respond to callers.

## Returns

`void` \| `Promise`\<`void`\>

Retorno controlado confirmando el éxito del cese.

## Description

Cloud Function v2 (Callable) encargada de suspender o dar de baja a un usuario 
del sistema. El proceso deshabilita la cuenta en Firebase Authentication de forma proactiva, 
muta el estado del perfil a inactivo en Firestore registrando la traza de autoría y despacha 
una alerta push notificando los motivos al usuario afectado.
Hereda la región global 'europe-west1' configurada en el archivo de índice.

## Throws

Excepciones de red y control de acceso estructuradas para el cliente.
