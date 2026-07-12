[**adcLosLocosV2**](../../../../README.md)

***

[adcLosLocosV2](../../../../README.md) / [pages/welcome/welcome.page](../README.md) / WelcomeComponent

# Class: WelcomeComponent

Defined in: [pages/welcome/welcome.page.ts:40](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/web-onboarding/src/app/pages/welcome/welcome.page.ts#L40)

WelcomeComponent

## Description

Componente standalone que actúa como puerta de acceso y control de identidad en el Onboarding.
Intercepta de forma asíncrona los tokens de la URL, visa su vigencia contra Firestore y decide de forma inteligente
si da paso al formulario de alta, bloquea el acceso o gestiona un retorno amigable para socios ya registrados.

## Implements

- `OnInit`

## Constructors

### Constructor

> **new WelcomeComponent**(): `WelcomeComponent`

Defined in: [pages/welcome/welcome.page.ts:71](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/web-onboarding/src/app/pages/welcome/welcome.page.ts#L71)

#### Returns

`WelcomeComponent`

#### Description

Registra de forma atómica los iconos vectoriales necesarios para la vista del componente.

## Properties

### errorMessage

> **errorMessage**: `string` = `''`

Defined in: [pages/welcome/welcome.page.ts:60](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/web-onboarding/src/app/pages/welcome/welcome.page.ts#L60)

#### Description

Mensaje literal que se muestra en los flujos de exclusión o error.

***

### isAlreadyRegistered

> **isAlreadyRegistered**: `boolean` = `false`

Defined in: [pages/welcome/welcome.page.ts:58](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/web-onboarding/src/app/pages/welcome/welcome.page.ts#L58)

#### Description

Bandera inteligente para controlar el retorno amigable si el token ya fue consumido con anterioridad.

***

### isLoading

> **isLoading**: `boolean` = `true`

Defined in: [pages/welcome/welcome.page.ts:54](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/web-onboarding/src/app/pages/welcome/welcome.page.ts#L54)

#### Description

Controla el renderizado del spinner de carga inicial en la pantalla.

***

### isValidToken

> **isValidToken**: `boolean` = `false`

Defined in: [pages/welcome/welcome.page.ts:56](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/web-onboarding/src/app/pages/welcome/welcome.page.ts#L56)

#### Description

Flag que habilita los contenedores y el botón de acceso al formulario de registro.

***

### logoUrl

> **logoUrl**: `string` = `'assets/img/escudo.png'`

Defined in: [pages/welcome/welcome.page.ts:65](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/web-onboarding/src/app/pages/welcome/welcome.page.ts#L65)

#### Description

Ruta física del asset del escudo oficial unificado de la peña.

***

### token

> **token**: `string` = `''`

Defined in: [pages/welcome/welcome.page.ts:62](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/web-onboarding/src/app/pages/welcome/welcome.page.ts#L62)

#### Description

Hash alfanumérico único extraído de la query string.

## Methods

### goToRegister()

> **goToRegister**(): `void`

Defined in: [pages/welcome/welcome.page.ts:120](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/web-onboarding/src/app/pages/welcome/welcome.page.ts#L120)

#### Returns

`void`

#### Method

goToRegister

#### Description

Redirige al formulario de registro avanzado arrastrando de forma segura el token de confirmación.

***

### ngOnInit()

> **ngOnInit**(): `Promise`\<`void`\>

Defined in: [pages/welcome/welcome.page.ts:85](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/web-onboarding/src/app/pages/welcome/welcome.page.ts#L85)

#### Returns

`Promise`\<`void`\>

#### Method

ngOnInit

#### Description

Captura el token de la URL y dispara de forma imperativa la validación de integridad en Firestore.
Resuelve el desvío amigable si detecta que la cuenta asociada ya completó su onboarding.

#### Implementation of

`OnInit.ngOnInit`
