import { When } from 'cypress-cucumber-preprocessor/steps';

When(`I click the {string} radio button`, label => {
  cy.findByRole('radio', { name: label }).click();
});
