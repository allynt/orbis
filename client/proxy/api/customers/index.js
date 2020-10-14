const express = require('express');
const {
  getCustomer,
  updateCustomer,
  getCustomerUsers,
  getSelectedUser,
  createCustomerUser,
  updateCustomerUser,
  inviteCustomerUser,
  deleteCustomerUser,
} = require('./data');

const getCustomerHandler = (req, res) => {
  console.log('Returning Current Customer');
  res.status(200);
  res.json(getCustomer(req.params.customerId));
};

const updateCustomerHandler = (req, res) => {
  console.log('Returning Updated Customer');

  const updatedCustomer = updateCustomer(req.body);

  res.status(200);
  res.json(updatedCustomer);
};

const getCustomerUsersHandler = (req, res) => {
  console.log('Returning all Users of Current Customer');
  res.status(200);
  res.json(getCustomerUsers(req.params.customerId));
};

const createCustomerUserHandler = (req, res) => {
  const newUser = createCustomerUser(req.params.customerId, req.body);
  console.log('Created New Customer User: ', newUser);

  res.status(201);
  res.json(newUser);
};

const getSelectedUserHandler = (req, res) => {
  console.log('Returning Selected User of Customer');
  res.status(200);
  res.json(getSelectedUser(req.currentUser.customers));
};

const updateSelectedUserHandler = (req, res) => {
  console.log('Updating Selected User of Customer');

  const user = req.body;

  const updatedUser = updateCustomerUser(user);
  res.status(200);
  res.json(updatedUser);
};

const inviteSelectedUserHandler = (req, res) => {
  console.log('Inviting Selected user of Customer');

  const customerUser = req.body;
  const invitedCustomerUser = invitedCustomerUser(customerUser);

  res.status(200);
  res.json(invitedCustomerUser);
};

const deleteSelectedUserHandler = (req, res) => {
  console.log('Deleting Selected User of Customer');

  deleteCustomerUser(req.params.userId);
  res.sendStatus(200);
};

const usersRouter = express.Router();

usersRouter.route('/:customerId').get(getCustomerHandler);
usersRouter.route('/:customerId').put(updateCustomerHandler);

usersRouter
  .route('/:customerId/users')
  .get(getCustomerUsersHandler)
  .post(createCustomerUserHandler);

usersRouter
  .route('/:customerId/users/:userId')
  .get(getSelectedUserHandler)
  .delete(deleteSelectedUserHandler)
  .put(updateSelectedUserHandler);

usersRouter
  .route('/:customerId/users/:userId/invite/')
  .post(inviteSelectedUserHandler);

module.exports = usersRouter;
