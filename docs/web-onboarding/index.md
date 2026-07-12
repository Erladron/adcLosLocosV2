# 🌐 Web Onboarding - Subproyecto de Registro

## 🛠️ Arquitectura y Propósito
El subproyecto `web-onboarding` es una aplicación web independiente integrada en el monorrepo, desarrollada en **Angular v20** con componentes **Standalone**. Su único propósito operativo es servir como la pasarela pública de captación y registro para los nuevos aspirantes a socios del club **A.C.D. Los Locos**, aislando este flujo público del núcleo de la aplicación nativa móvil.

---

## 📂 Estructura de Páginas y Enrutado
El enrutamiento público se gestiona en `projects/web-onboarding/src/app/app.routes.ts` y define las siguientes estaciones del flujo de admisión:

---

projects/web-onboarding/src/app/pages/
├── welcome/               # Landing de bienvenida e inicio del onboarding
├── register/              # Formulario maestro de captura de datos y documentos
├── success/               # Confirmación visual de solicitud completada con éxito
├── reset-password/        # Gestión alternativa de recuperación de credenciales
└── politica-privacidad/   # Textos legales y de obligado consentimiento RGPD

---

## 🔧 Servicios Núcleo (`Core Services`)
Alojados en `src/app/core/services/`, proveen la lógica de negocio y seguridad en el lado del cliente web:

### 1. `TokenService` (`token.service.ts`)
Encargado de interceptar, almacenar y validar los tokens criptográficos de sesión efímera durante el registro.
- **Método `setToken(token: string)`**: Almacena de forma segura el JSON Web Token en el almacenamiento del navegador.
- **Método `getToken()`**: Recupera la credencial activa para adjuntarla en las cabeceras HTTP mediante interceptores si es requerido por servicios externos.

---

## 📝 Flujo Técnico del Formulario Maestro (`register.page.ts`)
La página de registro centraliza la lógica compleja de validación, carga de archivos multimedia y persistencia en Firebase:

### Lógica de Formulario Reactivo (`FormGroup`)
Utiliza `ReactiveFormsModule` importando elementos compartidos desde la librería núcleo (`shared-core`) para estructurar los siguientes campos obligatorios:
- **Datos Personales:** Nombre completo, Apellidos, DNI/NIE (validado con regex de patrón oficial) y Teléfono de contacto.
- **Credenciales:** Correo electrónico corporativo o personal y Contraseña robusta.
- **Documentación Legal:** Toggles obligatorios de aceptación de la política de privacidad y tratamiento de datos.

### Gestión de Almacenamiento y Archivos (`Storage`)
El formulario exige la carga obligatoria del DNI escaneado por ambas caras y una fotografía de perfil nítida para la posterior expedición del carnet digital.
1. El usuario selecciona el archivo mediante un input file integrado.
2. El componente captura el evento y utiliza `PhotoService` / `PhotoHelper` para validar el tamaño máximo y el tipo MIME (permitiendo únicamente formatos `.jpg`, `.jpeg` y `.webp`).
3. Al enviar el formulario, el sistema inicializa una tarea de carga (`UploadTask`) en **Firebase Storage**, apuntando a rutas dinámicas segregadas por UID de usuario:
   - Ficheros de identidad: `users/{uid}/documents/dni_identity.jpg`
   - Fotografía de perfil: `users/{uid}/profile/avatar.jpg`

### Persistencia y Cambio de Estado
Tras concluir la subida de ficheros a Storage, la aplicación realiza las siguientes invocaciones atómicas:
1. Crea el registro de autenticación en **Firebase Auth** en estado inactivo.
2. Inserta el documento del aspirante en la colección `/users` de **Cloud Firestore**, fijando estrictamente los metadatos iniciales del ciclo de vida:
   - `status`: `UserStatus.PENDING_APPROVAL` (Bloqueo reactivo inmediato en la aplicación móvil).
   - `role`: `UserRole.SOCIO` (Rol básico predeterminado).
   - `createdAt`: Marca de tiempo del servidor de Firebase.
3. Si el proceso de escritura finaliza sin errores, el enrutador redirige por código hacia `/success`.

---

## 🔒 Cumplimiento Normativo (RGPD) y Seguridad
- **Consentimiento Explícito:** La interfaz web impide la pulsación del botón de envío si los campos booleanos de aceptación legal vinculados a `politica-privacidad.page.ts` no están marcados con valor `true`.
- **Reglas de FireStore & Storage:** El subproyecto se alinea directamente con los archivos raíz `firestore.rules` y `storage.rules`, los cuales restringen los privilegios de escritura en este estado, impidiendo que un usuario con estado `PENDING_APPROVAL` pueda alterar datos de cuotas o cambiar su propio rol de forma fraudulenta desde la consola de desarrollo web.

```