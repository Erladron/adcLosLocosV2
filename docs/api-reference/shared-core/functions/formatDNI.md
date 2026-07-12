[**shared-core**](../README.md)

***

[shared-core](../README.md) / formatDNI

# Function: formatDNI()

> **formatDNI**(`dni`): `string`

Defined in: [utils/string.utils.ts:74](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/utils/string.utils.ts#L74)

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
