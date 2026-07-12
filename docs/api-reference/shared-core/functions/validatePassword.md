[**shared-core**](../README.md)

***

[shared-core](../README.md) / validatePassword

# Function: validatePassword()

> **validatePassword**(`password`): `boolean`

Defined in: [utils/string.utils.ts:156](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/utils/string.utils.ts#L156)

**`Function`**

validatePassword

## Parameters

### password

`string`

Cadena de la contraseña.

## Returns

`boolean`

True si la longitud cumple el umbral de seguridad de 6 caracteres.

## Description

Evalúa los requisitos mínimos de robustez exigidos por Firebase Authentication para claves de acceso.
