describe("Eliminación de Eventos (Admin) - 04_03_admin_eliminacion_eventos.cy.ts", () => {
  const ADMIN_EMAIL = "admin.fundador@adcloslocos.com";
  const ADMIN_PASSWORD = "PasswordSegura123!";
  
  // Sincronizado con el alta del test 04_01
  const EVENT_TO_DELETE_NAME = "Asamblea General Ordinaria 2026";

  beforeEach(() => {
    cy.login(ADMIN_EMAIL, ADMIN_PASSWORD);
    cy.visit("/events"); 
    cy.get('[data-cy="events-page-content"]').should('be.visible');
  });

  it("Debería eliminar un evento y verificar su desaparición del listado", () => {
    // Localizar el evento real en las tarjetas dinámicas del HTML
    cy.contains('[data-cy="event-card"]', EVENT_TO_DELETE_NAME).should('be.visible').click({ force: true });
    cy.url().should("include", "/events/");

    // Pulsar el botón unívoco de eliminación dentro de la vista de lectura
    cy.get('[data-cy="btn-delete-event"]').should('be.visible').click({ force: true });
    cy.wait(300); 

    // 🎯 CORRECCIÓN INTEGRAL: Atacamos el diálogo emergente rompiendo el Shadow DOM de Ionic
    // Buscamos el texto exacto del botón que se renderiza en tu interfaz de la Peña
    cy.get('ion-alert', { includeShadowDom: true })
      .find('button')
      .contains('SÍ, CANCELAR Y NOTIFICAR', { matchCase: false })
      .click({ force: true });

    // Verificar el retorno exitoso al listado general de eventos
    cy.url().should("include", "/events");
    cy.get('[data-cy="events-page-content"]').should('be.visible');

    // Verificar de manera robusta que la tarjeta ya no existe en el contenedor de la lista
    cy.get('[data-cy="events-list-wrapper"]').should("not.contain", EVENT_TO_DELETE_NAME);
  });
});