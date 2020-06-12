const express = require('express');
const currentUserMiddleware = require('../authentication/middleware/currentUserMiddleware');
const { getCustomersOfUser } = require('./data');

const getCustomersOfUserHandler = (req, res) => {
  console.log('Returning Current User Customers', req.currentUser.customers);
  res.status(200);
  res.json(getCustomersOfUser(req.currentUser.customers));
};

const usersRouter = express.Router();

usersRouter.route('/:username').get(currentUserMiddleware, getCustomersOfUserHandler);

module.exports = usersRouter;
