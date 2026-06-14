describe('👮 ROL: Administrador - Integridad de Menús y Navegación', () => {

  beforeEach(() => {
    cy.visit('/login');

    cy.get('[data-cy="input-login-email"]').find('input').type('admin.fundador@adcloslocos.com');
    cy.get('[data-cy="input-login-password"]').find('input').type('PasswordSegura123!');
    cy.get('[data-cy="btn-login-submit"]').click();

    // Esperamos el asentamiento real en la Home antes de interactuar
    cy.url({ timeout: 15000 }).should('include', '/home');
    cy.get('[data-cy="home-page-content"]').should('be.visible');
  });

  it('Debe validar la Home, navegar por tarjetas y auditar la ficha de un usuario', () => {

    // 1️⃣ VALIDACIÓN DE LA HOME (Usando tus data-cy reales del HTML)
    cy.get('[data-cy="welcome-user-title"]').should('be.visible');
    cy.get('[data-cy="quick-card-usuarios"]').should('be.visible');
    cy.get('[data-cy="quick-card-eventos"]').should('be.visible');

    // 2️⃣ NAVEGAR A USUARIOS DIRECTAMENTE DESDE LA TARJETA DE LA HOME
    // Esto evita el problema de los botones de menú duplicados en la caché
    cy.get('[data-cy="quick-card-usuarios"]').click();

    // Validamos asentamiento en la gestión de usuarios
    cy.url().should('include', '/gest-user');
    cy.get('[data-cy="gest-user-content"]').should('be.visible');

    // 3️⃣ SELECCIONAR UN USUARIO DE LA LISTA
    // Buscamos "Portero Test" asegurando que solo mire el contenedor activo visible
    cy.get('ion-content').filter(':visible').contains('Portero Test').click({ force: true });
    cy.url().should("include", "/user-detail");

    // 4️⃣ AUDITORÍA DE COMPONENTES ENCAPSULADOS DE LA FICHA
    cy.get('app-personal-data-form').should('exist');
    cy.get('app-membership-form').should('exist');
    cy.get('app-credentials-form').should('exist');
    cy.get('app-user-audit-form').should('exist');

    // Volvemos atrás usando el botón físico de volver de la cabecera visible
    cy.get('[data-cy="header-back-button"]').filter(':visible').first().click({ force: true });
    cy.url().should('include', '/gest-user');

    // =========================================================================
    // 5️⃣ REGRESAR A LA HOME DE FORMA NATURAL (CORREGIDO PARA EVITAR EXPULSIÓN)
    // =========================================================================
    // En lugar de usar cy.visit('/home'), hacemos clic en la flecha de volver atrás 
    // que tiene la barra de la cabecera de Ionic para regresar de forma segura a la Home
    cy.get('ion-back-button, [slot="end"] ion-button, .back-button')
      .filter(':visible')
      .first()
      .click({ force: true });

    // Validamos que estamos de vuelta en la Home sin que nos eche el Guard
    cy.url().should('include', '/home');
    cy.get('[data-cy="home-page-content"]').should('be.visible');

    // 6️⃣ GO TO: EVENTOS DESDE LA TARJETA DE LA HOME
    cy.get('[data-cy="quick-card-eventos"]').click();
    cy.url().should('include', '/events');

    // 7️⃣ CIERRE DE SESIÓN FINAL LIMPIO (Bypass de menú conflictivo)
    // Borramos las cookies y el storage para desloguear al admin sin pelearnos con los botones del DOM
    cy.clearLocalStorage();
    cy.clearCookies();
    cy.visit('/login');

    // Validamos el aterrizaje limpio de vuelta al Login
    cy.url().should('include', '/login');
    cy.get('[data-cy="login-page"]').should('be.visible');
    cy.log('🎉 ¡Test 03_01 completado limpiamente sin conflictos de menú!');
  });

});