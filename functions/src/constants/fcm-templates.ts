import { Message } from 'firebase-admin/messaging';

/**
 * @interface FcmPayloadOptions
 * @description Estructura de parámetros requeridos para ensamblar un payload nativo estandarizado de FCM.
 */
interface FcmPayloadOptions {
  /** @property {string} token - Cadena física única del token de registro FCM del dispositivo de destino. */
  token: string;
  /** @property {string} title - Título visible de la notificación en el panel del sistema operativo. */
  title: string;
  /** @property {string} body - Cuerpo descriptivo del mensaje de la notificación. */
  body: string;
  /** @property {string} targetUrl - Ruta interna de navegación (deep link) para la aplicación móvil. */
  targetUrl: string;
  /** @property {string} tipoNotificacion - Criterio o categoría lógica de la alerta (e.g., 'CUENTA_APROBADA'). */
  tipoNotificacion: string;
  /** @property {string} [tag] - Identificador único de canal/agrupamiento para evitar duplicados en la barra de estado. */
  tag?: string;
  /** @property {Record<string, string>} [customData] - Diccionario de clave/valor con parámetros adicionales de contexto. */
  customData?: Record<string, string>;
}

/**
 * @class FcmTemplates
 * @description Clase factoría estática encargada de centralizar, maquetar y estructurar 
 * los payloads estandarizados de mensajería (payloads FCM) para la APK nativa Android/iOS.
 */
export class FcmTemplates {

  /**
   * @private
   * @static
   * @method buildBasePayload
   * @description Constructor maestro privado que ensambla un payload nativo estructurado para Android/APK, 
   * inyectando canales de sonido, color corporativo, icono de recurso nativo y el diccionario de datos 'data'
   * para el enrutamiento reactivo tras el toque (click_action).
   * 
   * @param {FcmPayloadOptions} options - Parámetros de configuración e información del mensaje.
   * 
   * @returns {admin.messaging.Message} Carga útil formateada lista para ser procesada por el SDK administrativo de FCM.
   */
  private static buildBasePayload(options: FcmPayloadOptions): Message {
    const { token, title, body, targetUrl, tipoNotificacion, tag, customData = {} } = options;

    const safeData: Record<string, string> = {
      targetUrl: String(targetUrl),
      landing_page: String(targetUrl),
      tipoNotificacion: String(tipoNotificacion),
      click_action: 'FLUTTER_NOTIFICATION_CLICK'
    };

    Object.keys(customData).forEach((key) => {
      if (customData[key] !== undefined && customData[key] !== null) {
        safeData[key] = String(customData[key]);
      }
    });

    return {
      token: token,

      notification: {
        title: title,
        body: body
      },

      android: {
        priority: 'high' as const,
        notification: {
          title: title,
          body: body,
          icon: 'ic_stat_badge',
          color: '#003399',
          sound: 'default',
          defaultSound: true,
          tag: tag || tipoNotificacion
        }
      },

      data: safeData
    };
  }

  // ============================================================================
  // PLANTILLAS DE NOTIFICACIÓN
  // ============================================================================

  /**
   * @static
   * @method getSocioAprobadoTemplate
   * @description Construye la carga útil estandarizada para notificar a un aspirante que su cuenta 
   * ha sido aprobada por la Junta Directiva y cuenta con acceso total a la plataforma.
   * 
   * @param {string} token - Token físico de registro FCM del dispositivo de destino.
   * @param {string} nombreSocio - Nombre completo o de pila del socio validado.
   * 
   * @returns {admin.messaging.Message} Payload ensamblado compatible con la APK nativa.
   */
  static getSocioAprobadoTemplate(token: string, nombreSocio: string): Message {
    return FcmTemplates.buildBasePayload({
      token,
      title: '¡Bienvenido a la Asociación! 🎉🥳',
      body: `¡Hola ${nombreSocio}! La directiva ha verificado tu cuenta. Ya puedes disfrutar de la app móvil con acceso total.`,
      targetUrl: '/home',
      tipoNotificacion: 'CUENTA_APROBADA'
    });
  }

  /**
   * @static
   * @method getAvisoDirectivaTemplate
   * @description Construye la carga útil estandarizada para alertar a los miembros de la Junta Directiva 
   * sobre la presencia de nuevas solicitudes de registro en cola pendientes de aprobación manual.
   * 
   * @param {string} token - Token físico de registro FCM del dispositivo del directivo.
   * @param {number} totalPendientes - Número total de usuarios en estado PENDING_APPROVAL.
   * @param {string} applicantUid - Identificador único (UID) del aspirante que acaba de solicitar el alta.
   * 
   * @returns {admin.messaging.Message} Payload ensamblado compatible con la APK nativa.
   */
  static getAvisoDirectivaTemplate(token: string, totalPendientes: number, applicantUid: string): Message {
    const targetUrl = '/gest-user?tab=pendientes';
    const body = totalPendientes === 1
      ? `Hay ${totalPendientes} usuario pendiente de ser aprobado.`
      : `Hay ${totalPendientes} usuarios pendientes de ser aprobados.`;

    return FcmTemplates.buildBasePayload({
      token,
      title: '🔔 Gestión de Socios - A.C.D. Los Locos',
      body,
      targetUrl,
      tipoNotificacion: 'NUEVO_REGISTRO',
      customData: { solicitanteUid: applicantUid }
    });
  }

