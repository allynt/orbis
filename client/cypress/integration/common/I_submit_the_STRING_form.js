import { When } from 'cypress-cucumber-preprocessor/steps';

When(`I submit the {string} form`, buttonText => {
  cy.contains(buttonText).click({ force: true });
});
