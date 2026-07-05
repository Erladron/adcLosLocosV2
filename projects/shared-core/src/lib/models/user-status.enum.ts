/**
 * @enum UserStatus
 * @description Catálogo unificado y fuertemente tipado de los estados del ciclo de vida de un usuario.
 * Controla de forma secuencial las fases del onboarding, desde el registro inicial hasta el bloqueo por impagos.
 */
export enum UserStatus {
  /** 
   * @description Fase de pre-alta web. El aspirante ha sido invitado pero aún no ha completado sus datos personales civiles.
   */
  PENDING_DATA = 'pending_data',

  /** 
   * * @description Datos completados por el aspirante. La solicitud está en cola de revisión para aprobación manual de la directiva.
   */
  PENDING_APPROVAL = 'pending_approval',

  /** 
   * @description Usuario plenamente verificado, activo y con plenos derechos de acceso a la plataforma.
   */
  ACTIVE = 'active',

  /** 
   * @description Solicitud de alta web denegada de forma lógica por la directiva o la administración de la peña.
   */
  REJECTED = 'rejected',

  /** 
   * @description Usuario dado de baja lógica por un administrador o suspendido temporalmente por impago de cuotas.
   */
  INACTIVE = 'inactive'
}