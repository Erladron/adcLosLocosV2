describe('Flujo Integral de Pases e Invitados (Feria) - 05_02_flujo_pases_invitados.cy.ts', () => {
  const SOCIO_EMAIL = 'felipe.novato@adcloslocos.com';
  const SOCIO_PASSWORD = 'PasswordSegura123!';
  const SOCIO_NOMBRE = 'Felipe Novato Solís';
  const INVITADO_NOMBRE = 'Invitado Especial Gómez';

  beforeEach(() => {
    cy.login(SOCIO_EMAIL, SOCIO_PASSWORD);
  });

  it('Paso 1: Generar pase de feria asegurando el UID y nombre civil del anfitrión', () => {
    cy.visit('/fair-passes'); // Ruta real del gestor de invitaciones de la Peña
    cy.get('[data-cy="fair-passes-content"]').should('be.visible');

    // Rellenar de forma interactiva el nombre del invitado civil
    cy.get('[data-cy="input-guest-name"]').find('input')
      .clear({ force: true })
      .type(INVITADO_NOMBRE, { force: true })
      .trigger('input', { force: true });
    
    // Interceptar la petición de creación para validar el payload exacto que viaja a Firestore[cite: 5]
    cy.intercept('POST', '**/documents/fair_passes**', (req) => {
      expect(req.body.fields.hostName.stringValue).to.equal(SOCIO_NOMBRE); //[cite: 5]
      expect(req.body.fields.hostUid.stringValue).to.not.equal('Administrador del sistema'); //[cite: 5]
    }).as('createFairPass');

    // Pulsar el botón unívoco de generación de invitación
    cy.get('[data-cy="btn-generate-pass"]').should('not.be.disabled').click({ force: true });
    cy.wait('@createFairPass');
  });

  it('Paso 2: Simular push recibido y redirección guiada automática al pase', () => {
    // Simulamos que el usuario pulsa en la notificación push y entra directo al detalle del pase[cite: 5]
    cy.visit('/fair-passes/detail/pase_feria_test_123');
    cy.get('[data-cy="pass-detail-content"]').should('be.visible');

    // Verificar que se renderiza el contenedor del Pase/QR y el nombre del anfitrión original de la Peña[cite: 5]
    cy.get('[data-cy="qr-code-container"]').should('be.visible');
    cy.get('[data-cy="pass-host-name"]').should('be.visible').and('contain', SOCIO_NOMBRE);
  });
});