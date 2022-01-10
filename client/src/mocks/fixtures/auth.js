let users = [
  {
    id: '5edd4615-34a7-4c55-9243-0092671ef9d8',
    username: 'user@test.com',
    email: 'user@test.com',
    password: 'user',
    name: null,
    description: '',
    is_verified: true,
    is_approved: true,
    profiles: {},
    roles: ['UserRole', 'AstrosatRole'],
    customers: [],
    orbs: [{ features: ['satellites'] }],
  },
  {
    id: '6e5ac533-0245-4031-ab65-b1eff4d30a1f',
    email: 'admin@test.com',
    password: 'admin',
    phone: '123456789',
    name: 'Harry Callahan',
    avatar:
      'https://www.bfi.org.uk/sites/bfi.org.uk/files/styles/full/public/image/dirty-harry-1971-002-clint-eastwood-medium-shot.jpg?itok=Gt8uYZDg',
    description: '',
    change_password: false,
    is_verified: true,
    is_approved: true,
    accepted_terms: true,
    profiles: {},
    roles: ['UserRole', 'AstrosatRole'],
    customers: [
      {
        id: '7009b9d8-c286-11ea-b3de-0242ac130004',
        type: 'MANAGER',
        status: 'ACTIVE',
      },
      {
        id: '8e4bc896-c286-11ea-b3de-0242ac130004',
        type: 'MANAGER',
        status: 'ACTIVE',
      },
      {
        id: '56f2eab2-3aeb-4fe1-9266-4230725ccd94',
        type: 'MEMBER',
        status: 'ACTIVE',
      },
    ],
    orbs: [
      {
        id: 1,
        name: 'Exploration',
        features: ['satellites'],
      },
    ],
  },
  {
    id: 'e3e7cd24-cfc7-49b3-837c-332dde8f1033',
    username: 'verified@test.com',
    email: 'verified@test.com',
    password: 'verified',
    name: null,
    description: '',
    is_verified: true,
    is_approved: false,
    profiles: {},
    roles: ['UserRole'],
    customers: [],
    orbs: [],
  },
  {
    id: '14247edb-5e41-4770-aa91-d652466880be',
    username: 'approved@test.com',
    email: 'approved@test.com',
    password: 'approved',
    name: null,
    description: '',
    is_verified: false,
    is_approved: true,
    profiles: {},
    roles: ['UserRole'],
    customers: [],
    orbs: [],
  },
];

const userKey = { token: '57bd67287664bb1497cb29fe89d2d5087195a3ae' };

export { users, userKey };
