/**
 * @interface InvitedUser
 * @description Modelo estructural para los documentos de la colección `/invitedUsers`.
 * Actúa como un token de pre-alta o "cerrojo de invitación". Ningún usuario externo puede completar 
 * su registro en la plataforma si su correo electrónico no ha sido sembrado previamente en esta colección por la directiva.
 */
export interface InvitedUser {
  /** @description ID único autogenerado del documento en Firestore (coincide habitualmente con el email o un UUID). */
  id?: string;

  // =========================================================================
  // 📋 BASIC DATA (Información Civil del Aspirante)
  // =========================================================================

  /** @description Nombre completo del usuario invitado. */
  nombre: string;

  /** @description Correo electrónico unívoco autorizado para el onboarding. */
  email: string;

  /** @description Teléfono de contacto opcional del aspirante. */
  telefono?: string;

  // =========================================================================
  // 🎫 INVITATION AUDIT (Metadatos de Expedición)
  // =========================================================================

  /** @description Nombre del miembro de la Junta Directiva o Administrador que emite la invitación. */
  invitadoPor: string;

  /** @description UID físico en Firebase Auth del directivo responsable de la emisión. */
  invitadoPorUid: string;

  /** * @description Fecha y hora exacta de expedición del token de invitación.
   * Soporta Date nativo, String ISO o el mapa estructural Timestamp de Firebase.
   */
  fechaInvitacion: Date | string | { seconds: number; nanoseconds: number };

  // =========================================================================
  // ⚙️ STATUS & TRACKING (Control de Consumo del Token)
  // =========================================================================

  /** @description Flag lógico; true si el aspirante ya ha consumido este token para completar su registro. */
  usado: boolean;

  /** @description UID asignado definitivamente al nuevo usuario en Firebase Auth tras canjear la invitación. */
  usadoPorUid?: string;

  /** * @description Fecha y hora en la que el usuario consolidó su onboarding en la app.
   * Soporta Date nativo, String ISO o el mapa estructural Timestamp de Firebase.
   */
  fechaRegistro?: Date | string | { seconds: number; nanoseconds: number };
}