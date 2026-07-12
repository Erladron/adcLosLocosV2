[**adcLosLocosV2**](../../../../../README.md)

***

[adcLosLocosV2](../../../../../README.md) / [features/auth/guards/auth.guard](../README.md) / authGuard

# Function: authGuard()

> **authGuard**(`route`, `state`): `MaybeAsync`\<`GuardResult`\>

Defined in: [src/app/features/auth/guards/auth.guard.ts:18](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/auth/guards/auth.guard.ts#L18)

authGuard

## Parameters

### route

`ActivatedRouteSnapshot`

### state

`RouterStateSnapshot`

## Returns

`MaybeAsync`\<`GuardResult`\>

## Description

Guardián de enrutamiento funcional encargado de interceptar los accesos de sesión.
Evalúa los estados civiles del censo en Firestore y coordina las redirecciones automáticas o el control de accesos.
