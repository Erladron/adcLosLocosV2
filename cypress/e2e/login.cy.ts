describe('Login', () => {

  it('Debe iniciar sesión correctamente', () => {

    cy.visit('/login');

    cy.get('input[type="email"]')
      .type('admin@test.com');

    cy.get('input[type="password"]')
      .type('123456');

    cy.contains('Entrar').click();

    cy.url().should(
      'include',
      '/home'
    );

  });

});