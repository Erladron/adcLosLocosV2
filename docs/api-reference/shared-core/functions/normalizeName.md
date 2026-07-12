[**shared-core**](../README.md)

***

[shared-core](../README.md) / normalizeName

# Function: normalizeName()

> **normalizeName**(`value`): `string`

Defined in: [utils/string.utils.ts:11](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/utils/string.utils.ts#L11)

**`Function`**

normalizeName

## Parameters

### value

`string`

Cadena de texto bruta introducida por el usuario.

## Returns

`string`

Cadena normalizada resultante.

## Description

Normaliza nombres propios o apellidos completos aplicando formato PascalCase.
Elimina espacios redundantes iniciales, intermedios o finales de la cadena.

## Example

```ts
"jUAN jEsUs" => "Juan Jesus"
```
