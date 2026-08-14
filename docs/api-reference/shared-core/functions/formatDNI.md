[**shared-core**](../index.md)

***

[shared-core](../index.md) / formatDNI

# Function: formatDNI()

> **formatDNI**(`dni`): `string`

Defined in: [utils/string.utils.ts:74](https://github.com/Erladron/adcLosLocosV2/blob/ef8b35066458446779d596c924480fd02bae169f/projects/shared-core/src/lib/utils/string.utils.ts#L74)

**`Function`**

formatDNI

## Parameters

### dni

`string`

Cadena con el documento sucio o incompleto.

## Returns

`string`

Cadena formateada de 8 números junto a su letra de validación exacta.

## Description

Filtra caracteres alfanuméricos espurios, extrae los dígitos y calcula síncronamente la letra de control.
oficial del Ministerio del Interior mediante el algoritmo de residuo módulo 23.
