[**shared-core**](../README.md)

***

[shared-core](../README.md) / DateEsUtils

# Class: DateEsUtils

Defined in: [utils/string.utils.ts:195](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/utils/string.utils.ts#L195)

DateEsUtils

## Description

Utilidad core especializada en la normalización, conversión y estandarización
de objetos temporales bajo el huso horario oficial de España (Europe/Madrid).
Sanea desfases UTC en entornos distribuidos, emuladores y consultas NoSQL de la peña.

## Constructors

### Constructor

> **new DateEsUtils**(): `DateEsUtils`

#### Returns

`DateEsUtils`

## Methods

### estaEnRangoDiarioEs()

> `static` **estaEnRangoDiarioEs**(`fechaInicio`, `fechaFin`): `boolean`

Defined in: [utils/string.utils.ts:266](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/utils/string.utils.ts#L266)

#### Parameters

##### fechaInicio

`any`

Límite inferior del evento.

##### fechaFin

`any`

Límite superior del evento.

#### Returns

`boolean`

True si el pase es válido hoy.

#### Method

estaEnRangoDiarioEs

#### Description

Regla de negocio ferial de la peña. Evalúa si el día de hoy cae dentro de la vigencia de un abono o evento de la peña.

***

### formatearFechaCortaEs()

> `static` **formatearFechaCortaEs**(`valor`): `string`

Defined in: [utils/string.utils.ts:228](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/utils/string.utils.ts#L228)

#### Parameters

##### valor

`any`

Fecha en cualquier formato legible.

#### Returns

`string`

Cadena formateada (ej: "2026-06-30").

#### Method

formatearFechaCortaEs

#### Description

Convierte una fecha al estándar corto de almacenamiento e indexación NoSQL (YYYY-MM-DD).

***

### formatearFechaLargaEs()

> `static` **formatearFechaLargaEs**(`valor`, `incluirSegundos?`): `string`

Defined in: [utils/string.utils.ts:243](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/utils/string.utils.ts#L243)

#### Parameters

##### valor

`any`

Fecha en cualquier formato legible.

##### incluirSegundos?

`boolean` = `false`

Flag opcional para activar precisión de picaje en portería.

#### Returns

`string`

Cadena formateada (ej: "30/06/2026 18:45").

#### Method

formatearFechaLargaEs

#### Description

Convierte una fecha al estándar de visualización civil con granularidad de horas y minutos (DD/MM/YYYY HH:mm).

***

### normalizarADate()

> `static` **normalizarADate**(`valor`): `Date`

Defined in: [utils/string.utils.ts:214](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/utils/string.utils.ts#L214)

#### Parameters

##### valor

`any`

El dato temporal bruto procedente de la UI o de Firestore.

#### Returns

`Date`

Instancia de fecha normalizada.

#### Method

normalizarADate

#### Description

Helper defensivo que asimila Timestamps de Firebase, cadenas ISO o Date nativos, devolviendo un Date limpio.

***

### obtenerFechaActualEs()

> `static` **obtenerFechaActualEs**(): `Date`

Defined in: [utils/string.utils.ts:202](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/utils/string.utils.ts#L202)

#### Returns

`Date`

Objeto Date ajustado al huso de la península.

#### Method

obtenerFechaActualEs

#### Description

Genera una instancia Date sincronizada con la hora civil oficial de España.
