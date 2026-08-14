[**adcLosLocosV2**](../../../../../index.md)

***

[adcLosLocosV2](../../../../../index.md) / [app/core/services/token.service](../index.md) / TokenService

# Class: TokenService

Defined in: [app/core/services/token.service.ts:28](https://github.com/Erladron/adcLosLocosV2/blob/ef8b35066458446779d596c924480fd02bae169f/projects/web-onboarding/src/app/core/services/token.service.ts#L28)

TokenService

## Description

Servicio especialista del ecosistema Web-onboarding encargado de visar la solvencia de los enlaces web
de invitación generados por la Junta Directiva antes de instanciar los formularios civiles de registro.

## Constructors

### Constructor

> **new TokenService**(): `TokenService`

Defined in: [app/core/services/token.service.ts:39](https://github.com/Erladron/adcLosLocosV2/blob/ef8b35066458446779d596c924480fd02bae169f/projects/web-onboarding/src/app/core/services/token.service.ts#L39)

#### Returns

`TokenService`

#### Description

Inicializa el servicio validador de tokens.

## Methods

### validateInvitation()

> **validateInvitation**(`tokenId`): `Promise`\<[`TokenValidationResult`](../interfaces/TokenValidationResult.md)\>

Defined in: [app/core/services/token.service.ts:48](https://github.com/Erladron/adcLosLocosV2/blob/ef8b35066458446779d596c924480fd02bae169f/projects/web-onboarding/src/app/core/services/token.service.ts#L48)

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
