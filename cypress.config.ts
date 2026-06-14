import { defineConfig } from 'cypress';

export default defineConfig({

  e2e: {

    baseUrl: 'http://localhost:8100',

    viewportWidth: 1440,

    viewportHeight: 900,

    video: true,

    screenshotOnRunFailure: true,

    defaultCommandTimeout: 10000,
    
    experimentalRunAllSpecs: true,

    setupNodeEvents(on, config) {

      return config;

    }

  }

});