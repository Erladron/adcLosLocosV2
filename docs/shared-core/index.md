# 📦 Shared Core - Librería Compartida del Monorrepo

## 🛠️ Propósito e Integración

La librería interna `shared-core` (ubicada en `projects/shared-core/`) actúa como la **única fuente de verdad** (*Single Source of Truth*) para todo el ecosistema digital de la peña. Al centralizar las interfaces de datos, enumeraciones de estado, lógica de validación perimetral y utilidades comunes, se garantiza la paridad absoluta de tipos y el desacoplamiento arquitectónico entre:

1. La aplicación móvil principal (Angular + Ionic Standalone).


2. El subproyecto web independiente de pre-alta (`web-onboarding`).


3. Los triggers, helpers y funciones del backend serverless (Cloud Functions v2).



La librería se expone y exporta de manera limpia al resto del monorrepo a través del punto de entrada unificado `projects/shared-core/src/public-api.ts`.

---

## 🏗️ Patrones Arquitectónicos y Sintaxis Funcional Moderna

### 1. Inyección de Dependencias mediante `inject()`

El núcleo compartido ha sido migrado con éxito hacia el patrón de sintaxis funcional de Angular. Se ha eliminado por completo la inyección clásica por constructor en los componentes y servicios del núcleo, sustituyéndola por la directiva modular `inject()`. Esto desacopla las clases de la herencia rígida y optimiza los árboles de dependencias. Los servicios core inyectan Firestore, el manejador de errores y el satélite de cuotas utilizando esta sintaxis funcional.

### 2. Sincronización del Huso Horario y Estado Reactivo (`NgZone`)

Para el manejo correcto del estado reactivo de Firebase y la captura de instantáneas en vivo mediante `onSnapshot()`, el sistema utiliza de forma imperativa `runInInjectionContext` junto a `NgZone`. Esto garantiza que las mutaciones de datos NoSQL asíncronas que ocurren en caliente en el servidor (como la validación de un pase en la puerta o un cambio masivo de cuotas) se inyecten correctamente dentro del ciclo de vida de Angular y fuercen la detección de cambios en la interfaz gráfica del cliente.

---

## 📂 Modelos de Datos y Enumeraciones (`Models & Enums`)

### 1. Control de Roles y Accesos Jerárquicos (`UserRole`)

Ubicado en `user-role.enum.ts`, fija de forma estricta las capacidades mediante Control de Acceso Basado en Roles (RBAC):

* ADMINISTRADOR: Privilegios totales de gobierno y destrucción de datos en el entorno.


* DIRECTIVA: Capacidad operativa de administración, alta de convocatorias e invitaciones.


* SOCIO: Miembro regular del club supeditado a cuotas anuales.


* PORTERO: Personal operativo asignado al control físico de accesos en la caseta.


* INVITADO: Usuario externo temporal autorizado mediante pase.



### 2. Ciclo de Vida Civil del Miembro (`UserStatus`)

Ubicado en `user-status.enum.ts`, regula las fases del censo de la peña:

* PENDING_DATA: Fase de pre-alta web; el aspirante fue invitado pero no ha completado su ficha.


* PENDING_APPROVAL: Datos completados por el usuario; en cola de revisión por la directiva.


* ACTIVE: Miembro plenamente verificado con plenos derechos de acceso.


* INACTIVE: Baja lógica del sistema o suspensión por impago de cuotas.


* REJECTED: Solicitud de onboarding desestimada por la Junta.



### 3. Estructuras de Entidades Obligatorias

* `User` (`models/users.models.ts`): Define la forma inmutable del documento almacenado en la colección `/users` de Firestore. Incluye propiedades críticas de auditoría como nombre, dni, telefono, numeroSocio, foto, cuotaAlCorriente, cuotaActualizadaPorNombre y createdAt.


* `AppEvent` (`models/events.models.ts`): Contrato técnico de las convocatorias feriales y asambleas, gobernando propiedades como maxAttendees, attendeeCount, requiresAccessControl y limiteInvitadosPorSocio.


* `PasseAccess` / `PaseUniversal` (`models/events.models.ts`): Extensión profesional para soportar la validez multi-día de las credenciales de la caseta ferial, indexando userId, hostId, invitedByName, scans (matriz de picajes cronológicos con scannedAt y gatekeeperUid) y el estado del pase.


* `InvitedUser` (`invited-user.model.ts`): Estructura que rige los tokens de pre-alta e invitaciones cruzadas en la colección `/invitedUsers`.



---

## 🔧 Servicios Compartidos de Infraestructura (`Services`)

### 1. Interceptor Central de Excepciones (`ErrorHandlerService`)