  /**
   * @static
   * @method getUsuarioDesactivadoTemplate
   * @description Construye la carga útil estandarizada para informar a un socio que su cuenta 
   * ha sido dada de baja o suspendida temporalmente por la directiva, especificando el motivo opcional.
   * 
   * @param {string} token - Token físico de registro FCM del dispositivo del socio deshabilitado.
   * @param {string} motivo - Explicación o causa justificada de la desactivación.
   * 
   * @returns {admin.messaging.Message} Payload ensamblado compatible con la APK nativa.
   */
  static getUsuarioDesactivadoTemplate(token: string, motivo: string): Message {
    const body = motivo
      ? `Tu cuenta ha sido dada de baja en la plataforma. Motivo: ${motivo}`
      : 'Tu cuenta ha sido dada de baja en la plataforma por decisión de la directiva.';

    return FcmTemplates.buildBasePayload({
      token,
      title: '⚠️ Cuenta Desactivada',
      body,
      targetUrl: '/login',
      tipoNotificacion: 'CUENTA_DESACTIVADA'
    });
  }

  /**
   * @static
   * @method getUsuarioReactivadoTemplate
   * @description Construye la carga útil estandarizada para avisar a un socio previamente suspendido 
   * de que su cuenta ha sido reactivada satisfactoriamente por la administración.
   * 
   * @param {string} token - Token físico de registro FCM del dispositivo del socio reactivado.
   * 
   * @returns {admin.messaging.Message} Payload ensamblado compatible con la APK nativa.
   */
  static getUsuarioReactivadoTemplate(token: string): Message {
    return FcmTemplates.buildBasePayload({
      token,
      title: '🎉 ¡Cuenta Reactivada!',
      body: 'Tu cuenta ha sido reactivada con éxito por la junta directiva. Ya puedes acceder de nuevo a la aplicación.',
      targetUrl: '/home',
      tipoNotificacion: 'CUENTA_REACTIVADA'
    });
  }

  /**
   * @static
   * @method getNuevoEventoTemplate
   * @description Construye la carga útil estandarizada para difundir de forma masiva la publicación 
   * de una nueva convocatoria o evento en la agenda de la peña.
   * 
   * @param {string} token - Token físico de registro FCM del dispositivo de destino.
   * @param {string} tituloPush - Cabecera publicitaria o título del evento.
   * @param {string} descripcionPush - Resumen o texto descriptivo principal de la cita.
   * @param {string} eventId - Identificador único (ID) del evento en Cloud Firestore para el deep link.
   * 
   * @returns {admin.messaging.Message} Payload ensamblado compatible con la APK nativa.
   */
  static getNuevoEventoTemplate(token: string, tituloPush: string, descripcionPush: string, eventId: string): Message {
    return FcmTemplates.buildBasePayload({
      token,
      title: tituloPush,
      body: descripcionPush,
      targetUrl: `/events/${eventId}`,
      tipoNotificacion: 'NUEVO_EVENTO',
      tag: `evento-${eventId}`,
      customData: { eventId }
    });
  }

  /**
   * @static
   * @method getModificacionEventoTemplate
   * @description Construye la carga útil estandarizada para informar a los inscritos y socios sobre 
   * cambios, ajustes de horario o reprogramación en un evento existente.
   * 
   * @param {string} token - Token físico de registro FCM del dispositivo de destino.
   * @param {string} tituloPush - Cabecera de actualización de la convocatoria.
   * @param {string} descripcionPush - Detalle textual de los cambios aplicados por la organización.
   * @param {string} eventId - Identificador único (ID) del evento reprogramado para el deep link.
   * 
   * @returns {admin.messaging.Message} Payload ensamblado compatible con la APK nativa.
   */
  static getModificacionEventoTemplate(token: string, tituloPush: string, descripcionPush: string, eventId: string): Message {
    return FcmTemplates.buildBasePayload({
      token,
      title: tituloPush,
      body: descripcionPush,
      targetUrl: `/events/${eventId}`,
      tipoNotificacion: 'MODIFICACION_EVENTO',
      tag: `evento-${eventId}`,
      customData: { eventId }
    });
  }

  /**
   * @static
   * @method getElimacionEventoTemplate
   * @description Construye la carga útil estandarizada para notificar de forma urgente la suspensión 
   * o cancelación definitiva de un evento agendado.
   * 
   * @param {string} token - Token físico de registro FCM del dispositivo de destino.
   * @param {string} tituloPush - Cabecera de aviso de suspensión del evento.
   * @param {string} descripcionPush - Motivo o comunicado explicativo sobre la cancelación.
   * @param {string} [eventId] - Identificador único (ID) opcional del evento eliminado.
   * 
   * @returns {admin.messaging.Message} Payload ensamblado compatible con la APK nativa.
   */
  static getElimacionEventoTemplate(token: string, tituloPush: string, descripcionPush: string, eventId?: string): Message {
    return FcmTemplates.buildBasePayload({
      token,
      title: tituloPush,
      body: descripcionPush,
      targetUrl: '/events',
      tipoNotificacion: 'ELIMINACION_EVENTO',
      tag: eventId ? `evento-${eventId}` : 'eventos-cancelados'
    });
  }

