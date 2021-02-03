import { Then } from 'cypress-cucumber-preprocessor/steps';

const buttonText = 'Save Map';

// View My Maps panel
Then(`I see the "Bookmarks" panel`, () => {
  // Verify form
  cy.findByPlaceholderText('Title');
  cy.findByPlaceholderText('Description');
  cy.contains(buttonText).should('be.disabled');
});

// Bookmark with no form values
Then(`"Add Bookmark" form not submitted as submit button disabled`, () => {
  cy.contains(buttonText).should('be.disabled');
});

Then(`I see the new {string} Bookmark`, title => {
  cy.contains(title);
  cy.contains('Load');
  cy.contains('Delete');
});

Then(
  `I see the new {string} Bookmark with description {string}`,
  (title, description) => {
    cy.contains(title);
    cy.contains(description);
    cy.contains('Load');
    cy.contains('Delete');
  },
);
