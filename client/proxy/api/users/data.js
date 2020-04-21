const users = [
  {
    id: 1,
    username: 'user@test.com',
    email: 'user@test.com',
    password: 'pandaconcretespoon',
    name: null,
    description: '',
    is_verified: true,
    is_approved: true,
    profiles: {},
    roles: [{ id: 2, name: 'IsUser', description: '', permissions: [] }]
  },
  {
    id: 2,
    username: 'admin@test.com',
    email: 'admin@test.com',
    password: 'pandaconcretespoon',
    name: null,
    description: '',
    is_verified: true,
    is_approved: true,
    profiles: {},
    roles: [
      { id: 1, name: 'IsManager', description: '', permissions: [] },
      { id: 2, name: 'IsUser', description: '', permissions: [] }
    ]
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
    roles: [{ id: 2, name: 'IsUser', description: '', permissions: [] }]
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
    roles: [{ id: 2, name: 'IsUser', description: '', permissions: [] }]
  }
];

module.exports = { users };
