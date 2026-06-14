==========================================================================
CONTEXTO TECNICO Y FUNCIONAL GLOBAL: APP ADC LOS LOCOS V2 (ACTUALIZADO 2026)
==========================================================================

Este documento sirve como transferencia de contexto absoluto (Bootstrap) para cualquier Agente de IA. Describe el estado actual del desarrollo, las caracteristicas ya implementadas, la arquitectura del sistema, hitos recientes del backend, analisis de riesgos y los siguientes pasos pendientes.

---

1. ARQUITECTURA GENERAL DEL SOFTWARE

El proyecto es una aplicacion movil y web hibrida desarrollada con Ionic (Standalone Components) y Angular. Sigue una estrategia de desarrollo modular y reutilizacion de codigo mediante una libreria local dedicada.

* Aplicacion Principal (App): Gestiona las vistas finales, paginas especificas de cada funcionalidad (Features) y los flujos de navegacion (Routes).
* Nucleo Compartido (shared-core): Una libreria publica ubicada en 'projects/shared-core/'. Centraliza la logica de negocio, modelos de datos, utilidades y servicios de infraestructura. Toda la comunicacion con Firebase se realiza a traves de esta capa.
* Estructura Visual de Componentes: Los elementos estructurales nativos e interactivos usan layouts basados en Glassmorphism sobre botones y tarjetas, integrados con clases dinamicas e inyecciones de estado reactivo.

---

2. FUNCIONALIDADES YA IMPLEMENTADAS (HISTORIAL DEL PROYECTO)

A. Ecosistema de Autenticacion y Registro (Auth Feature)
* Control de Acceso: Modulo blindado mediante Guards (auth.guard.ts y role.guard.ts) que interceptan las rutas segun el estado de la sesion y los privilegios del usuario.
* Flujo de Acceso Basico: Pagina de Login integrada con Firebase Authentication y pasarela de Google Auth.
* Sistema de Invitaciones: Flujo de alta controlado (invite.page) para pre-registrar o invitar a futuros miembros.
* Onboarding y Aprobacion: Pagina de perfil completo (complete-profile.page) para el alta inicial y pantalla de espera activa (pending-approval.page) para usuarios cuyos perfiles requieren validacion manual por parte de la junta directiva.

B. Gestion Completa de Socios (Users Feature)
* Administanion Interna: Vista de gestion general (gest-user.page) y ficha individualizada de datos del socio (user-detail.page).
* Formularios Modulares Especializados (User Detail Components):
  - credentials-form: Gestion de emails, contrasenas y datos de acceso.
  - membership-form: Control del estado del socio (Alta, Baja, Suspendido) y asignacion de roles (Socio, Administrador, Directiva). El campo de perfil del documento mapea el rol real bajo la propiedad estricta 'tipo' en Firestore.
  - personal-data-form: Formulario avanzado para la informacion civil del usuario. Incluye:
    * Capitalizacion de nombres automaticos mediante utilidades core (string.utils.ts).
    * Validacion estricta de DNI en caliente (calculo sincrono del digito verificador de la letra y badge visual en pantalla).
    * Tratamiento de imagen de perfil: Integracion de plugin de recorte (ngx-image-cropper) con optimizacion de escala por Canvas en hardware para almacenar la foto optimizada.
  - user-audit-form: Vista de logs e historial de modificaciones del usuario para control de auditoria.

C. Modulo de Infraestructura y Servicios del Core (shared-core)
* Persistencia: Capa de servicios (user.service.ts, events.service.ts) totalmente desacoplada para interactuar con Cloud Firestore y Firebase Storage.
* Notificaciones Push: Servicio centralizado (fcm.service.ts) listo para capturar tokens de dispositivo y gestionar alertas push nativas remotas.
* UI Helpers: Fachadas unificadas para lanzar ventanas emergentes (dialog.service.ts), pantallas de carga sincronizadas (loading.service.ts) y alertas corporativas optimizadas (notification.service.ts).
* Geocodificacion Predictiva: Integracion con la API de Mapbox (mapbox.service.ts) para autocompletar direcciones postales reales en base a un flujo reactivo controlado por RxJS.

