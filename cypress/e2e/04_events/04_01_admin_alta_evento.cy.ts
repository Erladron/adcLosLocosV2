describe('👮 ROL: Administrador - Alta de Nueva Convocatoria de Evento', () => {

    const tituloEvento = 'Asamblea General Ordinaria 2026';
    const descripcionEvento = 'Convocatoria anual para todos los socios de la Peña para debatir los presupuestos y el calendario de eventos del año.';

    beforeEach(() => {
        cy.login('admin.fundador@adcloslocos.com', 'PasswordSegura123!');

        cy.url({ timeout: 15000 }).should('include', '/home');
        cy.get('[data-cy="home-page-content"]').should('be.visible');
    });

    it('Debe crear una nueva asamblea exclusiva para socios y verificar que se muestra en el listado', () => {

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
        cy.get('[data-cy="form-select-type"]').select('asamblea', { force: true });

        // Marcamos el checkbox de que dura todo el día de forma interactiva
        cy.get('[data-cy="form-checkbox-allday"]').click({ force: true });

        // =========================================================================
        // 📆 DISPARO CONTROLADO DEL EVENTO DE FECHA NATIVO
        // =========================================================================
        // 1. Abrimos el popover de forma real para simular el flujo humano
        cy.get('[data-cy="form-popover-trigger-start"]').click({ force: true });
        cy.wait(600);

        // 2. Extraemos el componente ion-datetime, le asignamos la fecha ISO de hoy
        // y disparamos el evento personalizado 'ionChange' que espera tu HTML.
        cy.get('ion-popover #startDatePicker').then(($el) => {
            const datetimeEl = $el[0] as any;
            const hoy = new Date();
            hoy.setDate(hoy.getDate() + 1);
            const fechaIni = hoy.toISOString(); 
            // Forzamos el valor interno del componente de Ionic
            datetimeEl.value = fechaIni;

            // Emitimos el evento nativo 'ionChange' simulando que se ha pulsado Aceptar
            datetimeEl.dispatchEvent(new CustomEvent('ionChange', {
                detail: { value: fechaIni }
            }));

            // Si el componente expone el método confirm, lo llamamos para que cierre el popover visualmente
            if (datetimeEl.confirm) {
                datetimeEl.confirm(true);
            }
        });

        cy.wait(600); // Colchón de asentamiento para que el popover desaparezca y Angular procese el estado

        // Descripción del evento
        cy.get('[data-cy="form-textarea-description"]').type(descripcionEvento, { force: true });

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