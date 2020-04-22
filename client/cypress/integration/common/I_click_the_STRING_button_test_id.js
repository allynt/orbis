import { When } from 'cypress-cucumber-preprocessor/steps';

When(`I click the {string} button by test id`, label => {
  cy.get(`[data-testid=${label}]`).click();
});
