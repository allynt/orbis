let customers = [
  {
    type: 'MULTIPLE',
    name: 'cyberdyne',
    title: 'Cyberdyne Systems',
    description: 'Bringing you the future, today.',
    logo: 'https://ichef.bbci.co.uk/images/ic/1200x675/p03t1sm8.jpg',
    roles: ['SaveTheWorldRole'],
    permissions: ['can_deploy_skynet'],
    licences: [
      {
        id: 1,
        orb: 'Rice',
      },
      {
        id: 2,
        orb: 'Rice',
        customer_user: 1,
      },
      { id: 3, orb: 'Oil' },
    ],
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
    licences: [2],
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

const getCustomer = customerId => customers.find(c => c.name === customerId);

const getCustomerUsers = customerId => customerUsers.filter(cu => cu.customer === customerId);

/**
 * @param {string} customerId The id of the customer to add the user to
 * @param {{email: string, name: string, licences: number[]}} userData the form data
 */
const createCustomerUser = (customerId, userData) => {
  const newUserId = getCustomerUsers(customerId).length + 1;
  const customerLicences = getCustomer(customerId).licences;
  userData.licences.forEach(
    licenceId => (customerLicences.find(licence => licence.id === licenceId).customer_user = newUserId),
  );
  const newUser = {
    id: newUserId,
    type: 'MEMBER',
    status: 'PENDING',
    licences: userData.licences,
    customer: customerId,
    user: userData.user,
  };
  customerUsers.push(newUser);
  return newUser;
};

const getSelectedUser = customer => {
  console.log('SELECTED USER');
};

module.exports = { getCustomer, getCustomerUsers, createCustomerUser, getSelectedUser };
