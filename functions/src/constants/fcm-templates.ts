export class FcmTemplates {

  // URL del escudo oficial de la peña almacenado en vuestro Firebase Storage
  private static urlEscudo = 'https://firebasestorage.googleapis.com/v0/b/adcloslocos-desa.firebasestorage.app/o/escudo.png?alt=media&token=6b0614fc-9d03-4b73-8c8b-be07e8fabbad';

  /**
   * Plantilla para dar la bienvenida oficial a un nuevo socio aprobado
   */
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
        notification: {
          icon: 'ic_escudo_notificacion',
          color: '#1c3f7c',
          sound: 'default',
          defaultSound: true
        }
      },
      data: {
        tipoNotificacion: 'CUENTA_APROBADA'
      }
    };
  }

  /**
   * Plantilla para avisar a la directiva de que hay solicitudes en cola
   */
  static getAvisoDirectivaTemplate(token: string, totalPendientes: number, applicantUid: string) {
    return {
      token: token,
      notification: {
        title: '📌 Gestión de Socios - A.D.C. Los Locos',
        body: totalPendientes === 1
          ? `Hay ${totalPendientes} usuario pendiente de ser aprobado.`
          : `Hay ${totalPendientes} usuarios pendientes de ser aprobados.`,
        image: FcmTemplates.urlEscudo
      },
      android: {
        priority: 'high' as const,
        notification: {
          icon: 'ic_escudo_notificacion',
          color: '#1c3f7c',
          sound: 'default',
          defaultSound: true
        }
      },
      data: {
        tipoNotificacion: 'NUEVO_REGISTRO',
        solicitanteUid: applicantUid
      }
    };
  }

  /**
   * 📅 Plantilla para alertar de la creación de un nuevo evento
   */
  static getNuevoEventoTemplate(token: string, tituloPush: string, descripcionPush: string, eventId: string) {
    return {
      token: token,
      notification: {
        title: tituloPush,
        body: descripcionPush,
        image: FcmTemplates.urlEscudo
      },
      android: {
        priority: 'high' as const,
        notification: {
          icon: 'ic_escudo_notificacion',
          color: '#1c3f7c', 
          sound: 'default',
          defaultSound: true
        }
      },
      data: {
        tipoNotificacion: 'NUEVO_EVENTO',
        eventId: eventId
      }
    };
  }

  /**
   * ⚠️ Plantilla para alertar de modificaciones en convocatorias existentes
   */
  static getModificacionEventoTemplate(token: string, tituloPush: string, descripcionPush: string, eventId: string) {
    return {
      token: token,
      notification: {
        title: tituloPush,
        body: descripcionPush,
        image: FcmTemplates.urlEscudo
      },
      android: {
        priority: 'high' as const,
        notification: {
          icon: 'ic_escudo_notificacion',
          color: '#1c3f7c',
          sound: 'default',
          defaultSound: true
        }
      },
      data: {
        tipoNotificacion: 'MODIFICACION_EVENTO',
        eventId: eventId
      }
    };
  }

  /**
   * 🛑 Plantilla para alertar de la cancelación/eliminación de un evento
   */
  static getElimacionEventoTemplate(token: string, tituloPush: string, descripcionPush: string) {
    return {
      token: token,
      notification: {
        title: tituloPush,
        body: descripcionPush,
        image: FcmTemplates.urlEscudo
      },
      android: {
        priority: 'high' as const,
        notification: {
          icon: 'ic_escudo_notificacion',
          color: '#1c3f7c',
          sound: 'default',
          defaultSound: true
        }
      },
      data: {
        tipoNotificacion: 'ELIMINACION_EVENTO'
      }
    };
  }

  /**
   * 🎟️ NUEVA: Plantilla para alertar a un invitado de que le han generado un Pase de Feria
   */
  static getNuevoPaseFeriaTemplate(token: string, nombreSocio: string) {
    return {
      token: token,
      notification: {
        title: '🎟️ Tu Pase de Feria está listo',
        body: `${nombreSocio} te ha asignado una invitación para la caseta. Abre la app para ver tu código QR de acceso.`,
        image: FcmTemplates.urlEscudo
      },
      android: {
        priority: 'high' as const,
        notification: {
          icon: 'ic_escudo_notificacion',
          color: '#1c3f7c',
          sound: 'default',
          defaultSound: true
        }
      },
      data: {
        tipoNotificacion: 'NUEVO_PASE_FERIA' // Le sirve a la app para saber que debe abrir la vista del pase
      }
    };
  }
}