/**
 * @enum UserRole
 * @description Catálogo unificado y fuertemente tipado de los roles y rangos jerárquicos de acceso.
 * Delimita de forma perimetral las capacidades visuales en las pantallas, la obligatoriedad de cuotas financieras 
 * y los privilegios de escaneo en los accesos de la peña.
 */
export enum UserRole {
  /** @description Privilegios totales sobre el sistema, bases de datos, pasarelas de autenticación y auditorías. */
  ADMINISTRADOR = 'administrador',

  /** @description Miembro de la Junta Directiva con facultades de alta manual, aprobación de socios y gestión de eventos. */
  DIRECTIVA = 'directiva',

  /** @description Socio ordinario de la peña sujeto al pago de cuotas anuales, con derechos de reserva y pases feriales. */
  SOCIO = 'socio',

  /** @description Usuario externo pre-autenticado en fase de onboarding o completado de perfil. */
  INVITADO = 'invitado',

  /** @description Personal de control de acceso contratado con permisos exclusivos de escaneo de códigos QR en puerta. */
  PORTERO = 'portero'
}