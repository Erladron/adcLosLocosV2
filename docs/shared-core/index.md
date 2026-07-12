# 📦 Shared Core - Librería Compartida del Monorrepo

## 🛠️ Propósito e Integración
La librería interna `@shared-core` (ubicada en `projects/shared-core/`) actúa como la **única fuente de verdad** (*Single Source of Truth*) para todo el monorrepo de **A.C.D. Los Locos**. Al centralizar las interfaces de datos, enumeraciones de estado, lógica de validación y utilidades comunes, se garantiza la paridad absoluta de tipos entre:
1. La aplicación móvil principal (Angular + Ionic).
2. El subproyecto web independiente (`web-onboarding`).
3. Los tipos de datos consumidos o validados indirectamente por las Cloud Functions.

Se exporta al resto del monorrepo a través del punto de entrada unificado `projects/shared-core/src/public-api.ts`.

---

## 📂 Modelos de Datos y Enumeraciones (`Models & Enums`)

### 1. Control de Roles y Estados (`src/lib/models/`)
Fijan los estados del ciclo de vida de los usuarios y delimitan los privilegios mediante Control de Acceso Basado en Roles (RBAC):

*   **`UserRole` (`user-role.enum.ts`):**
    ```typescript
    export enum UserRole {
      ADMIN = 'ADMIN',
      SOCIO = 'SOCIO',
      PORTERO = 'PORTERO'
    }
    ```
*   **`UserStatus` (`user-status.enum.ts`):**
    ```typescript
    export enum UserStatus {
      PENDING_APPROVAL = 'PENDING_APPROVAL',
      APPROVED = 'APPROVED',
      DEACTIVATED = 'DEACTIVATED'
    }
    ```

### 2. Estructuras de Entidades Obligatorias
*   **`UserDetail` (`user-detail.model.ts` / `users.models.ts`):** Define el tipado estricto del documento almacenado en la colección `/users` de Firestore:
    - `uid: string`: Identificador único global de Firebase Auth.
    - `email: string`: Correo electrónico del usuario.
    - `name: string` y `lastName: string`: Nombre y apellidos.
    - `dni: string`: Documento Nacional de Identidad validado.
    - `phone: string`: Teléfono de contacto.
    - `photoUrl: string`: Enlace de almacenamiento al avatar de perfil.
    - `dniFrontUrl: string` y `dniBackUrl: string`: Enlaces de verificación del documento físico.
    - `role: UserRole`: Rol asignado en el sistema.
    - `status: UserStatus`: Estado de activación.
    - `isCuotaPagada: boolean`: Bandera de control financiero.
    - `createdAt: Date | any`: Marca de tiempo de alta.
*   **`InvitedUser` (`invited-user.model.ts`):** Estructura que rige los pases de invitados generados por los socios para el acceso a la Feria del club.
*   **`UpdatePersonalDataRequest` (`update-personal-data-request.model.ts`):** Modelo de datos seguro que acota los únicos campos modificables por el propio socio desde su pantalla de perfil.
*   **`ClubEvent` (`events.models.ts`):** Estructura del documento de eventos, controlando aforos máximos, ubicaciones geográficas y listas de asistencia confirmada.

---

## 🔧 Servicios Compartidos de Infraestructura (`Services`)

### 1. `MapboxService` (`services/mapbox/mapbox.service.ts`)
Encapsula la lógica de geolocalización y renderizado cartográfico para el cálculo de coordenadas en eventos del club mediante la API de Mapbox.

### 2. Gestión de Sesión y Permisos
*   **`AuthService` y `AuthSessionService`:** Centralizan la comunicación directa con el SDK de Firebase Auth, exponiendo observables reactivos sobre el estado de la sesión (`User | null`).
*   **`AuthPermissionsService` y `AuthPoliciesService`:** Resuelven las reglas booleanas en local para determinar qué elementos de la UI (botones, menús, pestañas) deben ocultarse o mostrarse en función del `UserRole` activo.

### 3. Operaciones de Datos Atómicas
*   **`UserService` y `UserDetailDataService`:** Abstraen las consultas CRUD a la colección `/users` de Firestore.
*   **`UserDetailFormService` y `UserDetailFacadeService`:** Implementan el patrón *Facade* para desacoplar las páginas de la UI Angular de la lógica directa de formularios reactivos y control de estado (`user-detail.state.ts`).
*   **`UserFeesService`:** Modula la lógica de edición en lote para actualizar el estado `isCuotaPagada` de múltiples documentos simultáneamente.
*   **`InvitedUserService` & `FairService`:** Servicios encargados de la expedición, anulación y escaneo de pases QR de invitados a la Feria.

### 4. Utilidades de UI y Soporte
*   **`FcmService`:** Gestiona la suscripción a tokens de notificaciones *Push* en dispositivos móviles a través de Firebase Cloud Messaging.
*   **`PhotoService` & `UserPhotoService`:** Controlan la captura de imágenes mediante la API de la cámara del dispositivo móvil y gestionan los flujos de subida hacia las carpetas de Firebase Storage.
*   **`ErrorHandlerService`:** Centraliza las excepciones de red mapeando errores mediante `firebase-error-map.ts` y traduciendo los códigos nativos a mensajes entendibles declarados en `app-messages.ts` y `app-message-code.enum.ts`.
*   **`LoadingService` & `DialogService`:** Proveedores globales de alertas de confirmación intermitentes y pantallas de carga bloqueantes.

---

## 🧩 Componentes Reutilizables Standalone (`Components`)

Alojados bajo `src/lib/components/`, están listos para ser importados en cualquier vista del monorrepo:
*   **`PageHeaderComponent`:** Normaliza la barra superior de navegación, inyectando de forma dinámica los títulos y botones de acción contextuales de Ionic/Angular.
*   **`EmptyStateComponent`:** Vista estandarizada con soporte multimedia e iconos para notificar la ausencia de datos en listados (ej. cuando no hay eventos vigentes o no existen pases creados).

---

## 📄 Plantillas Globales (`Templates`)
*   **`EmailTemplates` (`templates/email-templates.ts`):** Repositorio de layouts HTML predefinidos y reutilizables para el envío de correos automatizados desde el sistema (notificaciones de alta, recordatorios de cuotas impagadas y pases expedidos).