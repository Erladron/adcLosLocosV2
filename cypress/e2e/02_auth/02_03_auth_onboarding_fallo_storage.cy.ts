describe('TestCase: 02_03_auth_onboarding_fallo_storage', () => {
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

  it('PASO 1: Debería manejar correctamente un error de red o de servidor al procesar la solicitud', () => {

    // 1. 🛡️ INTERCEPTACIÓN REGISTRADA PRIMERO (Para no perder ninguna llamada)
    cy.intercept('POST', '**/requestUserApproval', {
      statusCode: 500,
      body: {
        error: {
          status: 'INTERNAL',
          message: 'Error al subir la imagen o procesar el perfil.'
        }
      }
    }).as('saveProfileError');

    // 2. RELLENAR DATOS EN LA TARJETA CIVIL
    cy.get('[data-cy="personal-data-card"]').within(() => {
      cy.get('[data-cy="input-profile-nombre"]').find('input').clear({ force: true }).type('Felipe Onboarding Storage', { force: true });
      cy.get('[data-cy="input-profile-dni"]').find('input').type(NEW_USER_DNI, { force: true });
      cy.get('[data-cy="input-profile-telefono"]').find('input').type('699887766', { force: true });
      cy.get('[data-cy="input-profile-profesion"]').find('input').type('Pintor', { force: true });
    });

    // Buscador predictivo de Mapbox para la dirección postal
    cy.fillAddress('Camas');

    // 3. ENVÍO Y COMPROBACIÓN
    cy.get('[data-cy="btn-submit-onboarding"]').should('not.be.disabled').click({ force: true });

    // ⏱️ Aumentamos el timeout a 10s por si la subida/procesamiento previo tarda
    cy.wait('@saveProfileError', { timeout: 10000 });

    // Comprobamos que el aviso Toast se dibuja en el Shadow DOM de Ionic
    cy.get('ion-toast', { includeShadowDom: true, timeout: 8000 }).should('exist');

    // 🛡️ EL BLINDAJE
    cy.url().should('include', '/complete-profile');
    cy.get('[data-cy="complete-profile-page"]').should('be.visible');
  });
});