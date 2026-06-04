================================================================================
# ADC Los Locos V2 - Documentación Técnica y Funcional (Actualizada 2026)
================================================================================

--------------------------------------------------------------------------------
## Estado Actual del Proyecto
--------------------------------------------------------------------------------
La aplicación se encuentra en una fase avanzada de consolidación funcional, con un enfoque en la estabilidad y el rendimiento. Actualmente, dispone de un sistema de autenticación robusto, onboarding de invitados, gestión completa de usuarios con diferentes estados y roles, auditoría avanzada, control de permisos detallado, sistema de invitaciones y administración de estados de usuario. El punto actual es estable, con todas las funcionalidades principales operativas y probadas.

--------------------------------------------------------------------------------
## 1. Descripción Funcional
--------------------------------------------------------------------------------
ADC Los Locos V2 es una aplicación móvil y web desarrollada para la gestión integral de usuarios, socios, invitados y la administración interna de una asociación/peña.

Funcionalidades principales implementadas:
* Registro mediante invitación.
* Onboarding guiado para completar perfiles.
* Estados de usuario avanzados (pending_data, pending_approval, active, inactive, rejected).
* Directorio y Panel de Gestión de Usuarios Inteligente (Actualizado): Transforma su comportamiento dinámicamente según quién navegue la app.
* Control de acceso por roles y políticas de seguridad.
* Sistema de auditoría completo (quién invitó, fecha, quién aprobó, fecha, fecha y motivo de baja, reactivaciones).
* Gestión de fotografías y avatares con ngx-image-cropper.
* Protección de navegación mediante Angular Guards.
* Menú dinámico según el estado y los permisos del usuario.

--------------------------------------------------------------------------------
## 2. Flujo Funcional de Usuarios (Simplificado)
--------------------------------------------------------------------------------
1. Un socio/directiva/admin invita a un nuevo usuario.
2. El usuario recibe un enlace de registro.
3. El usuario se registra y nace con el estado "invitado".
4. El usuario completa el onboarding y sus datos personales. El estado cambia automáticamente a "pending_approval".
5. La directiva o administración aprueba el acceso. El usuario pasa al estado "active".
6. Con el estado "active", se habilita el menú completo y el acceso a todas las funcionalidades.

--------------------------------------------------------------------------------
## 3. Estados de Usuario
--------------------------------------------------------------------------------
* pending_data:    Usuario pendiente de completar perfil
* pending_approval: Pendiente de aprobación de directiva
* active:           Usuario activo con acceso
* inactive:         Usuario dado de baja
* rejected:         Usuario rechazado

--------------------------------------------------------------------------------
## 4. Arquitectura Técnica
--------------------------------------------------------------------------------
Frontend:
* Framework: Ionic (^8.0.0) y Angular (^20.0.0).
* Componentes: Standalone Components de Angular, SCSS personalizado.
* Estructura: Arquitectura modular por features. Utiliza ngx-image-cropper para la gestión de imágenes.
* Manejo de estado: RxJS (~7.8.0).

Backend:
* Plataforma: Firebase (Authentication, Cloud Firestore, Firebase Functions, Firebase Storage).
* Funciones: Firebase Functions (functions/package.json usa Node.js 24, firebase-admin: ^13.6.0, firebase-functions: ^7.0.0).
* Reglas de seguridad: firestore.rules y firestore.indexes.json para Cloud Firestore.

Integración Móvil (Capacitor):
* Capacitor: (@capacitor/core: 8.3.4, @capacitor/android: 8.3.3).
* Plugins: @capacitor/push-notifications (con presentationOptions: ["badge", "sound", "alert"]), @capacitor/app, @capacitor/camera, @capacitor/haptics, @capacitor/keyboard, @capacitor/status-bar.
* Configuración: capacitor.config.ts (appId: com.adcloslocos_desa.app, appName: Los Locos).

Despliegue:
* Firebase Hosting (dist/web-onboarding/browser).
* Scripts en package.json para deploy:desa, deploy:prod, deploy:web, build:android, deploy:all.

--------------------------------------------------------------------------------
## 5. Auditoría Implementada
--------------------------------------------------------------------------------
La aplicación dispone de auditoría avanzada para usuarios, visible solo para Administradores y Directiva. Registra:
* Quién invitó al usuario.
* Fecha de invitación.
* Quién aprobó el acceso.
* Fecha de aprobación.
* Fecha y motivo de baja.
* Reactivaciones.

--------------------------------------------------------------------------------
## 6. Estructura del Proyecto (Directorios Clave)
--------------------------------------------------------------------------------
* android/:   Proyecto nativo de Android (Gradle 8.13.0, Google Services 4.4.4).
* functions/: Firebase Functions (TypeScript, Node.js 24).
* projects/:  Espacio de trabajo de Angular para múltiples proyectos/librerías (shared-core, web-onboarding).
* src/:       Código fuente principal de la aplicación Ionic/Angular.
* www/:       Directorio de salida de la construcción web para Capacitor.

--------------------------------------------------------------------------------
## 7. Estado Actual del Desarrollo (Últimas Mejoras Incorporadas)
--------------------------------------------------------------------------------

