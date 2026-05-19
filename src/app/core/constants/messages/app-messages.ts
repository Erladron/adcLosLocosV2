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
    'Servicio temporalmente no disponible.'

};