import * as admin from 'firebase-admin';

// 🚀 1. Importamos el gestor de opciones globales de la v2
import { setGlobalOptions } from 'firebase-functions/v2';

// 🚀 2. Fijamos la región europea como prioritaria para TODO el backend
setGlobalOptions({ 
  region: 'europe-west1' 
});

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