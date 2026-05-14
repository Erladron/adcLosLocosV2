describe('Detalle usuario', () => {

  it('Debe abrir el detalle de un usuario', () => {

    // =================================
    // LOGIN
    // =================================

    cy.visit('/login');

    cy.get('ion-input input')
      .eq(0)
      .type('admin@test.com');

    cy.get('ion-input input')
      .eq(1)
      .type('123456');

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
    // IR A USUARIOS
    // =================================

    cy.contains('Usuarios')
      .should('be.visible')
      .click();

    // =================================
    // VALIDAR RUTA
    // =================================

    cy.url().should(
      'include',
      '/gest-user'
    );

    // =================================
    // VALIDAR LISTADO
    // =================================

    cy.get('.user-card')
      .should(
        'have.length.at.least',
        1
      );

    // =================================
    // ABRIR PRIMER USUARIO
    // =================================

    cy.get('.user-card')
      .first()
      .click();

    // =================================
    // VALIDAR DETALLE
    // =================================

    cy.url().should(
      'include',
      '/user-detail'
    );

    // =================================
    // VALIDAR HEADER
    // =================================

    cy.get('.header-section')
      .should('exist');

    // =================================
    // VALIDAR TABS
    // =================================

    cy.contains('Personales')
      .should('exist');

    cy.contains('Credenciales')
      .should('exist');

    cy.contains('Membresía')
      .should('exist');

  });

});