import { When } from 'cypress-cucumber-preprocessor/steps';

When(`I click the {string} link`, label => {
  cy.contains(label).click();
});
