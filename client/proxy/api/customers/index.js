const express = require('express');
const currentUserMiddleware = require('../authentication/middleware/currentUserMiddleware');
const { getAllCustomers, getAllUserCustomers } = require('./data');

const getAllCustomersHandler = (req, res) => {
  console.log('Returning All Customers');
  res.status(200);
  res.json(getAllCustomers());
};

const getAllUserCustomersHandler = (req, res) => {
  console.log('Returning Current User Customers', req.currentUser.customers);
  res.status(200);
  res.json(getAllUserCustomers(req.currentUser.customers));
};

const usersRouter = express.Router();

usersRouter.route('/').get(getAllCustomersHandler);
usersRouter.route('/:username').get(currentUserMiddleware, getAllUserCustomersHandler);

module.exports = usersRouter;
