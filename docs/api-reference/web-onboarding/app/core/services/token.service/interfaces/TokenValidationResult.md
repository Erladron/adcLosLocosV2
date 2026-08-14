[**adcLosLocosV2**](../../../../../index.md)

***

[adcLosLocosV2](../../../../../index.md) / [app/core/services/token.service](../index.md) / TokenValidationResult

# Interface: TokenValidationResult

Defined in: [app/core/services/token.service.ts:11](https://github.com/Erladron/adcLosLocosV2/blob/ef8b35066458446779d596c924480fd02bae169f/projects/web-onboarding/src/app/core/services/token.service.ts#L11)

TokenValidationResult

## Description

Estructura de control que rige la respuesta del proceso de validación del token de onboarding.

## Properties

### data?

> `optional` **data?**: `InvitedUser`

Defined in: [app/core/services/token.service.ts:15](https://github.com/Erladron/adcLosLocosV2/blob/ef8b35066458446779d596c924480fd02bae169f/projects/web-onboarding/src/app/core/services/token.service.ts#L15)

#### Description

Datos del perfil de siembra recuperados del servidor si el token es solvente.

***

### error?

> `optional` **error?**: `string`

Defined in: [app/core/services/token.service.ts:17](https://github.com/Erladron/adcLosLocosV2/blob/ef8b35066458446779d596c924480fd02bae169f/projects/web-onboarding/src/app/core/services/token.service.ts#L17)

#### Description

Texto descriptivo amigable del motivo de la exclusión perimetral si no es válido.

***

### isValid

> **isValid**: `boolean`

Defined in: [app/core/services/token.service.ts:13](https://github.com/Erladron/adcLosLocosV2/blob/ef8b35066458446779d596c924480fd02bae169f/projects/web-onboarding/src/app/core/services/token.service.ts#L13)

#### Description

Flag booleano que determina si el token de pre-alta está vigente y apto para su consumo.
