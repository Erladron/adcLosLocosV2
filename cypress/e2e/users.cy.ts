describe('Gestión usuarios', () => {

  it('Debe abrir gestión usuarios', () => {

    // =================================
    // LOGIN
    // =================================

    cy.visit('/login');

    cy.get('ion-input input')
      .eq(0)
      .type('TU_EMAIL_ADMIN');

    cy.get('ion-input input')
      .eq(1)
      .type('TU_PASSWORD');

    cy.contains('Entrar')
      .click();

    // =================================
    // VALIDAR HOME
    // =================================

    cy.url().should(
      'include',
      '/home'
    );

    // =================================
    // ABRIR MENU
    // =================================

    cy.get('ion-menu-button')
      .should('be.visible')
      .click();

    // =================================
    // CLICK USUARIOS
    // =================================

    cy.contains('Usuarios')
      .should('be.visible')
      .click();

    // =================================
    // VALIDAR NAVEGACION
    // =================================

    cy.url().should(
      'include',
      '/gest-user'
    );

  });

});