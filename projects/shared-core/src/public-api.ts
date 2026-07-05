// =========================================================================
// 📦 MODELS & ENTITIES (Modelos Estructurales de Datos)
// =========================================================================
export * from './lib/models/invited-user.model';
export * from './lib/models/update-personal-data-request.model';
export * from './lib/models/user-detail.model';
export * from './lib/models/user-role.enum';
export * from './lib/models/user-status.enum';
export * from './lib/models/users.models';
export * from './lib/models/events.models'; // 🔄 Nota: Aquí ya se exporta tu interfaz 'Event' o similares de agenda

// =========================================================================
// 📺 COMPONENTS (Componentes de Presentación Reutilizables)
// =========================================================================
export * from './lib/components/empty-state/empty-state.component';
export * from './lib/components/page-header/page-header.component';

// =========================================================================
// 📝 CONSTANTS, DICTIONARIES & UTILS (Traducciones y Validaciones)
// =========================================================================
export * from './lib/constants/firebase-error-map';
export * from './lib/constants/app-message-code.enum';
export * from './lib/constants/app-messages';
export * from './lib/utils/string.utils';

// =========================================================================
// 🔐 SERVICES: AUTHENTICATION MODULE (Módulo de Acceso y Sesión)
// =========================================================================
export * from './lib/services/auth.service';
export * from './lib/services/auth-session.service';
export * from './lib/services/auth-register.service';
export * from './lib/services/auth-credentials.service';
export * from './lib/services/auth-permissions.service';
export * from './lib/services/auth-admin.service';
export * from './lib/services/auth-policies.service';

// =========================================================================
// 👥 SERVICES: USERS & CORE FEES (Directorio y Gestión Satélite)
// =========================================================================
export * from './lib/services/user.service';
export * from './lib/services/user-fees.service';
export * from './lib/services/invited-user.service';
export * from './lib/services/user-permissions.service';
export * from './lib/services/user-photo.service';

// =========================================================================
// 🗂️ SERVICES: USER DETAIL MODULE (Chasis y Soporte del Formulario)
// =========================================================================
export * from './lib/services/user-detail-data.service';
export * from './lib/services/user-detail-facade.service';
export * from './lib/services/user-detail-form.service';
export * from './lib/services/user-detail-permissions.service';
export * from './lib/services/user-detail-photo.service';

// =========================================================================
// 🗓️ SERVICES: AGENDA & EVENTS (Módulo de Convocatorias)
// =========================================================================
export * from './lib/services/events.service';

// =========================================================================
// 🎪 SERVICES: FAIR MODULE & QR (Módulo Ferial de la Caseta)
// =========================================================================
export * from './lib/services/fair.service';

// =========================================================================
// ⚙️ SERVICES: SYSTEM, INFRASTRUCTURE & UI (Utilidades de Soporte)
// =========================================================================
export * from './lib/services/notification.service';
export * from './lib/services/dialog.service';
export * from './lib/services/error-handler.service';
export * from './lib/services/loading.service';
export * from './lib/services/photo.service';
export * from './lib/services/mapbox/mapbox.service';
export * from './lib/services/fcm.service';            // 🚀 NUEVO: Exportación pública del servicio de notificaciones Push masivas
export * from './lib/env.token';
export * from './lib/templates/email-templates';