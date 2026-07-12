[**shared-core**](../README.md)

***

[shared-core](../README.md) / UserDetailFormService

# Class: UserDetailFormService

Defined in: [services/user-detail-form.service.ts:13](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/user-detail-form.service.ts#L13)

UserDetailFormService

## Description

Servicio core especialista encargado de la validación sintáctica de formularios, 
control de equivalencias de dobles checks (emails/passwords) y detección de mutaciones en los inputs.

## Constructors

### Constructor

> **new UserDetailFormService**(): `UserDetailFormService`

Defined in: [services/user-detail-form.service.ts:19](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/user-detail-form.service.ts#L19)

#### Returns

`UserDetailFormService`

#### Description

Inicializa el validador de lógica de formularios del detalle.

## Methods

### emailChanged()

> **emailChanged**(`currentEmail`, `originalEmail`): `boolean`

Defined in: [services/user-detail-form.service.ts:83](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/user-detail-form.service.ts#L83)

#### Parameters

##### currentEmail

`string`

Email actual en edición en la caja de texto.

##### originalEmail

`string`

Email de respaldo original persistido en la base de datos.

#### Returns

`boolean`

Retorna true si el usuario ha alterado o editado la cadena del correo de acceso.

#### Method

emailChanged

#### Description

Compara el correo electrónico activo en el input frente al valor inmutable original descargado del servidor.

***

### passwordChanged()

> **passwordChanged**(`password`, `repeatPassword`): `boolean`

Defined in: [services/user-detail-form.service.ts:66](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/user-detail-form.service.ts#L66)

#### Parameters

##### password

`string`

Contraseña primaria.

##### repeatPassword

`string`

Contraseña espejo.

#### Returns

`boolean`

Retorna true si alguna de las variables presenta contenido de texto.

#### Method

passwordChanged

#### Description

Detección síncrona preliminar para verificar si el operador ha introducido caracteres en las cajas de contraseñas.

***

### validateCredentialsForm()

> **validateCredentialsForm**(`params`): `object`

Defined in: [services/user-detail-form.service.ts:101](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/user-detail-form.service.ts#L101)

#### Parameters

##### params

Objeto compuesto con las cadenas de texto en edición y sus respectivos respaldos de base de datos.

###### email

`string`

###### originalEmail

`string`

###### password

`string`

###### repeatEmail

`string`

###### repeatPassword

`string`

#### Returns

`object`

Descriptor analítico final con el veredicto de validación del formulario.

##### error

> **error**: [`AppMessageCode`](../enumerations/AppMessageCode.md)

##### valid

> **valid**: `boolean`

#### Method

validateCredentialsForm

#### Description

Orquesta la validación integral multinivel combinada para el bloque de credenciales de seguridad.
Realiza el cortocircuito inmediato evaluando cambios en emails y contraseñas.

***

### validateEmails()

> **validateEmails**(`email`, `repeatEmail`): `object`

Defined in: [services/user-detail-form.service.ts:28](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/user-detail-form.service.ts#L28)

#### Parameters

##### email

`string`

Cadena de texto correspondiente al correo electrónico primario.

##### repeatEmail

`string`

Cadena de texto correspondiente al correo de confirmación de la UI.

#### Returns

`object`

Descriptor estructurado con el booleano resultante y su código de error indexado si falla.

##### error

> **error**: [`AppMessageCode`](../enumerations/AppMessageCode.md)

##### valid

> **valid**: `boolean`

#### Method

validateEmails

#### Description

Evalúa la coherencia y concordancia exacta de los correos primarios y espejos usando utilidades del core.

***

### validatePasswords()

> **validatePasswords**(`password`, `repeatPassword`): `object`

Defined in: [services/user-detail-form.service.ts:47](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/services/user-detail-form.service.ts#L47)

#### Parameters

##### password

`string`

Cadena de texto de la contraseña primaria.

##### repeatPassword

`string`

Cadena de texto de la contraseña espejo de confirmación.

#### Returns

`object`

Descriptor estructurado con el veredicto del doble check.

##### error

> **error**: [`AppMessageCode`](../enumerations/AppMessageCode.md)

##### valid

> **valid**: `boolean`

#### Method

validatePasswords

#### Description

Evalúa la equivalencia exacta de las cadenas de caracteres suministradas en los campos de claves de acceso.
