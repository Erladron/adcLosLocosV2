import { AppMessageCode }
  from './app-message-code.enum';

export const APP_MESSAGES = {

  // ============================================
  // AUTH ERRORS
  // ============================================

  [AppMessageCode.ADC_AUTH_ERR_0001]:
    'Usuario no autenticado.',

  [AppMessageCode.ADC_AUTH_ERR_0002]:
    'Credenciales inválidas.',

  [AppMessageCode.ADC_AUTH_ERR_0003]:
    'Tu correo no está autorizado para registrarse.',

  [AppMessageCode.ADC_AUTH_ERR_0004]:
    'Ya existe una cuenta registrada con este correo electrónico.',

  [AppMessageCode.ADC_AUTH_ERR_0005]:
    'La contraseña debe tener al menos 6 caracteres.',

  [AppMessageCode.ADC_AUTH_ERR_0006]:
    'El correo electrónico no es válido.',

  [AppMessageCode.ADC_AUTH_ERR_0007]:
    'Error registrando usuario.',

  [AppMessageCode.ADC_AUTH_ERR_0008]:
    'Por favor, introduce tu email y contraseña.',

  [AppMessageCode.ADC_AUTH_ERR_0009]:
    'Tu cuenta ha sido cancelada. Contacta con administración.',

  [AppMessageCode.ADC_AUTH_ERR_0010]:
    'Error actualizando credenciales.',

  [AppMessageCode.ADC_AUTH_ERR_0011]:
    'Usuario o contraseña incorrectos.',

  [AppMessageCode.ADC_AUTH_ERR_0012]:
    'Usuario o contraseña incorrectos.',

  [AppMessageCode.ADC_AUTH_ERR_0013]:
    'Demasiados intentos. Inténtalo más tarde.',

  [AppMessageCode.ADC_AUTH_ERR_0014]:
    'Error de conexión con Firebase.',

  // ============================================
  // USER ERRORS
  // ============================================

  [AppMessageCode.ADC_USER_ERR_0001]:
    'Error guardando usuario.',

  [AppMessageCode.ADC_USER_ERR_0002]:
    'Error actualizando datos personales.',

  [AppMessageCode.ADC_USER_ERR_0003]:
    'Los emails no coinciden.',

  [AppMessageCode.ADC_USER_ERR_0004]:
    'Las contraseñas no coinciden.',

  [AppMessageCode.ADC_USER_ERR_0005]:
    'Complete todos los campos.',

  // ============================================
  // INVITATION ERRORS
  // ============================================

  [AppMessageCode.ADC_INV_ERR_0001]:
    'Por favor, introduce un correo electrónico.',

  [AppMessageCode.ADC_INV_ERR_0002]:
    'Introduce un email válido.',

  [AppMessageCode.ADC_INV_ERR_0003]:
    'Error enviando invitación.',

  [AppMessageCode.ADC_INV_ERR_0004]:
    'El usuario ya pertenece a la aplicación.',

  [AppMessageCode.ADC_INV_ERR_0005]:
    'Ya existe una invitación para este correo.',

  [AppMessageCode.ADC_INV_ERR_0006]:
    'No existe ninguna invitación para este correo.',

  // ============================================
  // ADMIN ERRORS
  // ============================================

  [AppMessageCode.ADC_ADMIN_ERR_0001]:
    'Error aprobando usuario.',

  [AppMessageCode.ADC_ADMIN_ERR_0002]:
    'Error rechazando usuario.',

  // ============================================
  // AUTH INFO
  // ============================================

  [AppMessageCode.ADC_AUTH_INF_0001]:
    'Cuenta creada correctamente.',

  // ============================================
  // USER INFO
  // ============================================

  [AppMessageCode.ADC_USER_INF_0001]:
    'Usuario aprobado correctamente.',

  [AppMessageCode.ADC_USER_INF_0002]:
    'Usuario rechazado.',

  // ============================================
  // INVITATION INFO
  // ============================================

  [AppMessageCode.ADC_INV_INF_0001]:
    'Invitación enviada correctamente.',

  // ============================================
  // SYSTEM ERRORS
  // ============================================

  [AppMessageCode.ADC_SYS_ERR_0001]:
    'Error inesperado del sistema.',

  [AppMessageCode.ADC_SYS_ERR_0002]:
    'Error de conexión.',

  [AppMessageCode.ADC_SYS_ERR_0003]:
    'No tienes permisos para realizar esta acción.',

  [AppMessageCode.ADC_SYS_ERR_0004]:
    'Servicio temporalmente no disponible.',
  // ============================================
  // EVENT ERRORS
  // ============================================

  [AppMessageCode.ADC_EVENT_ERR_0001]:
    'No se ha podido guardar el evento. Por favor, inténtalo de nuevo.',

  [AppMessageCode.ADC_EVENT_ERR_0002]:
    'Error al registrar tu asistencia. Revisa tu conexión.',

  [AppMessageCode.ADC_EVENT_ERR_0003]:
    'No se ha podido eliminar el evento.',

  [AppMessageCode.ADC_EVENT_ERR_0004]:
    'El evento no existe o ha sido eliminado.',

  [AppMessageCode.ADC_EVENT_ERR_0005]:
    'Error al cargar los datos del evento.',

  [AppMessageCode.ADC_EVENT_ERR_0006]:
    'La fecha y hora inicio no puede ser menor a la actual.',

  [AppMessageCode.ADC_EVENT_ERR_0007]:
    'La fecha y hora de fin del evento debe ser posterior a la de inicio.',

  [AppMessageCode.ADC_EVENT_ERR_0008]:
    '¡Aforo completo! Lo sentimos, ya no quedan plazas libres para este evento.',

  [AppMessageCode.ADC_EVENT_ERR_0009]:
    'El límite de invitados por socio es obligatorio para los eventos de feria y debe ser igual o superior a 1.',

  // ============================================
  // EVENT INFO
  // ============================================

  [AppMessageCode.ADC_EVENT_INF_0001]:
    '¡Evento convocado con éxito!',

  [AppMessageCode.ADC_EVENT_INF_0002]:
    'Datos del evento actualizados correctamente.',

  [AppMessageCode.ADC_EVENT_INF_0003]:
    '¡Asistencia confirmada! Te esperamos.',


  // ============================================
  // FAIR ERRORS (Feria)
  // ============================================

  [AppMessageCode.ADC_FAIR_ERR_0001]:
    'Límite superado. Solo puedes invitar a un máximo de 6 personas por día.',

  [AppMessageCode.ADC_FAIR_ERR_0002]:
    'El código QR escaneado no corresponde a ningún pase de feria válido.',

  [AppMessageCode.ADC_FAIR_ERR_0003]:
    'Acceso denegado. Este pase no es válido para la fecha de hoy.',

  [AppMessageCode.ADC_FAIR_ERR_0004]:
    'No se pudo emitir la invitación. Verifica tu conexión.',

  [AppMessageCode.ADC_FAIR_ERR_0005]:
    'No se pudo anular el pase. Inténtalo de nuevo más tarde.',

  [AppMessageCode.ADC_FAIR_ERR_0006]:
    'Debes seleccionar un invitado del listado desplegable o escribir un nombre.',

  [AppMessageCode.ADC_FAIR_ERR_0007]:
    'No tienes ningún pase de feria activo disponible para la jornada de hoy.',

  [AppMessageCode.ADC_FAIR_ERR_0008]:
    'Acceso denegado. El socio no se encuentra en estado activo en el sistema.',

  [AppMessageCode.ADC_FAIR_ERR_0009]:
    'Acceso denegado. El tipo de usuario no dispone de credenciales de acceso de socio.',

  // ============================================
  // FAIR INFO (Feria)
  // ============================================

  [AppMessageCode.ADC_FAIR_INF_0001]:
    'Pase de caseta emitido correctamente.',

  [AppMessageCode.ADC_FAIR_INF_0002]:
    'El pase ha sido anulado correctamente.',

  [AppMessageCode.ADC_FAIR_INF_0003]:
    '¡Pase de Feria disponible! Hemos generado automáticamente tu credencial de acceso para la caseta de feria.',
};