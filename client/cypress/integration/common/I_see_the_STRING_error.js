import { Then } from 'cypress-cucumber-preprocessor/steps';

Then(`I see the {string} error`, error => {
  cy.contains(error);
});
