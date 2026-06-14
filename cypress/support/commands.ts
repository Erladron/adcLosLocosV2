// ***********************************************
// cypress/support/commands.ts
// ***********************************************

// 🔑 1️⃣ REGLAS DE LOGIN DINÁMICO (Actualizado con data-cy unívocos)
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/login');
  cy.get('[data-cy="input-login-email"]').find('input').type(email);
  cy.get('[data-cy="input-login-password"]').find('input').type(password);
  cy.get('[data-cy="btn-login-submit"]').click();
  cy.url().should('not.include', '/login');
});


// 🚪 2️⃣ CIERRE DE SESIÓN INTELIGENTE (Inmune a la caché de Ionic)
Cypress.Commands.add('logout', () => {
  // Comprobamos si el menú lateral ya está desplegado en pantalla
  cy.get('body').then(($body) => {
    // Si el menú NO está visible, pulsamos la hamburguesa para abrirlo
    if (!$body.find('[data-cy="menu-main-list"]').is(':visible')) {
      cy.get('[data-cy="header-menu-button"]').should('be.visible').click();
      cy.wait(400); // Pequeño respiro para la animación de Ionic
    }
    
    // Una vez garantizado que el menú está abierto de par en par,
    // hacemos clic de forma unívoca en el botón de cerrar sesión
    cy.get('[data-cy="menu-item-logout"]').should('be.visible').click();
  });

  // Aseguramos el asentamiento final volviendo al login
  cy.url().should('include', '/login');
});

Cypress.Commands.add('fillAddress', (address: string) => {
  // 🗺️ TRATAMIENTO DEL BUSCADOR MAPBOX (Fuera del within para evitar bloqueos)
        // Escribimos con un pequeño delay para simular escritura humana y activar las sugerencias
        cy.get('[data-cy="input-profile-direccion"]').find('input')
            .clear({ force: true })
            .type(address, { force: true, delay: 150 });

        // Esperamos a que el listado predictivo aparezca en el DOM de la Peña
        cy.get('[data-cy="profile-address-suggestions"]', { timeout: 8000 }).should('be.visible');

        // Hacemos clic en la primera dirección sugerida de la lista
        cy.get('[data-cy="profile-address-suggestion-item"]').first().click({ force: true });
        cy.wait(400); // Asentamiento para que Angular vuelque el texto en la caja
});

// -----------------------------------------------------------
// 🛠️ 3️⃣ DECLARACIÓN DE TIPOS PARA TYPESCRIPT
// -----------------------------------------------------------
declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>;
      logout(): Chainable<void>;
      fillAddress(address: string): Chainable<void>;
    }
  }
}

export { };