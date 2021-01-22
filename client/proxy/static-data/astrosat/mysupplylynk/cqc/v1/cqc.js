const faker = require('faker');

module.exports = {
  type: 'FeatureCollection',
  features: new Array(10).fill(undefined).map(() => ({
    id: 1,
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [
        +faker.address.longitude(-3.1883 + 0.1, -3.1883 - 0.1),
        +faker.address.latitude(55.9533 + 0.1, 55.9533 - 0.1),
      ],
    },
    properties: {
      'Address Line 1': faker.address.streetAddress(),
      'Address Line 2': '',
      'Address Line 3': faker.address.county(),
      'Bed Capacity': faker.random.number(100),
      'Location Inspection Directorate': 'Adult social care',
      'Location Local Authority': faker.address.state(),
      'Name of Business': faker.company.companyName(),
      Postcode: faker.address.zipCode(),
      'Service Type': new Array(faker.random.number(5))
        .fill(undefined)
        .map(() => faker.commerce.Category()),
      Website: faker.internet.url(),
    },
  })),
};
