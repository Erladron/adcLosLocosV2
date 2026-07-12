[**adcLosLocosV2**](../../../../../../README.md)

***

[adcLosLocosV2](../../../../../../README.md) / [features/users/pages/mantenimiento-cuotas/mantenimiento-cuotas.page](../README.md) / MantenimientoCuotasPage

# Class: MantenimientoCuotasPage

Defined in: [src/app/features/users/pages/mantenimiento-cuotas/mantenimiento-cuotas.page.ts:31](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/mantenimiento-cuotas/mantenimiento-cuotas.page.ts#L31)

## Implements

- `OnInit`

## Constructors

### Constructor

> **new MantenimientoCuotasPage**(`authService`, `loading`, `notification`, `errorHandler`, `userService`): `MantenimientoCuotasPage`

Defined in: [src/app/features/users/pages/mantenimiento-cuotas/mantenimiento-cuotas.page.ts:45](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/mantenimiento-cuotas/mantenimiento-cuotas.page.ts#L45)

#### Parameters

##### authService

`AuthService`

##### loading

`LoadingService`

##### notification

`NotificationService`

##### errorHandler

`ErrorHandlerService`

##### userService

`UserService`

#### Returns

`MantenimientoCuotasPage`

## Properties

### filteredUsers

> **filteredUsers**: `User`[] = `[]`

Defined in: [src/app/features/users/pages/mantenimiento-cuotas/mantenimiento-cuotas.page.ts:36](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/mantenimiento-cuotas/mantenimiento-cuotas.page.ts#L36)

***

### filtroEstado

> **filtroEstado**: `string` = `'todos'`

Defined in: [src/app/features/users/pages/mantenimiento-cuotas/mantenimiento-cuotas.page.ts:38](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/mantenimiento-cuotas/mantenimiento-cuotas.page.ts#L38)

***

### modoMasivoActivo

> **modoMasivoActivo**: `boolean` = `false`

Defined in: [src/app/features/users/pages/mantenimiento-cuotas/mantenimiento-cuotas.page.ts:41](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/mantenimiento-cuotas/mantenimiento-cuotas.page.ts#L41)

***

### searchText

> **searchText**: `string` = `''`

Defined in: [src/app/features/users/pages/mantenimiento-cuotas/mantenimiento-cuotas.page.ts:37](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/mantenimiento-cuotas/mantenimiento-cuotas.page.ts#L37)

***

### sociosModificadosTemporalmente

> **sociosModificadosTemporalmente**: `object` = `{}`

Defined in: [src/app/features/users/pages/mantenimiento-cuotas/mantenimiento-cuotas.page.ts:43](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/mantenimiento-cuotas/mantenimiento-cuotas.page.ts#L43)

#### Index Signature

\[`key`: `string`\]: `boolean`

***

### users

> **users**: `User`[] = `[]`

Defined in: [src/app/features/users/pages/mantenimiento-cuotas/mantenimiento-cuotas.page.ts:35](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/mantenimiento-cuotas/mantenimiento-cuotas.page.ts#L35)

## Accessors

### tieneCambiosPendientesMasivos

#### Get Signature

> **get** **tieneCambiosPendientesMasivos**(): `boolean`

Defined in: [src/app/features/users/pages/mantenimiento-cuotas/mantenimiento-cuotas.page.ts:150](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/mantenimiento-cuotas/mantenimiento-cuotas.page.ts#L150)

##### Method

tieneCambiosPendientesMasivos

##### Description

Devuelve un booleano para saber si el botón flotante de actualizar cuotas debe mostrarse.

##### Returns

`boolean`

## Methods

### aplicarFiltros()

> **aplicarFiltros**(): `void`

Defined in: [src/app/features/users/pages/mantenimiento-cuotas/mantenimiento-cuotas.page.ts:68](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/mantenimiento-cuotas/mantenimiento-cuotas.page.ts#L68)

#### Returns

`void`

***

### cancelarModoMasivo()

> **cancelarModoMasivo**(): `void`

Defined in: [src/app/features/users/pages/mantenimiento-cuotas/mantenimiento-cuotas.page.ts:201](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/mantenimiento-cuotas/mantenimiento-cuotas.page.ts#L201)

#### Returns

`void`

#### Method

cancelarModoMasivo

#### Description

Cancela la selección múltiple y borra todos los movimientos temporales de la pantalla.

***

### loadSocios()

> **loadSocios**(): `Promise`\<`void`\>

Defined in: [src/app/features/users/pages/mantenimiento-cuotas/mantenimiento-cuotas.page.ts:59](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/mantenimiento-cuotas/mantenimiento-cuotas.page.ts#L59)

#### Returns

`Promise`\<`void`\>

***

### ngOnInit()

> **ngOnInit**(): `Promise`\<`void`\>

Defined in: [src/app/features/users/pages/mantenimiento-cuotas/mantenimiento-cuotas.page.ts:55](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/mantenimiento-cuotas/mantenimiento-cuotas.page.ts#L55)

A callback method that is invoked immediately after the
default change detector has checked the directive's
data-bound properties for the first time,
and before any of the view or content children have been checked.
It is invoked only once when the directive is instantiated.

#### Returns

`Promise`\<`void`\>

#### Implementation of

`OnInit.ngOnInit`

***

### obtenerEstadoCuotaActual()

> **obtenerEstadoCuotaActual**(`user`): `boolean`

Defined in: [src/app/features/users/pages/mantenimiento-cuotas/mantenimiento-cuotas.page.ts:105](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/mantenimiento-cuotas/mantenimiento-cuotas.page.ts#L105)

#### Parameters

##### user

`User`

#### Returns

`boolean`

#### Method

obtenerEstadoCuotaActual

#### Description

Devuelve el estado de la cuota teniendo en cuenta si hay cambios temporales sin aplicar en la UI.

***

### procesarActualizacionMasiva()

> **procesarActualizacionMasiva**(): `Promise`\<`void`\>

Defined in: [src/app/features/users/pages/mantenimiento-cuotas/mantenimiento-cuotas.page.ts:158](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/mantenimiento-cuotas/mantenimiento-cuotas.page.ts#L158)

#### Returns

`Promise`\<`void`\>

#### Method

procesarActualizacionMasiva

#### Description

🚀 EL BOTÓN MÁGICO SOLICITADO. Envía en lote a Firebase todos los toggles alterados.

***

### toggleCuotaSocio()

> **toggleCuotaSocio**(`user`, `event`): `Promise`\<`void`\>

Defined in: [src/app/features/users/pages/mantenimiento-cuotas/mantenimiento-cuotas.page.ts:116](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/mantenimiento-cuotas/mantenimiento-cuotas.page.ts#L116)

#### Parameters

##### user

`User`

##### event

`any`

#### Returns

`Promise`\<`void`\>

#### Method

toggleCuotaSocio

#### Description

Modificado para interceptar si estamos en edición masiva o en guardado directo e individual.
