const express = require('express');

const { v4: uuidv4 } = require('uuid');

const { userKey, getCurrentUser, setCurrentUser } = require('./data');
const { getUsers } = require('../users/data');

const register = (req, res) => {
  const details = req.body;
  console.log('Registering New User');

  const users = getUsers();
  const existingUser = users.find(user => user.email === details.email);

  if (existingUser) {
    res.status(400);
    res.json({ message: `Sorry, ${details.email} already exists` });
  } else {
    const user = {
      id: uuidv4(),
      name: null,
      description: '',
      is_verified: false,
      is_approved: false,
      profiles: {},
      roles: [],
      ...details,
    };

    console.log('Registered New User :', user);

    users.push(user);

    res.status(200);
    res.json(userKey);
  }
};

const login = (req, res) => {
  const user = req.body;
  console.log('Logging User: ', user);

  const users = getUsers();
  setCurrentUser(users.find(usr => usr.email === user.email));
  const currentUser = getCurrentUser();
  console.log('USER Matched: ', currentUser);

  if (currentUser) {
    if (!currentUser.is_approved) {
      res.status(400);
      res.json({
        message: `Sorry, Registration not approved, please ask your manager to approve this account`,
      });
    }

    if (!currentUser.is_verified) {
      res.status(400);
      res.json({
        message: `Sorry, Registration not verified, please ask your manager to approve this account`,
      });
    }

    if (user.password === currentUser.password) {
      res.status(200);
      res.json(userKey);
    } else {
      res.status(400);
      res.json({
        message:
          '<p>Sorry, email and password did not match.</p><p><strong>Warning:</strong> After 7 consecutive unsuccessful login attempts, your account will be locked out for 60 minutes.</p>',
      });
    }
  } else {
    res.status(400);
    res.json({ message: `Sorry, ${user.username} could not be found` });
  }
};

const logout = (req, res) => {
  console.log('User Logout');
  setCurrentUser(null);

  res.status(200);
  res.json(userKey);
};

const changePassword = (req, res) => {
  console.log(`Changing User Password`);
  const users = getUsers();

  const oldPassword = req.body.old_password;
  const newPassword = req.body.new_password1;
  console.log(`Changing User Password from ${oldPassword} to ${newPassword}`);
  const user = users.find(user => user.username === currentUser.username);
  const currentUser = getCurrentUser();
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

const authRouter = express.Router();

authRouter.route('/registration').post(register);
authRouter.route('/login').post(login);
authRouter.route('/logout').post(logout);
authRouter.route('/password/change').post(changePassword);

module.exports = authRouter;
