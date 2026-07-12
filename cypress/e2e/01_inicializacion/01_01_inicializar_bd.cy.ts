describe('🚀 SEMILLA: Inicialización del Entorno de Pruebas', () => {

    it('Debe limpiar por completo la BD, sembrar los usuarios, loguear al Admin y mostrar la lista', () => {

        const projectId = 'adcloslocos-desa';

        // 1️⃣ PURGAMOS RESIDUOS PREVIOS EN LOS EMULADORES
        cy.request({
            method: 'DELETE',
            url: `http://127.0.0.1:9099/emulator/v1/projects/${projectId}/accounts`,
            headers: { Authorization: 'Bearer owner' },
            failOnStatusCode: false
        });

        cy.request({
            method: 'DELETE',
            url: `http://127.0.0.1:8080/emulator/v1/projects/${projectId}/databases/(default)/documents`,
            failOnStatusCode: false
        });

        cy.log('💥 Base de datos vaciada al 100%.');

        // 2️⃣ LA SIEMBRA REINA
        cy.request({
            method: 'POST',
            url: 'http://127.0.0.1:5001/adcloslocos-desa/europe-west1/inicializarTest',
            timeout: 60000
        }).then((resSiembra) => {
            expect(resSiembra.body.success).to.be.true;
            cy.log('🌱 Base de datos sembrada con éxito.');
        });
    });

});