describe('Fallo de Red en Storage Onboarding - 02_03_auth_onboarding_fallo_storage.cy.ts', () => {
  const NEW_USER_EMAIL = 'invitado.pending_data_2@adcloslocos.com';
  const NEW_USER_PASSWORD = 'PasswordSegura123!';
  const NEW_USER_DNI = '12345678';

  before(() => {
    // Creamos el blob de imagen falso de 1px para simular la foto de perfil
    const fakeImg = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=';
    cy.writeFile('cypress/fixtures/profile-placeholder.jpg', fakeImg, 'base64');
  });

  beforeEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
    cy.visit('/login');
    cy.get('[data-cy="input-login-email"]').find('input').type(NEW_USER_EMAIL);
    cy.get('[data-cy="input-login-password"]').find('input').type(NEW_USER_PASSWORD);
    cy.get('[data-cy="btn-login-submit"]').click();
    
    cy.url().should('include', '/complete-profile');
    cy.get('[data-cy="complete-profile-page"]').should('be.visible');
  });

  it('Debería manejar correctamente un error de red o de servidor al procesar la solicitud', () => {
    
    // =========================================================================
    // 1. 🛡️ RELLENAR DATOS EN LA TARJETA CIVIL (Identificador unívoco)
    // =========================================================================
    cy.get('[data-cy="personal-data-card"]').within(() => {
      cy.get('[data-cy="input-profile-nombre"]').find('input').clear({ force: true }).type('Felipe Onboarding Storage', { force: true });
      cy.get('[data-cy="input-profile-dni"]').find('input').type(NEW_USER_DNI, { force: true });
      cy.get('[data-cy="input-profile-telefono"]').find('input').type('699887766', { force: true });
      cy.get('[data-cy="input-profile-profesion"]').find('input').type('Pintor', { force: true });
    });

    // Buscador predictivo de Mapbox para la dirección postal
    cy.fillAddress('Camas');

    // =========================================================================
    // 2. INTERCEPTACIÓN DEL ERROR 500
    // =========================================================================
    cy.intercept('POST', '**/requestUserApproval**', {
      statusCode: 500,
      body: { error: 'Error al subir la imagen o procesar el perfil.' }
    }).as('saveProfileError');

    // =========================================================================
    // 3. ENVÍO Y COMPROBACIÓN DE RETENCIÓN DE SEGURIDAD
    // =========================================================================
    cy.get('[data-cy="btn-submit-onboarding"]').should('not.be.disabled').click({ force: true });

    // Esperamos a que la app choque contra el error provocado
    cy.wait('@saveProfileError');

    // Comprobamos que el aviso Toast se dibuja en el Shadow DOM de Ionic
    cy.get('ion-toast', { includeShadowDom: true, timeout: 8000 }).should('exist');
    
    // 🛡️ EL BLINDAJE: Si da un 500, el usuario se queda bloqueado aquí para reintentar
    cy.url().should('include', '/complete-profile');
    cy.get('[data-cy="complete-profile-page"]').should('be.visible');
  });
});