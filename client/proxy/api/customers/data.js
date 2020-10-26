const { v4: uuidv4 } = require('uuid');

let customers = [
  {
    id: '7009b9d8-c286-11ea-b3de-0242ac130004',
    type: 'MULTIPLE',
    name: 'cyberdyne',
    title: 'Cyberdyne Systems',
    country: 'United States',
    address: '123 Fake Street',
    postcode: 'EH6 1UF',
    description: 'Bringing you the future, today.',
    logo: 'https://ichef.bbci.co.uk/images/ic/1200x675/p03t1sm8.jpg',
    roles: ['SaveTheWorldRole'],
    permissions: ['can_deploy_skynet'],
    licences: [
      {
        id: '055aa73b-7a5f-41d7-b9d4-b3124c16ffde',
        orb: 'Rice',
        customer_user: 1,
        access: '1',
      },
      {
        id: 'd499964f-1bb4-4aa1-baf4-0164eabec297',
        orb: 'Rice',
        customer_user: 2,
        access: '1',
      },
      {
        id: '3e9dbb09-133b-4316-bf7c-c6e0be98bb05',
        orb: 'Rice',
        customer_user: 3,
        access: '1',
      },
      {
        id: 'db153830-d72a-44f7-88e0-d95b203b2383',
        orb: 'Rice',
        customer_user: 4,
        access: '1',
      },
      {
        id: 'a4a4bf7e-8980-4fd8-a3e8-dccc0ada36e1',
        orb: 'Oil',
        customer_user: 5,
        access: '1',
      },
      {
        id: 'e7d31181-61e3-4880-9529-6408ce9d2cd3',
        orb: 'Oil',
        customer_user: 6,
        access: '1',
      },
      {
        id: '7b2df564-3b91-4ed2-9b57-a362f7212c94',
        orb: 'Oil',
        customer_user: 1,
        access: '1',
      },
      {
        id: 'c2f0bae8-b2f5-412d-9780-551c6bbe3248',
        orb: 'Oil',
        customer_user: 2,
        access: '1',
      },
      {
        id: '4d16b720-2a7a-4ee7-a942-fd999af5aa15',
        orb: 'Oil',
        customer_user: 3,
        access: '1',
      },
      {
        id: 'f9a8a715-dbeb-4fbc-92c6-fd2138475a87',
        orb: 'Oil',
        customer_user: 4,
        access: '1',
      },
      {
        id: 'bca4255f-5147-4023-9b34-e52b0b8fcd86',
        orb: 'Rice',
        customer_user: 5,
        access: '1',
      },
      {
        id: '2c6c43e0-d0d4-4379-ab6e-895b06f7f71b',
        orb: 'Rice',
        customer_user: 6,
        access: '1',
      },
      {
        id: 'cffb1c43-54b9-47ce-be3b-572d2a3d2e14',
        orb: 'Rice',
        customer_user: null,
        access: '1',
      },
      {
        id: '580468ba-fd78-4ea6-bd50-52a7b7ecf686',
        orb: 'Oil',
        customer_user: null,
        access: '1',
      },
      {
        id: 'cffb1c43-54b9-47ce-be3b-572d2a3d2g59',
        orb: 'Steel',
        customer_user: null,
        access: '1',
      },
      {
        id: '580468ba-fd78-4ea6-bd50-52a7b7ecwpdc',
        orb: 'Steel',
        customer_user: null,
        access: '1',
      },
      {
        id: 'cffb1c43-54b9-47ce-be3b-572d2a3d2p23',
        orb: 'Timber',
        customer_user: null,
        access: '1',
      },
      {
        id: '580468ba-fd78-4ea6-bd50-52a7b7ecwlxn',
        orb: 'Timber',
        customer_user: null,
        access: '1',
      },
    ],
    data_limit: 100,
    data_total: 50,
  },
  {
    id: '8e4bc896-c286-11ea-b3de-0242ac130004',
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
    id: '56f2eab2-3aeb-4fe1-9266-4230725ccd94',
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
    customer: '7009b9d8-c286-11ea-b3de-0242ac130004',
    licences: [
      '055aa73b-7a5f-41d7-b9d4-b3124c16ffde',
      '7b2df564-3b91-4ed2-9b57-a362f7212c94',
    ],
    user: {
      id: '5edd4615-34a7-4c55-9243-0092671ef9d8',
      email: 'admin@test.com',
      name: 'Harry Callahan',
      description: '',
      change_password: false,
      is_verified: true,
      is_approved: true,
      accepted_terms: false,
      avatar:
        'https://www.bfi.org.uk/sites/bfi.org.uk/files/styles/full/public/image/dirty-harry-1971-002-clint-eastwood-medium-shot.jpg?itok=Gt8uYZDg',
      profiles: {},
      roles: ['UserRole', 'AstrosatRole'],
      permissions: [],
    },
  },
  {
    id: 2,
    type: 'MANAGER',
    status: 'ACTIVE',
    invitation_date: '2020-01-01T12:00:00.07Z',
    customer: '7009b9d8-c286-11ea-b3de-0242ac130004',
    licences: [
      'd499964f-1bb4-4aa1-baf4-0164eabec297',
      'c2f0bae8-b2f5-412d-9780-551c6bbe3248',
    ],
    user: {
      id: '3183f6ba-da80-4c0d-811c-9c2e45d5e95d',
      email: 'f.mulder@fbi.gov',
      name: 'Fox Mulder',
      description: '',
      change_password: false,
      is_verified: true,
      is_approved: true,
      accepted_terms: true,
      avatar: 'some/path/to/an/image',
      profiles: {},
      roles: ['UserRole', 'AstrosatRole'],
      permissions: [],
    },
  },
  {
    id: 3,
    type: 'MANAGER',
    status: 'ACTIVE',
    invitation_date: '2020-01-01T12:00:00.07Z',
    customer: '7009b9d8-c286-11ea-b3de-0242ac130004',
    licences: [
      '3e9dbb09-133b-4316-bf7c-c6e0be98bb05',
      'c2f0bae8-b2f5-412d-9780-551c6bbe3248',
    ],
    user: {
      id: '0414efbd-4bca-4197-8f2d-a00f841fa80b',
      email: 'm.riggs@lapd.gov',
      name: 'Martin Riggs',
      description: '',
      change_password: false,
      is_verified: true,
      is_approved: true,
      accepted_terms: true,
      avatar: 'some/path/to/an/image',
      profiles: {},
      roles: ['UserRole', 'AstrosatRole'],
      permissions: [],
    },
  },
  {
    id: 4,
    type: 'MANAGER',
    status: 'PENDING',
    invitation_date: '2020-01-31T11:46:12.618090Z',
    customer: '7009b9d8-c286-11ea-b3de-0242ac130004',
    licences: [
      'db153830-d72a-44f7-88e0-d95b203b2383',
      'f9a8a715-dbeb-4fbc-92c6-fd2138475a87',
    ],
    user: {
      id: 'a7bc79cf-fa3d-4a98-8af1-9e6a6cb18af6',
      email: 'f.serpico@nypd.gov',
      name: 'Frank Serpico',
      description: '',
      change_password: false,
      is_verified: true,
      is_approved: true,
      accepted_terms: true,
      avatar: 'some/path/to/an/image',
      profiles: {},
      roles: ['UserRole', 'AstrosatRole'],
      permissions: [],
    },
  },
  {
    id: 5,
    type: 'MEMBER',
    status: 'PENDING',
    invitation_date: '2020-01-31T11:46:12.618090Z',
    customer: '7009b9d8-c286-11ea-b3de-0242ac130004',
    licences: [
      'a4a4bf7e-8980-4fd8-a3e8-dccc0ada36e1',
      'bca4255f-5147-4023-9b34-e52b0b8fcd86',
    ],
    user: {
      id: 'abb63511-e88d-47f5-a884-3cba800b9714',
      email: 'e.exley@lapd.gov',
      name: 'Edmund Exley',
      description: '',
      change_password: false,
      is_verified: true,
      is_approved: true,
      accepted_terms: true,
      avatar: 'some/path/to/an/image',
      profiles: {},
      roles: ['UserRole', 'AstrosatRole'],
      permissions: [],
    },
  },
  {
    id: 6,
    type: 'MANAGER',
    status: 'PENDING',
    invitation_date: '2020-01-31T11:46:12.618090Z',
    customer: '7009b9d8-c286-11ea-b3de-0242ac130004',
    licences: [
      'e7d31181-61e3-4880-9529-6408ce9d2cd3',
      '2c6c43e0-d0d4-4379-ab6e-895b06f7f71b',
    ],
    user: {
      id: 'e7e26c78-d66a-4c26-9f62-c5926846fad2',
      email: 'a.murphy@dpd.gov',
      name: 'Alex Murphy',
      description: '',
      change_password: false,
      is_verified: true,
      is_approved: true,
      accepted_terms: true,
      avatar: 'some/path/to/an/image',
      profiles: {},
      roles: ['UserRole', 'AstrosatRole'],
      permissions: [],
    },
  },
  {
    id: 7,
    type: 'MANAGER',
    status: 'ACTIVE',
    customer: '7009b9d8-c286-11ea-b3de-0242ac130004',
    licences: [
      '055aa73b-7a5f-41d7-b9d4-b3124c16ffde',
      '7b2df564-3b91-4ed2-9b57-a362f7212c94',
    ],
    user: {
      id: '5edd4615-34a7-4c55-9243-0092671ef9d9',
      email: 'admin@test.com',
      name: 'Harry Callahan',
      description: '',
      change_password: false,
      is_verified: true,
      is_approved: true,
      accepted_terms: false,
      avatar:
        'https://www.bfi.org.uk/sites/bfi.org.uk/files/styles/full/public/image/dirty-harry-1971-002-clint-eastwood-medium-shot.jpg?itok=Gt8uYZDg',
      profiles: {},
      roles: ['UserRole', 'AstrosatRole'],
      permissions: [],
    },
  },
  {
    id: 8,
    type: 'MANAGER',
    status: 'ACTIVE',
    customer: '7009b9d8-c286-11ea-b3de-0242ac130004',
    licences: [
      'd499964f-1bb4-4aa1-baf4-0164eabec297',
      'c2f0bae8-b2f5-412d-9780-551c6bbe3248',
    ],
    user: {
      id: '3183f6ba-da80-4c0d-811c-9c2e45d5e95e',
      email: 'f.mulder@fbi.gov',
      name: 'Fox Mulder',
      description: '',
      change_password: false,
      is_verified: true,
      is_approved: true,
      accepted_terms: true,
      avatar: 'some/path/to/an/image',
      profiles: {},
      roles: ['UserRole', 'AstrosatRole'],
      permissions: [],
    },
  },
  {
    id: 9,
    type: 'MANAGER',
    status: 'ACTIVE',
    customer: '7009b9d8-c286-11ea-b3de-0242ac130004',
    licences: [
      '3e9dbb09-133b-4316-bf7c-c6e0be98bb05',
      'c2f0bae8-b2f5-412d-9780-551c6bbe3248',
    ],
    user: {
      id: '0414efbd-4bca-4197-8f2d-a00f841fa80c',
      email: 'm.riggs@lapd.gov',
      name: 'Martin Riggs',
      description: '',
      change_password: false,
      is_verified: true,
      is_approved: true,
      accepted_terms: true,
      avatar: 'some/path/to/an/image',
      profiles: {},
      roles: ['UserRole', 'AstrosatRole'],
      permissions: [],
    },
  },
  {
    id: 10,
    type: 'MANAGER',
    status: 'PENDING',
    invitation_date: '2020-01-31T11:46:12.618090Z',
    customer: '7009b9d8-c286-11ea-b3de-0242ac130004',
    licences: [
      'db153830-d72a-44f7-88e0-d95b203b2383',
      'f9a8a715-dbeb-4fbc-92c6-fd2138475a87',
    ],
    user: {
      id: 'a7bc79cf-fa3d-4a98-8af1-9e6a6cb18af8',
      email: 'f.serpico@nypd.gov',
      name: 'Frank Serpico',
      description: '',
      change_password: false,
      is_verified: true,
      is_approved: true,
      accepted_terms: true,
      avatar: 'some/path/to/an/image',
      profiles: {},
      roles: ['UserRole', 'AstrosatRole'],
      permissions: [],
    },
  },
  {
    id: 11,
    type: 'MEMBER',
    status: 'PENDING',
    invitation_date: '2020-01-31T11:46:12.618090Z',
    customer: '7009b9d8-c286-11ea-b3de-0242ac130004',
    licences: [
      'a4a4bf7e-8980-4fd8-a3e8-dccc0ada36e1',
      'bca4255f-5147-4023-9b34-e52b0b8fcd86',
    ],
    user: {
      id: 'abb63511-e88d-47f5-a884-3cba800b9715',
      email: 'e.exley@lapd.gov',
      name: 'Edmund Exley',
      description: '',
      change_password: false,
      is_verified: true,
      is_approved: true,
      accepted_terms: true,
      avatar: 'some/path/to/an/image',
      profiles: {},
      roles: ['UserRole', 'AstrosatRole'],
      permissions: [],
    },
  },
  {
    id: 12,
    type: 'MANAGER',
    status: 'PENDING',
    invitation_date: '2020-01-31T11:46:12.618090Z',
    customer: '7009b9d8-c286-11ea-b3de-0242ac130004',
    licences: [
      'e7d31181-61e3-4880-9529-6408ce9d2cd3',
      '2c6c43e0-d0d4-4379-ab6e-895b06f7f71b',
    ],
    user: {
      id: 'e7e26c78-d66a-4c26-9f62-c5926846fad3',
      email: 'a.murphy@dpd.gov',
      name: 'Alex Murphy',
      description: '',
      change_password: false,
      is_verified: true,
      is_approved: true,
      accepted_terms: true,
      avatar: 'some/path/to/an/image',
      profiles: {},
      roles: ['UserRole', 'AstrosatRole'],
      permissions: [],
    },
  },
];

