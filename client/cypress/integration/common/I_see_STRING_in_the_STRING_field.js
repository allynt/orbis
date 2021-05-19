import { Then } from 'cypress-cucumber-preprocessor/steps';

Then(`I see {string} in the {string} field`, (password, field) => {
  cy.findByRole('textbox', { name: field }).should('have.value', password);
});
