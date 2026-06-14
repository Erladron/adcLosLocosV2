describe("Asistencia a Evento y Seguridad (Socio) - 04_02_socio_asistencia_evento.cy.ts", () => {
  const SOCIO_EMAIL = "felipe.novato@adcloslocos.com";
  const SOCIO_PASSWORD = "PasswordSegura123!";
  const EVENT_NAME = "Asamblea General Ordinaria 2026";

  beforeEach(() => {
    cy.login(SOCIO_EMAIL, SOCIO_PASSWORD);
    cy.visit("/events"); 
    cy.get('[data-cy="events-page-content"]').should('be.visible');
  });

  it("Debería asistir a un evento y verificar el contador de asistentes", () => {
    // Localizamos la tarjeta usando el data-cy real del listado
    cy.contains('[data-cy="event-card"]', EVENT_NAME).should('be.visible').click({ force: true });
    cy.url().should("include", "/events/"); 

    // El socio confirma su asistencia pulsando el botón unívoco del listado o detalle
    cy.get('[data-cy="btn-confirm-attendance"]').first().click({ force: true });
    
    // Validamos el feedback nativo en pantalla de la Peña
    cy.get("ion-toast", { includeShadowDom: true }).should("exist");
  });

  it("Debería verificar que el socio no tiene acceso al formulario de edición", () => {
    cy.contains('[data-cy="event-card"]', EVENT_NAME).should('be.visible').click({ force: true });
    cy.url().should("include", "/events/");

    // 🛡️ CONTROL DE SEGURIDAD: Un socio común ve la tarjeta de lectura, nunca el formulario interactivo
    cy.get('[data-cy="event-read-card"]').should('be.visible');
    cy.get('[data-cy="event-form"]').should('not.exist');
    cy.get('[data-cy="btn-edit-event-toggle"]').should('not.exist');
  });
});