const EDIT = 'edit';
const DELETE = 'delete';

const updateCustomerLicences = (type, user) => {
  let customer = customers[0];

  customer.licences.forEach(licence => {
    const idMatch = licence.customer_user === user.id;
    if (type === DELETE) {
      if (idMatch) {
        licence.customer_user = null;
      }
    } else if (type === EDIT) {
      if (idMatch && !user.licences.includes(licence.id)) {
        licence.customer_user = null;
      }

      if (!licence.customer_user && user.licences.includes(licence.id)) {
        licence.customer_user = user.id;
      }
    }
  });
};

const getCustomer = customerId => customers.find(c => c.id === customerId);

const createCustomer = data => {
  const id = uuidv4();
  const newCustomer = { id, ...data };
  customers.push(newCustomer);
  return newCustomer;
};

const updateCustomer = newCustomer => {
  const index = customers.findIndex(cust => cust.id === newCustomer.id);

  customers[index] = newCustomer;
  return customers[index];
};

const getCustomerUsers = customerId =>
  customerUsers.filter(cu => cu.customer === customerId);

/**
 * @param {string} customerId The id of the customer to add the user to
 * @param {{email: string, name: string, licences: number[]}} userData the form data
 */
const createCustomerUser = (customerId, userData) => {
  const newCustomerUserId = getCustomerUsers(customerId).length + 1;
  const newUserId = uuidv4();

  const customerLicences = getCustomer(customerId).licences;
  const invitation_date = new Date().toISOString();
  userData.licences.forEach(
    licenceId =>
      (customerLicences.find(
        licence => licence.id === licenceId,
      ).customer_user = newCustomerUserId),
  );
  const newUser = {
    id: newCustomerUserId,
    type: 'MEMBER',
    status: 'PENDING',
    licences: userData.licences,
    customer: customerId,
    user: { ...userData.user, id: newUserId },
    invitation_date,
  };
  customerUsers.push(newUser);
  return newUser;
};

