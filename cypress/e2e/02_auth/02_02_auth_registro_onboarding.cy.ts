describe('Registro y Onboarding de Usuario - 02_02_auth_registro_onboarding.cy.ts', () => {
  const ADMIN_EMAIL = 'admin.fundador@adcloslocos.com';
  const ADMIN_PASSWORD = 'PasswordSegura123!';
  const NEW_USER_NAME = 'Felipe Novato Solís 2';
  const NEW_USER_EMAIL = 'felipe.novato_2@adcloslocos.com';
  const NEW_USER_EMAIL_PEND_DAT = 'invitado.pending_data@adcloslocos.com';
  const NEW_USER_DNI = '12345678';

  before(() => {
    // Creamos un blob de imagen falso de 1px en formato JPEG para simular la foto de perfil
    const fakeImg = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=';
    cy.writeFile('cypress/fixtures/profile-placeholder.jpg', fakeImg, 'base64');
  });

  beforeEach(() => {
    // Limpieza radical de cookies y almacenamiento local para aislar los inicios de sesión
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  it('Paso 1: Administrador envía invitación a nuevo miembro', () => {
    // 1. Usamos nuestro Login unívoco
    cy.visit('/login');
    cy.get('[data-cy="input-login-email"]').find('input').type(ADMIN_EMAIL);
    cy.get('[data-cy="input-login-password"]').find('input').type(ADMIN_PASSWORD);
    cy.get('[data-cy="btn-login-submit"]').click();

    // ⏳ VALIDACIÓN CRUCIAL DE ASENTAMIENTO: Esperamos a que cargue la Home de verdad
    cy.url().should('include', '/home');
    cy.get('[data-cy="home-page-content"]').should('be.visible');

    // 2. Abrimos el menú de navegación filtrando por el primer botón visible (Evita error de duplicados)
    cy.get('[data-cy="header-menu-button"]').filter(':visible').first().click({ force: true });
    cy.wait(500); // Pequeño respiro para la animación de Ionic

    // 3. Hacemos clic en el ítem unívoco del menú
    cy.get('[data-cy="menu-item-invite"]').should('be.visible').click({ force: true });

    // 4. Validamos que la navegación a la vista de invitaciones se ha consolidado
    cy.url().should('include', '/invite');
    cy.get('[data-cy="invite-content-page"]').should('be.visible');

    // 5. Escribimos el email usando su ID exclusivo
    cy.get('[data-cy="input-invite-email"]').find('input').type(NEW_USER_EMAIL, { force: true });

    // 6. Enviamos la invitación usando su botón exclusivo
    cy.get('[data-cy="btn-send-invite"]').click({ force: true });

    // 7. Logout usando la marca del menú lateral de la Peña
    cy.get('[data-cy="header-menu-button"]').filter(':visible').first().click({ force: true });
    cy.get('[data-cy="menu-item-logout"]').click({ force: true });
  });

  it('Paso 2: Nuevo usuario completa perfil y es redirigido a /pending-approval', () => {
    cy.visit('/login');

    // Logueamos al nuevo usuario invitado
    cy.get('[data-cy="input-login-email"]').find('input').type(NEW_USER_EMAIL_PEND_DAT);
    cy.get('[data-cy="input-login-password"]').find('input').type(ADMIN_PASSWORD);
    cy.get('[data-cy="btn-login-submit"]').click();

    // Debería redirigir al Onboarding
    cy.url().should('include', '/complete-profile');
    cy.get('[data-cy="complete-profile-page"]').should('be.visible');

    // Rellenamos sus datos personales unívocos usando el subformulario inyectado (Corregido con personal-data-card)
    cy.get('[data-cy="personal-data-card"]').within(() => {
      cy.get('[data-cy="input-profile-nombre"]').find('input').clear({ force: true }).type(NEW_USER_NAME, { force: true });
      cy.get('[data-cy="input-profile-dni"]').find('input').type(NEW_USER_DNI, { force: true });
      cy.get('[data-cy="input-profile-telefono"]').find('input').type('654321098', { force: true });
    });

    // 🗺️ TRATAMIENTO DEL BUSCADOR MAPBOX (Fuera del within para evitar bloqueos del DOM)
    cy.get('[data-cy="input-profile-direccion"]').find('input')
      .clear({ force: true })
      .type('Calle de la Peña Los Locos 15', { force: true, delay: 100 });
    
    // Si la API de Mapbox despliega sugerencias, hacemos clic en la primera opción
    cy.get('body').then(($body) => {
      if ($body.find('[data-cy="profile-address-suggestions"]').length > 0) {
        cy.get('[data-cy="profile-address-suggestion-item"]').first().click({ force: true });
      }
    });

    // Enviamos el formulario definitivo para solicitar la aprobación de la directiva
    cy.get('[data-cy="btn-submit-onboarding"]').click({ force: true });

    // Comprobamos que aterriza de forma exitosa en la pantalla de retención
    cy.url({ timeout: 30000 }).should('include', '/pending-approval');
    cy.get('[data-cy="approval-status-title"]').should('contain.text', 'Solicitud enviada');

    // Cierre de sesión final en la pantalla de pendientes
    cy.get('[data-cy="btn-approval-logout"]').click({ force: true });
    cy.url().should('include', '/login');
  });
});