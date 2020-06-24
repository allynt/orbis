let users = [
  {
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
  {
    id: 2,
    username: 'admin@test.com',
    email: 'admin@test.com',
    password: 'pandaconcretespoon',
    name: 'Harry Callahan',
    avatar:
      'https://www.bfi.org.uk/sites/bfi.org.uk/files/styles/full/public/image/dirty-harry-1971-002-clint-eastwood-medium-shot.jpg?itok=Gt8uYZDg',
    description: '',
    change_password: false,
    is_verified: true,
    is_approved: true,
    profiles: {},
    roles: ['AdminRole', 'UserRole', 'AstrosatRole'],
    customers: [
      {
        name: 'cyberdyne',
        type: 'MANAGER',
        status: 'ACTIVE',
      },
      {
        name: 'OCP',
        type: 'MANAGER',
        status: 'ACTIVE',
      },
      {
        name: 'customer3',
        type: 'MEMBER',
        status: 'ACTIVE',
      },
    ],
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
    customers: [],
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
    customers: [],
  },
];

const getUsers = () => users;
const addUser = user => (users = [...users, { ...user, id: users.length + 1 }]);
const updateUser = user => (users = users.map(usr => (usr.id === user.id ? user : usr)));
const deleteUser = id => (users = users.filter(user => user.id !== id));

module.exports = { getUsers, addUser, updateUser, deleteUser };
