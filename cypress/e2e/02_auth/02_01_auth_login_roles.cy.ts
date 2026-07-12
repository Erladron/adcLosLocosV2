describe('Control de Acceso (Guards) - 02_01_auth_login_roles.cy.ts', () => {
  const PASSWORD = 'PasswordSegura123!'; // Contraseña real de la base de datos de pruebas

  beforeEach(() => {
    // Limpieza radical de sesiones antes de cada caso
    cy.clearLocalStorage();
    cy.clearCookies();
    cy.visit('/login');
  });

  it('Caso A: Login con rol Socio - Redirección a /home y menú de navegación correcto', () => {
    cy.login('socio.fundador@adcloslocos.com', PASSWORD); //
    cy.url().should('include', '/home'); //
    
    // 1️⃣ ABRIR EL MENÚ LATERAL (Usando el botón de la cabecera)
    cy.get('ion-menu-button').filter(':visible').first().click({ force: true });
    cy.wait(500); // Colchón imprescindible para la animación de Ionic

    // 2️⃣ AUDITAR COMPONENTES DEL MENÚ 
    cy.contains('ion-item', 'Inicio').should('be.visible'); //
    cy.contains('ion-item', 'Usuarios').should('be.visible'); //
    cy.contains('ion-item', 'Eventos').should('be.visible'); //
    cy.contains('ion-item', 'Invitar').should('be.visible'); //
    cy.contains('ion-item', 'Cerrar sesión').should('be.visible'); //

    // 3️⃣ LOGOUT DIRECTO USANDO TU ETIQUETA DE AYER
    // Atacamos directamente la marca unívoca sin importar si hay backdrop o no
    cy.get('[data-cy="menu-item-logout"]').click({ force: true });
    
    // Validamos el retorno seguro al login
    cy.url().should('include', '/login');
  });

  it('Caso B: Login con rol Invitado/Pendiente - Retenido en /pending-approval', () => {
    cy.login('invitado.pending_approval@adcloslocos.com', PASSWORD); //
    cy.url().should('include', '/pending-approval'); //
    
    // El usuario pendiente no debe ver el botón de menú lateral de la Peña
    cy.get('ion-menu-button').should('not.exist'); //
    
    // 4️⃣ LOGOUT DE PENDIENTES CON SU ETIQUETA PROPIA
    // Usamos el data-cy del botón blanco de la tarjeta de aprobación que vimos ayer
    cy.get('[data-cy="btn-approval-logout"]').click({ force: true }); //
    
    cy.url().should('include', '/login');
  });
});