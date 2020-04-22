import { When } from 'cypress-cucumber-preprocessor/steps';

When(`I am on the {string} page`, url => {
  cy.visit(url);
});
