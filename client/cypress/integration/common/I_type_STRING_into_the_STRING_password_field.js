import { Then } from 'cypress-cucumber-preprocessor/steps';

Then(`I type {string} into the {string} password field`, (text, field) => {
  cy.findByLabelText(field)
    .type(text, { force: true })
    .should('have.value', text);
});
