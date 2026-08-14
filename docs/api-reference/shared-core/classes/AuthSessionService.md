[**shared-core**](../index.md)

***

[shared-core](../index.md) / AuthSessionService

# Class: AuthSessionService

Defined in: [services/auth-session.service.ts:37](https://github.com/Erladron/adcLosLocosV2/blob/ef8b35066458446779d596c924480fd02bae169f/projects/shared-core/src/lib/services/auth-session.service.ts#L37)

## Constructors

### Constructor

> **new AuthSessionService**(`auth`, `firestore`, `navCtrl`, `notification`, `ngZone`, `injector`, `menuCtrl`, `platform`): `AuthSessionService`

Defined in: [services/auth-session.service.ts:47](https://github.com/Erladron/adcLosLocosV2/blob/ef8b35066458446779d596c924480fd02bae169f/projects/shared-core/src/lib/services/auth-session.service.ts#L47)

#### Parameters

##### auth

`Auth`

##### firestore

`Firestore`

##### navCtrl

`NavController`

##### notification

[`NotificationService`](NotificationService.md)

##### ngZone

`NgZone`

##### injector

`EnvironmentInjector`

##### menuCtrl

`MenuController`

##### platform

`Platform`

#### Returns

`AuthSessionService`

## Properties

### authReady

> `readonly` **authReady**: `Signal`\<`boolean`\>

Defined in: [services/auth-session.service.ts:45](https://github.com/Erladron/adcLosLocosV2/blob/ef8b35066458446779d596c924480fd02bae169f/projects/shared-core/src/lib/services/auth-session.service.ts#L45)

***

### currentUser

> `readonly` **currentUser**: `Signal`\<`User`\>

Defined in: [services/auth-session.service.ts:43](https://github.com/Erladron/adcLosLocosV2/blob/ef8b35066458446779d596c924480fd02bae169f/projects/shared-core/src/lib/services/auth-session.service.ts#L43)

***

### currentUserData

> `readonly` **currentUserData**: `Signal`\<`any`\>

Defined in: [services/auth-session.service.ts:44](https://github.com/Erladron/adcLosLocosV2/blob/ef8b35066458446779d596c924480fd02bae169f/projects/shared-core/src/lib/services/auth-session.service.ts#L44)

## Methods

### initAuthListener()

> **initAuthListener**(): `void`

Defined in: [services/auth-session.service.ts:58](https://github.com/Erladron/adcLosLocosV2/blob/ef8b35066458446779d596c924480fd02bae169f/projects/shared-core/src/lib/services/auth-session.service.ts#L58)

#### Returns

`void`

***

### isLogged()

> **isLogged**(): `boolean`

Defined in: [services/auth-session.service.ts:101](https://github.com/Erladron/adcLosLocosV2/blob/ef8b35066458446779d596c924480fd02bae169f/projects/shared-core/src/lib/services/auth-session.service.ts#L101)

#### Returns

`boolean`

***

### login()

> **login**(`email`, `password`): `Promise`\<`any`\>

Defined in: [services/auth-session.service.ts:105](https://github.com/Erladron/adcLosLocosV2/blob/ef8b35066458446779d596c924480fd02bae169f/projects/shared-core/src/lib/services/auth-session.service.ts#L105)

#### Parameters

##### email

`string`

##### password

`string`

#### Returns

`Promise`\<`any`\>

***

### logout()

> **logout**(): `Promise`\<`void`\>

Defined in: [services/auth-session.service.ts:118](https://github.com/Erladron/adcLosLocosV2/blob/ef8b35066458446779d596c924480fd02bae169f/projects/shared-core/src/lib/services/auth-session.service.ts#L118)

#### Returns

`Promise`\<`void`\>

***

### reloadUserData()

> **reloadUserData**(`uid`): `Promise`\<`any`\>

Defined in: [services/auth-session.service.ts:171](https://github.com/Erladron/adcLosLocosV2/blob/ef8b35066458446779d596c924480fd02bae169f/projects/shared-core/src/lib/services/auth-session.service.ts#L171)

#### Parameters

##### uid

`string`

#### Returns

`Promise`\<`any`\>

***

### waitForAuthReady()

> **waitForAuthReady**(): `Promise`\<`void`\>

Defined in: [services/auth-session.service.ts:86](https://github.com/Erladron/adcLosLocosV2/blob/ef8b35066458446779d596c924480fd02bae169f/projects/shared-core/src/lib/services/auth-session.service.ts#L86)

#### Returns

`Promise`\<`void`\>
