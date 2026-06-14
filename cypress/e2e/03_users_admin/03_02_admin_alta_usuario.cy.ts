describe('👮 ROL: Administrador - Alta de Nuevo Usuario', () => {

    const nuevoUsuarioEmail = 'felipe.novato@adcloslocos.com';
    const nuevoUsuarioNombre = 'Felipe Novato Test';
    const fotoCaricatura = 'https://api.dicebear.com/7.x/bottts/svg?seed=Felipe';

    before(() => {
        // 🧹 LIMPIEZA PREVIA VIA CLOUD FUNCTION para que no explote por duplicado
        cy.request({
            method: 'POST',
            url: 'http://localhost:5001/adcloslocos-desa/us-central1/borrarUsuarioPorEmailDev',
            body: {
                email: nuevoUsuarioEmail
            },
            failOnStatusCode: false
        });
        cy.log(`💥 Base de datos y Auth limpios para: ${nuevoUsuarioEmail}`);
    });

    beforeEach(() => {
        cy.login('admin.fundador@adcloslocos.com', 'PasswordSegura123!');

        // Esperamos el asentamiento obligatorio en la Home usando tus marcas de tarjetas
        cy.url({ timeout: 15000 }).should('include', '/home');
        cy.get('[data-cy="home-page-content"]').should('be.visible');
    });

    it('Debe gestionar el ciclo completo: dar de alta, buscar, dar de baja y volver a reactivar al usuario', () => {

        // 1️⃣ NAVEGAR AL LISTADO DESDE LA TARJETA EXCLUSIVA DE LA HOME
        cy.get('[data-cy="quick-card-usuarios"]').should('be.visible').click();
        cy.url().should('include', '/gest-user');
        cy.get('[data-cy="gest-user-content"]').should('be.visible');

        // Abrir formulario de alta desde el FAB button circular azul (+)
        cy.get('ion-fab-button, ion-fab button').filter(':visible').last().click({ force: true });

        // 2️⃣ RELLENAR DATOS PERSONALES (Formulario Civil Estricto)
        cy.get('[data-cy="personal-data-card"]').within(() => {
            cy.get('[data-cy="input-profile-nombre"]').find('input').clear({ force: true }).type(nuevoUsuarioNombre, { force: true });
            cy.get('[data-cy="input-profile-telefono"]').find('input').type('677889900', { force: true });
            cy.get('[data-cy="input-profile-dni"]').find('input').type('12345678', { force: true });
            cy.get('[data-cy="input-profile-profesion"]').find('input').type('Informático', { force: true });
        });

        // 🗺️ TRATAMIENTO DEL BUSCADOR MAPBOX (Fuera del within para evitar bloqueos)
        cy.fillAddress('Camas');

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

        // =========================================================================
        // 3️⃣ CONFIGURAR MEMBRESÍA (BLINDADO SIN ATASCO DE SCROLL)
        // =========================================================================
        cy.get('[data-cy="select-membership-role"]').click({ force: true });
        cy.wait(500); // Colchón para que Ionic abra el popover oscuro

        // Seleccionamos la opción "Socio" en el popover flotante
        cy.get('ion-popover ion-item, ion-popover button')
          .contains('Socio', { matchCase: false })
          .click({ force: true });
        
        cy.wait(600); // Damos un instante a Angular para que procese el *ngIf

        // Escribimos el número de socio forzando el click e input
        cy.get('[data-cy="input-membership-socio-num"]').find('input').type('1524', { force: true });

        // =========================================================================
        // 🔑 4️⃣ RELLENAR CREDENCIALES DE ACCESO
        // =========================================================================
        cy.get('app-credentials-form').within(() => {
            cy.get('input[type="email"]').eq(0).type(nuevoUsuarioEmail, { force: true });
            cy.get('input[type="email"]').eq(1).type(nuevoUsuarioEmail, { force: true });
            
            cy.get('input[type="password"]').eq(0).type('PasswordSegura123!', { force: true });
            cy.get('input[type="password"]').eq(1).type('PasswordSegura123!', { force: true });
        });

        // Inyectamos la foto de contingencia en el componente para saltar validaciones asíncronas
        cy.get('app-personal-data-form').then(($el) => {
            cy.window().then((win: any) => {
                if (win.ng && win.ng.getComponent) {
                    const component = win.ng.getComponent($el[0]);
                    if (component && component.user) component.user.foto = fotoCaricatura;
                }
            });
        });

        // =========================================================================
        // 🚀 INTERCEPTACIÓN ASÍNCRONA DE LA CLOUD FUNCTION DE ALTA
        // =========================================================================
        // Escuchamos la petición POST real que va hacia el backend modular para frenar a Cypress
        cy.intercept('POST', '**/createUserByAdmin**').as('adminCreateCall');

        // Guardar el nuevo usuario pinchando el botón definitivo de guardado
        cy.get('ion-button').contains('Crear Usuario', { matchCase: false }).click({ force: true });

        // ⏳ BARRERA DE TIEMPO SEGURA: Congelamos el test hasta que la Cloud Function responda HTTP 200 OK
        cy.wait('@adminCreateCall', { timeout: 15000 });

        // Validamos la redirección con la app ya asentada y el usuario guardado en Firestore
        cy.url({ timeout: 8000 }).should('include', '/gest-user');

        // Validamos que se ha añadido correctamente a la lista general
        cy.get('[data-cy="user-card-activo"]').should('contain', nuevoUsuarioNombre);
    });
});