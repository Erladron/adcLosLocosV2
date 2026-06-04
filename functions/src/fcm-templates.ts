export class FcmTemplates {

  /**
   * Plantilla para dar la bienvenida oficial a un nuevo socio aprobado
   */
  static getSocioAprobadoTemplate(token: string, nombreSocio: string) {
    return {
      token: token,
      notification: {
        title: '¡Bienvenido a la Asociación! 🔵⚪✨', // 🚀 ¡Corregido a Azul y Blanco!
        body: `¡Hola ${nombreSocio}! La directiva ha verificado tu cuenta. Ya puedes disfrutar de la app móvil con acceso total.`
      },
      android: {
        priority: 'high' as const,
        notification: {
          icon: 'ic_escudo_notificacion', // Escudo nativo de la peña
          color: '#999999',           // 🚀 ¡Cambiado al Azul oficial de la peña!
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
          : `Hay ${totalPendientes} usuarios pendientes de ser aprobados.`
      },
      android: {
        priority: 'high' as const,
        notification: {
          icon: 'ic_escudo_notificacion',
          color: '#999999',           // 🚀 ¡Cambiado al Azul oficial de la peña!
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
}