[**shared-core**](../README.md)

***

[shared-core](../README.md) / AuthSessionService

# Class: AuthSessionService

Defined in: [services/auth-session.service.ts:42](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/auth-session.service.ts#L42)

## Constructors

### Constructor

> **new AuthSessionService**(`auth`, `firestore`, `router`, `notification`, `ngZone`, `injector`): `AuthSessionService`

Defined in: [services/auth-session.service.ts:76](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/auth-session.service.ts#L76)

#### Parameters

##### auth

`Auth`

##### firestore

`Firestore`

##### router

`Router`

##### notification

[`NotificationService`](NotificationService.md)

##### ngZone

`NgZone`

##### injector

`EnvironmentInjector`

#### Returns

`AuthSessionService`

## Properties

### authReady

> `readonly` **authReady**: `Signal`\<`boolean`\>

Defined in: [services/auth-session.service.ts:71](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/auth-session.service.ts#L71)

***

### currentUser

> `readonly` **currentUser**: `Signal`\<`User`\>

Defined in: [services/auth-session.service.ts:61](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/auth-session.service.ts#L61)

***

### currentUserData

> `readonly` **currentUserData**: `Signal`\<`any`\>

Defined in: [services/auth-session.service.ts:66](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/auth-session.service.ts#L66)

## Methods

### initAuthListener()

> **initAuthListener**(): `void`

Defined in: [services/auth-session.service.ts:99](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/auth-session.service.ts#L99)

Inicializa listener global auth.

#### Returns

`void`

***

### isLogged()

> **isLogged**(): `boolean`

Defined in: [services/auth-session.service.ts:210](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/auth-session.service.ts#L210)

#### Returns

`boolean`

***

### login()

> **login**(`email`, `password`): `Promise`\<`UserCredential`\>

Defined in: [services/auth-session.service.ts:223](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/auth-session.service.ts#L223)

Login Firebase.

#### Parameters

##### email

`string`

##### password

`string`

#### Returns

`Promise`\<`UserCredential`\>

***

### logout()

> **logout**(): `Promise`\<`void`\>

Defined in: [services/auth-session.service.ts:280](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/auth-session.service.ts#L280)

Logout usuario.

#### Returns

`Promise`\<`void`\>

***

### reloadUserData()

> **reloadUserData**(`uid`): `Promise`\<`any`\>

Defined in: [services/auth-session.service.ts:319](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/auth-session.service.ts#L319)

Recarga datos Firestore usuario.

#### Parameters

##### uid

`string`

#### Returns

`Promise`\<`any`\>

***

### waitForAuthReady()

> **waitForAuthReady**(): `Promise`\<`void`\>

Defined in: [services/auth-session.service.ts:180](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/auth-session.service.ts#L180)

#### Returns

`Promise`\<`void`\>
