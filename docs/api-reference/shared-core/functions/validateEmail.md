[**shared-core**](../README.md)

***

[shared-core](../README.md) / validateEmail

# Function: validateEmail()

> **validateEmail**(`email`, `repeatEmail?`): `boolean`

Defined in: [utils/string.utils.ts:126](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/utils/string.utils.ts#L126)

**`Function`**

validateEmail

## Parameters

### email

`string`

Dirección de correo electrónico principal.

### repeatEmail?

`string`

Opcional; dirección de validación espejo para doble check de confirmación en altas.

## Returns

`boolean`

True si la sintaxis es correcta y (si se facilita) ambos correos son idénticos.

## Description

🚀 REFACTORIZADO: Motor evaluador sintáctico de correos electrónicos.
Saneado por completo: Se elimina el cortocircuito inalcanzable y se parametriza el repeatEmail opcional para reutilizar la lógica en todo el ecosistema.
