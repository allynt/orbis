import { Then } from 'cypress-cucumber-preprocessor/steps';

Then(`I see {string} in the {string} field`, (password, field) => {
  cy.findByLabelText(field).should('have.value', password);
});
