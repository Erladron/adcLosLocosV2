[**adcLosLocosV2**](../../../../../../index.md)

***

[adcLosLocosV2](../../../../../../index.md) / [app/features/auth/guards/auth.guard](../index.md) / authGuard

# Function: authGuard()

> **authGuard**(`route`, `state`): `MaybeAsync`\<`GuardResult`\>

Defined in: [src/app/features/auth/guards/auth.guard.ts:27](https://github.com/Erladron/adcLosLocosV2/blob/ef8b35066458446779d596c924480fd02bae169f/src/app/features/auth/guards/auth.guard.ts#L27)

authGuard

## Parameters

### route

`ActivatedRouteSnapshot`

Instantánea de la ruta que se intenta activar.

### state

`RouterStateSnapshot`

Estado actual del enrutador que contiene la URL de destino.

## Returns

`MaybeAsync`\<`GuardResult`\>

Una promesa que resuelve a `true` si el acceso está permitido,
o a un `UrlTree` de redirección de seguridad en caso contrario.

## Description

Guardián de enrutamiento funcional asíncrono encargado de interceptar y asegurar
los accesos a las rutas de la aplicación. Gestiona de manera reactiva el ciclo de vida 
de la sesión en Firebase, mitiga condiciones de carrera (deadlocks) en logins rápidos y
coordina las redirecciones automáticas basadas en el rol y estado civil del socio en Firestore.
