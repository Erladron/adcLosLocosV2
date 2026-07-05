export class FcmTemplates {

  private static urlEscudo = 'https://firebasestorage.googleapis.com/v0/b/adcloslocos-desa.firebasestorage.app/o/escudo.png?alt=media&token=6b0614fc-9d03-4b73-8c8b-be07e8fabbad';

  static getSocioAprobadoTemplate(token: string, nombreSocio: string) {
    return {
      token: token,
      notification: {
        title: '¡Bienvenido a la Asociación! 🔵⚪✨',
        body: `¡Hola ${nombreSocio}! La directiva ha verificado tu cuenta. Ya puedes disfrutar de la app móvil con acceso total.`,
        image: FcmTemplates.urlEscudo
      },
      android: {
        priority: 'high' as const,
        notification: { icon: 'ic_escudo_notificacion', color: '#1c3f7c', sound: 'default', defaultSound: true }
      },
      data: { tipoNotificacion: 'CUENTA_APROBADA' }
    };
  }

  static getAvisoDirectivaTemplate(token: string, totalPendientes: number, applicantUid: string) {
    return {
      token: token,
      notification: {
        title: '📌 Gestión de Socios - A.C.D. Los Locos',
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

  // 🚀 NUEVA: Credencial Digital Generada automáticamente para Socios/Directiva (Al marcar "Asistiré")
  static getCredencialSocioTemplate(token: string, nombreEvento: string) {
    return {
      token: token,
      notification: {
        title: '¡Tu credencial ya está disponible! 🎫',
        body: `Confirmaste tu asistencia a "${nombreEvento}". Ya tienes tu credencial digital de acceso lista en la sección "Mis Pases". ¡Nos vemos allí!`,
        image: FcmTemplates.urlEscudo
      },
      android: {
        priority: 'high' as const,
        notification: { icon: 'ic_escudo_notificacion', color: '#1c3f7c', sound: 'default', defaultSound: true }
      },
      data: { tipoNotificacion: 'NUEVA_CREDENCIAL' }
    };
  }

  // 🚀 NUEVA: Invitación de Acceso enviada por un Socio hacia un Invitado Externo
  static getInvitacionExternoTemplate(token: string, nombreSocio: string, nombreEvento: string) {
    return {
      token: token,
      notification: {
        title: 'Has recibido una invitación digital ✉️',
        body: `${nombreSocio} te ha enviado una credencial de acceso para "${nombreEvento}". Entra en la app para ver tu código QR de entrada. ¡Te esperamos!`,
        image: FcmTemplates.urlEscudo
      },
      android: {
        priority: 'high' as const,
        notification: { icon: 'ic_escudo_notificacion', color: '#1c3f7c', sound: 'default', defaultSound: true }
      },
      data: { tipoNotificacion: 'NUEVA_CREDENCIAL' }
    };
  }

  // 🚀 NUEVA: Alerta inmediata de Cuenta Desactivada
  static getUsuarioDesactivadoTemplate(token: string, motivo: string) {
    return {
      token: token,
      notification: {
        title: '🛑 Cuenta Desactivada',
        body: motivo 
          ? `Tu cuenta ha sido dada de baja en la plataforma. Motivo: ${motivo}`
          : 'Tu cuenta ha sido dada de baja en la plataforma por decisión de la directiva.',
        image: FcmTemplates.urlEscudo
      },
      android: {
        priority: 'high' as const,
        notification: { icon: 'ic_escudo_notificacion', color: '#ef4444', sound: 'default', defaultSound: true }
      },
      data: { tipoNotificacion: 'CUENTA_DESACTIVADA' }
    };
  }

  // 🚀 NUEVA: Alerta inmediata de Cuenta Reactivada
  static getUsuarioReactivadoTemplate(token: string) {
    return {
      token: token,
      notification: {
        title: '⚡ ¡Cuenta Reactivada!',
        body: 'Tu cuenta ha sido reactivada con éxito por la junta directiva. Ya puedes acceder de nuevo a la aplicación.',
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