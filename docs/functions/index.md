# ⚡ Cloud Functions - Backend Serverless

## 🛠️ Arquitectura del Servidor

El backend de la A.C.D. Los Locos opera bajo el estándar moderno de Cloud Functions v2, implementado en un entorno Node.js con TypeScript (configurado en el directorio functions/src/). Toda la suite de funciones hereda la parametrización de región globalizada europe-west1 para optimizar los handshakes y handovers de red con los clientes de la península.

A diferencia de la consistencia local del cliente, el entorno serverless actúa con privilegios de infraestructura total a través del SDK administrativo de Firebase Admin, eludiendo las Security Rules perimetrales para efectuar escrituras e inicializaciones atómicas. La arquitectura se bifurca en dos grandes tipologías de ejecución de red:

1. Peticiones e Intercepciones HTTPS Directas (onRequest / onCall): Pasarelas orientadas a flujos transaccionales imperativos iniciados por el cliente o pasarelas externas.


2. Automatizaciones Orientadas a Eventos (Firestore Triggers v2): Microservicios reactivos en segundo plano que interceptan mutaciones en los documentos NoSQL (onDocumentCreated).



---

## 🔒 Catálogo de Funciones Administrativas (HTTPS)

Alojadas bajo el directorio src/functions/, regulan con aislamiento estricto el ciclo de vida del censo de socios y acompañantes:

### 1. `requestUserApproval`

Dispara la fase de post-registro web una vez que el aspirante finaliza el volcado civil de datos personales en el portal de onboarding. Setea reactivamente el estado de la cuenta al enumerado tipado UserStatus.PENDING_APPROVAL inyectando el documento en el padrón de Firestore para habilitar la auditoría visual de la Junta Directiva.

### 2. `approveUser`

Invocada por miembros autorizados de la administración para admitir a un aspirante en la peña. Comprueba de forma perimetral el token del ejecutor, eleva el estado a UserStatus.ACTIVE en la base de datos NoSQL y despacha de forma serverless la correspondencia electrónica automatizada de bienvenida.

### 3. `deactivateUser`

Inhabilita al instante el acceso perimetral de una cuenta a los servicios digitales del club. Muta el registro a UserStatus.INACTIVE y revoca de forma síncrona en caliente la validez de los tokens de sesión de Firebase Authentication en el servidor de identidades, forzando a los componentes de Capacitor a expulsar al usuario hacia el Login en el milisegundo de ejecución.

### 4. `reactivateUser`

Revierte el estado de bloqueo lógico de una cuenta previamente desactivada por impago o sanción. Devuelve el flag civil del usuario al estado activo (UserStatus.ACTIVE), permitiéndole recuperar los accesos operativos y la visualización de los abonos de temporada.

### 5. `createUserByAdmin` (onRequest v2)

Microservicio HTTPS crítico que implementa soporte nativo de CORS (cors: true) de la API v2 de Firebase, eliminando middlewares manuales intermedios. Permite a la directiva dar de alta perfiles de forma directa e individual sin pasar por el flujo de invitación externa.

El motor orquesta un lote transaccional (WriteBatch) asíncrono: registra las credenciales primarias en Firebase Authentication, inicializa el carnet digital en la colección /users y siembra en paralelo la colección /invitedUsers para blindar la coherencia relacional del censo. Cuenta con una salvaguarda de liquidación y Rollback automático en Auth; si la persistencia en Firestore es denegada o sufre una caída de red, la función fulmina la credencial creada para evitar cuentas huérfanas en el sistema.

### 6. `sendCustomPasswordReset` (onCall v2)

Intercepta la solicitud de restablecimiento y reemplaza las plantillas por defecto de Google por una pasarela premium con la identidad de la peña. Extrae el código de operación criptográfico único (oobCode) generado por Firebase Auth, ensambla de forma inmutable la URL corporativa apuntando al subproyecto web ([https://adcloslocos-desa.web.app/reset-password](https://www.google.com/search?q=https://adcloslocos-desa.web.app/reset-password)) y encola un documento con el layout HTML estilizado en la colección /mail para su distribución atómica vía SMTP.

---

## 🔔 Automatizaciones Basadas en Eventos (Firestore Triggers)

Microservicios desacoplados de alto rendimiento que reaccionan a los ciclos de vida de las colecciones de base de datos:

### 1. `onEventTriggerNotification`

Escucha la creación de nuevas convocatorias en la colección /events. Al activarse, lee el padrón de dispositivos móviles y propaga una alerta push masiva notificando la apertura de plazos de asistencia.

### 2. `onPasseAccessCreatedNotification` (v2 onDocumentCreated)

Trigger de alto impacto encargado de interceptar la emisión de credenciales feriales en la colección event-access/{accessId}. Resuelve de forma asíncrona en caliente los metadatos y el nombre real del evento asociado para garantizar la integridad de la alerta push, y extrae los tokens FCM activos del destinatario registrados en el subdirectorio users/{uid}/tokens.

El motor implementa una bifurcación de plantillas inteligente mapeada desde FcmTemplates: si el receptor es un invitado externo, inyecta la plantilla de invitación personalizada detallando el nombre del socio anfitrión responsable, mientras que si es un miembro del censo común, genera la plantilla de abono de temporada ferial.

---

## 🛠️ Herramientas de Soporte y Pruebas (Testing Helpers)

Endpoints HTTPS onRequest v2 restringidos rigurosamente al entorno local de emuladores mediante barreras de seguridad absolutas que evalúan el flag process.env.FUNCTIONS_EMULATOR para bloquear ejecuciones accidentales en producción. Garantizan la consistencia matemática y la repetibilidad de la suite de Cypress:

### 1. `inicializarTest`

Microservicio encargado de la siembra determinista del censo de pruebas de forma síncrona. Lee secuencialmente el catálogo estático del archivo usuarios_test.json e inserta las identidades maestras (Administrador, Directiva, Socio, Portero e Invitado) en Firebase Authentication, inyectando simultáneamente en Firestore las marcas temporales ISO y las referencias cruzadas de pre-alta en invitedUsers.

### 2. `borrarUsuarioPorEmailDev`

Actúa como un limpiador atómico destructivo entre ejecuciones de specs de Cypress. Localiza y elimina la credencial por correo electrónico en Auth y ejecuta operaciones por lote (WriteBatch) independientes en las colecciones de Firestore, purgando en cascada todos los documentos vinculados en users e invitedUsers para evitar colisiones por llaves duplicadas.

---

## 📦 Gestión de Mensajes y Plantillas (Templates & Helpers)

* `EmailTemplates` (src/constants/email-templates.ts): Repositorio centralizado de layouts HTML5 adaptivos que consumen la URL estática del imagotipo del escudo corporativo del club persistido en Storage, maquetando las respuestas de los flujos del backend.


* `FcmTemplates` (src/constants/fcm-templates.ts): Diccionario de internacionalización y payloads tipados para la correcta distribución de mensajes en los terminales móviles de los socios.


* `enviarConAutoLimpieza` (src/functions/notification-helper.ts): Utilidad de infraestructura multicast encargada de despachar ráfagas masivas a través de Firebase Cloud Messaging mediante sendEach(). Analiza reactivamente los rebotes del servidor de Google y ejecuta una purga atómica en lote (Batch) en Firestore para fulminar inmediatamente del subdirectorio del socio todos los tokens de registro revocados o huérfanos por desinstalación de la app móvil.