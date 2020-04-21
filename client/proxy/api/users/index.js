const express = require('express');
const currentUserMiddleware = require('../authentication/middleware/currentUserMiddleware');
const { users } = require('./data');

const getUsers = (req, res) => {
  console.log('Returning All Users');
  res.status(200);
  res.json(users);
};

const getCurrentUserHandler = (req, res) => {
  console.log('Returning Current User', req.currentUser);
  res.status(200);
  res.json(req.currentUser);
};

const usersRouter = express.Router();

usersRouter.route('/').get(getUsers);
usersRouter.route('/:username').get(currentUserMiddleware, getCurrentUserHandler);

module.exports = usersRouter;
