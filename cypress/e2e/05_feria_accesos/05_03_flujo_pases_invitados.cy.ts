describe('TestCase: 05_03_flujo_pases_invitados', () => {
  // Datos del socio Felipe Novato
  const SOCIO_EMAIL = 'felipe.novato@adcloslocos.com';
  const SOCIO_PASSWORD = 'PasswordSegura123!';

  // Datos del invitado para comprobar la recepción del pase
  const INVITADO_EMAIL = 'invitado.fundador@adcloslocos.com';
  const INVITADO_PASSWORD = 'PasswordSegura123!';

  it('PASO 1: Debe emitir un pase como Socio, logarse como Invitado y verificar la correcta recepción del pase', () => {

    // ==========================================
    // PARTE 1: SOCIO EMITE EL PASE
    // ==========================================

    // 1️⃣ LOGARSE CON EL ROL DE SOCIO (FELIPE)
    cy.login(SOCIO_EMAIL, SOCIO_PASSWORD);
    cy.visit('/home');
    cy.get('[data-cy="home-page-content"]').should('be.visible');

    // 2️⃣ DESPLEGAR EL MENÚ LATERAL E IR A "MIS PASES DIGITALES"
    cy.get('[data-cy="header-menu-button"]').should('be.visible').click();
    cy.wait(400); // Pausa obligatoria para la animación de la barra lateral de Ionic

    cy.get('[data-cy="menu-item-pases"]')
      .should('be.visible')
      .and('contain', 'Mis Pases Digitales')
      .click({ force: true });

    // 3️⃣ VERIFICAR LA EXISTENCIA Y HACER CLIC EN EL PASE "FERIA DE CAMAS 2026"
    cy.url().should('include', '/user-passes');
    cy.contains('[data-cy="passe-pass-card"]', 'Feria de Camas 2026')
      .should('be.visible')
      .click({ force: true });

    // 4️⃣ BUSCAR INVITADO Y EMITIR PASE DIGITAL
    cy.url().should('match', /\/events\/.*\/guests/);
    cy.get('[data-cy="event-guests-content"]').should('be.visible');

    // Escribimos en el input de búsqueda el criterio de nuestro invitado
    cy.get('[data-cy="input-search-invitado"]')
      .should('be.visible')
      .clear({ force: true })
      .type('Invitado Test', { force: true });

    // Esperamos el desplegable y seleccionamos al usuario
    cy.get('[data-cy="search-results-dropdown"]').should('be.visible');
    cy.get('[data-cy="search-result-item"]').first().click({ force: true });

    // Pulsamos el botón de emitir y esperamos que procese la petición en Firebase
    cy.get('[data-cy="btn-submit-passe-pass"]').should('not.be.disabled').click({ force: true });
    cy.wait(6000); // Pausa prudencial para la escritura en base de datos y Toast de éxito

    // Comprobamos que el cupo ya está lleno
    cy.get('[data-cy="passe-limit-reached-warning"]')
      .should('be.visible')
      .and('contain', 'Has completado el cupo máximo');

    // 5️⃣ REGRESAR ATRÁS PARA VOLVER A TENER EL MENÚ HAMBURGUESA Y HACER LOGOUT
    // Hacemos clic en el botón de atrás que provee app-page-header
    cy.get('[data-cy="page-header"]')
      .find('ion-back-button').filter(':visible').first().click({ force: true });

    // Validamos que regresamos correctamente a la pantalla de pases
    cy.url().should('include', '/user-passes');

    // Ahora sí realizamos el logout controlado del Socio
    cy.logout();

    // ==========================================
    // PARTE 2: INVITADO VERIFICA SU PASE
    // ==========================================

    // 6️⃣ LOGARSE CON LAS CREDENCIALES DEL INVITADO
    cy.login(INVITADO_EMAIL, INVITADO_PASSWORD);
    cy.visit('/home');
    cy.get('[data-cy="home-page-content"]').should('be.visible');

    // 7️⃣ IR A "MIS PASES DIGITALES" DESDE EL MENÚ DEL INVITADO
    cy.get('[data-cy="header-menu-button"]').should('be.visible').click();
    cy.wait(400);

    cy.get('[data-cy="menu-item-pases"]')
      .should('be.visible')
      .and('contain', 'Mis Pases Digitales')
      .click({ force: true });

    // 8️⃣ ASERCIÓN FINAL: COMPROBAR QUE EL PASE DE LA FERIA EXISTE PARA ÉL
    cy.url().should('include', '/user-passes');
    cy.contains('[data-cy="passe-pass-card"]', 'Feria de Camas 2026')
      .should('be.visible');
  });
});