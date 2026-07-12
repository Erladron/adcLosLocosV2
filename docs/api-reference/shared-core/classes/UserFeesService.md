[**shared-core**](../README.md)

***

[shared-core](../README.md) / UserFeesService

# Class: UserFeesService

Defined in: [services/user-fees.service.ts:15](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/user-fees.service.ts#L15)

UserFeesService

## Description

Servicio satélite especializado de la capa de datos encargado en exclusiva de la gestión,
auditoría y validación perimetral del estado financiero y solvencia de las cuotas de los socios.
Aisla la lógica de tesorería para evitar la proliferación de ficheros monstruo en el core.

## Constructors

### Constructor

> **new UserFeesService**(): `UserFeesService`

Defined in: [services/user-fees.service.ts:24](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/user-fees.service.ts#L24)

#### Returns

`UserFeesService`

#### Description

Inicializa el motor de control financiero de tesorería.

## Methods

### esSocioSolvente()

> **esSocioSolvente**(`user`): `boolean`

Defined in: [services/user-fees.service.ts:77](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/user-fees.service.ts#L77)

#### Parameters

##### user

[`User`](../interfaces/User.md)

Instancia de datos del usuario que se pretende evaluar.

#### Returns

`boolean`

Retorna true si el usuario está al corriente de pago o si está exento de cuota.

#### Method

esSocioSolvente

#### Description

💡 REGLA DE NEGOCIO INTERNA: Evalúa la solvencia financiera de un usuario.
Si el tipo de usuario no es un rol sujeto a cuotas (como invitados o porteros), la regla determina que "sí" es solvente
de forma transparente por bypass de esquema. Si es socio o directiva, valida estrictamente el booleano.

***

### updateCuotasMasivas()

> **updateCuotasMasivas**(`cambios`, `adminUid`, `adminNombre`): `Promise`\<`void`\>

Defined in: [services/user-fees.service.ts:51](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/user-fees.service.ts#L51)

#### Parameters

##### cambios

`object`[]

##### adminUid

`string`

##### adminNombre

`string`

#### Returns

`Promise`\<`void`\>

***

### updateCuotaStatus()

> **updateCuotaStatus**(`uid`, `alCorriente`, `adminUid`, `adminNombre`): `Promise`\<`void`\>

Defined in: [services/user-fees.service.ts:36](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/user-fees.service.ts#L36)

#### Parameters

##### uid

`string`

UID único del socio cuya cuota va a actualizarse.

##### alCorriente

`boolean`

Nuevo estado financiero booleano (true si está pagado, false si está pendiente).

##### adminUid

`string`

UID del administrador o miembro de la directiva ejecutor que firma la modificación.

##### adminNombre

`string`

Nombre civil descriptivo del administrador ejecutor.

#### Returns

`Promise`\<`void`\>

Promesa asíncrona de actualización en la nube.

#### Method

updateCuotaStatus

#### Description

Registra de forma atómica el estado de pago de la cuota del socio en Firestore.
Encapsula la inyección obligatoria de metadatos de auditoría de tesorería exigida por las Security Rules.
