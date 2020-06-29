const express = require('express');
const currentUserMiddleware = require('../authentication/middleware/currentUserMiddleware');
const { getCustomer, getCustomerUsers, getSelectedUser } = require('./data');

const getCustomerHandler = (req, res) => {
  console.log('Returning Current Customer');
  res.status(200);
  res.json(getCustomer(req.currentUser));
};

const getCustomerUsersHandler = (req, res) => {
  console.log('Returning all Users of Current Customer');
  const currentCustomer = getCustomer(req.currentUser);
  res.status(200);
  res.json(getCustomerUsers(currentCustomer));
};

const getSelectedUserHandler = (req, res) => {
  console.log('Returning Selected User of Customer');
  res.status(200);
  res.json(getSelectedUser(req.currentUser.customers));
};

const usersRouter = express.Router();

usersRouter.route('/:customer').get(currentUserMiddleware, getCustomerHandler);

usersRouter.route('/:customer/users').get(currentUserMiddleware, getCustomerUsersHandler);

usersRouter.route('/:customer/users/:username').get(getSelectedUserHandler);

module.exports = usersRouter;