A. Blindaje del Directorio y Control de Privacidad por Roles (Nuevo)
* Modo Vista Pública de Comunidad: Si un socio común consulta una ficha de perfil ajena, el controlador (user-detail.page.ts) intercepta la carga y activa una bandera de seguridad estricta.
* Destrucción del DOM de Campos Vacíos: Al consultar un perfil ajeno en modo público, las variables dni y direccion se vacían en memoria de forma inmediata. El formulario (personal-data-form.component.html) procesa los inputs con directivas condicionales *ngIf; al recibir estas cadenas vacías, elimina los campos por completo de la pantalla, evitando mostrar inputs vacíos o textos fijos inapropiados.
* Ocultación de Bloques Administrativos: Los componentes de Membresía (app-membership-form) y Auditoría (app-user-audit-form) se destruyen por completo en la interfaz pública de socios.
* Intimidad de Contacto: El teléfono y el email de un socio ajeno solo se exponen si el dueño activó expresamente sus respectivos selectores de visibilidad en sus opciones de perfil.
* Ocultación Absoluta del Admin: Para los socios comunes, las cuentas de los administradores quedan 100% invisibles en el listado, mutando el título de la pantalla de "Gestión de Usuarios" a "Directorio de Socios".

B. Optimización Gráfica, de Espacio y Contraste en Móviles (Nuevo)
* Layout Inline de Alta Densidad: Las tarjetas de la lista general muestran el rol (tipo-badge), la profesión y el teléfono en una sola línea horizontal elástica (flex-wrap: wrap; gap: 10px). Esto evita que las tarjetas se estiren verticalmente en los smartphones, garantizando un escaneo visual óptimo en pantallas pequeñas.
* Marcadores Iconográficos Dedicados: Se eliminaron los puntos de separación planos y se incorporaron iconos específicos Standalone (briefcase-outline, call-outline, eye-off-outline) para identificar inequívocamente cada dato de un vistazo.
* Subidón de Contraste en Tarjetas (Glass-Card): Para evitar que los textos se ahoguen contra el fondo azul marino de las tarjetas, la profesión se estiliza en azul celeste brillante (#64b5f6) con grosor tipográfico 600, y el número de teléfono en blanco translúcido de alta intensidad (rgba(255, 255, 255, 0.88)).
* Barra de Búsqueda de Alta Visibilidad: La barra de entrada de texto (custom-searchbar) se configuró mediante variables nativas de Ionic para forzar tanto el texto de guía (Placeholder) como el icono de la lupa y el botón de borrado en blanco puro (#ffffff).
* Control del Helper del DNI: El texto de aviso "La letra del DNI se calcula automáticamente" se condicionó estrictamente a que el usuario esté en modo edición activo (*ngIf="editing || !isEditMode"), limpiando el ruido visual en las consultas estáticas.
* Saneamiento Geográfico Postal: El campo de dirección se tipificó explícitamente como "Dirección Postal", desvinculando por completo su propósito del uso de correos electrónicos (que residen de forma aislada en la tarjeta de credenciales).

C. Gestión de Credenciales y Contraseñas Funcional (Nuevo)
* Flujo Informativo y Seguro: Los usuarios no modifican contraseñas escribiéndolas directamente en inputs locales de la app móvil.
* Acción Única Descentralizada: La tarjeta de credenciales expone el email del socio en modo lectura y un Botón Único de Restablecer Contraseña. Al pulsarse, se invoca la pasarela segura del servicio de autenticación y se dispara un correo automatizado al peñista con un enlace que lo redirige a la plataforma web de onboarding para completar el cambio con total seguridad.

--------------------------------------------------------------------------------
## 8. Próximos Pasos Recomendados
--------------------------------------------------------------------------------
1. Integración de Autocompletado Geográfico (Siguiente Paso Activo): Incorporar la API de autocompletado y validación predictiva de direcciones postales utilizando la infraestructura premium de Mapbox Search API (aprovechando la cuenta activa del proyecto y su capa gratuita de 100.000 peticiones mensuales).
2. Estabilización completa y Pruebas E2E: Continuar con la mejora de la estabilidad y la implementación de pruebas end-to-end para garantizar la calidad del software.
3. Implementación de Estadísticas Reales: Desarrollar módulos para mostrar métricas y datos relevantes de la asociación.
4. Módulo Completo de Eventos: Crear una sección dedicada a la gestión y visualización de eventos de la peña.
5. Notificaciones Push: Asegurarse de la correcta implementación y personalización de las notificaciones push para diferentes escenarios comunitarios.
6. Sistema de Logs Administrativos: Implementar un sistema robusto para registrar y monitorear acciones administrativas críticas.
7. Preparación PWA / Publicación: Preparar la aplicación para su despliegue como Progressive Web App y su posterior publicación en las tiendas oficiales.

--------------------------------------------------------------------------------
## 9. Recomendaciones Técnicas
--------------------------------------------------------------------------------
* Evitar añadir nuevas funcionalidades sin estabilizar completamente las existentes.
* Realizar snapshots o Git commits frecuentes para mantener un historial de cambios claro.
* Mantener una separación clara entre los servicios para mejorar la modularidad y el mantenimiento.
* Reducir progresivamente el tamaño de los servicios grandes refactorizándolos en fachadas (Facade Pattern).
* Evitar la lógica de sesión duplicada, centralizando su manejo en el AuthService.
* Centralizar enums y modelos para una mayor consistencia y facilidad de mantenimiento.

--------------------------------------------------------------------------------
## Conclusión
--------------------------------------------------------------------------------
ADC Los Locos V2 cuenta con una base sólida, moderna y profesional, completamente securizada y adaptada a la privacidad de datos móviles, lista para evolucionar hacia una aplicación completa y avanzada para la gestión de asociaciones, socios y eventos, tanto en plataformas móviles como web.
================================================================================