describe('👮 ROL: Administrador - Gestión de Cuotas en Lote (03_04)', () => {
  
  beforeEach(() => {
    // 1️⃣ Autenticación con el administrador maestro sembrado en base de datos
    cy.login('admin.fundador@adcloslocos.com', 'PasswordSegura123!');
    
    // 2️⃣ Navegación directa al panel de mantenimiento de cuotas
    cy.visit('/mantenimiento-cuotas');
    
    // 3️⃣ Asentamiento de UI: Validamos que el panel de control fije su carga
    cy.get('[data-cy="cuotas-content-panel"]').should('be.visible');
    cy.get('[data-cy="container-control-cuotas"]').should('be.visible');
  });

  it('Debe activar la selección múltiple, alterar toggles de socios en memoria y aplicar cambios en lote con Firebase', () => {
    
    // Interceptamos la llamada interna de red hacia la colección de usuarios para monitorizar el lote
    cy.intercept('POST', '**/documents/users/**').as('firestoreUpdateBatch');

    // 1️⃣ Activamos el checkbox de selección múltiple (Edición por lote)
    cy.get('ion-checkbox').should('be.visible').click({ force: true });

    // 2️⃣ Alteramos el estado financiero de los dos primeros socios de la lista en memoria local
    cy.get('[data-cy="toggle-row-cuota"]').first().click({ force: true });
    cy.get('[data-cy="toggle-row-cuota"]').eq(1).click({ force: true });

    // 3️⃣ AUDITORÍA DE UI: Validamos que la barra flotante emerja de forma reactiva al haber cambios pendientes
    cy.get('.floating-actions-bar').should('be.visible');
    cy.get('.floating-actions-bar .btn-guardar').should('contain.text', 'Actualizar cuota');

    // 4️⃣ PERSISTENCIA: Pulsamos el botón para procesar la actualización masiva atómica
    cy.get('.floating-actions-bar .btn-guardar').click({ force: true });

    // 5️⃣ FEEDBACK NATIVO: Rompemos el Shadow DOM de Ionic para garantizar que el Toast de éxito se ha dibujado
    cy.get('ion-toast', { includeShadowDom: true, timeout: 8000 }).should('exist');

    // 6️⃣ CIERRE DE CICLO: La barra flotante debe destruirse del DOM al no quedar movimientos en caché
    cy.get('.floating-actions-bar').should('not.exist');
  });

});