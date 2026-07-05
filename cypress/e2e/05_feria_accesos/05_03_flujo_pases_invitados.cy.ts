describe('Flujo de Acceso para Invitados (Feria) - 05_03_flujo_pases_invitados.cy.ts', () => {
  const INVITADO_EMAIL = 'invitado.fundador@adcloslocos.com';
  const INVITADO_PASSWORD = 'PasswordSegura123!';

  it('Debe logarse como invitado, acceder a su invitación por el menú y desplegar el QR en grande', () => {
    
    // 1️⃣ LOGARSE CON EL ROL DE INVITADO
    cy.login(INVITADO_EMAIL, INVITADO_PASSWORD);
    cy.visit('/home');
    cy.get('[data-cy="home-page-content"]').should('be.visible');

    // 2️⃣ DESPLEGAR EL MENÚ LATERAL Y BUSCAR EL ACCESO DE INVITADO
    // Abrimos el menú lateral desde el botón de la cabecera
    cy.get('[data-cy="header-menu-button"]').should('be.visible').click();
    cy.wait(400); // Pausa obligatoria para la animación de Ionic

    // Verificamos y pinchamos en el ítem unívoco de Invitación de Feria
    cy.get('[data-cy="menu-item-fair-guest"]')
      .should('be.visible')
      .and('contain', 'Invitación de Feria')
      .click({ force: true });

    // 3️⃣ VERIFICAR QUE ENTRA A LA PANTALLA Y RENDERIZA EL CARNET DE INVITADO
    // Validamos la redirección a la ruta correspondiente de la feria
    cy.url().should('include', '/fair');
    cy.get('[data-cy="fair-page-content"]').should('be.visible');

    // Certificamos que los títulos cambian al modo invitación individual
    cy.get('[data-cy="fair-theme-title"]').should('contain', 'INVITACIÓN INDIVIDUAL DE ACCESO');

    // Inspeccionamos la tarjeta asegurando que tiene la clase reactiva de invitado
    cy.get('[data-cy="fair-pass-card"]')
      .should('be.visible')
      .and('have.class', 'is-guest-card'); // Confirma el tipado visual

    // 4️⃣ CLIC EN EL QR MINI Y COMPROBACIÓN DEL MODAL EN GRANDE
    // Pulsamos en el panel interactivo del código QR de la derecha
    cy.get('[data-cy="btn-open-qr-modal"]').should('be.visible').click({ force: true });
    cy.wait(500); // Esperamos a que el ion-modal termine de subir a la pantalla

    // Validamos que el cuadro de diálogo flotante se muestra correctamente
    cy.get('[data-cy="fair-qr-modal"]').should('be.visible');

    // Certificamos que el contenedor del código QR en pantalla completa es perfectamente visible
    cy.get('[data-cy="qr-fullscreen-container"]').should('be.visible');

    // Comprobamos que el texto de validación manual o de pie de modal está en su sitio
    cy.get('[data-cy="qr-manual-code-text"]').should('be.visible');

    // 5️⃣ CIERRE CONTROLADO DEL VISOR
    // Pulsamos el aspa superior para cerrar el modal y no bloquear futuros tests
    cy.get('[data-cy="btn-close-qr-modal"]').should('be.visible').click({ force: true });
    cy.wait(400); // Esperamos a que se desvanezca

    // Aseguramos que la pantalla vuelve a quedar despejada
    cy.get('[data-cy="fair-qr-modal"]').should('not.be.visible');
  });
});