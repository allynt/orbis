import { When } from 'cypress-cucumber-preprocessor/steps';

When(`I click the {string} checkbox`, label => {
  cy.findByRole('checkbox', { name: label }).click();
});
