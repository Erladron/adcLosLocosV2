/**
 * @interface FcmPayloadOptions
 * @description Estructura de parámetros requeridos para generar un payload nativo estandarizado.
 */
interface FcmPayloadOptions {
  token: string;
  title: string;
  body: string;
  targetUrl: string;
  tipoNotificacion: string;
  tag?: string;
  customData?: Record<string, string>;
  image?: string;
}

/**
 * @class FcmTemplates
 * @description Clase factoría estática encargada de centralizar, maquetar y estructurar 
 * los payloads estandarizados de mensajería (payloads FCM) para la APK nativa.
 */
export class FcmTemplates {

  /** 
   * @private
   * @static
   * @property {string} urlEscudo - Enlace al logotipo oficial para mostrar como imagen grande/expandida.
   */
  private static urlEscudo = 'https://firebasestorage.googleapis.com/v0/b/adcloslocos-desa.firebasestorage.app/o/escudo.png?alt=media&token=6b0614fc-9d03-4b73-8c8b-be07e8fabbad';

  /**
   * @private
   * @static
   * @method buildBasePayload
   * @description Constructor maestro que ensambla un payload nativo para Android/APK con canal,
   * color corporativo, icono de recurso nativo y diccionario 'data' para navegación.
   */
  private static buildBasePayload(options: FcmPayloadOptions) {
    const { token, title, body, targetUrl, tipoNotificacion, tag, customData = {}, image } = options;
    const finalImage = image || FcmTemplates.urlEscudo;

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
          sound: 'default', // 🔑 Usa el sonido por defecto del sistema operativo
          defaultSound: true,
          image: finalImage,
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
   */
  static getSocioAprobadoTemplate(token: string, nombreSocio: string) {
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
   */
  static getAvisoDirectivaTemplate(token: string, totalPendientes: number, applicantUid: string) {
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
   */
  static getUsuarioDesactivadoTemplate(token: string, motivo: string) {
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
   */
  static getUsuarioReactivadoTemplate(token: string) {
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
   */
  static getNuevoEventoTemplate(token: string, tituloPush: string, descripcionPush: string, eventId: string) {
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
   */
  static getModificacionEventoTemplate(token: string, tituloPush: string, descripcionPush: string, eventId: string) {
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
   */
  static getElimacionEventoTemplate(token: string, tituloPush: string, descripcionPush: string, eventId?: string) {
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
   */
  static getCredencialSocioTemplate(token: string, nombreEvento: string, passId?: string) {
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
   */
  static getInvitacionExternoTemplate(token: string, nombreSocio: string, nombreEvento: string, passId?: string) {
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
   */
  static getInvitacionCanceladaTemplate(token: string, nombreSocio: string, nombreEvento: string, passId?: string) {
    return FcmTemplates.buildBasePayload({
      token,
      title: 'Invitación Cancelada 🚫',
      body: `${nombreSocio} ha retirado la invitación que te había asignado para "${nombreEvento}".`,
      targetUrl: '/user-passes',
      tipoNotificacion: 'INVITACION_CANCELADA',
      tag: passId ? `pase-${passId}` : 'mis-pases'
    });
  }
}