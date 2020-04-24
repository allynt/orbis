import { Then } from 'cypress-cucumber-preprocessor/steps';

Then(`I am redirected to the {string} page with url {string}`, (title, url) => {
  // I've added the title variable as I expect it will be used as page titles
  // should change.
  cy.url().should('include', url);
});
