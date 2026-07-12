[**adcLosLocosV2**](../../../../README.md)

***

[adcLosLocosV2](../../../../README.md) / [pages/success/success.page](../README.md) / SuccessComponent

# Class: SuccessComponent

Defined in: [pages/success/success.page.ts:34](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/web-onboarding/src/app/pages/success/success.page.ts#L34)

SuccessComponent

## Description

Componente standalone de UI que actúa como pantalla de aterrizaje de éxito.
Informa al socio que su pre-registro ha concluido satisfactoriamente y gestiona el retorno seguro
hacia la raíz arrastrando las credenciales del token de siembra.

## Implements

- `OnInit`

## Constructors

### Constructor

> **new SuccessComponent**(): `SuccessComponent`

Defined in: [pages/success/success.page.ts:50](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/web-onboarding/src/app/pages/success/success.page.ts#L50)

#### Returns

`SuccessComponent`

#### Description

Registra de forma atómica los iconos vectoriales de la pantalla para optimizar el árbol de dependencias.

## Properties

### logoUrl

> **logoUrl**: `string` = `'assets/img/escudo.png'`

Defined in: [pages/success/success.page.ts:42](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/web-onboarding/src/app/pages/success/success.page.ts#L42)

#### Description

Ruta física homologada del asset del escudo oficial de la peña.

***

### token

> **token**: `string` = `''`

Defined in: [pages/success/success.page.ts:44](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/web-onboarding/src/app/pages/success/success.page.ts#L44)

#### Description

Token alfanumérico persistido para mitigar la pérdida de contexto del socio.

## Methods

### irAlInicio()

> **irAlInicio**(): `void`

Defined in: [pages/success/success.page.ts:70](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/web-onboarding/src/app/pages/success/success.page.ts#L70)

#### Returns

`void`

#### Method

irAlInicio

#### Description

Ejecuta una redirección controlada de vuelta a la pantalla de bienvenida, arrastrando el token.

***

### ngOnInit()

> **ngOnInit**(): `void`

Defined in: [pages/success/success.page.ts:61](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/web-onboarding/src/app/pages/success/success.page.ts#L61)

#### Returns

`void`

#### Method

ngOnInit

#### Description

Captura el hash del token de la query string para evitar que se volatilice al refrescar la UI.

#### Implementation of

`OnInit.ngOnInit`
