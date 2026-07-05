describe('👮 ROL: Administrador - Alta de Nueva Convocatoria de Evento', () => {

    const ano: string = new Date().getFullYear().toString();
    const tituloEvento = 'Feria de Camas ' + ano;
    const descripcionEvento = 'Ven a psar un buen rato a la feria de Camas en compañia de la gente mas loca del pueblo.';

    beforeEach(() => {
        cy.login('admin.fundador@adcloslocos.com', 'PasswordSegura123!');

        cy.url({ timeout: 15000 }).should('include', '/home');
        cy.get('[data-cy="home-page-content"]').should('be.visible');
    });

    it('Debe crear un nuevo evento Feria y verificar que se muestra en el listado', () => {

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
        cy.get('[data-cy="form-select-type"]').select('feria', { force: true });

        // =========================================================================
        // 🎪 CAMPO ESPECÍFICO DE FERIA: LÍMITE DE INVITADOS
        // =========================================================================
        // Escribimos el cupo obligatorio para que el formulario pase a ser VALID
        cy.get('[data-cy="form-input-limit-guests"]')
          .clear({ force: true })
          .type('2', { force: true });


        // =========================================================================
        // 📆 CONTROL DE TIEMPOS QUIRÚRGICO: INICIO (AHORA + 1 MIN) Y FIN (HOY + 3 DÍAS)
        // =========================================================================

        // -------------------------------------------------------------------------
        // 🏁 1. FECHA Y HORA DE INICIO: Ahora mismo + 2 minuto
        // -------------------------------------------------------------------------
        cy.get('[data-cy="form-popover-trigger-start"]').click({ force: true });
        cy.wait(600);

        cy.get('ion-popover #startDatePicker').then(($el) => {
            const datetimeEl = $el[0] as any;
            
            // ⏰ Ahora mismo + 120.000 milisegundos (2 minutos)
            const fechaInicio = new Date(Date.now() + (120 * 1000)).toISOString();
            
            datetimeEl.value = fechaInicio;
            
            // Encolamos el evento pasándole el identificador 'startDate'
            datetimeEl.dispatchEvent(new CustomEvent('ionChange', {
                detail: { value: fechaInicio }
            }));

            if (datetimeEl.confirm) datetimeEl.confirm(true);
        });
        cy.wait(600); // Pausa de asentamiento entre popovers

        // -------------------------------------------------------------------------
        // 🏁 2. FECHA Y HORA DE FIN: Hoy + 3 días
        // -------------------------------------------------------------------------
        cy.get('[data-cy="form-popover-trigger-end"]').click({ force: true });
        cy.wait(600);

        cy.get('ion-popover #endDatePicker').then(($el) => {
            const datetimeEl = $el[0] as any;
            
            // 📅 Hoy + 3 días
            const fechaFin = new Date(Date.now() + (3 * 24 * 60 * 60 * 1000)).toISOString();
            
            datetimeEl.value = fechaFin;
            
            // Encolamos el evento pasándole el identificador 'endDate'
            datetimeEl.dispatchEvent(new CustomEvent('ionChange', {
                detail: { value: fechaFin }
            }));

            if (datetimeEl.confirm) datetimeEl.confirm(true);
        });
        cy.wait(600); // Colchón final de renderizado

        cy.wait(600); // Colchón de asentamiento para que el popover desaparezca y Angular procese el estado

        // Descripción del evento
        cy.get('[data-cy="form-textarea-description"]').type(descripcionEvento, { force: true });

        // Evento exclusivo para socios (Toggle)
        cy.get('[data-cy="form-toggle-private"]').click({ force: true });

        // 4️⃣ UBICACIÓN POSTAL / SEDE
        cy.get('[data-cy="form-input-location-name"]').type('Caseta La Locura', { force: true });

        // =========================================================================
        // 📜 EL TRUCO DEL SCROLL REAL EN IONIC
        // =========================================================================
        cy.get('ion-content').filter(':visible').then(($content) => {
            if ($content[0] && ($content[0] as any).scrollToBottom) {
                ($content[0] as any).scrollToBottom(300);
            }
        });
        cy.wait(400); // Pequeña pausa para que termine el desplazamiento visual

        // 🗺️ TRATAMIENTO DEL BUSCADOR MAPBOX
        cy.get('[data-cy="form-input-location-address"]')
            .clear({ force: true })
            .type('Ferrocarril Camas', { force: true, delay: 150 });

        cy.get('[data-cy="form-address-predictions"]', { timeout: 8000 }).should('be.visible');
        cy.get('[data-cy="form-address-predictions"] ion-item').first().click({ force: true });

        cy.wait(500);

        // 5️⃣ GUARDAR CONVOCATORIA
        cy.get('[data-cy="form-btn-save"]').should('not.be.disabled').click({ force: true });

        // 6️⃣ VERIFICACIÓN FINAL EN EL LISTADO GENERAL
        cy.url({ timeout: 10000 }).should('not.include', '/new');
        cy.url().should('include', '/events');
        cy.get('[data-cy="event-card"]').should('contain', tituloEvento);
    });

    // =========================================================================
    // 🛡️ ESCENARIO 1: VALIDACIÓN Y AUTO-CORRECCIÓN DE TIEMPOS INCOHERENTES
    // =========================================================================
    it('Caso B: Debe denegar fechas en el pasado o incoherentes lanzando las alertas ion-toast', () => {
        // 1. Navegamos directo al alta de eventos
        cy.get('[data-cy="quick-card-eventos"]').should('be.visible').click();
        cy.get('[data-cy="btn-create-event-fab"]').should('be.visible').click();
        cy.get('[data-cy="event-form"]').should('be.visible');

        // Rellenamos título y seleccionamos tipo para inicializar validadores
        cy.get('[data-cy="form-input-title"]').type('Evento Errores Temporales', { force: true });
        cy.get('[data-cy="form-select-type"]').select('asamblea', { force: true });

        // 2. FORZAR FECHA DE INICIO EN EL PASADO (Ayer)
        cy.get('[data-cy="form-popover-trigger-start"]').click({ force: true });
        cy.wait(500);

        cy.get('ion-popover #startDatePicker').then(($el) => {
            const datetimeEl = $el[0] as any;
            const fechaPasada = new Date(Date.now() - (24 * 60 * 60 * 1000)).toISOString(); // 24h atrás
            
            datetimeEl.value = fechaPasada;
            datetimeEl.dispatchEvent(new CustomEvent('ionChange', {
                detail: { value: fechaPasada }
            }));
            if (datetimeEl.confirm) datetimeEl.confirm(true);
        });

        // Verificamos que salta el feedback nativo en pantalla de la Peña
        cy.get('ion-toast', { includeShadowDom: true }).should('exist');
        cy.wait(600); // Pausa de asentamiento

        // 3. FORZAR FECHA DE FIN ANTERIOR A LA FECHA DE INICIO
        // Abrimos popover de finalización
        cy.get('[data-cy="form-popover-trigger-end"]').click({ force: true });
        cy.wait(500);

        cy.get('ion-popover #endDatePicker').then(($el) => {
            const datetimeEl = $el[0] as any;
            const fechaFinAbsurda = new Date(Date.now() - (48 * 60 * 60 * 1000)).toISOString(); // Dos días atrás
            
            datetimeEl.value = fechaFinAbsurda;
            datetimeEl.dispatchEvent(new CustomEvent('ionChange', {
                detail: { value: fechaFinAbsurda }
            }));
            if (datetimeEl.confirm) datetimeEl.confirm(true);
        });

        // Verificamos el bloqueo o toast reactivo del sistema ante rangos cruzados
        cy.get('ion-toast', { includeShadowDom: true }).should('exist');
    });
});