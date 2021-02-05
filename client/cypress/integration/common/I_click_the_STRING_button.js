import { When } from 'cypress-cucumber-preprocessor/steps';

When(`I click the {string} button`, label => {
  cy.findByRole('button', { name: label }).click();
});
