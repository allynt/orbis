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
      Name: faker.company.companyName(),
      'Line of Business': faker.commerce.department(),
      'New Product Lines': faker.commerce.department(),
      'Payment Terms': '',
      'Contact Name': `${faker.name.firstName()}, ${faker.name.lastName()}`,
      'Contact Email Address': faker.internet.email(),
      'Contact Phone Number': faker.phone.phoneNumber(),
      Postcode: faker.address.zipCode(),
      'Address Line 1': faker.address.streetAddress(),
      'Address Line 2': '',
      City: faker.address.city(),
      County: faker.address.county(),
      URL: faker.internet.url(),
      Items: new Array(faker.random.number(10)).fill(undefined).map(() => {
        const Category = faker.random.arrayElement(CATEGORIES);
        return {
          Name: faker.commerce.productName(),
          Category: Category,
        };
      }),
    },
  })),
};
