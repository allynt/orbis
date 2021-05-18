import { When } from 'cypress-cucumber-preprocessor/steps';

When(`I type {string} into the {string} field`, (text, field) => {
  cy.findByRole('textbox', { name: field })
    .type(text)
    .should('have.value', text);
});
