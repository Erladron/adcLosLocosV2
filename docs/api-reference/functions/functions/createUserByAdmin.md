[**functions**](../README.md)

***

[functions](../README.md) / createUserByAdmin

# Function: createUserByAdmin()

> **createUserByAdmin**(`req`, `res`): `void` \| `Promise`\<`void`\>

Defined in: [src/functions/createUserByAdmin.ts:21](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/functions/src/functions/createUserByAdmin.ts#L21)

createUserByAdmin

## Parameters

### req

`Request`

An Express request object representing the HTTPS call to the function.

### res

`Response`

An Express response object, for this function to respond to callers.

## Returns

`void` \| `Promise`\<`void`\>

Despacha la respuesta HTTP controlada directamente al cliente.

## Description

Cloud Function v2 (HTTP Request) que permite a miembros autorizados de la directiva
o administradores crear cuentas de usuarios de forma directa. Registra la credencial en Firebase Auth,
inicializa el registro en la colecci��n de usuarios y asienta un batch at��mico en Firestore. Incluye 
un mecanismo autom��tico de rollback en Auth si la persistencia de datos falla.
Hereda la regi��n global 'europe-west1' configurada en el archivo de ��ndice.
