[**shared-core**](../README.md)

***

[shared-core](../README.md) / FairService

# Class: FairService

Defined in: [services/fair.service.ts:44](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/fair.service.ts#L44)

FairService

## Description

Servicio core encargado de la expedición de invitaciones feriales, control de cupos 
por socio y procesamiento transaccional de picajes de QR en la portería de la caseta.

## Constructors

### Constructor

> **new FairService**(): `FairService`

#### Returns

`FairService`

## Methods

### contarInvitacionesDelDia()

> **contarInvitacionesDelDia**(`socioId`, `fecha`, `evento`): `Promise`\<`number`\>

Defined in: [services/fair.service.ts:96](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/fair.service.ts#L96)

#### Parameters

##### socioId

`string`

UID del socio emisor.

##### fecha

`string`

Fecha de corte evaluada.

##### evento

[`AppEvent`](../interfaces/AppEvent.md)

Convocatoria ferial de referencia.

#### Returns

`Promise`\<`number`\>

Número total de invitaciones consumidas por el socio.

#### Method

contarInvitacionesDelDia

#### Description

Calcula de forma síncrona el total de pases emitidos por un socio anfitrión para una fecha y evento dados.

***

### crearInvitacion()

> **crearInvitacion**(`socio`, `invitado`, `fecha`, `evento`): `Promise`\<[`PaseUniversal`](../interfaces/PaseUniversal.md)\>

Defined in: [services/fair.service.ts:124](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/fair.service.ts#L124)

#### Parameters

##### socio

[`User`](../interfaces/User.md)

Modelo de datos del socio emisor o anfitrión.

##### invitado

[`User`](../interfaces/User.md)

Modelo de datos del usuario receptor beneficiario.

##### fecha

`string`

Fecha asignada de validez.

##### evento

[`AppEvent`](../interfaces/AppEvent.md)

Convocatoria ferial vinculada.

#### Returns

`Promise`\<[`PaseUniversal`](../interfaces/PaseUniversal.md)\>

Credencial extendida generada en el servidor.

#### Method

crearInvitacion

#### Description

💡 INTERCEPTOR FINANCIERO CRÍTICO: Registra un pase de invitación para un tercero externo.
Valida en primera instancia que el socio anfitrión se encuentre al corriente de pago de sus cuotas anuales.
Evalúa secundariamente los límites transaccionales de aforo fijados en la convocatoria.

***

### crearInvitacionTransaccional()

> **crearInvitacionTransaccional**(`socio`, `invitado`, `fecha`, `evento`): `Promise`\<[`PaseUniversal`](../interfaces/PaseUniversal.md)\>

Defined in: [services/fair.service.ts:310](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/fair.service.ts#L310)

#### Parameters

##### socio

[`User`](../interfaces/User.md)

Modelo de datos del socio anfitrión emisor de la invitación.

##### invitado

[`User`](../interfaces/User.md)

Modelo de datos del usuario invitado receptor del pase.

##### fecha

`string`

Fecha asignada de validez del pase ferial (YYYY-MM-DD).

##### evento

[`AppEvent`](../interfaces/AppEvent.md)

Instancia local de la convocatoria para validar referencias.

#### Returns

`Promise`\<[`PaseUniversal`](../interfaces/PaseUniversal.md)\>

Promesa que resuelve la credencial generada con éxito tras la transacción.

#### Method

crearInvitacionTransaccional

#### Description

🛡️ VULNERABILIDAD BLINDADA (Race Conditions): Emite una invitación para un tercero externo
de forma transaccional y atómica en el servidor. Realiza una lectura en caliente del aforo actual del evento,
valida que no se supere el límite de plazas máximas, crea el pase digital e incrementa el aforo.

#### Throws

Lanza una excepción controlada si el socio no es solvente, si supera su cupo o si el aforo está completo.

***

### eliminarInvitacionTransaccional()

> **eliminarInvitacionTransaccional**(`paseId`, `eventId`): `Promise`\<`void`\>

Defined in: [services/fair.service.ts:391](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/fair.service.ts#L391)

#### Parameters

##### paseId

`string`

ID único de la invitación a eliminar.

##### eventId

`string`

ID de la convocatoria para actualizar su aforo.

#### Returns

`Promise`\<`void`\>

Promesa que resuelve al consolidar la transacción en el servidor.

#### Method

eliminarInvitacionTransaccional

#### Description

🛡️ OPERACIÓN ATÓMICA: Anula la invitación de un tercero externo eliminando su registro 
en la colección 'fair-access' y decrementando atómicamente el contador de aforo del evento asociado 
en el servidor, mitigando cualquier condición de carrera concurrente.
Emplea los códigos de error controlados del chasis centralizado.

#### Throws

Lanza una excepción con código AppMessageCode si el evento de destino no existe.

***

### obtenerCandidatosInvitadosDisponibles()

> **obtenerCandidatosInvitadosDisponibles**(`currentUserId`, `fecha`): `Promise`\<[`User`](../interfaces/User.md)[]\>

Defined in: [services/fair.service.ts:266](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/fair.service.ts#L266)

#### Parameters

##### currentUserId

`string`

UID del usuario operador logueado para aplicar exclusión mútua.

##### fecha

`string`

Fecha ferial de evaluación.

#### Returns

`Promise`\<[`User`](../interfaces/User.md)[]\>

Catálogo de usuarios aptos para recibir una invitación.

#### Method

obtenerCandidatosInvitadosDisponibles

#### Description

Consulta el padrón general del club buscando usuarios con el rol INVITADO que estén activos y no tengan un pase hoy.

***

### obtenerInvitadosDelSocio()

> **obtenerInvitadosDelSocio**(`socioId`, `fecha`): `Promise`\<[`PaseUniversal`](../interfaces/PaseUniversal.md)[]\>

Defined in: [services/fair.service.ts:243](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/fair.service.ts#L243)

#### Parameters

##### socioId

`string`

UID del socio anfitrión.

##### fecha

`string`

Cadena temporal YYYY-MM-DD.

#### Returns

`Promise`\<[`PaseUniversal`](../interfaces/PaseUniversal.md)[]\>

Matriz con los pases de invitación expedidos.

#### Method

obtenerInvitadosDelSocio

#### Description

Descarga el listado completo de pases de invitados asignados por un socio para una fecha concreta.

***

### obtenerPaseDiarioUsuario()

> **obtenerPaseDiarioUsuario**(`userId`, `date`): `Promise`\<[`PaseUniversal`](../interfaces/PaseUniversal.md)\>

Defined in: [services/fair.service.ts:64](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/fair.service.ts#L64)

#### Parameters

##### userId

`string`

UID del socio o invitado consultado.

##### date

`string`

Fecha actual de consulta en formato ISO simplificado (YYYY-MM-DD).

#### Returns

`Promise`\<[`PaseUniversal`](../interfaces/PaseUniversal.md)\>

Pase universal activo o null en su defecto.

#### Method

obtenerPaseDiarioUsuario

#### Description

Recupera la credencial digital de acceso de un usuario comprobando el rango de validez multi-día.

***

### registrarEscaneoPortero()

> **registrarEscaneoPortero**(`rawPayload`, `porteroUid`): `Promise`\<`void`\>

Defined in: [services/fair.service.ts:173](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/fair.service.ts#L173)

#### Parameters

##### rawPayload

`string`

Cadena alfanumérica encriptada o string de lectura rápida procedete del QR.

##### porteroUid

`string`

UID del operario autenticado en portería que valida el carnet.

#### Returns

`Promise`\<`void`\>

#### Method

registrarEscaneoPortero

#### Description

Procesa de forma atómica el picaje o lectura del código QR ejecutado por el personal en puerta.
Inyecta de forma inmutable el registro cronológico del escaneo facilitando accesos ilimitados.

***

### verificarYGenerarPaseSocioLogueado()

> **verificarYGenerarPaseSocioLogueado**(`usuarioActivo`): `Promise`\<`void`\>

Defined in: [services/fair.service.ts:232](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/fair.service.ts#L232)

#### Parameters

##### usuarioActivo

[`User`](../interfaces/User.md)

Instancia maestra del usuario activo.

#### Returns

`Promise`\<`void`\>

#### Method

verificarYGenerarPaseSocioLogueado

#### Description

Pasarela reservada para procesos de inicialización de credenciales de temporada.
