import { Given } from 'cypress-cucumber-preprocessor/steps';

Given(`I am logged in`, () => {
  cy.login();
});
