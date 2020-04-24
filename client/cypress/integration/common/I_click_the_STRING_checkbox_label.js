import { When } from 'cypress-cucumber-preprocessor/steps';

When(`I click the {string} checkbox label`, label => {
  cy.contains(label).click();
});
