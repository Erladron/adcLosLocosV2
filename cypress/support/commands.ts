Cypress.Commands.add(

  'login',

  (email, password) => {

    cy.visit('/login');

    cy.url().should(
      'include',
      '/login'
    );

    // EMAIL
    cy.get(
      'ion-input input:visible'
    )
    .eq(0)
    .clear()
    .type(email);

    // PASSWORD
    cy.get(
      'ion-input input:visible'
    )
    .eq(1)
    .clear()
    .type(password);

    // BOTON
    cy.contains(
      'Entrar'
    )
    .click();

    // VALIDAR
    cy.url().should(
      'include',
      '/home'
    );

  }

);