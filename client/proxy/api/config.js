('use strict');

const appConfig = {
  trackingId: 'UA-143753043-1',
  mapbox_token: 'pk.eyJ1IjoidGhlcm1jZXJ0IiwiYSI6ImNqbmN5N2F6NzBnODYza3A2anVqYWExOW8ifQ.10y0sH8cDQp9AfZNg1-M3Q'
};

const userKey = { key: '57bd67287664bb1497cb29fe89d2d5087195a3ae' };

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

const bookmarks = [
  {
    title: 'bookmark 1',
    feature_collection: [],
    center: [0, 0],
    zoom: 5,
    owner: users[2].id
  },
  {
    title: 'bookmark 2',
    feature_collection: [],
    center: [55.961667, -3.165556],
    zoom: 6,
    owner: users[2].id
  }
];

let currentUser = null;

const getAppConfig = (req, res) => {
  console.log('Returning App Config');
  res.status(200);
  res.json(appConfig);
};

const getUsers = (req, res) => {
  console.log('Returning All Users');
  res.status(200);
  res.json(users);
};

const getCurrentUser = (req, res) => {
  console.log('Returning Current User');
  res.status(200);
  res.json(currentUser);
};

const register = (req, res) => {
  const details = req.body;
  console.log('Registering User: ', details);

  const existingUser = users.find(user => user.username === details.username);

  if (existingUser) {
    res.status(400);
    res.json({ message: `Sorry, ${details.username} already exists` });
  } else {
    let oldId = users.length;
    const user = {
      id: ++oldId,
      username: details.username,
      email: details.email,
      name: null,
      description: '',
      is_verified: false,
      is_approved: false,
      profiles: {},
      roles: []
    };

    users.push(user);

    res.status(200);
    res.json(userKey);
  }
};

const login = (req, res) => {
  const user = req.body;
  console.log('Logging User: ', user);

  currentUser = users.find(usr => usr.email === user.email);
  console.log('USER Matched: ', currentUser);

  if (currentUser) {
    if (!currentUser.is_approved) {
      res.status(400);
      res.json({ message: `Sorry, Registration not approved, please ask your manager to approve this account` });
    }

    if (!currentUser.is_verified) {
      res.status(400);
      res.json({ message: `Sorry, Registration not verified, please ask your manager to approve this account` });
    }

    if (user.password === currentUser.password) {
      res.status(200);
      res.json(userKey);
    } else {
      res.status(400);
      res.json({
        message:
          '<p>Sorry, email and password did not match.</p><p><strong>Warning:</strong> After 7 consecutive unsuccessful login attempts, your account will be locked out for 60 minutes.</p>'
      });
    }
  } else {
    res.status(400);
    res.json({ message: `Sorry, ${user.username} could not be found` });
  }
};

const logout = (req, res) => {
  console.log('User Logout');
  currentUser = null;

  res.status(200);
  res.json(userKey);
};

const getBookmarks = (req, res) => {
  console.log('Returning Bookmarks');
  const userBookmarks = bookmarks.filter(bookmark => bookmark.owner === currentUser.id);

  res.status(200);
  res.json(userBookmarks);
};

const addBookmark = (req, res) => {
  console.log('Adding Bookmark');
  const bookmark = {
    ...req.body
  };

  bookmarks.push(bookmark);

  res.status(200);
  res.json(bookmark);
};

const changePassword = (req, res) => {
  console.log(`Changing User Password`);
  const oldPassword = req.body.old_password;
  const newPassword = req.body.old_password;
  console.log(`Changing User Password from ${oldPassword} to ${newPassword}`);
  const user = users.find(user => user.username === currentUser.username);

  if (currentUser.password === oldPassword) {
    if (req.body.new_password1 === 'razorpelicanturf') {
      res.status(400);
      res.json({ message: 'Some Error' });
    } else {
      user.password = newPassword;
      currentUser.password = newPassword;

      res.status(200);
      res.json(user);
    }
  }
};

module.exports = {
  getAppConfig,
  getUsers,
  getCurrentUser,
  register,
  login,
  logout,
  getBookmarks,
  addBookmark,
  changePassword
};
