'use strict';

const appConfig = {
  trackingId: 'UA-143753043-1',
  mapbox_token: 'pk.eyJ1IjoidGhlcm1jZXJ0IiwiYSI6ImNqbmN5N2F6NzBnODYza3A2anVqYWExOW8ifQ.10y0sH8cDQp9AfZNg1-M3Q'
};

const userKey = { key: '57bd67287664bb1497cb29fe89d2d5087195a3ae' };

const users = [
  {
    id: 2,
    username: 'msmall',
    email: 'mark.small@astrosat.space',
    name: null,
    description: '',
    is_verified: true,
    is_approved: false,
    profiles: {},
    roles: [{ id: 2, name: 'IsUser', description: '', permissions: [] }]
  },
  {
    id: 1,
    username: 'admin',
    email: '',
    name: null,
    description: '',
    is_verified: true,
    is_approved: true,
    profiles: {},
    roles: [
      { id: 1, name: 'IsManager', description: '', permissions: [] },
      { id: 2, name: 'IsUser', description: '', permissions: [] }
    ]
  }
];

let currentUser = users[1];

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

const login = (req, res) => {
  console.log('User Login');
  currentUser = users[1];
  res.status(200);
  res.json(userKey);
};

const logout = (req, res) => {
  console.log('User Logout');
  currentUser = null;
  res.status(200);
  res.json(userKey);
};

module.exports = {
  getAppConfig,
  getUsers,
  getCurrentUser,
  login,
  logout
};
