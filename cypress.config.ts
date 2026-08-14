import { defineConfig } from 'cypress';
import * as fs from 'fs';
import * as path from 'path';

export default defineConfig({

  e2e: {

    baseUrl: 'http://localhost:8100',

    viewportWidth: 1440,

    viewportHeight: 900,

    video: false,

    screenshotOnRunFailure: true,

    defaultCommandTimeout: 10000,

    experimentalRunAllSpecs: true,

    setupNodeEvents(on, config) {
      const csvPath = path.join(__dirname, 'cypress', 'resultados_tests.csv');

      // 1. Al empezar las pruebas, creamos el archivo con el BOM UTF-8 y los encabezados
      on('before:run', () => {
        // \ufeff es el BOM (Byte Order Mark) para que Excel detecte UTF-8 al instante
        const encabezados = '\ufeffArchivo Spec;Grupo (Suite);Caso de Prueba (Test);Resultado;Duracion (ms);Error\n';

        fs.mkdirSync(path.dirname(csvPath), { recursive: true });
        fs.writeFileSync(csvPath, encabezados, 'utf-8');
      });

      // 2. Volcamos los resultados limpiando caracteres conflictivos
      on('after:spec', (spec, results) => {
        if (results && results.tests) {
          let lineasCSV = '';

          results.tests.forEach((test) => {
            const archivo = spec.relative;
            const suite = test.title[0] || 'General';
            const nombreTest = test.title[test.title.length - 1];
            const estado = test.state;
            const duracion = test.duration;

            // Limpiamos saltos de línea, punto y coma y comillas dobles del error
            let mensajeError = test.displayError
              ? test.displayError.replace(/[\n\r;]+/g, ' ').replace(/"/g, '""').substring(0, 150)
              : '';

            // Si el error empieza por un carácter conflictivo para fórmulas de Excel (+, -, =), le ponemos un espacio delante
            if (mensajeError.startsWith('=') || mensajeError.startsWith('+') || mensajeError.startsWith('-')) {
              mensajeError = ' ' + mensajeError;
            }

            lineasCSV += `"${archivo}";"${suite}";"${nombreTest}";"${estado}";${duracion};"${mensajeError}"\n`;
          });

          fs.appendFileSync(csvPath, lineasCSV, 'utf-8');
        }
      });
    },
  },
});