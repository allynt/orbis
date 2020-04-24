import { Then } from 'cypress-cucumber-preprocessor/steps';

const LOGIN = '/login';

// View login page
Then(`I see the "Login" page`, () => {
  // Verify page
  cy.title().should('eq', 'orbis');
  cy.url().should('include', LOGIN);

  // Verify form
  cy.findByPlaceholderText('Email');
  cy.findByPlaceholderText('Password');
  cy.contains('Keep me logged in');
  cy.contains('Forgotten your');
  cy.contains('password?');
  cy.contains('Login');

  // Verify links.
  cy.contains("Don't have an account?");
  cy.contains('Sign Up');
});

// Login with no form values
Then(`"Login" form not submitted as submit button disabled`, () => {
  cy.url().should('include', LOGIN);
  cy.contains('Login').should('be.disabled');
});
