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
    invitation_date: '2020-01-31T11:46:12.618090Z',
    user: { name: 'Test One', email: 'test1@test.com' },
  },
  {
    id: '2',
    licences: ['3', '4'],
    type: 'MEMBER',
    invitation_date: '2020-01-31T11:46:12.618090Z',
    user: { name: 'Test Two', email: 'test2@test.com' },
  },
  {
    id: '3',
    licences: ['5', '6'],
    type: 'MEMBER',
    invitation_date: '2020-01-31T11:46:12.618090Z',
    user: { name: 'Test Three', email: 'test3@test.com' },
  },
];

export const pendingUsers = [
  {
    id: '1',
    licences: ['1', '2'],
    invitation_date: '2020-01-31T11:46:12.618090Z',
    user: { name: 'Test One', email: 'test1@test.com' },
  },
  {
    id: '2',
    licences: ['3', '4'],
    invitation_date: '2020-01-31T11:46:12.618090Z',
    user: { name: 'Test Two', email: 'test2@test.com' },
  },
  {
    id: '3',
    licences: ['5', '6'],
    invitation_date: '2020-01-31T11:46:12.618090Z',
    user: { name: 'Test Three', email: 'test3@test.com' },
  },
];
