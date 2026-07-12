[**shared-core**](../README.md)

***

[shared-core](../README.md) / LoadingService

# Class: LoadingService

Defined in: [services/loading.service.ts:14](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/loading.service.ts#L14)

LoadingService

## Description

Servicio core de UI encargado de gestionar los estados globales de carga e intermitencia.
Abstrae los spinners de bloqueo y provee el envoltorio seguro `wrap()`, el cual aplica una 
estrategia defensiva de carrera de promesas para evitar bloqueos indefinidos por caídas de red NoSQL.

## Constructors

### Constructor

> **new LoadingService**(): `LoadingService`

Defined in: [services/loading.service.ts:29](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/loading.service.ts#L29)

#### Returns

`LoadingService`

#### Description

Inicializa el servicio controlador de esperas de UI.

## Methods

### hide()

> **hide**(): `Promise`\<`void`\>

Defined in: [services/loading.service.ts:59](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/loading.service.ts#L59)

#### Returns

`Promise`\<`void`\>

#### Method

hide

#### Description

Destruye y desvanece con gracia el spinner de carga que se encuentre activo.

***

### show()

> **show**(`message?`): `Promise`\<`HTMLIonLoadingElement`\>

Defined in: [services/loading.service.ts:38](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/loading.service.ts#L38)

#### Parameters

##### message?

`string` = `'Cargando...'`

Mensaje textual explicativo de la operación de fondo.

#### Returns

`Promise`\<`HTMLIonLoadingElement`\>

Elemento overlay instanciado.

#### Method

show

#### Description

Despliega e instancia de forma imperativa un spinner de bloqueo en primer plano.
Bloquea la interacción del socio con el fondo del lienzo para garantizar la integridad transaccional.

***

### wrap()

> **wrap**\<`T`\>(`callback`, `message?`): `Promise`\<`T`\>

Defined in: [services/loading.service.ts:74](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/loading.service.ts#L74)

#### Type Parameters

##### T

`T`

#### Parameters

##### callback

() => `Promise`\<`T`\>

##### message?

`string` = `'Cargando...'`

#### Returns

`Promise`\<`T`\>

#### Method

wrap

#### Description

🛡️ ENVOLTORIO PROTECTOR DE INFRAESTRUCTURA: Ejecuta un callback asíncrono envolviéndolo 
en un spinner visual y aplicando una carrera de promesas (Promise.race). 
Si Firestore se congela debido a mala cobertura, intercepta el bloqueo, libera la pantalla y despacha un Toast offline.
