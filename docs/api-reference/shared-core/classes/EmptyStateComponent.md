[**shared-core**](../README.md)

***

[shared-core](../README.md) / EmptyStateComponent

# Class: EmptyStateComponent

Defined in: [components/empty-state/empty-state.component.ts:23](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/components/empty-state/empty-state.component.ts#L23)

EmptyStateComponent

## Description

Componente de presentación reutilizable (Dumb Component) encargado de renderizar
un lienzo unificado con iconografía, títulos descriptivos y mensajes de error o ausencia de registros.
Refactorizado con ciclo de vida reactivo para asegurar el registro dinámico de IonIcons por hardware en Ionic Standalone.

## Implements

- `OnChanges`

## Constructors

### Constructor

> **new EmptyStateComponent**(): `EmptyStateComponent`

Defined in: [components/empty-state/empty-state.component.ts:50](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/components/empty-state/empty-state.component.ts#L50)

#### Returns

`EmptyStateComponent`

#### Description

Inicializa el componente registrando el icono de contingencia por defecto.

## Properties

### icon

> **icon**: `string` = `'alert-circle-outline'`

Defined in: [components/empty-state/empty-state.component.ts:30](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/components/empty-state/empty-state.component.ts#L30)

#### Description

Identificador alfanumérico en formato kebab-case del icono de Ionicons que se pretende inyectar.

#### Default

```ts
'alert-circle-outline'
```

***

### message

> **message**: `string` = `'No hay información disponible'`

Defined in: [components/empty-state/empty-state.component.ts:44](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/components/empty-state/empty-state.component.ts#L44)

#### Description

Mensaje aclaratorio o de soporte descriptivo extendido en lenguaje natural.

#### Default

```ts
'No hay información disponible'
```

***

### title

> **title**: `string` = `'Sin datos'`

Defined in: [components/empty-state/empty-state.component.ts:37](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/components/empty-state/empty-state.component.ts#L37)

#### Description

Título principal de la advertencia o estado vacío que se imprimirá en la cabecera del lienzo.

#### Default

```ts
'Sin datos'
```

## Methods

### ngOnChanges()

> **ngOnChanges**(`changes`): `void`

Defined in: [components/empty-state/empty-state.component.ts:62](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/components/empty-state/empty-state.component.ts#L62)

#### Parameters

##### changes

`SimpleChanges`

Mapa de propiedades que han sufrido modificaciones en el ciclo.

#### Returns

`void`

#### Method

ngOnChanges

#### Description

Ciclo de vida de Angular que intercepta las mutaciones sobre las propiedades de entrada (@Input).
Convierte dinámicamente el string en formato kebab-case recibido a camelCase para localizarlo
en el mapa de IonIcons y registrarlo al vuelo en el motor standalone, evitando renderizados en blanco.

#### Implementation of

`OnChanges.ngOnChanges`
