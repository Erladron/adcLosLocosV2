[**adcLosLocosV2**](../../../../../../README.md)

***

[adcLosLocosV2](../../../../../../README.md) / [features/events/pages/event-guests/event-guests.page](../README.md) / EventGuestsPage

# Class: EventGuestsPage

Defined in: [src/app/features/events/pages/event-guests/event-guests.page.ts:51](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/events/pages/event-guests/event-guests.page.ts#L51)

EventGuestsPage

## Description

Componente controlador de la vista de asignación de pases e invitaciones para acompañantes externos.
Cumple con el aislamiento arquitectónico estricto: toda interacción con la BD se delega en servicios de shared-core.

## Implements

- `OnInit`

## Constructors

### Constructor

> **new EventGuestsPage**(): `EventGuestsPage`

Defined in: [src/app/features/events/pages/event-guests/event-guests.page.ts:98](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/events/pages/event-guests/event-guests.page.ts#L98)

#### Returns

`EventGuestsPage`

#### Description

Registra la iconografía atómica integrada de la peña.

## Properties

### currentUserData

> **currentUserData**: `any` = `null`

Defined in: [src/app/features/events/pages/event-guests/event-guests.page.ts:73](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/events/pages/event-guests/event-guests.page.ts#L73)

#### Description

Ficha completa con los datos de perfil del socio logueado.

***

### currentUserId

> **currentUserId**: `string` = `null`

Defined in: [src/app/features/events/pages/event-guests/event-guests.page.ts:71](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/events/pages/event-guests/event-guests.page.ts#L71)

#### Description

UID del socio o directivo autenticado en la sesión actual.

***

### eventId

> **eventId**: `string` = `null`

Defined in: [src/app/features/events/pages/event-guests/event-guests.page.ts:67](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/events/pages/event-guests/event-guests.page.ts#L67)

#### Description

ID único de la convocatoria extraído de la URL.

***

### eventoData

> **eventoData**: `AppEvent` = `null`

Defined in: [src/app/features/events/pages/event-guests/event-guests.page.ts:69](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/events/pages/event-guests/event-guests.page.ts#L69)

#### Description

Datos de la convocatoria hidratados desde el servicio.

***

### hoyFormateado

> **hoyFormateado**: `string` = `''`

Defined in: [src/app/features/events/pages/event-guests/event-guests.page.ts:75](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/events/pages/event-guests/event-guests.page.ts#L75)

#### Description

Fecha actual formateada en huso local (YYYY-MM-DD) para indexación de pases.

***

### invitacionesEnviadasHoy

> **invitacionesEnviadasHoy**: `number` = `0`

Defined in: [src/app/features/events/pages/event-guests/event-guests.page.ts:80](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/events/pages/event-guests/event-guests.page.ts#L80)

#### Description

Contador reactivo del número de pases ya expedidos hoy por el socio.

***

### invitadoSeleccionadoId

> **invitadoSeleccionadoId**: `string` = `''`

Defined in: [src/app/features/events/pages/event-guests/event-guests.page.ts:92](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/events/pages/event-guests/event-guests.page.ts#L92)

#### Description

ID del usuario seleccionado del dropdown predictivo listo para ser invitado.

***

### limiteInvitaciones

> **limiteInvitaciones**: `number` = `0`

Defined in: [src/app/features/events/pages/event-guests/event-guests.page.ts:78](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/events/pages/event-guests/event-guests.page.ts#L78)

#### Description

Cupo máximo de pases configurados en la convocatoria para este socio.

***

### misInvitadosEvento

> **misInvitadosEvento**: `FairAccess`[] = `[]`

Defined in: [src/app/features/events/pages/event-guests/event-guests.page.ts:83](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/events/pages/event-guests/event-guests.page.ts#L83)

#### Description

Listado de pases emitidos bajo la responsabilidad del socio para esta convocatoria.

***

### nombreBusqueda

> **nombreBusqueda**: `string` = `''`

Defined in: [src/app/features/events/pages/event-guests/event-guests.page.ts:90](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/events/pages/event-guests/event-guests.page.ts#L90)

#### Description

Cadena reactiva vinculada al input de búsqueda de la UI.

***

### usuariosActivos

> **usuariosActivos**: `User`[] = `[]`

Defined in: [src/app/features/events/pages/event-guests/event-guests.page.ts:85](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/events/pages/event-guests/event-guests.page.ts#L85)

#### Description

Bolsa general de usuarios candidatos con rol invitado activos en el censo.

***

### usuariosFiltrados

> **usuariosFiltrados**: `User`[] = `[]`

Defined in: [src/app/features/events/pages/event-guests/event-guests.page.ts:87](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/events/pages/event-guests/event-guests.page.ts#L87)

#### Description

Colección filtrada en caliente según los inputs del buscador de la UI.

## Methods

### cargarConfiguracionYInvitados()

> **cargarConfiguracionYInvitados**(): `Promise`\<`void`\>

Defined in: [src/app/features/events/pages/event-guests/event-guests.page.ts:143](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/events/pages/event-guests/event-guests.page.ts#L143)

#### Returns

`Promise`\<`void`\>

#### Method

cargarConfiguracionYInvitados

#### Description

Descarga la configuración de la convocatoria delegando la consulta en el EventsService.

***

### cargarTablaInvitados()

> **cargarTablaInvitados**(): `Promise`\<`void`\>

Defined in: [src/app/features/events/pages/event-guests/event-guests.page.ts:165](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/events/pages/event-guests/event-guests.page.ts#L165)

#### Returns

`Promise`\<`void`\>

#### Method

cargarTablaInvitados

#### Description

Descarga la relación de pases emitidos hoy y filtra las cuentas candidatas a recibir invitación.

***

### eliminarPase()

> **eliminarPase**(`pase`): `Promise`\<`void`\>

Defined in: [src/app/features/events/pages/event-guests/event-guests.page.ts:266](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/events/pages/event-guests/event-guests.page.ts#L266)

#### Parameters

##### pase

`FairAccess`

Instancia del pase que se desea revocar.

#### Returns

`Promise`\<`void`\>

#### Method

eliminarPase

#### Description

Solicita confirmación imperativa al usuario y delega la anulación del pase digital 
individual en la capa de servicios de shared-core. Centraliza el reporte de fallos en el interceptor 
maestro del monorrepo.

***

### enviarInvitacion()

> **enviarInvitacion**(): `Promise`\<`void`\>

Defined in: [src/app/features/events/pages/event-guests/event-guests.page.ts:230](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/events/pages/event-guests/event-guests.page.ts#L230)

#### Returns

`Promise`\<`void`\>

#### Method

enviarInvitacion

#### Description

Invoca el método transaccional de FairService en shared-core, el cual evalúa 
el aforo en caliente en el servidor blindando la app de condiciones de carrera.

***

### filtrarUsuarios()

> **filtrarUsuarios**(`event`): `void`

Defined in: [src/app/features/events/pages/event-guests/event-guests.page.ts:196](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/events/pages/event-guests/event-guests.page.ts#L196)

#### Parameters

##### event

`any`

#### Returns

`void`

#### Method

filtrarUsuarios

#### Description

Filtra en memoria local el listado predictivo del buscador basándose en nombres o DNI.

***

### limpiarBusqueda()

> **limpiarBusqueda**(): `void`

Defined in: [src/app/features/events/pages/event-guests/event-guests.page.ts:219](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/events/pages/event-guests/event-guests.page.ts#L219)

#### Returns

`void`

***

### ngOnInit()

> **ngOnInit**(): `Promise`\<`void`\>

Defined in: [src/app/features/events/pages/event-guests/event-guests.page.ts:118](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/events/pages/event-guests/event-guests.page.ts#L118)

#### Returns

`Promise`\<`void`\>

#### Method

ngOnInit

#### Description

Ciclo de vida inicial. Hidrata la sesión del socio y valida las rutas de entrada.

#### Implementation of

`OnInit.ngOnInit`

***

### ordenarAlfabeticamente()

> **ordenarAlfabeticamente**(`usuarios`): `Promise`\<`User`[]\>

Defined in: [src/app/features/events/pages/event-guests/event-guests.page.ts:135](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/events/pages/event-guests/event-guests.page.ts#L135)

#### Parameters

##### usuarios

`User`[]

#### Returns

`Promise`\<`User`[]\>

#### Method

ordenarAlfabeticamente

#### Description

Helper de ordenación puramente en memoria de colecciones de usuarios.

***

### seleccionarUsuario()

> **seleccionarUsuario**(`user`): `void`

Defined in: [src/app/features/events/pages/event-guests/event-guests.page.ts:213](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/events/pages/event-guests/event-guests.page.ts#L213)

#### Parameters

##### user

`User`

#### Returns

`void`
