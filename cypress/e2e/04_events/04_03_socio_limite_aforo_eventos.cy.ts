describe('TestCase: 04_03_socio_limite_aforo_eventos.cy.ts', () => {
  const SOCIO_EMAIL = 'socio.fundador@adcloslocos.com';
  const SOCIO_PASSWORD = 'PasswordSegura123!';
  const EVENT_NAME = 'Asamblea General Ordinaria 2026';

  beforeEach(() => {
    cy.login(SOCIO_EMAIL, SOCIO_PASSWORD);
  });

  it('PASO 1: Evento con aforo completo - Botón de Aforo Completo bloqueado', () => {

    // 1️⃣ NAVEGAR DIRECTAMENTE DESDE LOS BOTONES DE LA HOME
    cy.get('[data-cy="quick-card-eventos"]').should('be.visible').click();
    cy.url().should('include', '/events');
    cy.get('[data-cy="events-page-content"]').should('be.visible');


    cy.get('[data-cy="events-page-content"]').should('be.visible');

    cy.contains('[data-cy="event-card"]', EVENT_NAME).should('be.visible').click({ force: true });

    // Gracias al ngContainer reactivo del HTML, cuando el evento se llena 
    // se dibuja el botón alternativo con la marca 'btn-event-full' deshabilitado
    cy.get('[data-cy="btn-confirm-attendance"]')
      .should('be.visible')
      .and('be.disabled')
      .and('contain', 'Aforo Completo');
  });
});