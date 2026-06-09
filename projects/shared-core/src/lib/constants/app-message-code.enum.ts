export enum AppMessageCode {

  // ============================================
  // AUTH ERRORS
  // ============================================

  ADC_AUTH_ERR_0001 = 'ADC_AUTH_ERR_0001', // Usuario no autenticado

  ADC_AUTH_ERR_0002 = 'ADC_AUTH_ERR_0002', // Credenciales inválidas

  ADC_AUTH_ERR_0003 = 'ADC_AUTH_ERR_0003', // Correo no autorizado

  ADC_AUTH_ERR_0004 = 'ADC_AUTH_ERR_0004', // Cuenta email ya existe

  ADC_AUTH_ERR_0005 = 'ADC_AUTH_ERR_0005', // Password débil

  ADC_AUTH_ERR_0006 = 'ADC_AUTH_ERR_0006', // Email inválido

  ADC_AUTH_ERR_0007 = 'ADC_AUTH_ERR_0007', // Error registrando usuario

  ADC_AUTH_ERR_0008 = 'ADC_AUTH_ERR_0008', // Email/password vacíos

  ADC_AUTH_ERR_0009 = 'ADC_AUTH_ERR_0009', // Cuenta cancelada

  ADC_AUTH_ERR_0010 = 'ADC_AUTH_ERR_0010', // Error actualizando credenciales

  ADC_AUTH_ERR_0011 = 'ADC_AUTH_ERR_0011', // Usuario no encontrado

  ADC_AUTH_ERR_0012 = 'ADC_AUTH_ERR_0012', // Password incorrecta

  ADC_AUTH_ERR_0013 = 'ADC_AUTH_ERR_0013', // Demasiados intentos

  ADC_AUTH_ERR_0014 = 'ADC_AUTH_ERR_0014', // Error red Firebase

  // ============================================
  // USER ERRORS
  // ============================================

  ADC_USER_ERR_0001 = 'ADC_USER_ERR_0001',

  ADC_USER_ERR_0002 = 'ADC_USER_ERR_0002',

  ADC_USER_ERR_0003 = 'ADC_USER_ERR_0003',

  ADC_USER_ERR_0004 = 'ADC_USER_ERR_0004',

  ADC_USER_ERR_0005 = 'ADC_USER_ERR_0005',

  // ============================================
  // INVITATION ERRORS
  // ============================================

  ADC_INV_ERR_0001 = 'ADC_INV_ERR_0001',

  ADC_INV_ERR_0002 = 'ADC_INV_ERR_0002',

  ADC_INV_ERR_0003 = 'ADC_INV_ERR_0003',

  ADC_INV_ERR_0004 = 'ADC_INV_ERR_0004',

  ADC_INV_ERR_0005 = 'ADC_INV_ERR_0005',

  ADC_INV_ERR_0006 = 'ADC_INV_ERR_0006',

  // ============================================
  // ADMIN ERRORS
  // ============================================

  ADC_ADMIN_ERR_0001 = 'ADC_ADMIN_ERR_0001',

  ADC_ADMIN_ERR_0002 = 'ADC_ADMIN_ERR_0002',

  // ============================================
  // AUTH INFO
  // ============================================

  ADC_AUTH_INF_0001 = 'ADC_AUTH_INF_0001',

  // ============================================
  // USER INFO
  // ============================================

  ADC_USER_INF_0001 = 'ADC_USER_INF_0001',

  ADC_USER_INF_0002 = 'ADC_USER_INF_0002',

  // ============================================
  // INVITATION INFO
  // ============================================

  ADC_INV_INF_0001 = 'ADC_INV_INF_0001',

  // ============================================
  // SYSTEM ERRORS
  // ============================================

  ADC_SYS_ERR_0001 = 'ADC_SYS_ERR_0001',

  ADC_SYS_ERR_0002 = 'ADC_SYS_ERR_0002',

  ADC_SYS_ERR_0003 = 'ADC_SYS_ERR_0003',

  ADC_SYS_ERR_0004 = 'ADC_SYS_ERR_0004',

  // ============================================
  // EVENT ERRORS
  // ============================================

  ADC_EVENT_ERR_0001 = 'ADC_EVENT_ERR_0001', // Error creando/guardando el evento

  ADC_EVENT_ERR_0002 = 'ADC_EVENT_ERR_0002', // Error al intentar confirmar asistencia

  ADC_EVENT_ERR_0003 = 'ADC_EVENT_ERR_0003', // Error al eliminar el evento

  ADC_EVENT_ERR_0004 = 'ADC_EVENT_ERR_0004', // Evento no existe

  ADC_EVENT_ERR_0005 = 'ADC_EVENT_ERR_0005', // Error al cargar datos del evento

  ADC_EVENT_ERR_0006 = 'ADC_EVENT_ERR_0006', // La fecha de inicio no puede ser menos a la actual

  ADC_EVENT_ERR_0007 = 'ADC_EVENT_ERR_0007', // La fecha y hora de fin del evento debe ser posterior a la de inicio

  ADC_EVENT_ERR_0008 = 'ADC_EVENT_ERR_0008', // El evento ha alcanzado el límite máximo de asistentes

  ADC_EVENT_ERR_0009 = 'ADC_EVENT_ERR_0009', // El límite de invitados por socio es obligatorio para los eventos de feria y debe ser igual o superior a 1

  // ============================================
  // EVENT INFO
  // ============================================

  ADC_EVENT_INF_0001 = 'ADC_EVENT_INF_0001', // Evento creado con éxito

  ADC_EVENT_INF_0002 = 'ADC_EVENT_INF_0002', // Evento actualizado con éxito

  ADC_EVENT_INF_0003 = 'ADC_EVENT_INF_0003', // Asistencia confirmada

  // ============================================
  // FAIR ERRORS (Feria)
  // ============================================

  ADC_FAIR_ERR_0001 = 'ADC_FAIR_ERR_0001', // Límite de invitaciones superado
  ADC_FAIR_ERR_0002 = 'ADC_FAIR_ERR_0002', // QR no válido
  ADC_FAIR_ERR_0003 = 'ADC_FAIR_ERR_0003', // QR caducado o fecha incorrecta
  ADC_FAIR_ERR_0004 = 'ADC_FAIR_ERR_0004', // Error emitiendo pase
  ADC_FAIR_ERR_0005 = 'ADC_FAIR_ERR_0005', // Error anulando pase
  ADC_FAIR_ERR_0006 = 'ADC_FAIR_ERR_0006', // Seleccionar invitado obligatorio
  ADC_FAIR_ERR_0007 = 'ADC_FAIR_ERR_0007', // No hay pase activo hoy
  ADC_FAIR_ERR_0008 = 'ADC_FAIR_ERR_0008', // Socio no activo en el sistema
  ADC_FAIR_ERR_0009 = 'ADC_FAIR_ERR_0009', // Usuario sin rol de acceso ferial

  // ============================================
  // FAIR INFO (Feria)
  // ============================================

  ADC_FAIR_INF_0001 = 'ADC_FAIR_INF_0001', // Pase generado correctamente
  ADC_FAIR_INF_0002 = 'ADC_FAIR_INF_0002', // Pase anulado correctamente
  ADC_FAIR_INF_0003 = 'ADC_FAIR_INF_0003', // Pase diario de feria auto-generado con éxito
}