import { Then } from 'cypress-cucumber-preprocessor/steps';

const REGISTER = '/register';

// View registration page
Then(`I see the "Registration" page`, () => {
  // Verify page
  cy.title().should('eq', 'orbis');
  cy.url().should('include', REGISTER);

  // Verify form
  cy.findByRole('textbox', { name: 'Work Email Address' });
  cy.findByLabelText('Password *');
  cy.findByLabelText('Password Confirmation *');
  cy.contains('I agree with');
  cy.contains('Terms & Conditions');
  cy.contains('Sign Up');

  // Verify links.
  cy.contains('Do you have an account?');
  cy.contains('Login');
});

// Register with no form values
Then(`"Register" form not submitted as submit button disabled`, () => {
  cy.url().should('include', REGISTER);
  cy.contains('Sign Up').should('be.disabled');
});
