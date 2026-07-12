[**adcLosLocosV2**](../../../../../../README.md)

***

[adcLosLocosV2](../../../../../../README.md) / [features/users/pages/gest-user/gest-user.page](../README.md) / GestUserPage

# Class: GestUserPage

Defined in: [src/app/features/users/pages/gest-user/gest-user.page.ts:74](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/gest-user/gest-user.page.ts#L74)

GestUserPage

## Description

Componente controlador de la pantalla de directorio y gestión general de usuarios.
Se encuentra 100% desacoplado de la base de datos de Firebase, canalizando todas las lecturas a través de la interfaz expuesta por el UserService.

## Implements

OnInit

## Implements

- `OnInit`

## Constructors

### Constructor

> **new GestUserPage**(`userService`, `notification`, `router`, `route`, `policies`, `dialog`, `loading`, `errorHandler`): `GestUserPage`

Defined in: [src/app/features/users/pages/gest-user/gest-user.page.ts:184](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/gest-user/gest-user.page.ts#L184)

#### Parameters

##### userService

`UserService`

Servicio centralizado para la manipulación y abstracción de datos de usuarios.

##### notification

`NotificationService`

Servicio reactivo para despachar alertas y notificaciones Toast en pantalla.

##### router

`Router`

Enrutador general de Angular para la navegación entre vistas.

##### route

`ActivatedRoute`

Capturador de estados y parámetros dinámicos de la URL activa.

##### policies

`AuthPoliciesService`

Centralizador de políticas y evaluación perimetral de roles y permisos.

##### dialog

`DialogService`

Componente abstracto para el despliegue de modales y ventanas de confirmación.

##### loading

`LoadingService`

Controlador para superponer velos de carga asíncronos en la UI.

##### errorHandler

`ErrorHandlerService`

Servicio interceptor para el aislamiento y tipado de excepciones críticas del sistema.

#### Returns

`GestUserPage`

#### Description

Inicializa el componente e inyecta las dependencias de la capa de servicios, registrando el set nativo de iconos vectoriores.

## Properties

### canAddUsers

> **canAddUsers**: `boolean` = `false`

Defined in: [src/app/features/users/pages/gest-user/gest-user.page.ts:146](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/gest-user/gest-user.page.ts#L146)

#### Description

Flag lógico que determina si el usuario en sesión posee privilegios para dar de alta perfiles de forma manual.

***

### canApproveUsers

> **canApproveUsers**: `boolean` = `false`

Defined in: [src/app/features/users/pages/gest-user/gest-user.page.ts:152](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/gest-user/gest-user.page.ts#L152)

#### Description

Flag lógico que determina si el usuario en sesión está autorizado a validar o denegar altas pendientes.

***

### canViewInactiveUsers

> **canViewInactiveUsers**: `boolean` = `false`

Defined in: [src/app/features/users/pages/gest-user/gest-user.page.ts:158](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/gest-user/gest-user.page.ts#L158)

#### Description

Flag de administración que habilita la capacidad de visualizar registros históricos de bajas.

***

### filteredInactiveUsers

> **filteredInactiveUsers**: `User`[] = `[]`

Defined in: [src/app/features/users/pages/gest-user/gest-user.page.ts:110](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/gest-user/gest-user.page.ts#L110)

#### Description

Listado secundario filtrado en tiempo real de usuarios en estado inactivo.

***

### filteredPendingUsers

> **filteredPendingUsers**: `User`[] = `[]`

Defined in: [src/app/features/users/pages/gest-user/gest-user.page.ts:98](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/gest-user/gest-user.page.ts#L98)

#### Description

Listado secundario filtrado en tiempo real de usuarios pendientes.

***

### filteredUsers

> **filteredUsers**: `User`[] = `[]`

Defined in: [src/app/features/users/pages/gest-user/gest-user.page.ts:86](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/gest-user/gest-user.page.ts#L86)

#### Description

Listado secundario filtrado en tiempo real de usuarios activos para renderizar en la interfaz gráfica.

***

### inactiveUsers

> **inactiveUsers**: `User`[] = `[]`

Defined in: [src/app/features/users/pages/gest-user/gest-user.page.ts:104](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/gest-user/gest-user.page.ts#L104)

#### Description

Listado maestro de usuarios que han sido dados de baja de forma lógica en la plataforma.

***

### isSocioComun

> **isSocioComun**: `boolean` = `false`

Defined in: [src/app/features/users/pages/gest-user/gest-user.page.ts:170](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/gest-user/gest-user.page.ts#L170)

#### Description

Variable de control atómico que determina si el usuario logueado es un socio ordinario sin privilegios de gestión.

***

### pageSize

> **pageSize**: `number` = `15`

Defined in: [src/app/features/users/pages/gest-user/gest-user.page.ts:134](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/gest-user/gest-user.page.ts#L134)

#### Description

Tamaño máximo predeterminado del bloque de carga por lote para la paginación progresiva.

***

### pendingUsers

> **pendingUsers**: `User`[] = `[]`

Defined in: [src/app/features/users/pages/gest-user/gest-user.page.ts:92](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/gest-user/gest-user.page.ts#L92)

#### Description

Listado maestro de usuarios cuya solicitud de pre-alta web está pendiente de revisión.

***

### searchText

> **searchText**: `string` = `''`

Defined in: [src/app/features/users/pages/gest-user/gest-user.page.ts:140](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/gest-user/gest-user.page.ts#L140)

#### Description

Cadena de texto reactiva vinculada al buscador que almacena los criterios introducidos por el usuario.

***

### tabActual

> **tabActual**: `string` = `'activos'`

Defined in: [src/app/features/users/pages/gest-user/gest-user.page.ts:164](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/gest-user/gest-user.page.ts#L164)

#### Description

Identificador de la pestaña o segmento seleccionado actualmente en la vista ('activos' | 'pendientes' | 'inactivos').

***

### users

> **users**: `User`[] = `[]`

Defined in: [src/app/features/users/pages/gest-user/gest-user.page.ts:80](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/gest-user/gest-user.page.ts#L80)

#### Description

Listado maestro global de usuarios activos recuperados del servicio.

***

### visibleInactiveUsers

> **visibleInactiveUsers**: `User`[] = `[]`

Defined in: [src/app/features/users/pages/gest-user/gest-user.page.ts:128](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/gest-user/gest-user.page.ts#L128)

#### Description

Segmento de usuarios inactivos acoplado al paginador progresivo del scroll infinito.

***

### visiblePendingUsers

> **visiblePendingUsers**: `User`[] = `[]`

Defined in: [src/app/features/users/pages/gest-user/gest-user.page.ts:122](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/gest-user/gest-user.page.ts#L122)

#### Description

Segmento de usuarios pendientes acoplado al paginador progresivo del scroll infinito.

***

### visibleUsers

> **visibleUsers**: `User`[] = `[]`

Defined in: [src/app/features/users/pages/gest-user/gest-user.page.ts:116](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/gest-user/gest-user.page.ts#L116)

#### Description

Segmento de usuarios activos actualmente acoplado al scroll infinito para evitar bloqueos del DOM.

## Methods

### aprobarUsuario()

> **aprobarUsuario**(`user`): `Promise`\<`void`\>

Defined in: [src/app/features/users/pages/gest-user/gest-user.page.ts:385](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/gest-user/gest-user.page.ts#L385)

#### Parameters

##### user

`User`

Instancia de datos del usuario que se pretende aprobar.

#### Returns

`Promise`\<`void`\>

#### Method

aprobarUsuario

#### Description

Dispacha el UID hacia el UserService para tramitar la aprobación del ingreso del socio a través de la Cloud Function.

***

### cargarMasUsuarios()

> **cargarMasUsuarios**(`event`): `void`

Defined in: [src/app/features/users/pages/gest-user/gest-user.page.ts:340](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/gest-user/gest-user.page.ts#L340)

#### Parameters

##### event

`any`

Objeto evento nativo de finalización del refresco emitido por el componente `<ion-infinite-scroll>`.

#### Returns

`void`

#### Method

cargarMasUsuarios

#### Description

Concatena lotes incrementales de registros a la vista de scroll activo mitigando sobrecargas en el DOM.

***

### filterUsers()

> **filterUsers**(): `void`

Defined in: [src/app/features/users/pages/gest-user/gest-user.page.ts:284](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/gest-user/gest-user.page.ts#L284)

#### Returns

`void`

#### Method

filterUsers

#### Description

Motor de búsqueda local por coincidencia de caracteres. Filtra en minúsculas los arrays en caliente.
Incluye el mapeo predictivo del estado financiero convirtiendo el booleano en cadenas textuales en español.

***

### ionViewWillEnter()

> **ionViewWillEnter**(): `Promise`\<`void`\>

Defined in: [src/app/features/users/pages/gest-user/gest-user.page.ts:216](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/gest-user/gest-user.page.ts#L216)

#### Returns

`Promise`\<`void`\>

#### Method

ionViewWillEnter

#### Description

Ciclo de vida nativo de Ionic que evalúa parámetros de query-params dinámicos e invoca la recarga limpia de las colecciones desde el servicio.

***

### isScrollDisabled()

> **isScrollDisabled**(): `boolean`

Defined in: [src/app/features/users/pages/gest-user/gest-user.page.ts:363](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/gest-user/gest-user.page.ts#L363)

#### Returns

`boolean`

Retorna true si se han impreso en pantalla todos los elementos del array filtrado.

#### Method

isScrollDisabled

#### Description

Evalúa de forma local si el hardware del Infinite Scroll debe inhabilitar su escucha activa.

***

### loadPermissions()

> **loadPermissions**(): `void`

Defined in: [src/app/features/users/pages/gest-user/gest-user.page.ts:271](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/gest-user/gest-user.page.ts#L271)

#### Returns

`void`

#### Method

loadPermissions

#### Description

Mapea en caliente las políticas y flags de seguridad analizando los tokens de sesión activos de forma síncrona.

***

### loadUsers()

> **loadUsers**(): `Promise`\<`void`\>

Defined in: [src/app/features/users/pages/gest-user/gest-user.page.ts:232](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/gest-user/gest-user.page.ts#L232)

#### Returns

`Promise`\<`void`\>

#### Method

loadUsers

#### Description

Centraliza la sincronización asíncrona de datos invocando de forma abstracta los métodos del UserService.
Aplica la bifurcación de seguridad requerida: si detecta un socio común, consume el endpoint blindado `getUsersForSocioComun`; 
si es directivo o admin, consume el directorio completo de gestión asumiendo la carga de pestañas pendientes e inactivas.

***

### ngOnInit()

> **ngOnInit**(): `Promise`\<`void`\>

Defined in: [src/app/features/users/pages/gest-user/gest-user.page.ts:206](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/gest-user/gest-user.page.ts#L206)

#### Returns

`Promise`\<`void`\>

#### Method

ngOnInit

#### Description

Ciclo de vida inicial del componente Angular. Ejecuta el mapeo de permisos y desencadena la descarga de datos a través del servicio.

#### Implementation of

`OnInit.ngOnInit`

***

### nuevoUsuario()

> **nuevoUsuario**(): `void`

Defined in: [src/app/features/users/pages/gest-user/gest-user.page.ts:375](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/gest-user/gest-user.page.ts#L375)

#### Returns

`void`

#### Method

nuevoUsuario

#### Description

Enruta al operador hacia el detalle de usuario inyectando banderas dinámicas query-params de alta manual.

***

### rechazarUsuario()

> **rechazarUsuario**(`user`): `Promise`\<`void`\>

Defined in: [src/app/features/users/pages/gest-user/gest-user.page.ts:403](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/gest-user/gest-user.page.ts#L403)

#### Parameters

##### user

`User`

Instancia de datos del usuario que se pretende rechazar.

#### Returns

`Promise`\<`void`\>

#### Method

rechazarUsuario

#### Description

Despliega el diálogo modal de confirmación y despacha la petición de denegación lógica al UserService.

***

### resetPagination()

> **resetPagination**(): `void`

Defined in: [src/app/features/users/pages/gest-user/gest-user.page.ts:328](https://github.com/Erladron/adcLosLocosV2/blob/3b076a2fc2049a5e6c312b758d85eea11fd2bfcc/src/app/features/users/pages/gest-user/gest-user.page.ts#L328)

#### Returns

`void`

#### Method

resetPagination

#### Description

Inicializa o restablece las porciones de arrays visibles limitados por el tamaño del lote `pageSize`.
