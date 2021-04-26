const faker = require('faker');

module.exports = {
  type: 'FeatureCollection',
  features: [
    {
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
        Address: faker.address.streetAddress(),
        'Organisation Name': faker.company.companyName(),
        Postcode: faker.address.zipCode(),
        note: { id: 1, body: 'this is a test note' },
      },
    },
    {
      id: 2,
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [
          +faker.address.longitude(-3.1883 + 0.1, -3.1883 - 0.1),
          +faker.address.latitude(55.9533 + 0.1, 55.9533 - 0.1),
        ],
      },
      properties: {
        Address: faker.address.streetAddress(),
        'Organisation Name': faker.company.companyName(),
        Postcode: faker.address.zipCode(),
        note: null,
      },
    },
  ],
};
