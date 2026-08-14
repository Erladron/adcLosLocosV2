[**shared-core**](../index.md)

***

[shared-core](../index.md) / validateDNI

# Function: validateDNI()

> **validateDNI**(`dni`): `boolean`

Defined in: [utils/string.utils.ts:98](https://github.com/Erladron/adcLosLocosV2/blob/ef8b35066458446779d596c924480fd02bae169f/projects/shared-core/src/lib/utils/string.utils.ts#L98)

**`Function`**

validateDNI

## Parameters

### dni

`string`

Cadena con el documento de identidad completo.

## Returns

`boolean`

True si el formato matemático es estrictamente solvente.

## Description

Comprueba la integridad física de un DNI/NIE contrastando el dígito verificador final contra la matriz de la peña.
