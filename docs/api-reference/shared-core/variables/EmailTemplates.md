[**shared-core**](../README.md)

***

[shared-core](../README.md) / EmailTemplates

# Variable: EmailTemplates

> `const` **EmailTemplates**: `object`

Defined in: [templates/email-templates.ts:6](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/projects/shared-core/src/lib/templates/email-templates.ts#L6)

## Type Declaration

### getInvitationTemplate

> **getInvitationTemplate**: (`tokenGenerado`, `baseUrl?`) => `string`

#### Parameters

##### tokenGenerado

`string`

Hash único universal del token de siembra/invitación web.

##### baseUrl?

`string` = `'https://adcloslocos-desa.web.app'`

URL base del ecosistema web (inyectada según environment).

#### Returns

`string`

Código HTML enriquecido listo para ser inyectado en el transporte de mensajería (Nodemailer / Cloud Functions).

#### Method

getInvitationTemplate

#### Description

Genera el código HTML adaptativo para el correo de bienvenida y onboarding de nuevos socios.
🚀 REFACTORIZADO: Inyecta de manera dinámica la URL base de la aplicación para mitigar cruces de entornos entre desarrollo y producción.

## Const

EmailTemplates

## Description

Catálogo unificado de plantillas de correo electrónico estructuradas en HTML adaptativo (Responsive).
Provee los diseños corporativos premium optimizados para motores de renderizado de clientes de correo tradicionales (Outlook, Gmail, Apple Mail).
