[**adcLosLocosV2**](../../../../../../README.md)

***

[adcLosLocosV2](../../../../../../README.md) / [features/users/pages/user-detail/user-detail.page](../README.md) / UserDetailPage

# Class: UserDetailPage

Defined in: [src/app/features/users/pages/user-detail/user-detail.page.ts:56](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/user-detail/user-detail.page.ts#L56)

UserDetailPage

## Description

Componente controlador principal para la pantalla de alta, edición y detalle pormenorizado de usuarios.
Totalmente desacoplado de la infraestructura NoSQL directa, canalizando su lógica de negocio y permisos
a través de la fachada especializada UserDetailFacadeService y la capa unificada del UserService.

## Implements

- `OnInit`

## Constructors

### Constructor

> **new UserDetailPage**(): `UserDetailPage`

Defined in: [src/app/features/users/pages/user-detail/user-detail.page.ts:165](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/user-detail/user-detail.page.ts#L165)

#### Returns

`UserDetailPage`

#### Description

Registra de forma aislada la paleta de iconos vectoriales del componente.

## Properties

### canDeactivateUser

> **canDeactivateUser**: `boolean` = `false`

Defined in: [src/app/features/users/pages/user-detail/user-detail.page.ts:111](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/user-detail/user-detail.page.ts#L111)

#### Description

Flag de administración que habilita la capacidad de aplicar una baja lógica destructiva temporal sobre el usuario.

***

### canEditCredentials

> **canEditCredentials**: `boolean` = `false`

Defined in: [src/app/features/users/pages/user-detail/user-detail.page.ts:105](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/user-detail/user-detail.page.ts#L105)

#### Description

Permiso para gestionar configuraciones perimetrales de emails y accesos a credenciales de la cuenta.

***

### canEditMembership

> **canEditMembership**: `boolean` = `false`

Defined in: [src/app/features/users/pages/user-detail/user-detail.page.ts:102](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/user-detail/user-detail.page.ts#L102)

#### Description

Permiso restrictivo para modificar asignaciones jerárquicas como roles corporativos y números de socio.

***

### canEditPassword

> **canEditPassword**: `boolean` = `false`

Defined in: [src/app/features/users/pages/user-detail/user-detail.page.ts:108](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/user-detail/user-detail.page.ts#L108)

#### Description

Permiso específico para autorizar o denegar la mutación directa de contraseñas.

***

### canEditPersonalData

> **canEditPersonalData**: `boolean` = `false`

Defined in: [src/app/features/users/pages/user-detail/user-detail.page.ts:99](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/user-detail/user-detail.page.ts#L99)

#### Description

Permiso para alterar o mutar los bloques de información civil e imágenes del perfil.

***

### canReactivateUser

> **canReactivateUser**: `boolean` = `false`

Defined in: [src/app/features/users/pages/user-detail/user-detail.page.ts:114](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/user-detail/user-detail.page.ts#L114)

#### Description

Flag de administración que habilita la reactivación de cuentas en estado inactivo.

***

### canViewAudit

> **canViewAudit**: `boolean` = `false`

Defined in: [src/app/features/users/pages/user-detail/user-detail.page.ts:117](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/user-detail/user-detail.page.ts#L117)

#### Description

Autoriza el renderizado de la consola de marcas de tiempo e historiales de auditoría del servidor.

***

### croppedImage

> **croppedImage**: `string` = `''`

Defined in: [src/app/features/users/pages/user-detail/user-detail.page.ts:156](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/user-detail/user-detail.page.ts#L156)

#### Description

Almacena el resultado en Base64 o URL local procesado por el componente recortador de imagen.

***

### currentPassword

> **currentPassword**: `string` = `''`

Defined in: [src/app/features/users/pages/user-detail/user-detail.page.ts:150](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/user-detail/user-detail.page.ts#L150)

#### Description

Almacena la contraseña actual del usuario autenticado exigida como re-autenticación en cambios sensibles.

***

### editingCredentials

> **editingCredentials**: `boolean` = `false`

Defined in: [src/app/features/users/pages/user-detail/user-detail.page.ts:129](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/user-detail/user-detail.page.ts#L129)

#### Description

Estado reactivo de edición para el bloque de formularios de correos y credenciales primarias.

***

### editingMembership

> **editingMembership**: `boolean` = `false`

Defined in: [src/app/features/users/pages/user-detail/user-detail.page.ts:126](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/user-detail/user-detail.page.ts#L126)

#### Description

Estado reactivo de edición para el bloque del formulario de membresía, roles y control de tesorería.

***

### editingPersonalData

> **editingPersonalData**: `boolean` = `false`

Defined in: [src/app/features/users/pages/user-detail/user-detail.page.ts:123](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/user-detail/user-detail.page.ts#L123)

#### Description

Estado reactivo de edición para el bloque del formulario de datos personales e imágenes.

***

### imageChangedEvent

> **imageChangedEvent**: `any` = `''`

Defined in: [src/app/features/users/pages/user-detail/user-detail.page.ts:153](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/user-detail/user-detail.page.ts#L153)

#### Description

Captura el evento nativo del DOM disparado al seleccionar un nuevo fichero de imagen desde el hardware local.

***

### isAdminCreate

> **isAdminCreate**: `boolean` = `false`

Defined in: [src/app/features/users/pages/user-detail/user-detail.page.ts:93](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/user-detail/user-detail.page.ts#L93)

#### Description

Determina si la acción procede de un flujo explícito de creación manual por parte de la directiva o administración.

***

### isEditMode

> **isEditMode**: `boolean` = `false`

Defined in: [src/app/features/users/pages/user-detail/user-detail.page.ts:87](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/user-detail/user-detail.page.ts#L87)

#### Description

Flag indicador que determina si la vista opera en modo de edición/lectura (true) o creación (false).

***

### isOwnProfile

> **isOwnProfile**: `boolean` = `false`

Defined in: [src/app/features/users/pages/user-detail/user-detail.page.ts:96](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/user-detail/user-detail.page.ts#L96)

#### Description

Flag de seguridad que determina si el perfil en pantalla pertenece al mismo usuario que ha iniciado sesión.

***

### isProfileCompletion

> **isProfileCompletion**: `boolean` = `false`

Defined in: [src/app/features/users/pages/user-detail/user-detail.page.ts:90](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/user-detail/user-detail.page.ts#L90)

#### Description

Flag que indica si la pantalla se renderiza dentro del flujo autónomo de completado de perfil pos-registro web.

***

### isVistaPublica

> **isVistaPublica**: `boolean` = `false`

Defined in: [src/app/features/users/pages/user-detail/user-detail.page.ts:120](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/user-detail/user-detail.page.ts#L120)

#### Description

🛡️ MODO SEGURIDAD: Define si la pantalla debe ocultar datos de carácter personal y financiero por violación de privilegios.

***

### mostrarCropper

> **mostrarCropper**: `boolean` = `false`

Defined in: [src/app/features/users/pages/user-detail/user-detail.page.ts:159](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/user-detail/user-detail.page.ts#L159)

#### Description

Flag que activa o destruye la visualización en primer plano del panel del lienzo de recorte.

***

### originalEmail

> **originalEmail**: `string` = `''`

Defined in: [src/app/features/users/pages/user-detail/user-detail.page.ts:135](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/user-detail/user-detail.page.ts#L135)

#### Description

Almacén temporal de respaldo del email original del usuario para evaluar solicitudes de cambio.

***

### password

> **password**: `string` = `''`

Defined in: [src/app/features/users/pages/user-detail/user-detail.page.ts:144](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/user-detail/user-detail.page.ts#L144)

#### Description

Almacén local temporal para capturar la nueva contraseña plana introducida en el formulario.

***

### pendingEmailVerification

> **pendingEmailVerification**: `boolean` = `false`

Defined in: [src/app/features/users/pages/user-detail/user-detail.page.ts:141](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/user-detail/user-detail.page.ts#L141)

#### Description

Estado lógico que determina si el perfil se encuentra bloqueado a la espera de una verificación de red.

***

### repeatEmail

> **repeatEmail**: `string` = `''`

Defined in: [src/app/features/users/pages/user-detail/user-detail.page.ts:138](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/user-detail/user-detail.page.ts#L138)

#### Description

Variable de control espejo para validar el doble check de introducción del correo electrónico.

***

### repeatPassword

> **repeatPassword**: `string` = `''`

Defined in: [src/app/features/users/pages/user-detail/user-detail.page.ts:147](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/user-detail/user-detail.page.ts#L147)

#### Description

Variable espejo para la validación y confirmación física de contraseñas nuevas.

***

### tiposDisponibles

> **tiposDisponibles**: `string`[]

Defined in: [src/app/features/users/pages/user-detail/user-detail.page.ts:132](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/user-detail/user-detail.page.ts#L132)

#### Description

Listado estricto de roles mapeados disponibles para asignación jerárquica en el sistema.

***

### user

> **user**: `User`

Defined in: [src/app/features/users/pages/user-detail/user-detail.page.ts:75](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/user-detail/user-detail.page.ts#L75)

#### Description

Instancia de datos del usuario que se está manipulando o visualizando en la pantalla.

***

### userId

> **userId**: `string` = `null`

Defined in: [src/app/features/users/pages/user-detail/user-detail.page.ts:84](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/user-detail/user-detail.page.ts#L84)

#### Description

Identificador único (UID) del usuario extraído de los parámetros de enrutamiento.

## Methods

### applyCropper()

> **applyCropper**(): `void`

Defined in: [src/app/features/users/pages/user-detail/user-detail.page.ts:537](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/user-detail/user-detail.page.ts#L537)

#### Returns

`void`

#### Description

Consolida la cadena Base64 optimizada como foto de perfil formal.

***

### cancelCropper()

> **cancelCropper**(): `void`

Defined in: [src/app/features/users/pages/user-detail/user-detail.page.ts:544](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/user-detail/user-detail.page.ts#L544)

#### Returns

`void`

#### Description

Cierra el lienzo de recorte restaurando el estado previo.

***

### deactivateUser()

> **deactivateUser**(): `Promise`\<`void`\>

Defined in: [src/app/features/users/pages/user-detail/user-detail.page.ts:404](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/user-detail/user-detail.page.ts#L404)

#### Returns

`Promise`\<`void`\>

#### Method

deactivateUser

#### Description

Lanza un prompt de captura para motivar y consolidar la baja lógica del socio en el servidor.

***

### imageCropped()

> **imageCropped**(`event`): `void`

Defined in: [src/app/features/users/pages/user-detail/user-detail.page.ts:528](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/user-detail/user-detail.page.ts#L528)

#### Parameters

##### event

`any`

#### Returns

`void`

#### Description

Intercepta los cambios en caliente del lienzo de recorte `ngx-image-cropper`.

***

### loadPermissions()

> **loadPermissions**(): `void`

Defined in: [src/app/features/users/pages/user-detail/user-detail.page.ts:266](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/user-detail/user-detail.page.ts#L266)

#### Returns

`void`

#### Method

loadPermissions

#### Description

Computa dinámicamente la matriz de compuertas de privilegios a través de la fachada.

***

### loadUser()

> **loadUser**(): `Promise`\<`void`\>

Defined in: [src/app/features/users/pages/user-detail/user-detail.page.ts:232](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/user-detail/user-detail.page.ts#L232)

#### Returns

`Promise`\<`void`\>

#### Method

loadUser

#### Description

Realiza la descarga asíncrona del documento del usuario aplicando la purga en modo Vista Pública.

***

### ngOnInit()

> **ngOnInit**(): `Promise`\<`void`\>

Defined in: [src/app/features/users/pages/user-detail/user-detail.page.ts:173](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/user-detail/user-detail.page.ts#L173)

#### Returns

`Promise`\<`void`\>

#### Method

ngOnInit

#### Description

Intercepta parámetros de enrutamiento y queries dinámicas, inicializando los estados de edición.

#### Implementation of

`OnInit.ngOnInit`

***

### onSendPasswordReset()

> **onSendPasswordReset**(`email`): `Promise`\<`void`\>

Defined in: [src/app/features/users/pages/user-detail/user-detail.page.ts:305](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/user-detail/user-detail.page.ts#L305)

#### Parameters

##### email

`string`

#### Returns

`Promise`\<`void`\>

#### Method

onSendPasswordReset

#### Description

Despacha el enlace seguro para el reseteo de claves canalizando los errores al interceptor unificado.

***

### reactivateUser()

> **reactivateUser**(): `Promise`\<`void`\>

Defined in: [src/app/features/users/pages/user-detail/user-detail.page.ts:435](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/user-detail/user-detail.page.ts#L435)

#### Returns

`Promise`\<`void`\>

#### Method

reactivateUser

#### Description

Revierte la baja lógica de una cuenta con confirmación explícita.

***

### save()

> **save**(): `Promise`\<`void`\>

Defined in: [src/app/features/users/pages/user-detail/user-detail.page.ts:465](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/user-detail/user-detail.page.ts#L465)

#### Returns

`Promise`\<`void`\>

#### Method

save

#### Description

Valida la estructura y comanda la creación física de nuevos registros de miembros en la plataforma.

***

### selectPhoto()

> **selectPhoto**(): `Promise`\<`void`\>

Defined in: [src/app/features/users/pages/user-detail/user-detail.page.ts:512](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/user-detail/user-detail.page.ts#L512)

#### Returns

`Promise`\<`void`\>

#### Description

Lanza el selector de ficheros nativo para capturar una imagen de la galería.

***

### solicitarBajaVoluntaria()

> **solicitarBajaVoluntaria**(): `Promise`\<`void`\>

Defined in: [src/app/features/users/pages/user-detail/user-detail.page.ts:554](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/user-detail/user-detail.page.ts#L554)

#### Returns

`Promise`\<`void`\>

#### Method

solicitarBajaVoluntaria

#### Description

🛡️ FLUJO DE PRIVACIDAD AVANZADO: Solicita confirmación explícita reforzada al socio.
Si confirma escribiendo la clave, procesa la baja e inmediatamente gatilla la desconexión 
del chasis expulsando de forma segura al usuario hacia la pantalla de acceso.

***

### takePhoto()

> **takePhoto**(): `Promise`\<`void`\>

Defined in: [src/app/features/users/pages/user-detail/user-detail.page.ts:519](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/user-detail/user-detail.page.ts#L519)

#### Returns

`Promise`\<`void`\>

#### Description

Inicializa la cámara nativa a través del plugin Capacitor de hardware.

***

### toggleCredentials()

> **toggleCredentials**(): `Promise`\<`void`\>

Defined in: [src/app/features/users/pages/user-detail/user-detail.page.ts:371](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/user-detail/user-detail.page.ts#L371)

#### Returns

`Promise`\<`void`\>

#### Method

toggleCredentials

#### Description

Gestiona las actualizaciones de correos, comprobaciones espejo y contraseñas primarias.

***

### toggleMembership()

> **toggleMembership**(): `Promise`\<`void`\>

Defined in: [src/app/features/users/pages/user-detail/user-detail.page.ts:348](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/user-detail/user-detail.page.ts#L348)

#### Returns

`Promise`\<`void`\>

#### Method

toggleMembership

#### Description

Conmuta el estado de edición y persiste el bloque jerárquico de membresía.

***

### togglePersonalData()

> **togglePersonalData**(): `Promise`\<`void`\>

Defined in: [src/app/features/users/pages/user-detail/user-detail.page.ts:323](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/user-detail/user-detail.page.ts#L323)

#### Returns

`Promise`\<`void`\>

#### Method

togglePersonalData

#### Description

Conmuta el estado de edición y persiste los datos civiles e imágenes de perfil.
