# 🌐 Web Onboarding - Subproyecto de Registro

## 🛠️ Arquitectura y Propósito

El subproyecto `web-onboarding` es una aplicación web independiente integrada en la estructura modular del monorrepo, desarrollada en Angular v20 empleando de forma estricta componentes Standalone. Su único propósito operativo dentro del ecosistema es servir como pasarela pública de captación, visado y registro primario para los nuevos aspirantes de la A.C.D. Los Locos.

Esta separación física aísla el tráfico de autoregistro público de los chasis de la aplicación móvil de producción, permitiendo canalizar las fases previas del censo desde navegadores web convencionales sin forzar la instalación prematura de empaquetados nativos en el terminal del usuario.

---

## 📂 Estructura de Páginas y Enrutado

El enrutamiento de la aplicación web se gestiona de forma centralizada en el archivo projects/web-onboarding/src/app/app.routes.ts. Las estaciones que rigen el flujo de admisión pública son las siguientes:

projects/web-onboarding/src/app/pages/

* welcome/: Landing page de aterrizaje encargada de capturar el token efímero de la URL y visar la invitación inicial del aspirante.


* register/: Formulario maestro reactivo para la cumplimentación del perfil y configuración inicial de claves privadas de acceso.


* success/: Confirmación visual premium orientada a la experiencia de usuario que notifica el encolamiento de la solicitud e inyecta enlaces de descarga nativos para tiendas.


* reset-password/: Portal web de contingencia utilizado por la Cloud Function v2 sendCustomPasswordReset para interceptar el token oobCode y cambiar contraseñas.


* politica-privacidad/: Vista legal estática que despliega las cláusulas de protección de datos (RGPD) aplicadas en el tratamiento de la información del club.



---

## 🔧 Servicios Núcleo (Core Services)

Alojados en projects/web-onboarding/src/app/core/services/, gestionan las pasarelas de seguridad perimetral previas a la creación de la sesión de usuario:

### 1. TokenService (token.service.ts)

Servicio especialista encargado de interceptar y auditar la vigencia de los pases web expedidos por la directiva antes de levantar los formularios reactivos de la pantalla de registro.

* Método `validateInvitation()`: Realiza lecturas directas en caliente en Firestore atacando la ruta indexada de la colección invitedUsers/{tokenId}. Si el documento no existe o posee la propiedad booleana usado seteada en true, el servicio corta de forma fulminante el flujo del cliente, inyecta un mensaje de denegación contextual mediante Toasts y redirige al aspirante a la pantalla de bienvenida, impidiendo autoregistros maliciosos o el canje múltiple del mismo token de siembra.



---

## 📝 Flujo Técnico del Formulario Maestro (RegisterComponent)

El controlador RegisterComponent (register.page.ts) orquesta la captura civil de datos, la validación sintáctica de claves y la persistencia transaccional en Firebase Auth y Cloud Firestore:

### Lógica de Formulario Reactivo (FormGroup)

El componente inicializa un FormGroup validado en tiempo real mediante delay sintáctico de Angular. Requiere obligatoriamente un nombre completo (nombre), una contraseña primaria con un mínimo de 6 caracteres y una repetición idéntica en el input espejo de confirmación, activando el validador personalizado de simetría síncrona passwordMatchValidator().

La interfaz web bloquea por código la pulsación del botón de envío "Registrarse y Entrar" si el formulario es inválido, si el hilo de red está saturado o si los términos legales vinculados a la política de privacidad no constan marcados explícitamente con el valor booleano true.

### Persistencia y Auditoría de Alta en Firebase

Al procesarse la acción de envío (onSubmit), la aplicación web orquesta las siguientes operaciones atómicas orientadas al dominio del monorrepo:

1. Mapeo Estructural: Ensambla un objeto parcial alineado estrictamente con el modelo unificado User del Shared Core, inyectando el email verificado de la invitación, el nombre civil limpio y el rastro formal de auditoría (invitadoPorNombre, invitadoPorUid y el sello de procedencia de canal creadoPorNombre asignado a Autoregistro desde Web).


2. Creación en Auth: Invoca el método register() de la fachada centralizada AuthService, provocando el alta inmediata de la credencial en el servidor de Firebase Authentication con claves cifradas de forma irreversible.


3. Consolidación en Firestore: La inserción inicial del perfil se escribe fijando el estado transaccional inicial de la cuenta en UserStatus.PENDING_DATA y el rol predeterminado en UserRole.INVITADO, provocando un bloqueo reactivo inmediato si el usuario intenta saltar hacia la aplicación móvil antes de rellenar su ficha completa o recibir la aprobación manual de la directiva.


4. Redirección Segura: Tras consolidar el registro e hidratar el canal del estado local de Angular sin bloquear el hilo visual, el enrutador redirige por código al aspirante hacia la vista /success para guiarlo en la instalación de las apps nativas móviles.



---

## 🔒 Cumplimiento Normativo (RGPD) y Seguridad

* Consentimiento Explícito: La maquetación de projects/web-onboarding/src/app/pages/politica-privacidad/ despliega textos legales actualizados que detallan minuciosamente el tratamiento de datos biométricos de imagen de perfil, direcciones postales normalizadas vía Mapbox y DNIs, impidiendo por validación reactiva del formulario avanzar en el Onboarding si no se aceptan las cláusulas en el cliente.


* Alineación Perimetral de Reglas: El comportamiento público del subproyecto se acopla directamente con las directrices de seguridad de firestore.rules y storage.rules del monorrepo. Estas reglas impiden de forma absoluta en el servidor que un usuario autoregistrado con estado PENDING_DATA o PENDING_APPROVAL pueda inyectar números de socio de forma fraudulenta, alterar campos financieros de cuotas, mutar su propio rol jerárquico a administrador o examinar el subdirectorio de tokens FCM de otros socios desde la consola de desarrollo web.



---