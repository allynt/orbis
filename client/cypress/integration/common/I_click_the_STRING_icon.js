import { When } from 'cypress-cucumber-preprocessor/steps';

When(`I click the {string} icon`, label => {
  cy.findByRole('img', { name: label }).click();
});
