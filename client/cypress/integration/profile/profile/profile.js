import { Then } from 'cypress-cucumber-preprocessor/steps';

const MAP = '/map';

// View My Account panel
Then(`I see the {string} panel`, header => {
  cy.contains(header);

  // Verify form
  cy.findByPlaceholderText('Email');
  cy.findByPlaceholderText('Name');
  cy.contains('Update Account');
  cy.contains('Logout');

  // Verify links.
  cy.contains('Need help? Contact us');
  cy.contains('here');
  cy.contains('Read our');
  cy.contains('Terms & Conditions');
});

Then(`"Update User" form not submitted as submit button disabled`, () => {
  cy.url().should('include', MAP);
  cy.contains('Update Account').should('be.disabled');
});
