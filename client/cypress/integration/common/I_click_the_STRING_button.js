import { When } from 'cypress-cucumber-preprocessor/steps';

When(`I click the {string} button`, label => {
  cy.contains(label).click();
});
