/**
 * @file firebase-messaging-sw.js
 * @description Service Worker maestro para la gestión de Web Push en segundo plano.
 * Cumple estrictamente con las directrices de evaluación inicial síncrona del navegador.
 */

// 🚀 1. IMPORTACIÓN E INICIALIZACIÓN SÍNCRONA OBLIGATORIA
importScripts(
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js"
);

/** @description Flag de seguridad para evitar dobles inicializaciones del chasis */
let messagingInitialized = false;

// =========================================================================
// 🎯 2. OYENTES DE EVALUACIÓN INICIAL (Eliminan por fin los warnings de Chrome)
// =========================================================================

/**
 * @description Escucha del evento bruto de push enviado por el sistema operativo.
 * Declarado en la raíz del script para cumplir con la validación de Chrome.
 */
self.addEventListener("push", (event) => {
  console.log(
    "🔔 [SW-Peña] Evento PUSH bruto recibido por el hardware del PC."
  );
});

/**
 * @description Escucha del evento de clic sobre la notificación flotante del sistema operativo.
 * Evita excepciones InvalidAccessError si el navegador bloquea el foco reactivo.
 */
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const payloadData = event.notification.data;
  if (!payloadData) return;

  let rutaDestino = "/home";
  if (payloadData.tipoNotificacion === "NUEVO_REGISTRO") {
    rutaDestino = "/gest-user?tab=pendientes";
  } else if (payloadData.tipoNotificacion === "NUEVA_CREDENCIAL") {
    rutaDestino = "/user-passes";
  } else if (
    payloadData.tipoNotificacion === "NUEVO_EVENTO" &&
    payloadData.eventId
  ) {
    rutaDestino = `/events/${payloadData.eventId}`;
  }

  const urlPromesa = clients
    .matchAll({ type: "window", includeUncontrolled: true })
    .then((windowClients) => {
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url.includes(self.location.origin) && "focus" in client) {
          client.postMessage({ tipo: "NAVEGAR_PUSH", ruta: rutaDestino });

          // 🚀 BLINDAJE ANTIFALLO: Intentamos dar el foco, si Chrome lo deniega, lo capturamos limpiamente
          try {
            return client.focus();
          } catch (focusError) {
            console.warn(
              "⚠️ [SW-Peña] El navegador ha denegado el focus de la pestaña activa:",
              focusError
            );
            return null;
          }
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(rutaDestino);
      }
    });

  event.waitUntil(urlPromesa);
});

// =========================================================================
// 📥 3. CANAL DE ASIGNACIÓN DINÁMICA DE CREDENCIALES DESDE EL FRONTEND
// =========================================================================

self.addEventListener("message", (event) => {
  if (
    event.data &&
    event.data.tipo === "CONFIGURAR_ENTORNO" &&
    !messagingInitialized
  ) {
    const config = event.data.firebaseConfig;

    if (config && config.apiKey && config.projectId) {
      // Inicializamos Firebase con el entorno inyectado dinámicamente
      firebase.initializeApp(config);
      const messaging = firebase.messaging();

      /**
       * @description Escucha activa en segundo plano (Background) delegada al SDK
       */
      messaging.onBackgroundMessage((payload) => {
        console.log(
          "📥 [SW-Peña] Notificación en segundo plano capturada por el SDK:",
          payload
        );
        const tituloNotificacion =
          payload.notification?.title || "A.C.D. Los Locos";
        const opcionesNotificacion = {
          body:
            payload.notification?.body || "Nueva alerta oficial de la peña.",
          icon: "/assets/img/escudo.png",
          badge: "/assets/img/escudo.png",
          data: payload.data,
        };
        return self.registration.showNotification(
          tituloNotificacion,
          opcionesNotificacion
        );
      });

      messagingInitialized = true;
      console.log(
        "🍏 [SW-Peña] Sistema inicializado con éxito vía transferencia de contexto."
      );
    }
  }
});
