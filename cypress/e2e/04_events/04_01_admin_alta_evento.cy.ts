describe('TestCase: 04_01_admin_alta_evento', () => {

    const tituloEvento = 'Asamblea General Ordinaria 2026';
    const descripcionEvento = 'Convocatoria anual para todos los socios de la Peña para debatir los presupuestos y el calendario de eventos del año.';

    beforeEach(() => {
        cy.login('admin.fundador@adcloslocos.com', 'PasswordSegura123!');

        cy.url({ timeout: 15000 }).should('include', '/home');
        cy.get('[data-cy="home-page-content"]').should('be.visible');
    });

    it('PASO 1: Debe crear una nueva asamblea exclusiva para socios y verificar que se muestra en el listado', () => {

        // 1️⃣ NAVEGAR DIRECTAMENTE DESDE LOS BOTONES DE LA HOME
        cy.get('[data-cy="quick-card-eventos"]').should('be.visible').click();
        cy.url().should('include', '/events');
        cy.get('[data-cy="events-page-content"]').should('be.visible');

        // 2️⃣ ABRIR EL FORMULARIO DE ALTA (FAB BUTTON DE EVENTOS)
        cy.get('[data-cy="btn-create-event-fab"]').should('be.visible').click();
        cy.url().should('include', '/events/new');
        cy.get('[data-cy="event-form"]').should('be.visible');

        // 3️⃣ RELLENAR DATOS PRINCIPALES DEL EVENTO
        // Título del evento
        cy.get('[data-cy="form-input-title"]').type(tituloEvento, { force: true });

        // Tipo de evento

        // 1. Hacemos click real en el selector de Ionic para que despliegue el Popover
        cy.get('[data-cy="form-select-type"]').click({ force: true });
        cy.wait(500); // Pequeño colchón obligatorio para la animación de apertura del popover

        // 2. Buscamos la opción correspondiente dentro del contenedor flotante que dibuja Ionic
        // Nota: Puedes usar 'ion-select-option' o atacar directamente al texto del item en el popover
        cy.get('ion-popover ion-item, ion-popover button')
            .contains('Asamblea', { matchCase: false })
            .click({ force: true });

        cy.wait(400); // Pausa de asentamiento para que Angular asimile el cambio en el formulario reactivo

        // Marcamos el checkbox de que dura todo el día de forma interactiva
        cy.get('[data-cy="form-checkbox-allday"]').click({ force: true });

        // =========================================================================
        // 📆 DISPARO CONTROLADO DEL EVENTO DE FECHA EN FORMATO LOCAL PURO
        // =========================================================================
        cy.get('[data-cy="form-popover-trigger-start"]').click({ force: true });
        cy.wait(600);

        cy.get('ion-popover #startDatePicker').then(($el) => {
            
            const datetimeEl = $el[0] as any;

            // 🎯 REPARACIÓN DE PASO DE DATOS: Construimos un formato de texto local (YYYY-MM-DD)
            // idéntico al que genera tu navegador cuando haces click manual en el componente.
            const hoy = new Date();
            const ano = hoy.getFullYear();
            const mes = String(hoy.getMonth() + 1).padStart(2, '0');
            const dia = String(hoy.getDate()).padStart(2, '0');

            // Le pasamos solo la fecha y una hora plana local sin la "Z" universal de JavaScript
            const fechaIni = `${ano}-${mes}-${dia}T12:00:00`;

            datetimeEl.value = fechaIni;

            datetimeEl.dispatchEvent(new CustomEvent('ionChange', {
                
                detail: { value: fechaIni }
            }));

            if (datetimeEl.confirm) {
                
                datetimeEl.confirm(true);
            }
        });

        cy.wait(600); // Colchón de asentamiento para Angular

        // Descripción del evento
        // Buscamos el elemento nativo textarea oculto en el interior del componente de Ionic
        cy.get('[data-cy="form-textarea-description"]')
            .find('textarea')
            .type(descripcionEvento, { force: true });

        // Evento exclusivo para socios (Toggle)
        cy.get('[data-cy="form-toggle-private"]').click({ force: true });

        // Aforo y plazas
        cy.get('[data-cy="form-input-max-attendees"]')
            .clear({ force: true })
            .type('1', { force: true });

        // 4️⃣ UBICACIÓN POSTAL / SEDE
        cy.get('[data-cy="form-input-location-name"]').type('Sede Peña Los Locos', { force: true });

        // 🗺️ TRATAMIENTO DEL BUSCADOR MAPBOX (Fuera del within para evitar bloqueos)
        // 4️⃣ UBICACIÓN POSTAL / SEDE
        cy.get('[data-cy="form-input-location-name"]').type('Sede Peña Los Locos', { force: true });

        // =========================================================================
        // 📜 EL TRUCO DEL SCROLL REAL EN IONIC
        // =========================================================================
        // Le pedimos al componente ion-content de la pantalla activa que baje el scroll 
        // de forma nativa a través de la ventana de la aplicación para destapar las credenciales
        cy.get('ion-content').filter(':visible').then(($content) => {
            // CORRECCIÓN: Validamos que el elemento existe y tiene el método de Ionic
            if ($content[0] && ($content[0] as any).scrollToBottom) {
                ($content[0] as any).scrollToBottom(300);
            }
        });
        cy.wait(400); // Pequeña pausa para que termine el desplazamiento visual

        // 🗺️ TRATAMIENTO DEL BUSCADOR MAPBOX (Corregido con los selectores reales de tu HTML)
        // 1. Escribimos en el input real de la dirección con delay humano
        cy.get('[data-cy="form-input-location-address"]')
            .clear({ force: true })
            .type('Camas', { force: true, delay: 150 });

        // 2. Esperamos a que el listado predictivo oficial de Mapbox se despliegue y sea visible
        cy.get('[data-cy="form-address-predictions"]', { timeout: 8000 }).should('be.visible');

        // 3. Pinchamos de forma interactiva en el primer elemento sugerido de la lista
        cy.get('[data-cy="form-address-predictions"] ion-item').first().click({ force: true });

        cy.wait(500); // Pausa de asentamiento para que Angular asimile el objeto de la dirección

        // 5️⃣ GUARDAR CONVOCATORIA
        // Con la fecha procesada e inyectada en el formulario reactivo, el botón se habilita
        cy.get('[data-cy="form-btn-save"]').should('not.be.disabled').click({ force: true });

        // 6️⃣ VERIFICACIÓN FINAL EN EL LISTADO GENERAL
        cy.url({ timeout: 10000 }).should('not.include', '/new');
        cy.url().should('include', '/events');

        // Verificamos que la tarjeta con el título aparece en la vista
        cy.get('[data-cy="event-card"]').should('contain', tituloEvento);
    });
});