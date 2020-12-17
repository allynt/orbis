const faker = require('faker');

const CATEGORIES = [
  'PPE',
  'Cleaning',
  'Medical Equipment & Aids',
  'Food',
  'Stationery',
  'Clothing',
  'Services',
  'Staff',
  'Other',
];

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
      Company: faker.company.companyName(),
      Postcode: faker.address.zipCode(),
      'Email Address': faker.internet.email(),
      Telephone: faker.phone.phoneNumber(),
      Website: faker.internet.url(),
      Category: faker.random.arrayElement(CATEGORIES),
    },
  })),
};
