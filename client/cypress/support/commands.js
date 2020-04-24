// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
import '@testing-library/cypress/add-commands';
// import centroid from '@turf/centroid';

import { login } from '../../src/accounts/accounts.slice';

const loginUrl = '/login';
const email = Cypress.env('EMAIL');
const password = Cypress.env('PASSWORD');

// -- This is a parent command --
Cypress.Commands.add('login', () => {
  if (Cypress.config('baseUrl') !== 'http://localhost:3000') {
    cy.visit(loginUrl);

    cy.window()
      .its('store')
      .invoke('dispatch', login({ email, password }));
  }
});

Cypress.Commands.add('getMap', (id, timeout = 10000) => {
  cy.get(`[data-testid="map-${id}"]`, { timeout: timeout })
    .should(mapContainers => {
      const { map } = mapContainers[id];
      expect(!!map).to.eql(true, 'Style loaded');
      expect(map.areTilesLoaded()).to.eql(true, 'Tiles loaded');
    })
    .then(mapContainers => mapContainers[id].map);
});
