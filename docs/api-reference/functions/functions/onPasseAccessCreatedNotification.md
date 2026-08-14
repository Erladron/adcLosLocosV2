[**functions**](../index.md)

***

[functions](../index.md) / onPasseAccessCreatedNotification

# Function: onPasseAccessCreatedNotification()

> **onPasseAccessCreatedNotification**(`raw`): `any`

Defined in: src/functions/onPasseAccessCreatedNotification.ts:21

onPasseAccessCreatedNotification

## Parameters

### raw

`CloudEvent`\<`unknown`\>

## Returns

`any`

Retorno síncrono controlado para liberar hilos de ejecución en el entorno cloud.

## Description

Cloud Function v2 (Firestore Trigger) que intercepta la creación de nuevos 
accesos o credenciales de feria en la colección 'event-access'. Resuelve de forma asíncrona en 
caliente los metadatos del evento asociado y despacha una alerta push personalizada a través 
de FCM discriminando el flujo si el receptor es un socio o un invitado externo.
Hereda la región global 'europe-west1' configurada en el archivo de índice.
