import { Then } from 'cypress-cucumber-preprocessor/steps';

Then(`The {string} page will open url {string} in a new tab`, (label, url) => {
  cy.contains(label).then($a => {
    // extract the fully qualified href property
    const href = $a.prop('href');
    assert.include(href, url);
  });
});
