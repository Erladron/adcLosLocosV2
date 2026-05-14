describe('Editar usuario', () => {

    it('Debe editar el nombre de un usuario y restaurarlo', () => {

        let nombreOriginal = '';

        const nombreTemporal =
            'Usuario Test Cypress';

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
        // MENU
        // =================================

        cy.get('ion-menu-button')
            .click();

        // =================================
        // USERS
        // =================================

        cy.contains('Usuarios')
            .click();

        // =================================
        // VALIDAR RUTA
        // =================================

        cy.url().should(
            'include',
            '/gest-user'
        );

        // =================================
        // ABRIR USER
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
        // LEER NOMBRE ORIGINAL
        // =================================

        cy.get('.section-card')
            .first()
            .find('input')
            .first()
            .should(($input) => {

                expect(
                    ($input[0] as HTMLInputElement)
                        .value
                ).to.not.equal('');

            })
            .then(($input) => {

                nombreOriginal =
                    ($input[0] as HTMLInputElement)
                        .value;

            });

        // =================================
        // EDITAR
        // =================================

        cy.contains('Editar')
            .click();

        // =================================
        // MODIFICAR NOMBRE
        // =================================

        cy.get('.section-card')
            .first()
            .find('input')
            .first()
            .click()
            .type('{selectall}{backspace}')
            .type(nombreTemporal);

        // =================================
        // GUARDAR
        // =================================

        cy.contains('Guardar Datos')
            .click();

        // =================================
        // VALIDAR CAMBIO
        // =================================

        cy.contains(nombreTemporal)
            .should('exist');

        // =================================
        // REEDITAR
        // =================================

        cy.contains('Editar')
            .click();

        // =================================
        // RESTAURAR NOMBRE
        // =================================

        cy.get('.section-card')
            .first()
            .find('input')
            .first()
            .click()
            .type('{selectall}{backspace}')
            .type(nombreOriginal);

        // =================================
        // GUARDAR ORIGINAL
        // =================================

        cy.contains('Guardar Datos')
            .click();

        // =================================
        // VALIDAR RESTAURADO
        // =================================

        cy.contains(nombreOriginal)
            .should('exist');

    });

});