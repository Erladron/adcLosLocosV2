import { initializeApp } from 'firebase-admin/app';
import { setGlobalOptions } from 'firebase-functions/v2';

// 🚀 1. Fijamos la región europea como prioritaria para TODO el backend
setGlobalOptions({ 
  region: 'europe-west1' 
});

// 🚀 2. Inicialización ligera única al cargar la entrada
initializeApp();

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
export { onPasseAccessCreatedNotification } from './functions/onPasseAccessCreatedNotification';
export { onPasseAccessDeletedNotification } from './functions/onPasseAccessDeletedNotification';