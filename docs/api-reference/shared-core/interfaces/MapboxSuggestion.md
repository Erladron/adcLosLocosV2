[**shared-core**](../README.md)

***

[shared-core](../README.md) / MapboxSuggestion

# Interface: MapboxSuggestion

Defined in: [services/mapbox/mapbox.service.ts:11](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/mapbox/mapbox.service.ts#L11)

MapboxSuggestion

## Description

Contrato estructural que define el formato normalizado de las sugerencias de direcciones
devueltas por el servicio de geocodificación para el consumo de los componentes visuales.

## Properties

### name

> **name**: `string`

Defined in: [services/mapbox/mapbox.service.ts:13](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/mapbox/mapbox.service.ts#L13)

#### Description

Nombre corto o principal de la localización o vía (ej: "Calle Serrano").

***

### place\_formatted

> **place\_formatted**: `string`

Defined in: [services/mapbox/mapbox.service.ts:15](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/mapbox/mapbox.service.ts#L15)

#### Description

Dirección completa, normalizada y formateada por la API geográfica (ej: "Calle Serrano, 24, Madrid, España").
