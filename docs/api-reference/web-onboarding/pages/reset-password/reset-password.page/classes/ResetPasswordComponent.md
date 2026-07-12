[**adcLosLocosV2**](../../../../README.md)

***

[adcLosLocosV2](../../../../README.md) / [pages/reset-password/reset-password.page](../README.md) / ResetPasswordComponent

# Class: ResetPasswordComponent

Defined in: [pages/reset-password/reset-password.page.ts:46](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/web-onboarding/src/app/pages/reset-password/reset-password.page.ts#L46)

ResetPasswordComponent

## Description

Componente standalone encargado de interceptar el código de acción OOB (Out-Of-Band) de Firebase,
maquetar el formulario de actualización de credenciales de seguridad y consolidar el restablecimiento físico de contraseñas.

## Implements

- `OnInit`

## Constructors

### Constructor

> **new ResetPasswordComponent**(): `ResetPasswordComponent`

Defined in: [pages/reset-password/reset-password.page.ts:94](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/web-onboarding/src/app/pages/reset-password/reset-password.page.ts#L94)

#### Returns

`ResetPasswordComponent`

#### Description

Inicializa de forma síncrona el componente de restablecimiento.

## Properties

### errorMessage

> **errorMessage**: `string` = `''`

Defined in: [pages/reset-password/reset-password.page.ts:86](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/web-onboarding/src/app/pages/reset-password/reset-password.page.ts#L86)

#### Description

Mensaje descriptivo legible de la alerta de exclusión o error contextual.

***

### isSubmitting

> **isSubmitting**: `boolean` = `false`

Defined in: [pages/reset-password/reset-password.page.ts:84](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/web-onboarding/src/app/pages/reset-password/reset-password.page.ts#L84)

#### Description

Flag indicador de progreso que desactiva los formularios durante la llamada asíncrona.

***

### isSuccess

> **isSuccess**: `boolean` = `false`

Defined in: [pages/reset-password/reset-password.page.ts:88](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/web-onboarding/src/app/pages/reset-password/reset-password.page.ts#L88)

#### Description

Flag que activa la vista del contenedor de éxito una vez restablecida la contraseña.

***

### loading

> **loading**: `boolean` = `true`

Defined in: [pages/reset-password/reset-password.page.ts:80](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/web-onboarding/src/app/pages/reset-password/reset-password.page.ts#L80)

#### Description

Bloqueo de renderizado inicial mientras se extrae el token de la URL.

***

### oobCode

> **oobCode**: `string` = `null`

Defined in: [pages/reset-password/reset-password.page.ts:82](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/web-onboarding/src/app/pages/reset-password/reset-password.page.ts#L82)

#### Description

Token cifrado de un solo uso emitido y empaquetado por Firebase (oobCode).

***

### password

> **password**: `string` = `''`

Defined in: [pages/reset-password/reset-password.page.ts:62](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/web-onboarding/src/app/pages/reset-password/reset-password.page.ts#L62)

#### Description

String de la contraseña de acceso principal vinculada al input.

***

### repeatPassword

> **repeatPassword**: `string` = `''`

Defined in: [pages/reset-password/reset-password.page.ts:64](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/web-onboarding/src/app/pages/reset-password/reset-password.page.ts#L64)

#### Description

String de confirmación de la contraseña vinculada al input espejo.

***

### showPassword

> **showPassword**: `boolean` = `false`

Defined in: [pages/reset-password/reset-password.page.ts:71](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/web-onboarding/src/app/pages/reset-password/reset-password.page.ts#L71)

#### Description

Flag de visibilidad ("botón ojo") de la contraseña principal.

***

### showRepeatPassword

> **showRepeatPassword**: `boolean` = `false`

Defined in: [pages/reset-password/reset-password.page.ts:73](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/web-onboarding/src/app/pages/reset-password/reset-password.page.ts#L73)

#### Description

Flag de visibilidad ("botón ojo") de la contraseña de confirmación.

## Methods

### ngOnInit()

> **ngOnInit**(): `void`

Defined in: [pages/reset-password/reset-password.page.ts:101](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/web-onboarding/src/app/pages/reset-password/reset-password.page.ts#L101)

#### Returns

`void`

#### Method

ngOnInit

#### Description

Recupera de forma atómica el token criptográfico de seguridad de la URL (oobCode).
Levanta un error preventivo en pantalla si el pase de seguridad no viene provisto.

#### Implementation of

`OnInit.ngOnInit`

***

### resetPassword()

> **resetPassword**(): `Promise`\<`void`\>

Defined in: [pages/reset-password/reset-password.page.ts:127](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/web-onboarding/src/app/pages/reset-password/reset-password.page.ts#L127)

#### Returns

`Promise`\<`void`\>

#### Method

resetPassword

#### Description

Orquesta y valida la robustez de las cadenas a través de las utilidades puras del core.
Si pasa el cribado formal, efectúa el envío a red hacia los servidores distribuidos de Firebase Auth.

***

### togglePassword()

> **togglePassword**(): `void`

Defined in: [pages/reset-password/reset-password.page.ts:112](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/web-onboarding/src/app/pages/reset-password/reset-password.page.ts#L112)

#### Returns

`void`

#### Description

Invierte el booleano para alternar el tipo de entrada del input de clave (text/password).

***

### toggleRepeatPassword()

> **toggleRepeatPassword**(): `void`

Defined in: [pages/reset-password/reset-password.page.ts:117](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/web-onboarding/src/app/pages/reset-password/reset-password.page.ts#L117)

#### Returns

`void`

#### Description

Invierte el booleano para alternar el tipo de entrada del input de confirmación (text/password).
