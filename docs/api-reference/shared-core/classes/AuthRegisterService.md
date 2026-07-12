[**shared-core**](../README.md)

***

[shared-core](../README.md) / AuthRegisterService

# Class: AuthRegisterService

Defined in: [services/auth-register.service.ts:47](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/auth-register.service.ts#L47)

AuthRegisterService

## Description

Servicio core transaccional encargado de orquestar el alta e inscripción de usuarios en la plataforma.
Gestiona de forma síncrona la sincronización entre Firebase Authentication y Cloud Firestore, aplicando
un patrón rollback estricto en caso de fallo parcial para evitar registros huérfanos o inconsistencias.

## Constructors

### Constructor

> **new AuthRegisterService**(): `AuthRegisterService`

Defined in: [services/auth-register.service.ts:65](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/auth-register.service.ts#L65)

#### Returns

`AuthRegisterService`

#### Description

Inicializa el motor transaccional de registro.

## Methods

### register()

> **register**(`user`, `checkInvitation?`): `Promise`\<[`User`](../interfaces/User.md)\>

Defined in: [services/auth-register.service.ts:76](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/auth-register.service.ts#L76)

#### Parameters

##### user

`Partial`\<[`User`](../interfaces/User.md)\> & `object`

DTO con la información civil y credenciales facilitadas en el formulario.

##### checkInvitation?

`boolean` = `true`

Determina si se aplica la restricción perimetral de invitaciones.

#### Returns

`Promise`\<[`User`](../interfaces/User.md)\>

Documento consolidado del usuario de Firestore.

#### Method

register

#### Description

Orquesta el flujo atómico de registro. Si es un registro civil común (`checkInvitation = true`),
exige y consume un token válido de invitación. Si es un alta administrativa (`checkInvitation = false`),
levanta una instancia secundaria de Firebase App en caliente para evitar la suplantación de la sesión activa del directivo.
