/**
 * @fileoverview Service Worker para la recepción de notificaciones Push (FCM) y navegación PWA.
 * @module ServiceWorker/FirebaseMessaging
 * @description Gestiona el ciclo de vida del SW con reclamación inmediata de clientes (`clients.claim`),
 * inicializa Firebase dinámicamente mediante eventos de mensaje, captura notificaciones en segundo plano
 * aplicando patrones de vibración/agrupación y redirige a Angular mediante `BroadcastChannel`.
 */

/// <reference lib="webworker" />

importScripts(
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js"
);

/* ============================================================================
 * 1. CONTROL DE CICLO DE VIDA (Obliga al SW a tomar el control de la pestaña)
 * ============================================================================ */

/**
 * Evento de instalación del Service Worker.
 * Fuerza a la versión recién descargada a instalarse inmediatamente sin esperar a que se cierren otras pestañas.
 *
 * @listens self#install
 * @param {ExtendableEvent} event - Evento nativo de instalación.
 */
self.addEventListener("install", (event) => {
  self.skipWaiting();
});

/**
 * Evento de activación del Service Worker.
 * Toma el control de todas las pestañas abiertas activas (clientes) de forma inmediata.
 *
 * @listens self#activate
 * @param {ExtendableEvent} event - Evento nativo de activación.
 */
self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

/* ============================================================================
 * 2. MANEJADOR DE CLIC EN NOTIFICACIONES
 * ============================================================================ */

/**
 * Intercepta el clic de los usuarios sobre una notificación push generada en el sistema operativo.
 * Cierra la notificación visual y abre la URL de destino de forma directa e instantánea
 * evitando bloqueos de procesos en Android/MIUI.
 *
 * @listens self#notificationclick
 * @param {NotificationEvent} event - Evento nativo de interacción con la notificación.
 * @returns {Promise<void>}
 */
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const notificationData = event.notification.data || {};
  const targetUrl =
    notificationData.url ||
    notificationData.ruta ||
    notificationData.FCM_MSG?.data?.url ||
    "/home";

  const fullUrl = new URL(targetUrl, self.location.origin).href;

  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        // Si la app está abierta en segundo plano, la traemos al frente SIN llamar a client.navigate()
        for (const client of clientList) {
          if ("focus" in client) {
            // CORRECCIÓN MIUI: Enfocamos primero para reactivar el hilo del WebView y
            // tras la resolución de la promesa enviamos el mensaje a Angular.
            return client.focus().then(() => {
              client.postMessage({
                type: "PUSH_NAVIGATE",
                url: targetUrl,
              });
            });
          }
        }
        // Solo si está completamente CERRADA abrimos ventana
        if (self.clients.openWindow) {
          return self.clients.openWindow(fullUrl);
        }
      })
  );
});

/* ============================================================================
 * 3. CONFIGURACIÓN DINÁMICA DE FIREBASE Y BACKGROUND MESSAGING
 * ============================================================================ */

/**
 * Flag de control para prevenir múltiples llamadas de inicialización a Firebase dentro del worker.
 * @type {boolean}
 */
let messagingInitialized = false;

/**
 * Escucha los mensajes de la aplicación cliente (Angular) para configurar el entorno de Firebase
 * de forma dinámica e instanciar el escuchador de mensajes en segundo plano.
 *
 * @listens self#message
 * @param {ExtendableMessageEvent} event - Mensaje recibido desde la aplicación en ejecución.
 */
self.addEventListener("message", (event) => {
  if (
    event.data &&
    event.data.tipo === "CONFIGURAR_ENTORNO" &&
    !messagingInitialized
  ) {
    /** @type {Object} Credenciales de entorno pasadas desde Angular (environment.firebase) */
    const config = event.data.firebaseConfig;

    if (config && config.apiKey && config.projectId) {
      try {
        // @ts-ignore
        if (!firebase.apps.length) {
          // @ts-ignore
          firebase.initializeApp(config);
        }

        // @ts-ignore
        const messaging = firebase.messaging();

        /**
         * Manejador para la recepción de mensajes push cuando la PWA está en segundo plano o cerrada.
         * Desestructura el payload enviado por FCM / FcmTemplates y dispara la notificación nativa.
         *
         * @callback
         * @param {Object} payload - Contenido del push enviado desde la nube (FCM).
         * @param {Object} [payload.notification] - Datos generales del título y cuerpo.
         * @param {Object} [payload.webpush] - Parámetros WebPush configurados en FcmTemplates.
         * @param {Object} [payload.data] - Atributos clave-valor personalizados.
         * @returns {Promise<void>}
         */
        messaging.onBackgroundMessage((payload) => {
          console.log(
            "📩 [SW] Notificación recibida en segundo plano:",
            payload
          );

          const webpushOptions = payload.webpush?.notification || {};
          const dataOptions = payload.data || {};

          const notificationTitle =
            payload.notification?.title ||
            dataOptions.title ||
            "A.C.D. Los Locos";

          /**
           * Extrae la URL de Storage enviada desde el payload (soporta varias ubicaciones según FCM)
           * @type {string|undefined}
           */
          const storageIcon =
            webpushOptions.icon ||
            payload.notification?.icon ||
            dataOptions.icon ||
            undefined;

          /**
           * Opciones de rendering para la notificación nativa del dispositivo.
           * @type {NotificationOptions}
           */
          const notificationOptions = {
            body: payload.notification?.body || dataOptions.body || "",
            // Asignamos el icono tanto a icon como a badge para forzar que Android lo muestre a la izquierda
            ...(storageIcon && { icon: storageIcon }),

            badge: "/assets/icons/badge-monochrome.png",
            color: "#003399",
            vibrate: [200, 100, 200],

            // 🏷️ Agrupación por recurso (reemplaza o actualiza avisos del mismo tag)
            tag:
              webpushOptions.tag ||
              dataOptions.tag ||
              dataOptions.tipoNotificacion ||
              "general",
            renotify: webpushOptions.renotify ?? true,
            requireInteraction: webpushOptions.requireInteraction ?? true,

            // 🔗 Información normalizada para el event listener de notificationclick y el BroadcastChannel
            data: {
              url: dataOptions.url || dataOptions.ruta || "/home",
              tipoNotificacion: dataOptions.tipoNotificacion || "GENERAL",
              ...dataOptions,
            },
          };

          return self.registration.showNotification(
            notificationTitle,
            notificationOptions
          );
        });

        messagingInitialized = true;
        console.log(
          "✅ [SW] Entorno e intersección de Push configurados correctamente."
        );
      } catch (err) {
        console.error("❌ [SW] Error inicializando Firebase en el SW:", err);
      }
    }
  }
});
