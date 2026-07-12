[**functions**](../README.md)

***

[functions](../README.md) / onEventTriggerNotification

# Function: onEventTriggerNotification()

> **onEventTriggerNotification**(`raw`): `any`

Defined in: [src/functions/onEventTriggerNotification.ts:29](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/functions/src/functions/onEventTriggerNotification.ts#L29)

onEventTriggerNotification

## Parameters

### raw

`CloudEvent`\<`unknown`\>

## Returns

`any`

Retorno síncrono controlado para liberar hilos de ejecución en el entorno cloud.

## Description

Cloud Function v2 (Firestore Trigger) que intercepta cualquier tipo de escritura 
(creación, edición o purga) en la colección raíz de eventos. Realiza una segmentación perimetral 
estricta basada en roles y solvencia de tesorería del socio antes de delegar el envío masivo en 
el motor de Firebase Cloud Messaging (FCM). Aplica criterios de optimización industrial omitiendo 
alertas automáticas ante meros incrementos de asistencia.
Hereda la región global 'europe-west1' configurada en el archivo de índice.
