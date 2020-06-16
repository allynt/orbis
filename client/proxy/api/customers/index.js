const express = require('express');
// const currentUserMiddleware = require('../authentication/middleware/currentUserMiddleware');
const { getCustomer, getAllUsersOfCustomer, getSelectedUser } = require('./data');

const getCustomerHandler = (req, res) => {
  console.log('Returning Current Customer');
  res.status(200);
  res.json(getCustomer());
};
const getAllUsersOfCustomerHandler = (req, res) => {
  console.log('Returning all Users of Current Customer');
  res.status(200);
  res.json(getAllUsersOfCustomer(req.currentUser.customers));
};
const getSelectedUserHandler = (req, res) => {
  console.log('Returning Selected User of Customer');
  res.status(200);
  res.json(getSelectedUser(req.currentUser.customers));
};

const usersRouter = express.Router();

usersRouter.route('/:customer').get(getCustomerHandler);

usersRouter.route('/:customer/users').get(getAllUsersOfCustomerHandler);

usersRouter.route('/:customer/users/:username').get(getSelectedUserHandler);

module.exports = usersRouter;
