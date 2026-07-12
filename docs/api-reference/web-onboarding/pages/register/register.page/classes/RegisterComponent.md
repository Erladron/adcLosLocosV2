[**adcLosLocosV2**](../../../../README.md)

***

[adcLosLocosV2](../../../../README.md) / [pages/register/register.page](../README.md) / RegisterComponent

# Class: RegisterComponent

Defined in: [pages/register/register.page.ts:53](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/web-onboarding/src/app/pages/register/register.page.ts#L53)

RegisterComponent

## Description

Componente standalone especialista encargado de gestionar el formulario y la lógica de autoregistro
de nuevos miembros mediante enlaces de invitación cifrados por token. Consolida las auditorías
de onboarding y dispara los flujos transaccionales de Firebase Auth.

## Implements

- `OnInit`

## Constructors

### Constructor

> **new RegisterComponent**(): `RegisterComponent`

#### Returns

`RegisterComponent`

## Properties

### cargando

> **cargando**: `boolean` = `false`

Defined in: [pages/register/register.page.ts:90](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/web-onboarding/src/app/pages/register/register.page.ts#L90)

#### Description

Flag de bloqueo visual que desactiva el botón durante el envío de red.

***

### invitationData

> **invitationData**: `InvitedUser` = `null`

Defined in: [pages/register/register.page.ts:79](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/web-onboarding/src/app/pages/register/register.page.ts#L79)

#### Description

Datos limpios de la invitación recuperados desde Firestore.

***

### logoUrl

> **logoUrl**: `string` = `'assets/img/escudo.png'`

Defined in: [pages/register/register.page.ts:93](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/web-onboarding/src/app/pages/register/register.page.ts#L93)

#### Description

Ruta estática homologada del asset del escudo corporativo de la peña.

***

### registerForm

> **registerForm**: `FormGroup`

Defined in: [pages/register/register.page.ts:75](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/web-onboarding/src/app/pages/register/register.page.ts#L75)

#### Description

Formulario reactivo con las credenciales de siembra.

***

### showPassword

> **showPassword**: `boolean` = `false`

Defined in: [pages/register/register.page.ts:86](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/web-onboarding/src/app/pages/register/register.page.ts#L86)

#### Description

Flag indicador para alternar la visibilidad de la contraseña en texto plano.

***

### showPasswordConfirm

> **showPasswordConfirm**: `boolean` = `false`

Defined in: [pages/register/register.page.ts:88](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/web-onboarding/src/app/pages/register/register.page.ts#L88)

#### Description

Flag indicador para alternar la visibilidad de la confirmación de la contraseña.

***

### token

> **token**: `string` = `''`

Defined in: [pages/register/register.page.ts:77](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/web-onboarding/src/app/pages/register/register.page.ts#L77)

#### Description

Token alfanumérico extraído de la URL.

## Methods

### ngOnInit()

> **ngOnInit**(): `Promise`\<`void`\>

Defined in: [pages/register/register.page.ts:100](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/web-onboarding/src/app/pages/register/register.page.ts#L100)

#### Returns

`Promise`\<`void`\>

#### Method

ngOnInit

#### Description

Inicializa la estructura de validación reactiva y dispara el visado del token de acceso.
En caso de ausencia o invalidez del pase, redirige ipso-facto a la pantalla de bienvenida.

#### Implementation of

`OnInit.ngOnInit`

***

### onSubmit()

> **onSubmit**(): `Promise`\<`void`\>

Defined in: [pages/register/register.page.ts:140](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/web-onboarding/src/app/pages/register/register.page.ts#L140)

#### Returns

`Promise`\<`void`\>

#### Method

onSubmit

#### Description

Orquesta el proceso de persistencia. Consume el token, mapea de forma estricta los campos
de auditoría del nuevo usuario según el modelo core y redirige a la pantalla de confirmación.

***

### passwordMatchValidator()

> **passwordMatchValidator**(`control`): `ValidationErrors`

Defined in: [pages/register/register.page.ts:129](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/web-onboarding/src/app/pages/register/register.page.ts#L129)

#### Parameters

##### control

`AbstractControl`

#### Returns

`ValidationErrors`

#### Method

passwordMatchValidator

#### Description

Validador personalizado síncrono que comprueba la simetría exacta entre la clave y su espejo.
