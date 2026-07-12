# ⚡ Cloud Functions - Backend Serverless

## 🛠️ Arquitectura del Servidor
El backend de **A.C.D. Los Locos** opera bajo una arquitectura serverless implementada en **Firebase Cloud Functions** (entorno Node.js con TypeScript, configurado en `functions/src/`). 
- **Acceso Administrativo:** Modifica directamente los datos de autenticación y registros de base de datos eludiendo las restricciones locales de cliente.
- **Activadores (Triggers):** Expone endpoints mediante llamadas directas HTTPS (`onCall`) y reacciona de forma automática a eventos internos de Firestore (`onDocumentCreated`, `onDocumentUpdated`).
- **Seguridad:** Todas las funciones de tipo administrativo (`onCall`) evalúan los metadatos de la sesión del solicitante (`context.auth`) antes de procesar cualquier cambio físico.

---

## 🔒 Catálogo de Funciones Administrativas (`HTTPS onCall`)

Alojadas bajo el directorio `src/functions/`, estas funciones permiten gestionar el ciclo de vida de los usuarios de forma segura:

### 1. `requestUserApproval` (`requestUserApproval.ts`)
Dispara la fase de post-registro web cuando un aspirante finaliza su alta de Onboarding.
- **Lógica:** Recibe los datos validados del usuario, establece de forma predeterminada su estado inicial como `UserStatus.PENDING_APPROVAL` e inyecta el documento dentro de la colección `/users` en Firestore.

### 2. `approveUser` (`approveUser.ts`)
Función crítica invocada únicamente por administradores para validar y admitir a un socio en el club.
- **Inputs:** `uid` (Identificador del usuario aspirante).
- **Lógica Interna:** 
  1. Comprueba que el usuario que ejecuta la función posea el rol de `ADMIN`.
  2. Modifica el campo `status` del socio a `UserStatus.APPROVED` en Firestore.
  3. Utiliza la API de Firebase Admin para estampar los **Custom Claims** criptográficos en el token de autenticación del usuario (`{ role: 'SOCIO' }`).
  4. Envía un correo electrónico automático de bienvenida utilizando la plantilla definitiva de confirmación.

### 3. `deactivateUser` (`deactivateUser.ts`)
Inhabilita temporal o permanentemente el acceso de un usuario a la plataforma.
- **Inputs:** `uid` (Identificador del usuario a bloquear).
- **Lógica Interna:** Actualiza el estado del documento en la colección a `UserStatus.DEACTIVATED` y revoca de inmediato la validez de los tokens de sesión de Firebase Auth en caliente, forzando al dispositivo del socio a cerrar la sesión y redirigir al Login.

### 4. `reactivateUser` (`reactivateUser.ts`)
Revierte el estado de bloqueo de un usuario previamente desactivado.
- **Inputs:** `uid` (Identificador del usuario).
- **Lógica Interna:** Devuelve el estado del usuario a `UserStatus.APPROVED`, permitiéndole recuperar el acceso completo a las funciones operativas del club.

### 5. `createUserByAdmin` (`createUserByAdmin.ts`)
Permite a un administrador dar de alta a un usuario (como un nuevo Portero o Administrador) de manera directa desde el panel de gestión.
- **Lógica:** Crea las credenciales en Firebase Auth, le asigna su contraseña temporal y genera el documento en Firestore con el rol y privilegios correspondientes.

### 6. `sendCustomPasswordReset` (`sendCustomPasswordReset.ts`)
Reemplaza el flujo nativo de recuperación de contraseñas de Firebase por un correo electrónico corporativo estilizado con la identidad de **A.C.D. Los Locos**.

---

## 🔔 Automatizaciones Basadas en Eventos (`Firestore Triggers`)

Funciones reactivas que se ejecutan en segundo plano al mutar documentos específicos en Firestore:

### 1. `onEventTriggerNotification` (`onEventTriggerNotification.ts`)
- **Gatillo:** Se ejecuta al crearse un nuevo documento bajo la colección `/events` (`onDocumentCreated`).
- **Comportamiento:** Realiza una lectura masiva de los tokens FCM registrados por todos los socios activos y despacha una notificación *Push* masiva notificando la apertura de inscripciones para el nuevo evento del club.

### 2. `onFairAccessCreatedNotification` (`onFairAccessCreatedNotification.ts`)
- **Gatillo:** Se activa cuando un socio crea un nuevo pase de invitado en la subcolección de accesos de la Feria.
- **Comportamiento:** Despacha una alerta *Push* de confirmación al dispositivo del socio y procesa de forma paralela la cola de correo para enviar al destinatario final el código QR con las instrucciones de acceso.

---

## 🛠️ Herramientas de Soporte y Pruebas (`Testing Helpers`)

Alojadas bajo `src/functions/testing-helpers.ts` y complementadas por archivos de datos en `src/constants/usuarios_test.json`:
- **Propósito:** Endpoints dedicados exclusivamente al entorno de integración y pruebas automatizadas (Cypress). Permiten purgar la base de datos de pruebas o sembrar datos iniciales controlados (como los usuarios maestros de administración, socios ficticios y porteros) para garantizar la consistencia y repetibilidad de los tests E2E.

---

## 📦 Gestión de Mensajes y Plantillas (`Templates & Helpers`)
- **`email-templates.ts`**: Repositorio de layouts HTML renderizados dinámicamente en el backend para notificaciones por email.
- **`fcm-templates.ts`**: Mapeo estandarizado de títulos, cuerpos e iconos para las alertas push móviles.
- **`notification-helper.ts`**: Clase de utilidad que abstrae la complejidad técnica de interactuar directamente con la API `messaging()` del SDK de Firebase Admin, gestionando el control de errores por tokens FCM expirados o inválidos.