  /**
   * @static
   * @method getCredencialSocioTemplate
   * @description Construye la carga útil estandarizada para notificar a un socio que se ha emitido 
   * y habilitado correctamente su pase/credencial digital tras confirmar asistencia a un evento.
   * 
   * @param {string} token - Token físico de registro FCM del dispositivo del socio.
   * @param {string} nombreEvento - Título o denominación de la convocatoria confirmada.
   * @param {string} [passId] - Identificador del pase para el agrupamiento (tag) de notificaciones.
   * 
   * @returns {admin.messaging.Message} Payload ensamblado compatible con la APK nativa.
   */
  static getCredencialSocioTemplate(token: string, nombreEvento: string, passId?: string): Message {
    return FcmTemplates.buildBasePayload({
      token,
      title: '¡Tu credencial ya está disponible! 🎟️✨',
      body: `Confirmaste tu asistencia a "${nombreEvento}". Ya tienes tu credencial digital de acceso lista en la sección "Mis Pases". ¡Nos vemos allí!`,
      targetUrl: '/user-passes',
      tipoNotificacion: 'NUEVA_CREDENCIAL',
      tag: passId ? `pase-${passId}` : 'mis-pases'
    });
  }

  /**
   * @static
   * @method getInvitacionExternoTemplate
   * @description Construye la carga útil estandarizada para notificar a un usuario o invitado que 
   * ha recibido un pase digital de acceso cedido expresamente por un socio anfitrión.
   * 
   * @param {string} token - Token físico de registro FCM del dispositivo del receptor/invitado.
   * @param {string} nombreSocio - Nombre completo o de pila del socio emisor/anfitrión.
   * @param {string} nombreEvento - Título o denominación del evento al que ha sido invitado.
   * @param {string} [passId] - Identificador del pase para el agrupamiento (tag) de notificaciones.
   * 
   * @returns {admin.messaging.Message} Payload ensamblado compatible con la APK nativa.
   */
  static getInvitacionExternoTemplate(token: string, nombreSocio: string, nombreEvento: string, passId?: string): Message {
    return FcmTemplates.buildBasePayload({
      token,
      title: 'Has recibido una invitación digital ✉️✨',
      body: `${nombreSocio} te ha enviado una credencial de acceso para "${nombreEvento}". Entra en la app para ver tu código QR de entrada. ¡Te esperamos!`,
      targetUrl: '/user-passes',
      tipoNotificacion: 'NUEVA_CREDENCIAL',
      tag: passId ? `pase-${passId}` : 'mis-pases'
    });
  }

  /**
   * @static
   * @method getInvitacionCanceladaTemplate
   * @description Construye la carga útil estandarizada para informar a un invitado de que el socio 
   * anfitrión ha retirado o anulado la invitación que le había otorgado previamente.
   * 
   * @param {string} token - Token físico de registro FCM del dispositivo del invitado.
   * @param {string} nombreSocio - Nombre completo o de pila del socio que retira el pase.
   * @param {string} nombreEvento - Título o denominación del evento implicado.
   * @param {string} [passId] - Identificador del pase para el agrupamiento (tag) de notificaciones.
   * 
   * @returns {admin.messaging.Message} Payload ensamblado compatible con la APK nativa.
   */
  static getInvitacionCanceladaTemplate(token: string, nombreSocio: string, nombreEvento: string, passId?: string): Message {
    return FcmTemplates.buildBasePayload({
      token,
      title: 'Invitación Cancelada 🚫',
      body: `${nombreSocio} ha retirado la invitación que te había asignado para "${nombreEvento}".`,
      targetUrl: '/user-passes',
      tipoNotificacion: 'INVITACION_CANCELADA',
      tag: passId ? `pase-${passId}` : 'mis-pases'
    });
  }

  /**
   * @static
   * @method getPaseRevocadoTemplate
   * @description Construye la carga útil estandarizada para notificar la revocación o eliminación 
   * de un pase o invitación de acceso a un evento desde el gestor de la caseta/portería.
   * 
   * @param {string} token - Token físico de registro FCM del dispositivo de destino.
   * @param {string} nombreEvento - Título o denominación del evento asociado.
   * @param {string} [passId] - Identificador único del pase para el agrupamiento (tag) de notificaciones.
   * 
   * @returns {admin.messaging.Message} Payload ensamblado compatible con la APK nativa.
   */
  static getPaseRevocadoTemplate(token: string, nombreEvento: string, passId?: string): Message {
    return FcmTemplates.buildBasePayload({
      token,
      title: '🎟️ Pase de acceso cancelado',
      body: `Tu invitación para el evento "${nombreEvento}" ha sido revocada por el socio anfitrión.`,
      targetUrl: '/user-passes',
      tipoNotificacion: 'PASSE_REVOKED',
      tag: passId ? `pase-${passId}` : 'mis-pases'
    });
  }
}