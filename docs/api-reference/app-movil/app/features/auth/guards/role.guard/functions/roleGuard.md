[**adcLosLocosV2**](../../../../../../index.md)

***

[adcLosLocosV2](../../../../../../index.md) / [app/features/auth/guards/role.guard](../index.md) / roleGuard

# Function: roleGuard()

> **roleGuard**(`route`, `state`): `MaybeAsync`\<`GuardResult`\>

Defined in: [src/app/features/auth/guards/role.guard.ts:12](https://github.com/Erladron/adcLosLocosV2/blob/ef8b35066458446779d596c924480fd02bae169f/src/app/features/auth/guards/role.guard.ts#L12)

roleGuard

## Parameters

### route

`ActivatedRouteSnapshot`

### state

`RouterStateSnapshot`

## Returns

`MaybeAsync`\<`GuardResult`\>

## Description

Guardián funcional encargado de evaluar los roles jerárquicos de la sesión activa
contra la matriz de privilegios requerida por la ruta de navegación.
