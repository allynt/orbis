let customers = [
  {
    type: 'MULTIPLE',
    name: 'cyberdyne',
    title: 'Cyberdyne Systems',
    description: 'Bringing you the future, today.',
    logo: 'https://ichef.bbci.co.uk/images/ic/1200x675/p03t1sm8.jpg',
    roles: ['SaveTheWorldRole'],
    permissions: ['can_deploy_skynet'],
    data_limit: 100,
    data_total: 50,
  },
  {
    type: 'MULTIPLE',
    name: 'ocp',
    title: 'Omnicorp Consumer Products',
    description: 'Omni Consumer Products',
    logo:
      'https://vignette.wikia.nocookie.net/robocop/images/8/82/OCP.jpg/revision/latest/scale-to-width-down/340?cb=20101115221812',
    roles: [],
    data_limit: 100,
    data_total: 50,
  },
  {
    type: 'MULTIPLE',
    name: 'customer3',
    title: 'Customer 3',
    description: 'Some Tagline',
    logo: 'some/path/to/an/image',
    roles: [],
    data_limit: 100,
    data_total: 50,
  },
];

let customerUsers = [
  {
    id: 1,
    type: 'MANAGER',
    status: 'ACTIVE',
    customer: 'cyberdyne',
    licences: ['licence1', 'licence2'],
    user: {
      id: 2,
      username: 'admin@test.com',
      email: 'admin@test.com',
      name: 'Harry Callahan',
      description: '',
      change_password: false,
      is_verified: true,
      is_approved: true,
      avatar:
        'https://www.bfi.org.uk/sites/bfi.org.uk/files/styles/full/public/image/dirty-harry-1971-002-clint-eastwood-medium-shot.jpg?itok=Gt8uYZDg',
      profiles: {},
      roles: ['UserRole', 'AdminRole', 'AstrosatRole'],
      permissions: [],
    },
  },
  {
    id: 2,
    type: 'MEMBER',
    status: 'PENDING',
    customer: 'cyberdyne',
    user: {
      id: 1,
      username: 'user@test.com',
      email: 'user@test.com',
      password: 'panda',
      name: null,
      description: '',
      is_verified: true,
      is_approved: true,
      profiles: {},
      roles: ['UserRole', 'AstrosatRole'],
      customers: [],
    },
  },
];

const getCustomer = user => {
  const customerName = user.customers[0].name;
  return customers.find(c => c.name === customerName);
};

const getCustomerUsers = customer => {
  return customerUsers.filter(cu => cu.customer === customer.name);
};

const getSelectedUser = customer => {
  console.log('SELECTED USER');
};

module.exports = { getCustomer, getCustomerUsers, getSelectedUser };
