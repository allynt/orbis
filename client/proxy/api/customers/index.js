const express = require('express');
const currentUserMiddleware = require('../authentication/middleware/currentUserMiddleware');
const {
  getCustomer,
  createCustomer,
  updateCustomer,
  getCustomerUsers,
  getSelectedUser,
  createCustomerUser,
  updateCustomerUser,
  inviteCustomerUser,
  deleteCustomerUser,
  createOrder,
} = require('./data');

const getCustomerHandler = (req, res) => {
  console.log('Returning Current Customer');
  res.status(200);
  res.json(getCustomer(req.params.customerId));
};

const createCustomerHandler = (req, res) => {
  res.status(200);
  res.json(createCustomer(req.body));
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
  const invitedCustomerUser = inviteCustomerUser(customerUser);

  res.status(200);
  res.json(invitedCustomerUser);
};

const deleteSelectedUserHandler = (req, res) => {
  console.log('Deleting Selected User of Customer');

  deleteCustomerUser(req.params.userId);
  res.sendStatus(200);
};

const createOrderHandler = (req, res) => {
  const order = createOrder(
    req.currentUser.email,
    req.params.customerId,
    req.body,
  );
  req.status(200);
  req.json(order);
};

const customersRouter = express.Router();

customersRouter.route('/').post(createCustomerHandler);

customersRouter
  .route('/:customerId')
  .get(getCustomerHandler)
  .put(updateCustomerHandler);

customersRouter
  .route('/:customerId/users')
  .get(getCustomerUsersHandler)
  .post(createCustomerUserHandler);

customersRouter
  .route('/:customerId/users/:userId')
  .get(getSelectedUserHandler)
  .delete(deleteSelectedUserHandler)
  .put(updateSelectedUserHandler);

customersRouter
  .route('/:customerId/users/:userId/invite/')
  .post(inviteSelectedUserHandler);

customersRouter
  .route('/:customerId/orders')
  .post(currentUserMiddleware, createOrderHandler);

module.exports = customersRouter;
