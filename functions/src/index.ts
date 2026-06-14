import * as admin from 'firebase-admin';

// Inicializamos el SDK de administración global una única vez aquí para todo el ecosistema
admin.initializeApp();

// ============================================================================
// 🧪 ENTORNO DE TESTING (Módulos exclusivos para Cypress / Emuladores)
// ============================================================================
export { inicializarTest, borrarUsuarioPorEmailDev } from './functions/testing-helpers';

// ============================================================================
// 📦 EXPORTACIÓN ESTRUCTURADA DE ENDPOINTS MODULARES
// ============================================================================
export { createUserByAdmin } from './functions/createUserByAdmin';
export { deactivateUser } from './functions/deactivateUser';
export { reactivateUser } from './functions/reactivateUser';
export { approveUser } from './functions/approveUser';
export { sendCustomPasswordReset } from './functions/sendCustomPasswordReset';
export { requestUserApproval } from './functions/requestUserApproval';
export { onEventTriggerNotification } from './functions/onEventTriggerNotification';
export { onFairAccessCreatedNotification } from './functions/onFairAccessCreatedNotification';