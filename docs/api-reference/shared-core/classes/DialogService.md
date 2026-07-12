[**shared-core**](../README.md)

***

[shared-core](../README.md) / DialogService

# Class: DialogService

Defined in: [services/dialog.service.ts:14](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/dialog.service.ts#L14)

DialogService

## Description

Servicio core de UI encargado de abstraer e instanciar ventanas modales imperativas
nativas de Ionic (Alertas, Prompts de captura de datos y Diálogos de Confirmación).
Centraliza la inyección y simplifica el consumo mediante el uso de Promesas nativas de JavaScript.

## Constructors

### Constructor

> **new DialogService**(): `DialogService`

Defined in: [services/dialog.service.ts:23](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/dialog.service.ts#L23)

#### Returns

`DialogService`

#### Description

Inicializa el servicio de diálogos comunes.

## Methods

### alert()

> **alert**(`params`): `Promise`\<`void`\>

Defined in: [services/dialog.service.ts:83](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/dialog.service.ts#L83)

#### Parameters

##### params

Parámetros de configuración del modal.

###### buttonText?

`string` = `'Aceptar'`

Etiqueta del botón de cierre.

###### header?

`string` = `'Información'`

Título del modal.

###### message?

`string` = `''`

Mensaje informativo a imprimir.

#### Returns

`Promise`\<`void`\>

#### Method

alert

#### Description

Renderiza un modal informativo unidireccional con un único botón de aceptación.

***

### confirm()

> **confirm**(`params`): `Promise`\<`boolean`\>

Defined in: [services/dialog.service.ts:36](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/dialog.service.ts#L36)

#### Parameters

##### params

Parámetros de configuración del modal.

###### cancelText?

`string` = `'Cancelar'`

Etiqueta del botón de desestimación.

###### confirmText?

`string` = `'Aceptar'`

Etiqueta del botón de confirmación.

###### header?

`string` = `'Confirmación'`

Título superior del diálogo.

###### message?

`string` = `'¿Deseas continuar?'`

Texto descriptivo de la acción.

#### Returns

`Promise`\<`boolean`\>

#### Method

confirm

#### Description

Despliega un diálogo de confirmación binario en pantalla.
Retorna una promesa que se resuelve con true si el operador presiona el botón afirmativo, o false en caso de cancelación.

***

### prompt()

> **prompt**(`params`): `Promise`\<`string`\>

Defined in: [services/dialog.service.ts:118](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/dialog.service.ts#L118)

#### Parameters

##### params

Parámetros de configuración del prompt.

###### cancelText?

`string` = `'Cancelar'`

Texto del botón negativo.

###### confirmText?

`string` = `'Aceptar'`

Texto del botón positivo.

###### header?

`string` = `'Introducir valor'`

Cabecera del formulario.

###### message?

`string` = `''`

Texto aclaratorio.

###### placeholder?

`string` = `''`

Pista visual interna de la caja de entrada.

#### Returns

`Promise`\<`string`\>

#### Method

prompt

#### Description

Levanta un modal imperativo provisto de una caja de texto simple para la captura de entradas de usuario.
Retorna una promesa que resuelve con la cadena introducida por el operador, o null si la operación fue cancelada.
