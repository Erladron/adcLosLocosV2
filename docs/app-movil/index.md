# 📱 Aplicación Móvil - Manual Técnico

## 🛠️ Arquitectura y Tecnologías
La aplicación móvil de **A.C.D. Los Locos** está desarrollada bajo la versión 2 de la plataforma del club[cite: 1], empleando un stack moderno y reactivo orientado a la persistencia en la nube y el rendimiento nativo en dispositivos móviles:
- **Framework Web:** Angular v20 (Arquitectura basada en componentes Standalone y Reactividad nativa).
- **Diseño de Interfaz:** Ionic Framework v8 (Componentes web móviles nativos avanzados).
- **Capa Nativa:** Capacitor (Compilación nativa cross-platform para iOS y Android).
- **Base de Datos y Sesiones:** Firebase SDK (Firestore Database, Firebase Auth y Firebase Cloud Messaging para notificaciones automáticas).

---

## 📂 Estructura de Páginas y Enrutado
El sistema implementa un enrutamiento modular a través de `src/app/app.routes.ts`. Se divide principalmente en flujos de Autenticación/Gestión y flujos Operativos del Socio:

---
src/app/features/
├── auth/
│   ├── pages/
│   │   ├── login/               # Autenticación de usuarios y roles
│   │   ├── complete-profile/    # Carga de datos de perfil post-registro
│   │   ├── invite/              # Generación de invitaciones para la feria
│   │   └── pending-approval/    # Pantalla de bloqueo reactivo para usuarios pendientes
├── events/
│   ├── pages/
│   │   ├── events/              # Tablero principal de eventos del club
│   │   ├── event-detail/        # Detalle del evento e inscripciones de aforo
│   │   ├── event-guests/        # Listado de invitados de un socio a un evento
│   │   ├── fair/                # Visualización del pase QR de Feria del socio
│   │   └── fair-scan/           # Consola física de escaneo para portería
├── home/
│   └── pages/home/              # Dashboard principal contextual
└── users/
├── pages/
│   ├── gest-user/           # Panel de administración e histórico
│   ├── mantenimiento-cuotas/ # Panel en lote de control de cuotas financieras
│   └── user-detail/         # Gestión atómica del perfil (Datos, Rol, Estado)

---

## 🔐 Guardianes de Acceso (`Guards`)
Para blindar la navegación web y nativa frente a accesos no autorizados o estados de perfil inconsistentes, se emplean dos guardianes clave en la raíz de rutas `src/app/features/auth/guards/`:

### 1. `auth.guard.ts`
Garantiza el estado activo de la sesión del usuario a nivel de Firebase Auth. Si no existe una sesión válida, redirige automáticamente al flujo `/login`. Adicionalmente, verifica reactivamente si el estado del usuario en Firestore es `PENDING_APPROVAL` para retenerlo en la página de espera bloqueante, o si está `DEACTIVATED` para denegar por completo el entorno interno.

### 2. `role.guard.ts`
Implementa control de acceso basado en roles (`RBAC`). Utiliza los metadatos integrados del token de autenticación (Custom Claims) o el documento del usuario en la colección `/users`.
- **Campos Evaluados:** `UserRole` (`ADMIN`, `SOCIO`, `PORTERO`).
- **Comportamiento:** Si un usuario intenta acceder a rutas administrativas (ej. `/mantenimiento-cuotas` o `/gest-user`) sin el rol `ADMIN`, el guardián aborta la navegación y lo redirige a la ruta base de socios `/home`.

---

## 🛠️ Componentes Operativos Clave y Flujos de UI

### 1. Panel de Control de Cuotas en Lote (`mantenimiento-cuotas.page.ts`)
Este componente permite a los administradores gestionar de forma masiva y atómica el estado financiero de las cuotas de los socios[cite: 1].
- **Lógica de UI Reactiva:** Se inicializa activando una fila de selección múltiple mediante un elemento `ion-checkbox`[cite: 1]. Las modificaciones se encolan localmente en memoria sin persistirse inmediatamente en caliente[cite: 1].
- **Acción del Lote:** Al detectar variaciones pendientes en el listado de socios, emerge de forma reactiva la barra flotante inferior `.floating-actions-bar` con el botón de guardado masivo "Actualizar cuota"[cite: 1].
- **Persistencia:** Al pulsar el accionamiento, se despacha un `writeBatch` atómico de Firestore hacia la ruta de red de la API REST / SDK de Firebase de la colección `/users`[cite: 1]. Tras finalizar con éxito, se destruye la barra del DOM y se renderiza un mensaje nativo mediante `ion-toast` rompiendo el Shadow DOM de Ionic[cite: 1].

### 2. Terminal de Validación en Portería (`fair-scan.page.ts`)
Diseñado de manera prioritaria para el rol de `PORTERO`, permite procesar los pases QR de los invitados de forma automatizada mediante cámara o a través de su consola de contingencia alternativa de entrada manual[cite: 1].
- **Consola de Entrada Manual:** Representada por la clase `.manual-entry-console`[cite: 1]. Cuenta con un campo de texto nativo validado en tiempo real que desbloquea reactivamente el botón `.btn-validate` al introducir caracteres alfanuméricos (DNI o código de pase)[cite: 1].
- **Lógica de Feedback Radical:** Ante pases inválidos, duplicados o no autorizados, la consola bloquea el flujo del terminal inyectando a pantalla completa el layout de alerta `.feedback-fullscreen` con la clase de peligro `.error-bg` (fondo rojo brillante)[cite: 1]. Esto provee una respuesta visual instantánea para el personal de seguridad de la entrada, mostrando el detalle específico de la denegación en la subcapa `.feedback-content`[cite: 1].

---

## ⚙️ Configuración y Compilación Nativa (`Capacitor`)
El nexo con las capacidades nativas del hardware del dispositivo móvil se centraliza en el archivo `capacitor.config.ts`.

### Ficheros de Configuración Críticos
- **`capacitor.config.ts`**: Fija el identificador único del paquete (`appId: 'com.adcloslocos.app'`), el nombre de la app nativa y el directorio de distribución web final (`webDir: 'www'`).
- **`ionic.config.json`**: Administra las integraciones globales del CLI de Ionic, declarando que es un proyecto de tipo `angular`.

### Comandos de Despliegue y Sincronización
Para trasladar los cambios realizados en Angular hacia los entornos nativos de desarrollo, se ejecutan las siguientes instrucciones en la raíz del monorrepo:

1. **Compilar los artefactos web optimizados en producción:**
   ng build --configuration=production

---

2. **Sincronizar el código fuente empaquetado y los plugins nativos hacia iOS / Android:**
npx cap sync

---


3. **Abrir el entorno nativo integrado (Xcode para iOS o Android Studio para Android):**
npx cap open android
npx cap open ios

---
