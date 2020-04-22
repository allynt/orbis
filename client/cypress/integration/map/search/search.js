import { When, Then } from 'cypress-cucumber-preprocessor/steps';

When(`I type {string} in the "search box"`, place => {
  // cy.get('.mapboxgl-ctrl-geocoder--input')
  cy.findByPlaceholderText('Search')
    .click()
    .type(place)
    .should('have.value', place);
});

Then(`The results box displays {string}`, response => {
  cy.contains(response);
});

// When there are multiple results
When(`I select {string} option`, option => {
  cy.contains(option).click();
});

Then(`The map zooms in to "Easter Road Stadium"`, () => {
  cy.getMap(0, 30000)
    .invoke('getZoom')
    .should('eql', 16);
});
