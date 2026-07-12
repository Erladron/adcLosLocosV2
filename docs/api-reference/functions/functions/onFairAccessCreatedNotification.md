[**functions**](../README.md)

***

[functions](../README.md) / onFairAccessCreatedNotification

# Function: onFairAccessCreatedNotification()

> **onFairAccessCreatedNotification**(`raw`): `any`

Defined in: [src/functions/onFairAccessCreatedNotification.ts:21](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/functions/src/functions/onFairAccessCreatedNotification.ts#L21)

onFairAccessCreatedNotification

## Parameters

### raw

`CloudEvent`\<`unknown`\>

## Returns

`any`

Retorno síncrono controlado para liberar hilos de ejecución en el entorno cloud.

## Description

Cloud Function v2 (Firestore Trigger) que intercepta la creación de nuevos 
accesos o credenciales de feria en la colección 'fair-access'. Resuelve de forma asíncrona en 
caliente los metadatos del evento asociado y despacha una alerta push personalizada a través 
de FCM discriminando el flujo si el receptor es un socio o un invitado externo.
Hereda la región global 'europe-west1' configurada en el archivo de índice.