---

3. REFACTORIZACION HISTORICA: SEGURIDAD, BACKEND BLINDADO Y UI (CAMBIOS AYER)

Durante la ultima sesion tecnica, se aplico una auditoria critica de seguridad y rediseno de interfaz que transformo la interaccion Cliente-Servidor y elimino por completo vulnerabilidades de riesgo alto y medio.

A. Purga del Trigger del Cliente y Optimizacion del Core (`events.service.ts`)
* Blindaje de Escritura: Se elimino por completo el payload interceptable `_notificationTrigger` de los metodos de creacion, edicion y eliminacion de la app movil. Ahora la app solo envia datos civiles limpios.
* Reduccion de Costes de Red (Cuota Firebase): En `createEvent`, se sustituyo el encadenamiento ineficiente de `addDoc` + `updateDoc` (2 escrituras) por una generacion sincrona de ID en local seguida de un unico impacto `setDoc` (1 escritura), reduciendo el consumo de la API al 50%.
* Destruccion Fisica Directa: El metodo `deleteEvent` paso de parchear el documento a ejecutar un `deleteDoc` nativo directo.

B. Nuevo Motor Analitico en la Nube (`index.ts` y `fcm-templates.ts` de Cloud Functions v2)
* Aislamiento del Servidor (Riesgo Alto Mitigado): La Cloud Function v2 (`onEventTriggerNotification`) ahora evalua de forma 100% aislada los estados `event.data.before` y `event.data.after`. Deduce de forma automatica si es un ALTA, EDICION o CANCELACION, impidiendo hackeos de pushes masivos desde la consola web del cliente.
* Filtro Quirurgico de Ruido de Red: Se implemento un algoritmo comparador que detecta si el unico campo modificado en un evento es `attendeeCount`. De ser asi (un socio haciendo clic en "Asistire"), la funcion aborta su ejecucion en un microsegundo, ahorrando costes de computacion y evitando saturar a la pena con falsos pushes masivos de edicion.
* Autolimpieza de Datos Huerfanos (Riesgo Medio Mitigado): Al procesarse una eliminacion (`ELIMINACION_EVENTO`), la funcion ejecuta un borrado atomico en bloque (*Batch*) de todas las confirmaciones almacenadas en la subcoleccion huerfana `/attendance`, manteniendo Firestore reluciente y libre de datos fantasmas.

C. Menu Lateral Reactivo, Inteligente y Ajuste de Zona Segura Movil (`app.component.*`)
* Control de Visibilidad por Calendario: Se inyecto `EventsService` en el archivo raiz. El menu lateral escucha en tiempo real la coleccion de convocatorias; si no existe ningun evento activo de tipo `'feria'`, los accesos de **"Pases de Feria"** y **"Porteria Caseta"** se ocultan por completo de la interfaz de forma reactiva[cite: 2].
* Apertura de Perimetro para el Rol Invitado (Hotfix UX): Se detecto que un usuario de tipo `'invitado'`, tras salir de la pantalla por redireccion push, perdia el acceso a su pase al no renderizarse la opcion en el menu principal. Se modifico la matriz de rutas reactivas en `app.component.ts` para garantizar que la seccion de consulta de pases sea visible permanentemente para cualquier usuario autenticado (incluyendo el rol restringido `Invitado`), permitiendo la reconsulta del QR de entrada en porteria sin depender exclusivamente del push.
* Semantica por Bloques y Lineas Divisorias: Se reorganizo el archivo HTML en tres bloques diferenciados (Navegacion General -> Ecosistema de Feria -> Cierre de Sesion), separados por lineas divisoria premium con degradados CSS traslucidos en SCSS que se apagan solas si no hay feria activa[cite: 2].
* Correccion del Reloj de la Barra de Estado: Se rediseno el encabezado a formato horizontal flexible (`.menu-header-flex`) reduciendo el escudo a un tamano compacto de `44px` atado por reglas estricta `!important`[cite: 2]. Se inyecto la propiedad nativa `env(safe-area-inset-top)` para empujar la cabecera hacia abajo, evitando que tape el reloj y la bateria en terminales iOS y Android[cite: 2].
* Sistema Anti-solapamiento del Footer: Se extrajo el pie de pagina (`.menu-footer-clean`) fuera del componente de scroll `<ion-content>` y se anclo fijamente al final de la etiqueta `ion-menu` usando layouts limpios compatibles con el enrutador de Ionic[cite: 2]. Se inyecto `env(safe-area-inset-bottom)` para esquivar las barras de gestos fisicas del hardware del movil[cite: 2].

