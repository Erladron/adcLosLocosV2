# 📱 Aplicación Móvil - Manual Técnico

## 🛠️ Arquitectura y Tecnologías

La aplicación móvil de la A.C.D. Los Locos está desarrollada bajo la versión 2 del ecosistema de la peña, empleando un stack híbrido avanzado orientado a la modularidad, reactividad asíncrona viva y rendimiento nativo en hardware móvil:

* Framework Web: Angular v20, adoptando una arquitectura basada estrictamente en componentes Standalone y reactividad nativa.


* Diseño de Interfaz: Ionic Framework v8, explotando componentes web optimizados para interfaces móviles de alta densidad.


* Capa Nativa: Capacitor, actuando como el puente de abstracción cross-platform para el empaquetado y acceso a APIs de iOS y Android.


* Base de Datos y Sesiones: SDK Modular de Firebase, integrando Cloud Firestore para sincronización offline/online, Firebase Auth para pasarelas de inicio de sesión y Firebase Cloud Messaging (FCM) para la distribución de alertas push.



---

## 📂 Estructura de Páginas y Enrutado

El sistema implementa una arquitectura de enrutamiento modular desacoplada a través del archivo maestro src/app/app.routes.ts. Las vistas se encuentran agrupadas por dominios lógicos y características funcionales de la siguiente manera:

src/app/features/

* auth/pages/login/: Pantalla controladora para la autenticación de credenciales primarias de acceso.


* auth/pages/complete-profile/: Formulario civil de onboarding obligatorio para los nuevos miembros.


* auth/pages/invite/: Vista administrativa para la expedición de correos electrónicos de invitación a nuevos aspirantes.


* auth/pages/pending-approval/: Pantalla de retención y bloqueo para cuentas a la espera de validación por la directiva.


* events/pages/events/: Listado general de convocatorias publicadas por la peña.


* events/pages/event-detail/: Ficha de detalle, control de aforo reactivo e inscripción a asambleas.


* events/pages/event-guests/: Módulo operativo de gestión de pases y acompañantes para socios solventes.


* events/pages/event-passes/: Tablero principal de visualización de abonos y pases válidos para hoy de la peña.


* events/pages/event-scan/: Terminal operativo de validación física de códigos QR para el personal en puerta.


* home/pages/home/: Dashboard unificado con accesos directos contextuales según el rol.


* users/pages/gest-user/: Catálogo administrativo para la auditoría de perfiles y censo general.


* users/pages/mantenimiento-cuotas/: Panel de tesorería para la visualización y edición de estados financieros por lote.


* users/pages/user-detail/: Ficha atómica y encapsulada del usuario dividida en pestañas de auditoría.



---

## 🔐 Guardianes de Acceso (Guards)

Para blindar el perímetro de navegación y las vistas internas ante solicitudes ilegítimas o estados inconsistentes, se emplean guardianes reactivos bajo la ruta src/app/features/auth/guards/:

### 1. auth.guard.ts

Garantiza que exista una sesión activa en Firebase Auth. Adicionalmente, se conecta en vivo a Firestore para evaluar el ciclo de vida real del perfil: retiene obligatoriamente a los usuarios en /pending-approval si su estado es PENDING_APPROVAL, y bloquea el acceso redirigiendo al Login si la cuenta pasa a estar INACTIVE, cerrando de forma proactiva las escuchas de datos abiertas.

### 2. role.guard.ts

Implementa el Control de Acceso Basado en Roles (RBAC). Utiliza el documento hidratado del usuario para verificar las jerarquías de UserRole y restringir de forma estricta las rutas de administración general (/gest-user) o tesorería (/mantenimiento-cuotas) exclusivamente a los perfiles ADMINISTRADOR o DIRECTIVA, abortando y redirigiendo a la Home ante intentos de intrusión.

---

## 🛠️ Componentes Operativos Clave y Flujos de UI

### 1. Panel de Control de Cuotas en Lote (MantenimientoCuotasPage)

Componente de alta densidad diseñado para simplificar las tareas de tesorería del club sin sobrecargar la red.

* Lógica de UI Reactiva: Se inicializa permitiendo activar la selección múltiple por lote a través de un ion-checkbox. Al alterar los toggles individuales de los socios, los cambios no se envían directamente a Firestore; se encolan en caliente en el objeto de memoria local sociosModificadosTemporalmente, alterando dinámicamente el borde de las tarjetas afectadas a color azul para indicar edición.


* Acción del Lote: Cuando el componente detecta que existen movimientos pendientes en la caché local, emerge reactivamente desde la base de la pantalla la barra flotante de diseño translúcido .floating-actions-bar mostrando el botón "Actualizar cuota".


* Persistencia: Al pulsar el botón, el componente invoca el método procesarActualizacionMasiva(), ejecutando ráfagas asíncronas controladas mediante el satélite UserFeesService. Una vez consolidada la escritura de los documentos modificados, se limpia la memoria temporal, se destruye la barra flotante y se rompe el Shadow DOM de Ionic para inyectar un ion-toast con confirmación de éxito.



### 2. Terminal de Validación en Portería (PasseScanPage)

Controlador de hardware prioritario para el personal en puerta, encargado de escanear y quemar las credenciales QR de los socios e invitados mediante la cámara nativa con Capacitor o su consola de contingencia manual.

* Consola de Entrada Manual: Representada por la directiva .manual-entry-console. Integra una caja de texto reactiva vinculada mediante ngModel que mantiene bloqueado el botón de validación hasta introducir un código alfanumérico legible, proporcionando una alternativa fluida ante fallas en los sensores ópticos del dispositivo.


* Lógica de Feedback Radical: Para optimizar la toma de decisiones del portero en entornos ruidosos, el método procesarAcceso() implementa respuestas extremas que alteran por completo la pantalla mediante la bandera scanStatus. Ante un pase caducado, inexistente o que ya cruzó la puerta, el terminal oculta la interfaz ordinaria y despliega a pantalla completa un layout masivo con fondo rojo (.error-bg) y un icono gigante de alerta de acceso denegado en .feedback-content. Este bloqueo visual se sincroniza por hardware disparando los motores de haptic vibration del terminal mediante Capacitor Haptics (NotificationType.Error), volviendo al estado de espera tras un retardo controlado de 2.5 segundos.



---

## ⚙️ Configuración y Compilación Nativa (Capacitor)

El nexo con las capacidades y empaquetados para tiendas móviles se centraliza en la raíz del monorrepo a través de archivos JSON de configuración estructurados.

### Ficheros de Configuración Críticos

* capacitor.config.ts: Fija de forma inmutable el identificador de paquete oficial de la peña (appId: 'com.adcloslocos.app'), el nombre descriptivo de la app nativa y el directorio de salida web de compilación (webDir: 'www').


* ionic.config.json: Administra las tareas de integración global del CLI de Ionic, declarando el tipo de proyecto como angular-standalone.



### Comandos de Despliegue y Sincronización

Para trasladar de manera correcta las mutaciones aplicadas sobre los componentes web en Angular hacia los contenedores de desarrollo de Apple Xcode o Android Studio, se ejecutan las siguientes instrucciones secuenciales desde la consola del proyecto:

1. Compilar los artefactos web optimizados aplicando árboles de sacudida y compresión en producción:
ng build --configuration=production


2. Sincronizar el directorio compilado, variables de entorno y plugins nativos del hardware móvil hacia los SDKs de iOS y Android:
npx cap sync


3. Inicializar las herramientas de compilación nativa de la plataforma correspondiente para la firma del binario o pruebas en emulador físico:
npx cap open android
npx cap open ios



---