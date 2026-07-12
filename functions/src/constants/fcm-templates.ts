/**
 * @class FcmTemplates
 * @description Clase factor��a est��tica encargada de centralizar, maquetar y estructurar 
 * los payloads estandarizados de mensajer��a (payloads FCM) para su distribuci��n masiva 
 * o dirigida a trav��s de Firebase Cloud Messaging. Configura las directrices nativas de 
 * prioridad y estilos visuales para dispositivos Android.
 */
export class FcmTemplates {

  /** 
   * @private
   * @static
   * @property {string} urlEscudo - Enlace est��tico al imagotipo oficial de la A.D.C. Los Locos en Firebase Storage.
   */
  private static urlEscudo = 'https://firebasestorage.googleapis.com/v0/b/adcloslocos-desa.firebasestorage.app/o/escudo.png?alt=media&token=6b0614fc-9d03-4b73-8c8b-be07e8fabbad'; //

  /**
   * @static
   * @method getSocioAprobadoTemplate
   * @description Modela el payload de bienvenida para notificar a un socio que su cuenta ha sido validada por la directiva.
   * @param {string} token - Token f��sico de registro FCM del dispositivo destino.
   * @param {string} nombreSocio - Nombre completo del socio que ha sido aprobado.
   * @returns {Object} Estructura de mensaje compatible con admin.messaging.Message.
   */
  static getSocioAprobadoTemplate(token: string, nombreSocio: string) {
    return {
      token: token,
      notification: {
        title: '?Bienvenido a la Asociaci��n! ????',
        body: `?Hola ${nombreSocio}! La directiva ha verificado tu cuenta. Ya puedes disfrutar de la app m��vil con acceso total.`,
        image: FcmTemplates.urlEscudo
      },
      android: {
        priority: 'high' as const,
        notification: { icon: 'ic_escudo_notificacion', color: '#1c3f7c', sound: 'default', defaultSound: true }
      },
      data: { tipoNotificacion: 'CUENTA_APROBADA' }
    };
  }

  /**
   * @static
   * @method getAvisoDirectivaTemplate
   * @description Estructura una alerta dirigida a la junta directiva indicando el volumen actual de solicitudes de registro pendientes.
   * @param {string} token - Token f��sico de registro FCM del terminal del administrador o directivo.
   * @param {number} totalPendientes - C��mputo global de usuarios en estado de retenci��n.
   * @param {string} applicantUid - UID del usuario aspirante que acaba de completar su onboarding.
   * @returns {Object} Estructura de mensaje compatible con admin.messaging.Message.
   */
  static getAvisoDirectivaTemplate(token: string, totalPendientes: number, applicantUid: string) {
    return {
      token: token,
      notification: {
        title: '?? Gesti��n de Socios - A.C.D. Los Locos',
        body: totalPendientes === 1
          ? `Hay ${totalPendientes} usuario pendiente de ser aprobado.`
          : `Hay ${totalPendientes} usuarios pendientes de ser aprobados.`,
        image: FcmTemplates.urlEscudo
      },
      android: {
        priority: 'high' as const,
        notification: { icon: 'ic_escudo_notificacion', color: '#1c3f7c', sound: 'default', defaultSound: true }
      },
      data: { tipoNotificacion: 'NUEVO_REGISTRO', solicitanteUid: applicantUid }
    };
  }

  /**
   * @static
   * @method getNuevoEventoTemplate
   * @description Configura la notificaci��n de broadcast masivo para alertar sobre la publicaci��n de una nueva convocatoria.
   * @param {string} token - Token de direccionamiento del dispositivo.
   * @param {string} tituloPush - T��tulo del mensaje definido por la mutaci��n del trigger.
   * @param {string} descripcionPush - Descripci��n o cuerpo del mensaje con los datos del evento.
   * @param {string} eventId - Identificador ��nico del evento en Cloud Firestore para enrutamiento deep-linking.
   * @returns {Object} Estructura de mensaje compatible con admin.messaging.Message.
   */
  static getNuevoEventoTemplate(token: string, tituloPush: string, descripcionPush: string, eventId: string) {
    return {
      token: token,
      notification: { title: tituloPush, body: descripcionPush, image: FcmTemplates.urlEscudo },
      android: {
        priority: 'high' as const,
        notification: { icon: 'ic_escudo_notificacion', color: '#1c3f7c', sound: 'default', defaultSound: true }
      },
      data: { tipoNotificacion: 'NUEVO_EVENTO', eventId: eventId }
    };
  }

  /**
   * @static
   * @method getModificacionEventoTemplate
   * @description Modela el payload informativo ante cambios estructurales en un evento (horarios, ubicaciones, etc.).
   * @param {string} token - Token de direccionamiento del dispositivo.
   * @param {string} tituloPush - T��tulo adaptado para la modificaci��n.
   * @param {string} descripcionPush - Cuerpo explicativo detallando la actualizaci��n.
   * @param {string} eventId - UID del evento modificado para forzar la sincronizaci��n en el cliente.
   * @returns {Object} Estructura de mensaje compatible con admin.messaging.Message.
   */
  static getModificacionEventoTemplate(token: string, tituloPush: string, descripcionPush: string, eventId: string) {
    return {
      token: token,
      notification: { title: tituloPush, body: descripcionPush, image: FcmTemplates.urlEscudo },
      android: {
        priority: 'high' as const,
        notification: { icon: 'ic_escudo_notificacion', color: '#1c3f7c', sound: 'default', defaultSound: true }
      },
      data: { tipoNotificacion: 'MODIFICACION_EVENTO', eventId: eventId }
    };
  }