const updateCustomerUser = user => {
  const index = customerUsers.indexOf(
    customerUsers.find(cu => cu.id === user.id),
  );

  customerUsers[index] = user;

  updateCustomerLicences(EDIT, user);

  return customerUsers[index];
};

const inviteCustomerUser = customerUser => {
  const index = customerUsers.findIndex(cu => cu.id === customerUser.id);

  const invitation_date = new Date().toISOString();

  const invitedCustomerUser = {
    ...customerUser,
    invitation_date,
  };

  customerUsers[index] = invitedCustomerUser;

  return customerUsers[index];
};

const deleteCustomerUser = userId => {
  const deletedUser = customerUsers.find(cu => cu.user.id === userId);
  customerUsers = customerUsers.filter(
    cu => cu.user.id !== deletedUser.user.id,
  );

  updateCustomerLicences(DELETE, deletedUser);
};

const createOrder = (user, customerId, data) => {
  const id = uuidv4();
  const order = { ...data, id, created: new Date().toISOString(), user };
  const customer = customers.find(c => c.id === customerId);
  const customerIndex = customers.indexOf(customer);
  let orders = customer.orders || [];
  orders.push(order);
  customers[customerIndex] = { ...customer, orders };
  return order;
};

module.exports = {
  getCustomer,
  createCustomer,
  updateCustomer,
  getCustomerUsers,
  createCustomerUser,
  updateCustomerUser,
  inviteCustomerUser,
  deleteCustomerUser,
  createOrder,
};
