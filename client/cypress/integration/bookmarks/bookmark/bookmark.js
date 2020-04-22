import { When, Then } from 'cypress-cucumber-preprocessor/steps';

const MAP = '/map';
const buttonText = 'Save Bookmark';

// View My Maps panel
Then(`I see the "Bookmarks" panel`, () => {
  // Verify form
  cy.findByPlaceholderText('Title');
  cy.findByPlaceholderText('Description');
  cy.contains(buttonText).should('be.disabled');
});

// Bookmark with no form values
Then(`"Add Bookmark" form not submitted as submit button disabled`, () => {
  // cy.url().should('include', MAP);
  cy.contains(buttonText).should('be.disabled');
});

Then(`I see the new {string} Bookmark`, title => {
  cy.contains(title);
  cy.contains('Load');
  cy.contains('Delete');
});

Then(`I see the new {string} Bookmark with description {string}`, (title, description) => {
  cy.contains(title);
  cy.contains(description);
  cy.contains('Load');
  cy.contains('Delete');
});

Then(`I see the Bookmark item removed from the list`, () => {
  // Verify form
  // cy.findByPlaceholderText('Title');
  // cy.findByPlaceholderText('Description');
  // cy.contains(buttonText).should('be.disabled');
});
