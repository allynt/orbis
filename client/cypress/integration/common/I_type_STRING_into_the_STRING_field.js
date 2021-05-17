import { When } from 'cypress-cucumber-preprocessor/steps';

When(`I type {string} into the {string} field`, (text, field) => {
  cy.findByLabelText(field)
    .type(text, { force: true })
    .should('have.value', text);
});
