[**functions**](../README.md)

***

[functions](../README.md) / requestUserApproval

# Function: requestUserApproval()

> **requestUserApproval**(`req`, `res`): `void` \| `Promise`\<`void`\>

Defined in: [src/functions/requestUserApproval.ts:31](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/functions/src/functions/requestUserApproval.ts#L31)

requestUserApproval

## Parameters

### req

`Request`

An Express request object representing the HTTPS call to the function.

### res

`Response`

An Express response object, for this function to respond to callers.

## Returns

`void` \| `Promise`\<`void`\>

Objeto confirmatorio con la traza de alertas ejecutadas.

## Description

Cloud Function v2 (Callable) responsable de procesar la solicitud de onboarding 
de un nuevo usuario. Almacena de manera atómica el perfil civil ampliado en Firestore, cambia el estado 
del solicitante a 'pending_approval' y despacha notificaciones masivas automatizadas (FCM) a los tokens 
registrados de la junta directiva y administradores del sistema para avisar del trámite pendiente.
Hereda la región global 'europe-west1' configurada en el archivo de índice.

## Throws

Excepciones de red y control de acceso estructuradas para el cliente web o móvil.
