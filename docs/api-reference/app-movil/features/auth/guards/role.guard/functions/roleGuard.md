[**adcLosLocosV2**](../../../../../README.md)

***

[adcLosLocosV2](../../../../../README.md) / [features/auth/guards/role.guard](../README.md) / roleGuard

# Function: roleGuard()

> **roleGuard**(`route`, `state`): `MaybeAsync`\<`GuardResult`\>

Defined in: [src/app/features/auth/guards/role.guard.ts:12](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/auth/guards/role.guard.ts#L12)

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
