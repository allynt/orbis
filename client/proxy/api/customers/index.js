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
  res.json(getCustomer(req.params.customerId));
};

const getCustomerUsersHandler = (req, res) => {
  console.log('Returning all Users of Current Customer');
  res.status(200);
  res.json(getCustomerUsers(req.params.customerId));
};

const createCustomerUserHandler = (req, res) => {
  const newUser = createCustomerUser(req.params.customerId, req.body);
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
<<<<<<< HEAD
  const deletedUser = deleteCustomerUser(req.params.userId);
  res.status(200);
  res.json(deletedUser);
=======
  deleteCustomerUser(req.params.user);
  res.status(200);
  res.json(getCustomerUsers());
>>>>>>> fix(frontend): Add tests, tidy up code and styling
};

const usersRouter = express.Router();

usersRouter.route('/:customerId').get(getCustomerHandler);

usersRouter
  .route('/:customerId/users')
  .get(getCustomerUsersHandler)
  .post(createCustomerUserHandler);

usersRouter
<<<<<<< HEAD
  .route('/:customerId/users/:userId')
=======
  .route('/:customer/users/:username')
>>>>>>> fix(frontend): Add tests, tidy up code and styling
  .get(getSelectedUserHandler)
  .delete(deleteSelectedUserHandler);

module.exports = usersRouter;