D. Automatizacion del Flujo de Pases para Invitados
* Captura Automatica de Invitaciones: Se creo una nueva Cloud Function v2 (`onFairAccessCreatedNotification`) encargada de escuchar la coleccion `fair-access/{accessId}`[cite: 2]. En cuanto un socio genera un pase, el servidor extrae sincronamente los tokens del invitado asignado y despacha un push personalizado[cite: 2].
* Correccion Critica de Identidad del Anfitrion: Se soluciono un bug en el mapeo de datos donde los pases de feria impresos o visualizados mostraban por defecto el string generico `"Administrador del sistema"`. Se inyecto el estado reactivo de `AuthService` en el formulario emisor (`invite.page.ts`) para capturar explicitamente el `uid` y el nombre civil completo del Socio o Directiva anfitrion, guardandolo de forma limpia y directa en el payload de Firestore.
* Plantilla Estetica de Entrada (`fcm-templates.ts`): Se diseno el metodo `getNuevoPaseFeriaTemplate` inyectando la etiqueta oculta en los metadatos de red: `tipoNotificacion: 'NUEVO_PASE_FERIA'`[cite: 2].
* Redireccion Guiada Nvativa (`fcm.service.ts`): Se actualizo el interceptor de acciones de Capacitor en la aplicacion movil para capturar el codigo del pase de feria[cite: 2]. Al hacer clic sobre la notificacion push con el movil bloqueado, el telefono abre la app y viaja directamente a la ruta protegida `/fair`, mostrando el QR del pase al invitado al instante[cite: 2].

---

4. REGLAS DE SEGURIDAD EN CLOUD FIRESTORE (firestore.rules)

* Actualizacion Atomica y Quirurgica de Eventos: Utilizando la funcion analitica request.resource.data.diff(resource.data).affectedKeys().hasOnly(['attendeeCount']), se concede permiso de actualizacion a los usuarios comunes unicamente si el unico campo alterado es el contador de asistentes.
* Subcoleccion de Asistencia: Se securizo el subpath /attendance/{userId} garantizando allow read: if isLogged() y limitando la escritura exclusivamente al propio dueno del identificador o a la junta directiva (allow write: if isOwnUser(userId) || canManageUsers()).

---

5. BUENAS PRACTICAS SUGERIDAS PARA EL DESARROLLO DEL PROYECTO

1. Gestion de Entornos Seguros (Mapbox Token): Configurar restricciones perimetrales estrictas de dominio de URL (adcloslocos-desa.web.app) y el bundle ID nativo de Android en el panel de Mapbox.
2. Uso de Pipes en lugar de Metodos en el HTML: Reemplazar los metodos evaluadores en bucles directos del HTML por Pipes puros para no sobrecargar los micro-ciclos de deteccion de cambios de Angular.
3. Control Centralizado de Roles en la Nube: Validar tokens de seguridad JWT utilizando reclamaciones personalizadas (Custom Claims).

---