Centraliza y captura de forma robusta cualquier fallo del sistema o de red (`Catch-All`). Utiliza el mapa cerrado `FIREBASE_ERROR_MAP` (`firebase-error-map.ts`) para traducir al vuelo los códigos nativos del SDK de Google (como credential inválida, email ya en uso, contraseña débil o denegación de permisos) en constantes del dominio `AppMessageCode` expuestas mediante Toasts contextuales amigables. Si un error contiene un mensaje de negocio controlado (que empiece por `ADC_`), el handler lo expone directamente. Si se trata de una excepción imprevista o técnica en producción, enmascara la traza para evitar fugas de información y despliega de forma defensiva el código genérico de error del sistema.

### 2. Servicio Defensivo de Carga (`LoadingService`)

Implementa un patrón envoltorio `.wrap()` potenciado con una carrera de promesas asíncronas (`Promise.race`). Este mecanismo blinda la interfaz del cliente ante caídas latentes de red en entornos NoSQL distribuidos, aplicando tiempos de expiración estrictos: en producción se establece en 10 segundos para liberar la UI del socio ante pérdidas de cobertura móvil, mientras que en el entorno de Cypress se amplía a 60 segundos para mitigar falsos negativos (flaky tests) causados por el arranque en frío de emuladores en CI/CD.

### 3. Motor Financiero de Tesorería (`UserFeesService`)

Satélite especializado encargado de aislar la lógica de control de abonos anuales. Expone la regla perimetral de negocio `esSocioSolvente()`, la cual realiza un bypass de esquema automático otorgando solvencia transparente a los roles exentos de pago (`INVITADO`, `PORTERO`) y validando estrictamente el booleano `cuotaAlCorriente` en socios y directivos. Este servicio da soporte a la edición por lote (masiva) en el panel de mantenimiento, inyectando de forma atómica en Firestore las firmas de auditoría obligatorias exigidas por las reglas de seguridad (`cuotaActualizadaPorUid`, `cuotaActualizadaPorNombre` y `cuotaActualizadaAt`).

### 4. Orquestador Antiraza de Pases (`PasseService`)

Gestiona de forma centralizada la expedición y picaje de credenciales de caseta. Para blindar el sistema contra la consistencia eventual y condiciones de carrera concurrentes (*race conditions*), implementa transacciones atómicas directas en el servidor mediante `runTransaction`. Al crear una invitación, realiza una lectura crítica en caliente del aforo real; si el evento se llenó concurrentemente, aborta con seguridad, y si hay espacio, asienta el pase e incrementa la ocupación con `increment(1)`. En anulaciones, remueve el pase y decrementa el aforo con `increment(-1)`, asegurando que el total de asistentes jamás descienda por debajo de cero.

### 5. Otros Servicios del Ecosistema

* `MapboxService`: Especialista encargado de realizar consultas HTTP REST a la API de Geocoding V5, acotando de forma estricta las sugerencias de direcciones predictivas al territorio español (`country=es`) y en castellano (`language=es`).


* `AuthService`: Fachada de sesión que expone ganchos observables sobre la cuenta en curso y hereda métodos especialistas de `AuthCredentialsService` para mutaciones críticas de email y clave bajo re-autenticación obligatoria.


* `UserPhotoService` & `PhotoService`: Interactúan con la cámara nativa y carrete mediante Capacitor, controlando el lienzo de recorte (`ngx-image-cropper`) and convirtiendo los objetos Blob en cadenas Base64 serializadas para su persistencia segura en Firebase Storage.



---

## 🧩 Componentes Reutilizables Standalone (`Components`)

Declarados de forma atómica en el Shared Core bajo la arquitectura Standalone oficial de Ionic, listos para su importación directa sin necesidad de módulos intermedios:

### 1. `PageHeaderComponent`

Abstrae y normaliza la barra de herramientas superior corporativa (`<ion-toolbar>`). Integra efectos visuales premium como el desenfoque de fondo mediante `backdrop-filter: blur(16px)` y controla dinámicamente las compuertas de activación del botón de retroceso (`showBack`) y el activador del menú lateral hamburguesa (`showMenu`).

### 2. `EmptyStateComponent`

Lienzo unificado de presentación para notificar la ausencia de datos en listados o pantallas vacías. Implementa un ciclo de vida reactivo avanzado a través del gancho `ngOnChanges()`: intercepta la propiedad de entrada en formato kebab-case (ej. `cash-outline`), la traduce internamente a camelCase (`cashOutline`) y la registra al vuelo en el motor inmutable de IonIcons mediante `addIcons()`, evitando renderizados en blanco.

---

## 📄 Plantillas Globales (`Templates`)

* `EmailTemplates` (`templates/email-templates.ts`): Layouts HTML adaptivos y estilizados con la identidad de la peña y el imagotipo oficial del escudo. Es utilizado como la estructura base inyectable de correspondencia electrónica para los flujos automatizados de restablecimiento seguro de contraseñas y enlaces de onboarding, vinculando dinámicamente el token transaccional de un solo uso (`oobCode`).



---