[**shared-core**](../README.md)

***

[shared-core](../README.md) / ErrorHandlerService

# Class: ErrorHandlerService

Defined in: [services/error-handler.service.ts:17](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/error-handler.service.ts#L17)

ErrorHandlerService

## Description

Interceptor maestro y gestor centralizado de excepciones (Catch-All) del ecosistema.
Traduce de forma unificada errores de red, fallos NoSQL de Cloud Firestore, códigos nativos del SDK
de Firebase Auth o errores imprevistos del hilo de ejecución en Toasts corporativos amigables.

## Constructors

### Constructor

> **new ErrorHandlerService**(): `ErrorHandlerService`

Defined in: [services/error-handler.service.ts:26](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/error-handler.service.ts#L26)

#### Returns

`ErrorHandlerService`

#### Description

Inicializa el gestor interceptor de excepciones.

## Methods

### handle()

> **handle**(`error`, `fallbackMessage?`): `Promise`\<`void`\>

Defined in: [services/error-handler.service.ts:37](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/error-handler.service.ts#L37)

#### Parameters

##### error

`any`

Objeto de excepción capturado por los bloques try/catch de los servicios o componentes.

##### fallbackMessage?

[`AppMessageCode`](../enumerations/AppMessageCode.md) = `AppMessageCode.ADC_SYS_ERR_0001`

Código de contingencia por defecto si el fallo no está catalogado.

#### Returns

`Promise`\<`void`\>

#### Method

handle

#### Description

Intercepta un error, realiza un volcado de traza limpio en la consola para depuración
y determina de forma jerárquica el mensaje final que se renderizará de cara al socio.
Previene fugas de información técnica o strings de depuración crudas en producción.
