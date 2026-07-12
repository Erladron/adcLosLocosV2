[**adcLosLocosV2**](../../../../README.md)

***

[adcLosLocosV2](../../../../README.md) / [core/services/token.service](../README.md) / TokenService

# Class: TokenService

Defined in: [core/services/token.service.ts:28](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/web-onboarding/src/app/core/services/token.service.ts#L28)

TokenService

## Description

Servicio especialista del ecosistema Web-onboarding encargado de visar la solvencia de los enlaces web
de invitación generados por la Junta Directiva antes de instanciar los formularios civiles de registro.

## Constructors

### Constructor

> **new TokenService**(): `TokenService`

Defined in: [core/services/token.service.ts:39](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/web-onboarding/src/app/core/services/token.service.ts#L39)

#### Returns

`TokenService`

#### Description

Inicializa el servicio validador de tokens.

## Methods

### validateInvitation()

> **validateInvitation**(`tokenId`): `Promise`\<[`TokenValidationResult`](../interfaces/TokenValidationResult.md)\>

Defined in: [core/services/token.service.ts:48](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/web-onboarding/src/app/core/services/token.service.ts#L48)

#### Parameters

##### tokenId

`string`

Identificador único alfanumérico (UUID) del token de la invitación.

#### Returns

`Promise`\<[`TokenValidationResult`](../interfaces/TokenValidationResult.md)\>

Objeto estructurado con el dictamen de validación.

#### Method

validateInvitation

#### Description

Realiza una lectura directa en Firestore para contrastar la existencia y vigencia de una invitación.
Bloquea el paso de forma fulminante si el token ya consta quemado en la base de datos (`usado === true`).
