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
* Administracion Interna: Vista de gestion general (gest-user.page) y ficha individualizada de datos del socio (user-detail.page).
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

3. MODULO DE EVENTOS Y NOTIFICACIONES PUSH: HITOS RECIENTES

Se ha completado la integracion total de la vista de listados (events.page), la pantalla de detalle (event-detail.page), el servicio core (events.service.ts) y un ecosistema distribuido de Cloud Functions v2 con Cloud Messaging, unificando criterios de rendimiento movil, maquetacion adaptada y robustez de datos:

A. Pantalla de Detalle, Edicion y Cancelacion Atomica (event-detail.page)
* Entrada de Fechas Espejo: Ocultacion total de los controles nativos de Ionic en favor de celdas glassmorphic personalizadas. Muestran las fechas formateadas en texto legible en tiempo real.
* Automatizacion de Fin de Evento: Al confirmar una fecha de inicio (y si no esta marcado como "Todo el dia"), el sistema calcula automaticamente la fecha de finalizacion proyectando mas una (+1) hora en el futuro.
* Blindaje Temporal del Pasado: No se permite fechar el inicio de un evento en un momento anterior al presente absoluto. Si se intenta, el componente corrige el valor reiniciandolo a la hora actual.
* Auto-reparacion de Incoherencias: Si el usuario edita la fecha de fin e introduce un valor menor o igual a la de inicio, la aplicacion bloquea el envio, anade la clase de error .control-has-error (borde rojo traslucido) y repara el campo solo devolviendolo al valor seguro (Inicio +1 hora).
* Mensajeria Centralizada: Vinculacion de las alertas de error de fecha con el enum corporativo AppMessageCode.ADC_EVENT_ERR_0003 mapeado en la libreria core.
* Direcciones Verificadas para Eventos: Integracion del buscador predictivo de Mapbox dentro del campo de ubicacion del evento. Usa un Subject de RxJS con operadores debounceTime(400) y switchMap para capturar el valor exacto del campo place_formatted consumiendo el token oficial mediante el Path Alias @env/environment.
* Flujo de Destruccion Atomica con Push Colectivo: La directiva puede cancelar y eliminar convocatorias usando el boton nativo integrado en la UI de cristal .btn-pena-cancel. La accion se procesa mediante el inyector AlertController, congela la UI con LoadingService.wrap para evitar fallos de conectividad o desajustes del DOM, e inyecta la orden de baja masiva en Firestore antes de limpiar la vista reactivamente.
* Internacionalizacion y Mapeo en Caliente (Espanol): Se integraron diccionarios estrictos globales (EVENT_TYPE_ES) para transformar los strings primitivos del modelo (asamblea, comida, quedada, feria) en etiquetas humanas legibles en la cabecera del cartel.

B. Listado General, Seguridad y Control de Asistencia (events.page)
* Consumo de Fachada Centralizada de Autenticacion: Se integro el componente con AuthService, haciendo uso del ciclo asincronico await this.authService.waitForUserData() para recuperar de manera segura el perfil de usuario desde Firestore antes de iniciar las consultas de datos.
* Filtrado Perimetral por Rol: Conexion directa con la directiva this.authService.isInvitado(). Si un usuario accede con perfil de "Invitado", el flujo RxJS filtra el tablon en caliente para ocultar cualquier convocatoria marcada como privada (event.isPrivate === true), garantizando que solo visualizan los eventos publicos (ej. "Un evento para todo el mundo").
* Seguro de Desconexion en Cierre de Sesion: Implementacion del patron de destruccion mediante Subject y takeUntil(this.destroy$) combinado con operadores de captura catchError(() => of([])). Al pulsar "Cerrar Sesion", la pagina destruye inmediatamente las suscripciones activas en tiempo real con Firestore. Esto evita que la aplicacion intente leer colecciones de socios en estado anonimo, silenciando por completo los errores de permisos (Missing or insufficient permissions) en la consola del navegador.
* Logica Avanzada de Aforo Profesional: 
  - Se diseno una funcion evaluadora isEventFull(event) que analiza si las confirmaciones han alcanzado el limite de maxAttendees.
  - Comportamiento UX Inteligente: Si el evento esta lleno y el usuario no esta inscrito, se ocultan los botones de accion y se muestra un estado deshabilitado de "Aforo Completo". Si el evento esta lleno pero el usuario ya estaba apuntado, la interfaz preserva los botones para permitirle desapuntarse y liberar su plaza de forma interactiva.
