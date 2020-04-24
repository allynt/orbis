import { When } from 'cypress-cucumber-preprocessor/steps';

When(`I type {string} into the {string} field`, (text, field) => {
  cy.findByPlaceholderText(field)
    .type(text)
    .should('have.value', text);
});
