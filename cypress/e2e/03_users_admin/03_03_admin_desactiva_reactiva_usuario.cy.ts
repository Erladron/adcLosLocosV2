describe('👮 ROL: Administrador - Desactiva y reactiva usuario', () => {

    const nuevoUsuarioNombre = 'Felipe Novato Test';
    
    beforeEach(() => {
        cy.login('admin.fundador@adcloslocos.com', 'PasswordSegura123!');

        // Esperamos el asentamiento obligatorio en la Home usando tus marcas de tarjetas
        cy.url({ timeout: 15000 }).should('include', '/home');
        cy.get('[data-cy="home-page-content"]').should('be.visible');
    });

    it('Debe gestionar la baja y volver a reactivar al usuario', () => {

         // NAVEGAR AL LISTADO DESDE LA TARJETA EXCLUSIVA DE LA HOME
        cy.get('[data-cy="quick-card-usuarios"]').should('be.visible').click();
        cy.url().should('include', '/gest-user');
        cy.get('[data-cy="gest-user-content"]').should('be.visible');

        // Usamos el buscador unívoco para aislar la tarjeta del socio recién creado
        cy.get('[data-cy="searchbar-users"]').find('input').type(nuevoUsuarioNombre, { force: true });
        cy.wait(600);

        cy.contains('[data-cy="user-card-activo"]', nuevoUsuarioNombre).click({ force: true });
        cy.url().should('include', '/user-detail');

        // Disparamos el flujo del modal de baja lógica
        cy.get('app-user-audit-form ion-button').contains('Dar de baja').click({ force: true });
        cy.wait(300);

        cy.get('ion-alert, body')
            .find('input[placeholder="Motivo de la baja"]')
            .type('Control de calidad automatizado', { force: true });

        cy.get('ion-alert').find('button').last().click({ force: true });
        cy.wait(600);

        // Reactivamos al usuario para dejar la semilla equilibrada
        cy.get('app-user-audit-form ion-button').contains('Reactivar usuario').click({ force: true });
        cy.get('ion-alert').find('button').last().click({ force: true });
        cy.wait(600);

        // 6️⃣ RETORNO SEGURO Y PURGA FINAL DE SESIÓN
        cy.get('[data-cy="header-back-button"]').filter(':visible').first().click({ force: true });
        cy.url().should('include', '/gest-user');

        // Cierre de sesión de bypass radical para evitar conflictos de caché de Ionic
        cy.clearLocalStorage();
        cy.clearCookies();
        cy.visit('/login');
        cy.url().should('include', '/login');
    });
});