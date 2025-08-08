const { defineConfig } = require('cypress');

const installLogsPrinter = require('cypress-terminal-report/src/installLogsPrinter');
const installLogsCollector = require('cypress-terminal-report/src/installLogsCollector');

module.exports = defineConfig({

  e2e: {
    baseUrl: 'https://partners-api.airalo.com',
    setupNodeEvents(on, config) {
      // implement node event listeners here
      installLogsPrinter(on, {
        outputRoot: 'cypress/logs/',
        outputTarget: {
          'run-log.txt': 'txt',
          'run-log.json': 'json',
        },
        includeSuccessfulHookLogs: true,
        // printLogsToConsole: 'always',
        printLogsToFile: 'always',
      });


      return config;
    },
    specPattern: 'cypress/e2e/**/*.cy.js',
    supportFile: 'cypress/support/e2e.js',



  }
});