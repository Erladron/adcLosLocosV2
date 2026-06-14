describe('Menú Reactivo Feria - 05_01_menu_reactivo_feria.cy.ts', () => {
  const SOCIO_EMAIL = 'felipe.novato@adcloslocos.com';
  const SOCIO_PASSWORD = 'PasswordSegura123!';

  it('Caso A: Sin feria activa', () => {
    // Interceptamos la llamada a Firestore para devolver una lista de eventos vacía (sin tipo 'feria')[cite: 6]
    cy.intercept('GET', '**/documents/events**', {
      statusCode: 200,
      body: []
    }).as('getEventsEmpty');

    cy.login(SOCIO_EMAIL, SOCIO_PASSWORD);
    cy.visit('/home');
    cy.get('[data-cy="home-page-content"]').should('be.visible');

    // Abrir el menú lateral de forma limpia atacando a la cabecera activa[cite: 1]
    cy.get('[data-cy="header-menu-button"]').should('be.visible').click();
    cy.wait(400); // Respiro necesario para la animación nativa de Ionic[cite: 1]

    // Verificar con marcas data-cy que los accesos del ecosistema de Feria NO están renderizados[cite: 6]
    cy.get('[data-cy="menu-item-fair-passes"]').should('not.exist');
    cy.get('[data-cy="menu-item-fair-porter"]').should('not.exist');
    cy.get('[data-cy="premium-divider"]').should('not.exist');
  });

  it('Caso B: Con feria activa', () => {
    // Interceptamos la llamada a Firestore para devolver un evento activo con tipo 'feria'[cite: 6]
    cy.intercept('GET', '**/documents/events**', {
      statusCode: 200,
      body: [
        {
          id: 'feria_2026',
          title: 'Feria de Camas 2026',
          tipo: 'feria',
          startDate: '2026-09-10T20:00:00.000Z',
          endDate: '2026-09-15T20:00:00.000Z'
        }
      ]
    }).as('getEventsFeria');

    cy.login(SOCIO_EMAIL, SOCIO_PASSWORD);
    cy.visit('/home');
    cy.get('[data-cy="home-page-content"]').should('be.visible');

    // Abrir menú lateral[cite: 6]
    cy.get('[data-cy="header-menu-button"]').should('be.visible').click();
    cy.wait(400);

    // Verificar de forma reactiva que el bloque de Ecosistema de Feria se despliega con sus data-cy unívocos[cite: 6]
    cy.get('[data-cy="menu-item-fair-passes"]').should('be.visible').and('contain', 'Pases de Feria');
    cy.get('[data-cy="menu-item-fair-porter"]').should('be.visible').and('contain', 'Portería Caseta');
  });
});