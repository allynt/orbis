const express = require('express');
const { getCurrentUser } = require('../authentication/data');
const { users } = require('./data');

const getUsers = (req, res) => {
  console.log('Returning All Users');
  res.status(200);
  res.json(users);
};

const getCurrentUserHandler = (req, res) => {
  const currentUser = getCurrentUser();
  console.log('Returning Current User', currentUser);
  res.status(200);
  res.json(currentUser);
};

const usersRouter = express.Router();

usersRouter.route('/').get(getUsers);
usersRouter.route('/:username').get(getCurrentUserHandler);

module.exports = usersRouter;
