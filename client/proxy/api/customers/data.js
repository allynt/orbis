let customers = [
  {
    type: 'MULTIPLE',
    name: 'cyberdyne',
    title: 'Cyberdyne Systems',
    description: 'Bringing you the future, today.',
    logo: 'https://ichef.bbci.co.uk/images/ic/1200x675/p03t1sm8.jpg',
    users: [
      {
        id: 1,
        username: 'user@test.com',
        email: 'user@test.com',
        name: null,
        description: '',
        is_verified: true,
        is_approved: true,
        profiles: {},
        roles: ['UserRole', 'AstrosatRole'],
      },
      {
        id: 2,
        customers: [
          {
            name: 'cyberdyne',
            manager: true,
          },
        ],
        username: 'admin@test.com',
        email: 'admin@test.com',
        name: 'Harry Callahan',
        avatar:
          'https://www.bfi.org.uk/sites/bfi.org.uk/files/styles/full/public/image/dirty-harry-1971-002-clint-eastwood-medium-shot.jpg?itok=Gt8uYZDg',
        description: '',
        is_verified: true,
        is_approved: true,
        profiles: {},
        roles: ['AdminRole', 'UserRole'],
      },
      {
        id: 2,
        username: 'verified@test.com',
        email: 'verified@test.com',
        password: 'pandaconcretespoon',
        name: null,
        description: '',
        is_verified: true,
        is_approved: false,
        profiles: {},
        roles: ['UserRole'],
      },
      {
        id: 3,
        username: 'approved@test.com',
        email: 'approved@test.com',
        password: 'pandaconcretespoon',
        name: null,
        description: '',
        is_verified: false,
        is_approved: true,
        profiles: {},
        roles: ['UserRole'],
      },
    ],
    roles: ['SaveTheWorldRole'],
    permissions: ['can_deploy_skynet'],
    data_limit: 100,
    data_total: 50,
  },
  {
    type: 'MULTIPLE',
    name: 'OCP',
    title: 'Omnicorp Consumer Products',
    description: 'Omni Consumer Products',
    logo:
      'https://vignette.wikia.nocookie.net/robocop/images/8/82/OCP.jpg/revision/latest/scale-to-width-down/340?cb=20101115221812',
    users: [
      {
        id: 2,
        username: 'admin@test.com',
        email: 'admin@test.com',
        password: 'pandaconcretespoon',
        name: 'Harry Callahan',
        avatar:
          'https://www.bfi.org.uk/sites/bfi.org.uk/files/styles/full/public/image/dirty-harry-1971-002-clint-eastwood-medium-shot.jpg?itok=Gt8uYZDg',
        description: '',
        is_verified: true,
        is_approved: true,
        profiles: {},
        roles: ['AdminRole', 'UserRole'],
        customers: [
          {
            name: 'cyberdyne',
            manager: true,
          },
          {
            name: 'customer2',
            manager: true,
          },
          {
            name: 'customer3',
            manager: false,
          },
        ],
      },
    ],
  },
  {
    type: 'MULTIPLE',
    name: 'customer3',
    title: 'Customer 3',
    description: 'Some Tagline',
    logo: 'some/path/to/an/image',
    users: [],
  },
];

const getAllCustomers = () => customers;

const getAllUserCustomers = userCustomers => {
  let customerObjs = [];

  for (const customer of customers) {
    for (const userCustomer of userCustomers) {
      if (userCustomer.manager && userCustomer.name === customer.name) {
        customerObjs = [...customerObjs, customer];
      }
    }
  }
  return customerObjs;
};

module.exports = { getAllCustomers, getAllUserCustomers };
