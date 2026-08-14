describe('TestCase: 05_04_porteria_scan_manual_erroneo', () => {

  beforeEach(() => {
    // 1️⃣ Autenticación usando la cuenta máster de Portero sembrada en tu JSON
    cy.login('portero.fundador@adcloslocos.com', 'PasswordSegura123!');
    
    // 2️⃣ Navegación directa al terminal operativo de escaneo de pases
    cy.visit('/event-scan');
  });

  it('PASO 1: Debe de pintarse la pantalla en rojo', () => {
    
    // 1️⃣ AUDITORÍA DE UI: Validamos que la consola física de contingencia alternativa esté visible
    cy.get('.manual-entry-console').should('be.visible');

    // 2️⃣ CAPTURA: Buscamos el input nativo dentro de la consola y tecleamos un código erróneo o inventado
    cy.get('.manual-entry-console input')
      .should('be.visible')
      .type('99999999X', { force: true });

    // 3️⃣ ACCIONAMIENTO: El botón de validar se desbloquea tras el input y procedemos a pulsar
    cy.get('.manual-entry-console .btn-validate')
      .should('not.be.disabled')
      .click({ force: true });

    // 4️⃣ FEEDBACK RADICAL MOBILE: Verificamos que emerge el layout a pantalla completa de error
    // Este panel bloquea el terminal con fondo rojo (.error-bg) para alertar visualmente al portero
    cy.get('.feedback-fullscreen')
      .should('be.visible')
      .and('have.class', 'error-bg');

    // 5️⃣ Integridad del contenido del feedback de denegación
    cy.get('.feedback-content').should('be.visible');
  });

});