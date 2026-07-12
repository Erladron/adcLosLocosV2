[**shared-core**](../README.md)

***

[shared-core](../README.md) / MapboxService

# Class: MapboxService

Defined in: [services/mapbox/mapbox.service.ts:26](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/mapbox/mapbox.service.ts#L26)

MapboxService

## Description

Servicio de infraestructura especialista encargado de interactuar con las APIs REST de Mapbox.
Provee capacidades de Geocoding síncronas y autocompletado inteligente de direcciones postales en territorio español.

## Constructors

### Constructor

> **new MapboxService**(): `MapboxService`

Defined in: [services/mapbox/mapbox.service.ts:42](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/mapbox/mapbox.service.ts#L42)

#### Returns

`MapboxService`

#### Description

Inicializa el servicio de localización geográfica.

## Methods

### buscarDireccion()

> **buscarDireccion**(`query`, `token`): `Observable`\<[`MapboxSuggestion`](../interfaces/MapboxSuggestion.md)[]\>

Defined in: [services/mapbox/mapbox.service.ts:52](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/mapbox/mapbox.service.ts#L52)

#### Parameters

##### query

`string`

Texto o cadena parcial de la dirección introducida por el usuario.

##### token

`string`

Clave pública o API Access Token de Mapbox configurada en los entornos.

#### Returns

`Observable`\<[`MapboxSuggestion`](../interfaces/MapboxSuggestion.md)[]\>

Flujo observable que emite una matriz de hasta 5 sugerencias normalizadas.

#### Method

buscarDireccion

#### Description

Realiza una consulta asíncrona a la API de Mapbox para obtener sugerencias de direcciones coincidentes.
Acota los resultados geográficos estrictamente a España ('country=es') y a lenguaje castellano ('language=es').
