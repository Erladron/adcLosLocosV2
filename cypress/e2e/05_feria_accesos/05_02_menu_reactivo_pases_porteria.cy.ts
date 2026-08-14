describe("TestCase; 05_02_menu_reactivo_pases_porteria", () => {
  const SOCIO_EMAIL = 'felipe.novato@adcloslocos.com';
  const SOCIO_PASSWORD = 'PasswordSegura123!';
  const EVENT_NAME = 'Feria de Camas 2026';
  
  const PORTERO_EMAIL = 'portero.fundador@adcloslocos.com'; 
  const PORTERO_PASSWORD = 'PasswordSegura123!';

  it("PASO 1: Asistir a un evento, revisar pases y validar acesso con porteria", () => {
    
    // -------------------------------------------------------------------------
    // 🙋‍♂️ PARTE 1: EL SOCIO ENTRA, SE APUNTA Y CAPTURA SU CÓDIGO QR
    // -------------------------------------------------------------------------
    
    // 🎯 REPARADO: Usamos tu comando login personalizado
    cy.login(SOCIO_EMAIL, SOCIO_PASSWORD);

    // Verificamos que entramos a la Home de manera limpia
    cy.url().should('include', '/home');
    cy.get('[data-cy="home-page-content"]').should('be.visible');

    // Navegar a la pantalla de listado de eventos usando el botón de la Home
    cy.get('[data-cy="quick-card-eventos"]').should('be.visible').click();
    cy.url().should('include', '/events');

    // Click en la tarjeta del evento de la Feria
    cy.contains('.event-minimal-card', EVENT_NAME).should('be.visible').click({ force: true });
    cy.url().should('include', '/events/');

    // Confirmar asistencia pulsando "Asistiré"[cite: 5]
    cy.get('[data-cy="btn-confirm-attendance"]').should('be.visible').click({ force: true });
    cy.get("ion-toast", { includeShadowDom: true }).should("exist");

    // Abrir menú hamburguesa lateral
    cy.get('[data-cy="header-menu-button"]').filter(':visible').first().click({ force: true });
    cy.wait(500); 

    // Navegar a "Mis Pases Digitales" usando tu data-cy real[cite: 7]
    cy.get('[data-cy="menu-item-pases"]').should('be.visible').click({ force: true });
    cy.wait(600);
    cy.url().should('include', '/user-passes');

    // Abrir el modal del QR dentro de la tarjeta activa[cite: 6]
    cy.get('[data-cy="passe-page-content"]').within(() => {
      cy.get('[data-cy="btn-open-qr-modal"]').should('be.visible').click({ force: true });
    });
    cy.wait(600); 

    // Capturar el código alfanumérico dinámico del modal para la portería[cite: 6]
    cy.get('[data-cy="qr-manual-code-text"]')
      .should('be.visible')
      .invoke('text')
      .then((textoCodigo) => {
        const codigoQR = textoCodigo.trim();
        cy.log(`🔑 CÓDIGO CAPTURADO CON ÉXITO: ${codigoQR}`);

        // Cerrar el modal pulsando el aspa[cite: 6]
        cy.get('[data-cy="btn-close-qr-modal"]').should('be.visible').click({ force: true });
        cy.wait(500);

        // -------------------------------------------------------------------------
        // 🚪 LOGOUT DEL SOCIO (Usando tu comando inteligente)
        // -------------------------------------------------------------------------
        // 🎯 REPARADO: Ejecutamos tu comando logout que limpia el LocalStorage,
        // SessionStorage, hace los clicks correspondientes y valida la redirección[cite: 8]
        cy.logout();

        // -------------------------------------------------------------------------
        // 👮 PARTE 2: EL PORTERO ENTRA POR CLICS Y VALIDA EL ACCESO
        // -------------------------------------------------------------------------
        
        // 🎯 REPARADO: Volvemos a usar tu comando login para el Portero[cite: 8]
        cy.login(PORTERO_EMAIL, PORTERO_PASSWORD);

        // Verificamos que el portero entra correctamente a la Home
        cy.url().should('include', '/event-scan');
        cy.get('[data-cy="scanner-page-content"]').should('be.visible');

        // Escribimos el código rescatado en el input manual de validación
        cy.get('[data-cy="input-scan-manual-id"]')
          .clear({ force: true })
          .type(codigoQR, { force: true });

        // Validamos el acceso en portería
        cy.get('[data-cy="btn-scan-manual-submit"]').click({ force: true });

        cy.window().then((win) => {
          cy.stub(win.navigator, 'vibrate').returns(true);
        });

        cy.get('ion-toast', { includeShadowDom: true }).should('exist');
      });
  });
});