describe('TestCase: 05_01_alta_evento_ctrl_acceso', () => {

    const ano: string = new Date().getFullYear().toString();
    const tituloEvento = 'Feria de Camas ' + ano;
    const descripcionEvento = 'Ven a psar un buen rato a la feria de Camas en compañia de la gente mas loca del pueblo.';

    beforeEach(() => {
        cy.login('admin.fundador@adcloslocos.com', 'PasswordSegura123!');

        cy.url({ timeout: 15000 }).should('include', '/home');
        cy.get('[data-cy="home-page-content"]').should('be.visible');
    });

    it('PASO 1: Debe crear un nuevo evento Feria y verificar que se muestra en el listado', () => {

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
            .contains('Feria', { matchCase: false })
            .click({ force: true });

        cy.wait(400); // Pausa de asentamiento para que Angular asimile el cambio en el formulario reactivo

        // Evento exclusivo para socios (Toggle)
        cy.get('[data-cy="form-toggle-access-control"]').click({ force: true });

        // =========================================================================
        // 🎪 CAMPO ESPECÍFICO DE FERIA: LÍMITE DE INVITADOS
        // =========================================================================
        // Escribimos el cupo obligatorio para que el formulario pase a ser VALID
        cy.get('[data-cy="form-input-limit-guests"]')
            .clear({ force: true })
            .type('1', { force: true });


        // -------------------------------------------------------------------------
        // 🏁 1. FECHA Y HORA DE INICIO: Ahora mismo (formato local)
        // -------------------------------------------------------------------------
        cy.get('[data-cy="form-popover-trigger-start"]').click({ force: true });
        cy.wait(600);

        cy.get('ion-popover #startDatePicker').then(($el) => {
            const datetimeEl = $el[0] as any;

            const hoy = new Date();
            // Sumamos un par de minutos para evitar cualquier milisegundo de retraso con el validador
            hoy.setMinutes(hoy.getMinutes() + 2);

            const ano = hoy.getFullYear();
            const mes = String(hoy.getMonth() + 1).padStart(2, '0'); 
            const dia = String(hoy.getDate()).padStart(2, '0');      
            const hora = String(hoy.getHours()).padStart(2, '0');
            const minutos = String(hoy.getMinutes()).padStart(2, '0');

            // Formato local puro sin "Z": YYYY-MM-DDTHH:mm:00
            const fechaIni = `${ano}-${mes}-${dia}T${hora}:${minutos}:00`;

            datetimeEl.value = fechaIni;

            datetimeEl.dispatchEvent(new CustomEvent('ionChange', {
                detail: { value: fechaIni }
            }));

            if (datetimeEl.confirm) {
                datetimeEl.confirm(true);
            }
        });

        cy.wait(600); // Colchón de asentamiento para Angular
        // -------------------------------------------------------------------------
        // 🏁 2. FECHA Y HORA DE FIN: Hoy + 3 días
        // -------------------------------------------------------------------------
        cy.get('[data-cy="form-popover-trigger-end"]').click({ force: true });
        cy.wait(600);

        cy.get('ion-popover #endDatePicker').then(($el) => {
            const datetimeEl = $el[0] as any;

            // Calculamos exactamente hoy + 3 días usando milisegundos de manera segura
            const hoyMasTresDias = new Date(Date.now() + (3 * 24 * 60 * 60 * 1000));

            const ano = hoyMasTresDias.getFullYear();
            const mes = String(hoyMasTresDias.getMonth() + 1).padStart(2, '0'); 
            const dia = String(hoyMasTresDias.getDate()).padStart(2, '0');      
            const hora = String(hoyMasTresDias.getHours()).padStart(2, '0');
            const minutos = String(hoyMasTresDias.getMinutes()).padStart(2, '0');

            // Formato local puro sin "Z": YYYY-MM-DDTHH:mm:00
            const fechaFin = `${ano}-${mes}-${dia}T${hora}:${minutos}:00`;

            datetimeEl.value = fechaFin;

            datetimeEl.dispatchEvent(new CustomEvent('ionChange', {
                detail: { value: fechaFin }
            }));

            if (datetimeEl.confirm) {
                datetimeEl.confirm(true);
            }
        });
        cy.wait(600); // Colchón final de renderizado

        // Descripción del evento
        // Buscamos el elemento nativo textarea oculto en el interior del componente de Ionic
        cy.get('[data-cy="form-textarea-description"]')
            .find('textarea')
            .type(descripcionEvento, { force: true });

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
    it('PASO 2: Debe denegar fechas en el pasado o incoherentes lanzando las alertas ion-toast', () => {
        // 1. Navegamos directo al alta de eventos
        cy.get('[data-cy="quick-card-eventos"]').should('be.visible').click();
        cy.get('[data-cy="btn-create-event-fab"]').should('be.visible').click();
        cy.get('[data-cy="event-form"]').should('be.visible');

        // Rellenamos título y seleccionamos tipo para inicializar validadores
        cy.get('[data-cy="form-input-title"]').type('Evento Errores Temporales', { force: true });
        // 1. Hacemos click real en el selector de Ionic para que despliegue el Popover
        cy.get('[data-cy="form-select-type"]').click({ force: true });
        cy.wait(500); // Pequeño colchón obligatorio para la animación de apertura del popover

        // 2. Buscamos la opción correspondiente dentro del contenedor flotante que dibuja Ionic
        // Nota: Puedes usar 'ion-select-option' o atacar directamente al texto del item en el popover
        cy.get('ion-popover ion-item, ion-popover button')
            .contains('Asamblea', { matchCase: false })
            .click({ force: true });

        // -------------------------------------------------------------------------
        // 🏁 1. FECHA Y HORA DE INICIO: Menor que hoy (formato local)
        // -------------------------------------------------------------------------
        cy.get('[data-cy="form-popover-trigger-start"]').click({ force: true });
        cy.wait(600);

        cy.get('ion-popover #startDatePicker').then(($el) => {
            const datetimeEl = $el[0] as any;

            const hoy = new Date();
            // Sumamos un par de minutos para evitar cualquier milisegundo de retraso con el validador
            hoy.setMinutes(hoy.getMinutes() + 2);

            const ano = hoy.getFullYear();
            const mes = String(hoy.getMonth() + 1).padStart(2, '0'); 
            const dia = String(hoy.getDate() - 1).padStart(2, '0');      
            const hora = String(hoy.getHours()).padStart(2, '0');
            const minutos = String(hoy.getMinutes()).padStart(2, '0');

            // Formato local puro sin "Z": YYYY-MM-DDTHH:mm:00
            const fechaIni = `${ano}-${mes}-${dia}T${hora}:${minutos}:00`;

            datetimeEl.value = fechaIni;

            datetimeEl.dispatchEvent(new CustomEvent('ionChange', {
                detail: { value: fechaIni }
            }));

            if (datetimeEl.confirm) {
                datetimeEl.confirm(true);
            }
        });

        cy.wait(600); // Colchón de asentamiento para Angular
        
        // Verificamos que salta el feedback nativo en pantalla de la Peña
        cy.get('ion-toast', { includeShadowDom: true }).should('exist');
        cy.wait(600); // Pausa de asentamiento

        // -------------------------------------------------------------------------
        // 🏁 2. FECHA Y HORA DE FIN: Anterior a inicio
        // -------------------------------------------------------------------------
        cy.get('[data-cy="form-popover-trigger-end"]').click({ force: true });
        cy.wait(600);

        cy.get('ion-popover #endDatePicker').then(($el) => {
            const datetimeEl = $el[0] as any;

            // Calculamos exactamente hoy + 3 días usando milisegundos de manera segura
            const hoyMasTresDias = new Date(Date.now() + (3 * 24 * 60 * 60 * 1000));

            const ano = hoyMasTresDias.getFullYear();
            const mes = String(hoyMasTresDias.getMonth() + 1).padStart(2, '0'); 
            const dia = String(hoyMasTresDias.getDate() - 2).padStart(2, '0');      
            const hora = String(hoyMasTresDias.getHours()).padStart(2, '0');
            const minutos = String(hoyMasTresDias.getMinutes()).padStart(2, '0');

            // Formato local puro sin "Z": YYYY-MM-DDTHH:mm:00
            const fechaFin = `${ano}-${mes}-${dia}T${hora}:${minutos}:00`;

            datetimeEl.value = fechaFin;

            datetimeEl.dispatchEvent(new CustomEvent('ionChange', {
                detail: { value: fechaFin }
            }));

            if (datetimeEl.confirm) {
                datetimeEl.confirm(true);
            }
        });
        cy.wait(600); // Colchón final de renderizado

        // Verificamos el bloqueo o toast reactivo del sistema ante rangos cruzados
        cy.get('ion-toast', { includeShadowDom: true }).should('exist');
    });
});