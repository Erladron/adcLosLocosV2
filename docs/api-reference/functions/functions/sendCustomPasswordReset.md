[**functions**](../README.md)

***

[functions](../README.md) / sendCustomPasswordReset

# Function: sendCustomPasswordReset()

> **sendCustomPasswordReset**(`req`, `res`): `void` \| `Promise`\<`void`\>

Defined in: [src/functions/sendCustomPasswordReset.ts:23](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/functions/src/functions/sendCustomPasswordReset.ts#L23)

sendCustomPasswordReset

## Parameters

### req

`Request`

An Express request object representing the HTTPS call to the function.

### res

`Response`

An Express response object, for this function to respond to callers.

## Returns

`void` \| `Promise`\<`void`\>

Objeto confirmatorio del encolamiento del correo.

## Description

Cloud Function v2 (Callable) encargada de interceptar y generar un enlace 
personalizado de restablecimiento de contraseña. Extrae de forma segura el código de operación 
único (oobCode) de Firebase Auth, ensambla una URL corporativa orientada al dominio del proyecto 
y encola un documento estructurado en la colección 'mail' para su distribución vía SMTP.
Hereda la región global 'europe-west1' configurada en el archivo de índice.

## Throws

Excepciones de red y argumentos inválidos formateadas para el cliente.
