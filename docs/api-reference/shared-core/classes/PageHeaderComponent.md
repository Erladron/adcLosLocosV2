[**shared-core**](../README.md)

***

[shared-core](../README.md) / PageHeaderComponent

# Class: PageHeaderComponent

Defined in: [components/page-header/page-header.component.ts:33](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/components/page-header/page-header.component.ts#L33)

PageHeaderComponent

## Description

Cabecera de página unificada y reutilizable (Dumb Component) para el ecosistema ADC Los Locos V2.
Encapsula la barra de herramientas superior expuesta en las vistas, abstrayendo las condicionales visuales
del botón de retroceso nativo de Ionic y las compuertas de activación del menú lateral izquierdo.

## Constructors

### Constructor

> **new PageHeaderComponent**(): `PageHeaderComponent`

Defined in: [components/page-header/page-header.component.ts:67](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/components/page-header/page-header.component.ts#L67)

#### Returns

`PageHeaderComponent`

#### Description

Inicializa la estructura base del componente de cabecera común.

## Properties

### backUrl

> **backUrl**: `string` = `'/home'`

Defined in: [components/page-header/page-header.component.ts:54](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/components/page-header/page-header.component.ts#L54)

#### Description

Ruta o path de fallback por defecto hacia la que navegará el stack si no hay historial previo en la sesión.

#### Default

```ts
'/home'
```

***

### showBack

> **showBack**: `boolean` = `false`

Defined in: [components/page-header/page-header.component.ts:47](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/components/page-header/page-header.component.ts#L47)

#### Description

Flag condicional booleano que determina si se debe renderizar e inyectar el botón de retroceso automático.

#### Default

```ts
false
```

***

### showMenu

> **showMenu**: `boolean` = `false`

Defined in: [components/page-header/page-header.component.ts:61](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/components/page-header/page-header.component.ts#L61)

#### Description

Flag condicional booleano que habilita o destruye visualmente el botón disparador del menú hamburguesa lateral.

#### Default

```ts
false
```

***

### title

> **title**: `string` = `''`

Defined in: [components/page-header/page-header.component.ts:40](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/components/page-header/page-header.component.ts#L40)

#### Description

Cadena de caracteres que define el título textual en español que se renderizará en el centro de la cabecera.

#### Default

```ts
''
```
