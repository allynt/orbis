import faker from '@faker-js/faker/locale/en_GB';

export const makeUsers = (type = 'ACTIVE', n = 20) =>
  Array(n)
    .fill()
    .map(() => {
      const firstName = faker.name.firstName(),
        lastName = faker.name.lastName();
      return {
        id: faker.random.uuid(),
        status: type,
        type: faker.random.arrayElement(['MEMBER', 'MANAGER']),
        licences: Array(1 + faker.random.number(5))
          .fill()
          .map(() => faker.random.uuid()),
        invitation_date: faker.date.past().toISOString(),
        user: {
          name: `${firstName} ${lastName}`,
          email: faker.internet.email(firstName, lastName),
        },
      };
    });

export const makeCustomer = users => ({
  licences: users
    .flatMap(({ licences }) => licences)
    .map(id => ({
      id,
      orb: faker.random.arrayElement(
        Array(20)
          .fill()
          .map(() => faker.company.bsNoun()),
      ),
      customer_user: users.find(user => user.licences.includes(id)).id,
    })),
});

export const customer = {
  licences: [
    {
      id: '1',
      orb: 'Rice',
      customer_user: '1',
    },
    {
      id: '2',
      orb: 'Rice',
      customer_user: '2',
    },
    {
      id: '3',
      orb: 'Rice',
      customer_user: '3',
    },
    {
      id: '4',
      orb: 'Rice',
      customer_user: '1',
    },
    {
      id: '5',
      orb: 'Oil',
      customer_user: '2',
    },
    {
      id: '6',
      orb: 'Oil',
      customer_user: '3',
    },
    {
      id: '7',
      orb: 'Oil',
      customer_user: null,
    },
    {
      id: '8',
      orb: 'Rice',
      customer_user: null,
    },
    {
      id: '9',
      orb: 'Steel',
      customer_user: null,
    },
    {
      id: '10',
      orb: 'Timber',
      customer_user: null,
    },
  ],
};

export const activeUsers = [
  {
    id: '1',
    licences: ['1', '2'],
    type: 'MANAGER',
    status: 'ACTIVE',
    invitation_date: '2020-01-31T11:46:12.618090Z',
    user: { name: 'Test One', email: 'test1@test.com' },
  },
  {
    id: '2',
    licences: ['3', '4'],
    type: 'MEMBER',
    status: 'ACTIVE',
    invitation_date: '2020-01-31T11:46:12.618090Z',
    user: { name: 'Test Two', email: 'test2@test.com' },
  },
  {
    id: '3',
    licences: ['5', '6'],
    type: 'MEMBER',
    status: 'ACTIVE',
    invitation_date: '2020-01-31T11:46:12.618090Z',
    user: { name: 'Test Three', email: 'test3@test.com' },
  },
  {
    id: '4',
    licences: ['7', '8'],
    type: 'MANAGER',
    status: 'ACTIVE',
    invitation_date: '2020-01-31T11:46:12.618090Z',
    user: { name: 'Test Four', email: 'test4@test.com' },
  },
  {
    id: '5',
    licences: ['9', '10'],
    type: 'MEMBER',
    status: 'ACTIVE',
    invitation_date: '2020-01-31T11:46:12.618090Z',
    user: { name: 'Test Five', email: 'test5@test.com' },
  },
  {
    id: '6',
    licences: ['11', '12'],
    type: 'MEMBER',
    status: 'ACTIVE',
    invitation_date: '2020-01-31T11:46:12.618090Z',
    user: { name: 'Test Six', email: 'test6@test.com' },
  },
];

export const pendingUsers = [
  {
    id: '1',
    status: 'PENDING',
    licences: ['1', '2'],
    invitation_date: '2020-01-31T11:46:12.618090Z',
    user: { name: 'Test One', email: 'test1@test.com' },
  },
  {
    id: '2',
    status: 'PENDING',
    licences: ['3', '4'],
    invitation_date: '2020-01-31T11:46:12.618090Z',
    user: { name: 'Test Two', email: 'test2@test.com' },
  },
  {
    id: '3',
    status: 'PENDING',
    licences: ['5', '6'],
    invitation_date: '2020-01-31T11:46:12.618090Z',
    user: { name: 'Test Three', email: 'test3@test.com' },
  },
];