  /**
   * @static
   * @method getElimacionEventoTemplate
   * @description Maqueta el aviso de cancelaci��n definitiva de una convocatoria o evento del club.
   * @param {string} token - Token de direccionamiento del dispositivo.
   * @param {string} tituloPush - T��tulo de cancelaci��n del evento.
   * @param {string} descripcionPush - Cuerpo del mensaje notificando el cese de la convocatoria.
   * @returns {Object} Estructura de mensaje compatible con admin.messaging.Message.
   */
  static getElimacionEventoTemplate(token: string, tituloPush: string, descripcionPush: string) {
    return {
      token: token,
      notification: { title: tituloPush, body: descripcionPush, image: FcmTemplates.urlEscudo },
      android: {
        priority: 'high' as const,
        notification: { icon: 'ic_escudo_notificacion', color: '#1c3f7c', sound: 'default', defaultSound: true }
      },
      data: { tipoNotificacion: 'ELIMINACION_EVENTO' }
    };
  }

  /**
   * @static
   * @method getCredencialSocioTemplate
   * @description Modela el mensaje transaccional para socios cuando confirman asistencia y se emite su credencial QR.
   * @param {string} token - Token de direccionamiento del dispositivo.
   * @param {string} nombreEvento - Nombre del evento confirmado.
   * @returns {Object} Estructura de mensaje compatible con admin.messaging.Message.
   */
  static getCredencialSocioTemplate(token: string, nombreEvento: string) {
    return {
      token: token,
      notification: {
        title: '?Tu credencial ya est�� disponible! ??',
        body: `Confirmaste tu asistencia a "${nombreEvento}". Ya tienes tu credencial digital de acceso lista en la secci��n "Mis Pases". ?Nos vemos all��!`,
        image: FcmTemplates.urlEscudo
      },
      android: {
        priority: 'high' as const,
        notification: { icon: 'ic_escudo_notificacion', color: '#1c3f7c', sound: 'default', defaultSound: true }
      },
      data: { tipoNotificacion: 'NUEVA_CREDENCIAL' }
    };
  }

  /**
   * @static
   * @method getInvitacionExternoTemplate
   * @description Maqueta la alerta dirigida a invitados externos cuando un socio les expide una invitaci��n de acceso con c��digo QR.
   * @param {string} token - Token de direccionamiento del dispositivo.
   * @param {string} nombreSocio - Nombre del socio anfitri��n que expide el pase.
   * @param {string} nombreEvento - Nombre de la convocatoria o festejo asociado.
   * @returns {Object} Estructura de mensaje compatible con admin.messaging.Message.
   */
  static getInvitacionExternoTemplate(token: string, nombreSocio: string, nombreEvento: string) {
    return {
      token: token,
      notification: {
        title: 'Has recibido una invitaci��n digital ??',
        body: `${nombreSocio} te ha enviado una credencial de acceso para "${nombreEvento}". Entra en la app para ver tu c��digo QR de entrada. ?Te esperamos!`,
        image: FcmTemplates.urlEscudo
      },
      android: {
        priority: 'high' as const,
        notification: { icon: 'ic_escudo_notificacion', color: '#1c3f7c', sound: 'default', defaultSound: true }
      },
      data: { tipoNotificacion: 'NUEVA_CREDENCIAL' }
    };
  }

  /**
   * @static
   * @method getUsuarioDesactivadoTemplate
   * @description Modela la alerta cr��tica e inmediata para informar a un usuario que su perfil ha sido suspendido en el sistema.
   * @param {string} token - Token de direccionamiento del dispositivo.
   * @param {string} motivo - Argumentaci��n o justificaci��n formal de la baja.
   * @returns {Object} Estructura de mensaje compatible con admin.messaging.Message.
   */
  static getUsuarioDesactivadoTemplate(token: string, motivo: string) {
    return {
      token: token,
      notification: {
        title: '?? Cuenta Desactivada',
        body: motivo 
          ? `Tu cuenta ha sido dada de baja en la plataforma. Motivo: ${motivo}`
          : 'Tu cuenta ha sido dada de baja en la plataforma por decisi��n de la directiva.',
        image: FcmTemplates.urlEscudo
      },
      android: {
        priority: 'high' as const,
        // ?? OPTIMIZACI��N VISUAL: Cambiamos de forma inteligente el color a rojo (#ef4444) para denotar criticidad
        notification: { icon: 'ic_escudo_notificacion', color: '#ef4444', sound: 'default', defaultSound: true }
      },
      data: { tipoNotificacion: 'CUENTA_DESACTIVADA' }
    };
  }

  /**
   * @static
   * @method getUsuarioReactivadoTemplate
   * @description Estructura la notificaci��n push para avisar a un socio que su cuenta ha sido restaurada con ��xito por la junta.
   * @param {string} token - Token de direccionamiento del dispositivo.
   * @returns {Object} Estructura de mensaje compatible con admin.messaging.Message.
   */
  static getUsuarioReactivadoTemplate(token: string) {
    return {
      token: token,
      notification: {
        title: '? ?Cuenta Reactivada!',
        body: 'Tu cuenta ha sido reactivada con ��xito por la junta directiva. Ya puedes acceder de nuevo a la aplicaci��n.',
        image: FcmTemplates.urlEscudo
      },
      android: {
        priority: 'high' as const,
        notification: { icon: 'ic_escudo_notificacion', color: '#1c3f7c', sound: 'default', defaultSound: true }
      },
      data: { tipoNotificacion: 'CUENTA_REACTIVADA' }
    };
  }
}