* Fidelidad Estricta de Maquetacion HTML/SCSS: Se reestructuraron las secciones del DOM mediante contenedores estructurales de Angular (<ng-container>) e inyecciones dinamicas de traduccion en caliente ({{ estadoTraduccion[event.status] | uppercase }}). Esto permite aplicar las condiciones logicas de aforo y asistencia respetando integramente las clases de estilo nativas .card-actions, .btn-action, .btn-accept y .btn-decline definidas en la hoja de estilos de la aplicacion principal, manteniendo los bordes circulares, paddings dinamicos y textos descriptivos en minusculas.
* Blindaje de la URL de Creacion: Implementacion de guardias de codigo en el ngOnInit de la pagina de detalle. Si un usuario no autorizado intenta forzar la entrada manual escribiendo el path /events/new, el sistema bloquea la inicializacion, muestra una notificacion de advertencia y redirige al infractor de vuelta al menu de listados.

C. Backend en la Nube: Arquitectura Firebase Cloud Functions v2
Se configuro y despliego un modulo robusto basado en el SDK de Cloud Functions de segunda generacion (v2) unificado en la region central de almacenamiento (us-central1):
* FCM Templates Integrados (fcm-templates.ts): Modulo estatico que define los payloads nativos esteticos para hardware movil con el color corporativo oficial de la pena (#1c3f7c), icono corporativo nativo empaquetado en el APK (ic_escudo_notificacion) e imagenes escaladas del escudo oficial desde Storage distribuidas por bloques asincronos rapidos de Firebase Cloud Messaging (messaging().sendEach()).
* Escuchador de Base de Datos Reactivo (onDocumentWritten): Monitorea la coleccion /events/{eventId} de manera asincrona. 
* Estrategia Interoperable de Triggers: El cliente Angular no realiza envios masivos directos (ahorrando bateria e impidiendo el robo de tokens). Al crear (createEvent), modificar (updateEvent) o eliminar (deleteEvent) un evento, la aplicacion movil inyecta un nodo temporal privado e invisible en la base de datos denominado _notificationTrigger.
* Procesamiento de Segmentacion y Autolimpieza Atomica: El backend captura el trigger, lee dinamicamente el array de roles elegidos (destinatarios), extrae de forma segura todos los tokens de terminal vinculados en las subcolecciones /users/{uid}/tokens de socios activos y distribuye los pushes adaptados al tipo de alerta (NUEVO_EVENTO, MODIFICACION_EVENTO, ELIMINACION_EVENTO). 
* Flujo Destructivo Centralizado: Si la orden interceptada en la nube es una eliminacion, el backend despacha los pushes de cancelacion a los terminales y, en el bloque de salida obligatoria (finally), destruye fisicamente de forma automatica el documento completo del evento de Firestore, evitando colecciones basura o dependencias muertas. Si es un alta o edicion, purga atomicamente el campo de control _notificationTrigger para evitar bucles repetitivos de alertas.
* Politica de Limpieza en Artifact Registry: Al trabajar con v2 (Cloud Run), se inyecto una regla de retencion automatica de imagenes en el repositorio de contenedores de Google Cloud, asegurando la eliminacion de compilaciones obsoletas y manteniendo la cuota mensual completamente gratuita.

D. Reglas de Seguridad en Cloud Firestore (firestore.rules)
* Actualizacion Atomica y Quirurgica de Eventos: Se refactorizaron las reglas de Firebase en produccion para la coleccion /events/{eventId}. Utilizando la funcion analitica request.resource.data.diff(resource.data).affectedKeys().hasOnly(['attendeeCount']), se concede permiso de actualizacion a los usuarios comunes (socios e invitados) unicamente si el unico campo alterado en la peticion es el contador numerico de asistentes, manteniendo el resto del documento (fechas, titulos, estados) protegido de forma estricta contra manipulaciones malintencionadas.
* Subcoleccion de Asistencia: Se securizo el subpath /attendance/{userId} garantizando que cualquier usuario autenticado puede consultar el listado de participantes (allow read: if isLogged()), pero limitando la escritura exclusivamente al propio dueno del identificador o a la junta directiva (allow write: if isOwnUser(userId) || canManageUsers()).

---

4. ANALISIS DE VULNERABILIDADES Y MITIGACION DE RIESGOS (AUDITORIA)

Revisando detalladamente la estructura y el comportamiento de las piezas de software implementadas, se detectan los siguientes puntos criticos que requieren atencion de seguridad:

* Riesgo Alto: Acceso al Trigger de Notificaciones Push Masivas
  - Vulnerabilidad: Actualmente el metodo deleteEvent (y los de alta/edicion) inyectan el payload _notificationTrigger desde el cliente Angular. Aunque las reglas impiden editar campos estructurales a usuarios corrientes, un socio malicioso con conocimientos de desarrollo web podria interceptar la consola del navegador, ejecutar un comando de actualizacion inyectando un _notificationTrigger modificado en un evento y forzar al backend de Google a enviar notificaciones push masivas falsas, ofensivas o SPAM con el escudo de la pena a todos los moviles de la base de datos.
  - Mitigacion recomendada: Retirar por completo el objeto _notificationTrigger de la app movil. Los formularios web de la directiva solo deben guardar los datos limpios del evento. El backend de Firebase (index.ts) debe evaluar mediante change.before.data() y change.after.data() de forma automatica si un evento es nuevo, modificado o eliminado, autogenerando la push masiva desde el servidor 100% aislado de los clientes.

* Riesgo Medio: El Borrado Fisico deja subcolecciones Huerfanas
  - Vulnerabilidad: Al ejecutar event.data.after.ref.delete() en el backend para eliminar el evento, Firestore borra el documento principal del evento, pero no elimina automaticamente las subcolecciones internas como /attendance (las inscripciones de los socios). Esos documentos de asistencia se quedan flotando como datos fantasmas ocupando espacio innecesario de almacenamiento.
  - Mitigacion recomendada: Modificar el bloque de eliminacion de la Cloud Function para que, antes de borrar el nodo del evento, realice un bucle que borre todos los registros de la subcoleccion attendance vinculados a ese ID.

---

5. BUENAS PRACTICAS SUGERIDAS PARA EL DESARROLLO DEL PROYECTO

1. Gestion de Entornos Seguros (Mapbox Token): Actualmente el token de Mapbox se inyecta desde environment.ts directamente en el codigo de produccion. Dado que los tokens expuestos en aplicaciones web o APKs hibridas pueden ser extraidos facilmente, asegurate de configurar en el panel de Mapbox restricciones perimetrales estrictas de dominio de URL (adcloslocos-desa.web.app) y el identificador de paquete nativo de Android, impidiendo que terceros roben vuestra cuota de geocodificacion.
2. Uso de Pipes en lugar de Metodos en el HTML: Para la traduccion de idiomas en el listado, se expuso el diccionario estadoTraduccion. Trata de mantener siempre esta estructura de acceso directo por clave estatica en lugar de invocar metodos funcionales (ej. getIconForType(event.type)) en bucles *ngFor. Los metodos en el HTML se ejecutan en cada micro-ciclo de deteccion de cambios de Angular, mermando el rendimiento y la fluidez del scroll en terminales antiguos de gama baja. Reemplazalos por Pipes personalizados reutilizables.
3. Control Centralizado de Roles en la Nube: Asegurate de que las logicas sensibles (como quien es Administrador o Directiva) se validen con tokens de seguridad JWT de Firebase en las peticiones HTTPS utilizando reclamaciones personalizadas (Custom Claims), impidiendo la suplantacion de identidad alterando el almacenamiento local del navegador (LocalStorage).

---

6. SIGUIENTES PASOS Y FUNCIONALIDADES PENDIENTES (BACKLOG DE LA PENA)

1. Migracion Completa de Funciones v1 a v2: Actualmente conviven funciones HTTP clasicas v1 (createUserByAdmin, deactivateUser...) con el disparador autonomo v2 de Firestore. Se recomienda unificar toda la carpeta functions a la v2 de Firebase para aprovechar el aislamiento nativo por hilos de Cloud Run, reduciendo a cero los problemas de arranque en frio (Cold Start).
2. Modulo de Estadisticas (stats.page): Pantalla planificada en la arquitectura de carpetas que permanece como contenedor de construccion (stats-construction.png). Debera consumir el historico de asistencia acumulado para mostrar graficas analiticas a la directiva sobre la participacion real de los socios en casetas y convivencias.
3. Control de Accesos por Codigos QR en Feria: Implementacion del lector e integrador de pases de la interfaz FairAccess de tu modelo. Se requerira un componente escaner de camara integrado en el hardware para validar los picajes de entradas y salidas de la caseta en tiempo real durante la festividad, verificando los pases de invitados vinculados al ID de un socio anfitrion.

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