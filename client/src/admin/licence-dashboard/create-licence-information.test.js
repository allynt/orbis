const { createLicenceInformation } = require('./create-licence-information');

const licences = [
  { orb: 'Rice' },
  { orb: 'Oil', customer_user: 1 },
  { orb: 'Rice', customer_user: 2 },
  { orb: 'Health', customer_user: '1' },
  { orb: 'Rice', customer_user: 1 },
  { orb: 'Health' },
  { orb: 'Health', customer_user: 3 },
  { orb: 'Oil', customer_user: 3 },
  { orb: 'Health', customer_user: 2 },
  { orb: 'Health' },
];

describe('createLicenceInformation', () => {
  it('creates an entry for each orb', () => {
    const result = createLicenceInformation(licences);
    expect(Object.keys(result)).toEqual(['Rice', 'Oil', 'Health']);
  });

  it.each([
    [
      'purchased',
      [
        ['Rice', 3],
        ['Oil', 2],
        ['Health', 5],
      ],
    ],
    [
      'active',
      [
        ['Rice', 2],
        ['Oil', 2],
        ['Health', 3],
      ],
    ],
    [
      'available',
      [
        ['Rice', 1],
        ['Oil', 0],
        ['Health', 2],
      ],
    ],
  ])('Calculates %s count', (property, results) => {
    const result = createLicenceInformation(licences);
    results.forEach(([orb, count]) => expect(result[orb][property]).toBe(count));
  });
});
