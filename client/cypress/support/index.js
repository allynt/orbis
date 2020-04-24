// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';

// this is needed until https://github.com/cypress-io/cypress/issues/95 is fixed
enableFetchWorkaround();

// Alternatively you can use CommonJS syntax:
// require('./commands')
function enableFetchWorkaround() {
  let polyfill;

  before(() => {
    console.info('Load fetch XHR polyfill');
    const polyfillUrl = 'https://unpkg.com/unfetch/dist/unfetch.umd.js';
    cy.request(polyfillUrl).then(response => {
      polyfill = response.body;
    });
  });

  Cypress.on('window:before:load', win => {
    const origFetch = win.fetch;
    delete win.fetch;
    // since the application code does not ship with a polyfill
    // load a polyfilled "fetch" from the test
    win.eval(polyfill);
    win.fetch = (url, ...args) => {
      console.log(url);
      if (url.startsWith && url.startsWith('/api/')) return win.unfetch(url, ...args);
      else return origFetch(url, ...args);
    };
  });
}