6. SIGUIENTES PASOS Y FUNCIONALIDADES PENDIENTES (BACKLOG DE LA PENA)

1. Migracion Completa de Funciones v1 a v2: Unificar las funciones HTTP clasicas (createUserByAdmin, deactivateUser...) a la v2 para optimizar los arranques en frio (Cold Start) mediante Cloud Run.
2. Sistema de Carnet de Socio General: Planificacion a futuro de una tarjeta de identidad virtual corporativa para el uso diario de los miembros, completamente independiente del flujo temporal de pases de la caseta de feria.
3. Pruebas de Estres de Notificaciones Push: Testeo de envio masivo en caliente de los pases en un entorno de pre-produccion con multiples dispositivos emulados.

---


7. ESTRUCTURA DE CARPETAS COMPLETA DEL REPOSITORIO (ADCLOSLOCOSV2)

C:\USERS\JUANJESUS\ADCLOSLOCOSV2
+---src                                   
|   |   global.scss                       
|   |   index.html                        
|   |   main.ts                           
|   |   manifest.webmanifest              
|   |   polyfills.ts                      
|   |   test.ts                           
|   |   zone-flags.ts                     
|   |   
|   +---app                               
|   |   |   app.component.html            
|   |   |   app.component.scss            
|   |   |   app.component.ts              
|   |   |   app.routes.ts                 
|   |   |   
|   |   +---features                      
|   |   |   +---auth                      
|   |   |   |   +---guards                
|   |   |   |   |       auth.guard.ts      
|   |   |   |   |       role.guard.ts     
|   |   |   |   +---pages                 
|   |   |   |   |   +---complete-profile  
|   |   |   |   |   |       complete-profile.page.html
|   |   |   |   |   |       complete-profile.page.scss
|   |   |   |   |   |       complete-profile.page.ts
|   |   |   |   |   +---invite            
|   |   |   |   |   |       invite.page.html
|   |   |   |   |   |       invite.page.scss
|   |   |   |   |   |       invite.page.ts
|   |   |   |   |   +---login             
|   |   |   |   |   |       login.page.html
|   |   |   |   |   |       login.page.scss
|   |   |   |   |   |       login.page.ts 
|   |   |   |   |   +---pending-approval  
|   |   |   |   |           pending-approval.page.html
|   |   |   |   |           pending-approval.page.scss
|   |   |   |   |           pending-approval.page.ts
|   |   |   +---events                    
|   |   |   |   +---pages                 
|   |   |   |   |   +---event-detail      
|   |   |   |   |   |       event-detail.page.html
|   |   |   |   |   |       event-detail.page.scss
|   |   |   |   |   |       event-detail.page.ts
|   |   |   |   |   +---events            
|   |   |   |   |           events.page.html
|   |   |   |   |           events.page.scss
|   |   |   |   |           events.page.ts
|   |   |   +---home                      
|   |   |   |   +---pages                 
|   |   |   |   |   +---home              
|   |   |   |   |           home.page.html
|   |   |   |   |           home.page.scss
|   |   |   |   |           home.page.ts  
|   |   |   +---stats                     
|   |   |   |   +---pages                 
|   |   |   |   |   +---stats             
|   |   |   |   |           stats.page.html
|   |   |   |   |           stats.page.scss
|   |   |   |   |           stats.page.ts 
|   |   |   +---users                     
|   |   |   |   +---components            
|   |   |   |   +---facades               
|   |   |   |   +---models                
|   |   |   |   +---pages                 
|   |   |   |   |   +---gest-user         
|   |   |   |   |   |       gest-user.page.html
|   |   |   |   |   |       gest-user.page.scss
|   |   |   |   |   |       gest-user.page.ts
|   |   |   |   |   +---user-detail       
|   |   |   |   |   |   |   user-detail.page.html
|   |   |   |   |   |   |   user-detail.page.scss
|   |   |   |   |   |   |   user-detail.page.ts
|   |   |   |   |   |   +---components    
|   |   |   |   |   |   |   +---credentials-form
|   |   |   |   |   |   |   |       credentials-form.component.html
|   |   |   |   |   |   |   |       credentials-form.component.scss
|   |   |   |   |   |   |   |       credentials-form.component.ts
|   |   |   |   |   |   |   +---membership-form
|   |   |   |   |   |   |   |       membership-form.component.html
|   |   |   |   |   |   |   |       membership-form.component.scss
|   |   |   |   |   |   |   |       membership-form.component.ts
|   |   |   |   |   |   |   +---personal-data-form
|   |   |   |   |   |   |   |       personal-data-form.component.html
|   |   |   |   |   |   |   |       personal-data-form.component.scss
|   |   |   |   |   |   |   |       personal-data-form.component.ts
|   |   |   |   |   |   |   +---user-audit-form
|   |   |   |   |   |   |           user-audit-form.component.html
|   |   |   |   |   |   |           user-audit-form.component.scss
|   |   |   |   |   |   |           user-audit-form.component.ts
|   |   |   |   |   |   +---constants     
|   |   |   |   |   |   |       user-detail.constants.ts
|   |   |   |   |   |   +---helpers       
|   |   |   |   |   |   |       user-detail.helpers.ts
|   |   |   |   |   |   +---state         
|   |   |   |   |   |           user-detail.state.ts
|   +---assets                            
|   |   |   shapes.svg                    
|   |   +---icon                          
|   |   |       favicon.ico               
|   |   +---icons                         
|   |   |       favicon.ico               
|   |   |       icon-128.webp
|   |   |       icon-192.webp
|   |   |       icon-256.webp
|   |   |       icon-48.webp
|   |   |       icon-512.webp
|   |   |       icon-72.webp
|   |   |       icon-96.webp
|   |   +---img                           
|   |           escudo.png                
|   |           events-construction.png   
|   |           stats-construction.png    
|   +---environments                      
|   |       environment.prod.ts            
|   |       environment.ts                
|   +---theme                             
|           variables.scss                
|        
+---projects                              
    +---shared-core                       
        +---src                           
            |   public-api.ts             
            |   
            +---lib                      
                |   env.token.ts          
                |   
                +---components            
                |   +---empty-state       
                |   |       empty-state.component.html
                |   |       empty-state.component.scss
                |   |       empty-state.component.ts
                |   +---page-header       
                |           page-header.component.html
                |           page-header.component.scss
                |           page-header.component.ts
                |           
                +---constants             
                |       app-message-code.enum.ts
                |       app-messages.ts   
                |       firebase-error-map.ts
                |       
                +---models                
                |       events.models.ts  
                |       invited-user.model.ts
                |       update-personal-data-request.model.ts
                |       user-detail.model.ts
                |       user-role.enum.ts 
                |       user-status.enum.ts
                |       users.models.ts   
                |       
                +---templates             
                |       email-templates.ts
                |       
                +---utils                 
                |       string.utils.ts   
                |       
                +---services              
                    |   auth-admin.service.ts
                    |   auth-credentials.service.ts
                    |   auth-permissions.service.ts
                    |   auth-policies.service.ts
                    |   auth-register.service.ts
                    |   auth-session.service.ts
                    |   auth.service.ts   
                    |   dialog.service.ts 
                    |   error-handler.service.ts
                    |   events.service.ts 
                    |   fcm.service.ts    
                    |   invited-user.service.ts
                    |   loading.service.ts
                    |   notification.service.ts
                    |   photo.service.ts  
                    |   user-detail-data.service.ts
                    |   user-detail-facade.service.ts
                    |   user-detail-form.service.ts
                    |   user-detail-permissions.service.ts
                    |   user-detail-photo.service.ts
                    |   user-permissions.service.ts
                    |   user-photo.service.ts
                    |   user.service.ts   
                    |   
                    +---mapbox            
                            mapbox.service.ts