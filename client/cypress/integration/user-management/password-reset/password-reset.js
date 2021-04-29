import { Then } from 'cypress-cucumber-preprocessor/steps';

const PASSWORD_RESET = '/password/reset';

// View password reset page
Then(`I see the "Password Reset" page`, () => {
  // Verify page
  cy.title().should('eq', 'orbis');
  cy.url().should('include', PASSWORD_RESET);

  // Verify form
  cy.findByLabelText('Email');
  cy.contains('Reset Password');

  // Verify links.
  cy.contains('Do you have an account?');
  cy.contains('Login');
});

// Password Reset with no form values
Then(`"Password Reset" form not submitted as submit button disabled`, () => {
  cy.url().should('include', PASSWORD_RESET);
  cy.contains('Reset Password').should('be.disabled');
});
