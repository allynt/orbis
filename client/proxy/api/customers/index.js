const express = require('express');
const {
  getCustomer,
  getCustomerUsers,
  getSelectedUser,
  createCustomerUser,
  deleteCustomerUser,
} = require('./data');

const getCustomerHandler = (req, res) => {
  console.log('Returning Current Customer');
  res.status(200);
  res.json(getCustomer(req.params.customer));
};

const getCustomerUsersHandler = (req, res) => {
  console.log('Returning all Users of Current Customer');
  res.status(200);
  res.json(getCustomerUsers(req.params.customer));
};

const createCustomerUserHandler = (req, res) => {
  const newUser = createCustomerUser(req.params.customer, req.body);
  res.status(201);
  res.json(newUser);
};

const getSelectedUserHandler = (req, res) => {
  console.log('Returning Selected User of Customer');
  res.status(200);
  res.json(getSelectedUser(req.currentUser.customers));
};

const deleteSelectedUserHandler = (req, res) => {
  console.log('Deleting Selected user of customer');
  deleteCustomerUser(req.params.user);
  res.status(200);
  res.json(getCustomerUsers());
};

const usersRouter = express.Router();

usersRouter.route('/:customer').get(getCustomerHandler);

usersRouter
  .route('/:customer/users')
  .get(getCustomerUsersHandler)
  .post(createCustomerUserHandler);

usersRouter
  .route('/:customer/users/:username')
  .get(getSelectedUserHandler)
  .delete(deleteSelectedUserHandler);

module.exports = usersRouter;
