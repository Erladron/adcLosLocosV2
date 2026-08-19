# 📝 Registro de Nuevo Usuario y Proceso de Alta en Dos Fases

Esta guía explica paso a paso cómo completar tu registro en la peña, desde que recibes el correo de invitación hasta que la Junta Directiva aprueba tu acceso definitivo.

---

### 👑 ¿Quién puede realizar este proceso?
* **Aspirantes e Invitados**: Personas cuyo correo electrónico ha sido autorizado previamente por un Socio, miembro de la Junta Directiva o Administrador desde la app.

---

### 📩 FASE 1: Web de Onboarding (Creación de Contraseña)

1. **Recepción del correo e invitación:** Abre el mensaje de invitación en tu email y haz clic en el enlace adjunto.
2. **Pantalla de Bienvenida (`welcome.page`):** El enlace te llevará a la web de onboarding del club[cite: 1]. Revisa la información inicial y pulsa el botón **"Completar Registro"**.
3. **Definición de Contraseña (`register.page`):** 
   * Introduce una **Contraseña personal** (mínimo 6 caracteres) y confírmala en el campo correspondiente.
   * Haz clic en **"Registrarse y Entrar"**.
4. **Pantalla de Éxito (`success.page`):** 
   * Tus credenciales de acceso quedarán creadas y tu cuenta pasará automáticamente al estado **Pendiente de Datos** (`pending_data`).
   * **Descarga la aplicación:** 
     * **Si usas Android:** Verás el botón para descargar directamente el instalador oficial (archivo `.apk`)[cite: 1].
     * **Si usas iPhone / iOS:** Se te indicará la ruta para acceder directamente a la aplicación Web (PWA).

---

### 📱 FASE 2: Aplicación Móvil (Datos Personales y Solicitud)

1. Abre la aplicación instalada en tu móvil o accede a través de la Web/PWA.
2. Inicia sesión introduciendo tu **Correo Electrónico** y la **Contraseña** que creaste en el paso anterior.
3. **Formulario de Datos OBLIGATORIOS (`complete-profile.page`):** Al detectar que tu cuenta está *Pendiente de Datos*, la aplicación te mostrará automáticamente un formulario para completar tu ficha civil:
   * **Nombre y Apellidos completos**.
   * **DNI / NIE**.
   * **Teléfono móvil de contacto**.
   * **Foto de carnet / perfil**.
4. Pulsa en **"Guardar y Enviar Solicitud"**.
   * **🔔 Notificación a la Junta Directiva:** En este momento, el sistema envía una **Notificación Push a la Junta Directiva** avisándoles de que hay una nueva solicitud pendiente de revisión.

---

### ⏳ FASE 3: Revisión y Aprobación por la Junta

* Tu solicitud se quedará en estado **Pendiente de Aprobación** (`pending_approval`) mientras la Junta la examina.
* **🔔 Notificación al Usuario (Resultado):**
  * **Si la Junta APRUEBA tu solicitud:** Recibirás una **Notificación Push en tu móvil** informándote de que tu alta ha sido aceptada (`active`). Al abrir la app verás tu **Ficha Identificativa** y podrás acceder a tus pases y eventos.
  * **Si la Junta RECHAZA tu solicitud:** Recibirás una **Notificación Push en tu móvil** indicándote que la solicitud ha sido denegada (`rejected`).