const express = require('express');
const currentUserMiddleware = require('../authentication/middleware/currentUserMiddleware');
const { getUsers, addUser, updateUser, deleteUser } = require('./data');

const getUsersHandler = (req, res) => {
  console.log('Returning All Users');
  res.status(200);
  res.json(getUsers());
};

const addUserHandler = (req, res) => {
  const user = {
    ...req.body,
  };

  // check if user already exists by email.
  const userExists = getUsers().find(usr => usr.email === user.email);

  if (userExists) {
    res.status(400);
    res.json({ message: 'User already exists', user: userExists });
    return;
  }

  addUser(user);

  // Get the user from the list.
  const usr = getUsers().find(usr => usr.email === user.email);
  console.log('Created New User: ', usr);

  res.status(200);
  res.json(usr);
};

const updateUserHandler = (req, res) => {
  const user = req.body;
  updateUser(user);
  console.log(
    'Updated User: ',
    getUsers().find(usr => usr.id === user.id),
  );

  res.status(200);
  res.json(user);
};

const deleteUserHandler = (req, res) => {
  console.log('Deleting user with id: ', req.params.id);
  deleteUser(req.params.id);
  res.sendStatus(200);
};

const getCurrentUserHandler = (req, res) => {
  console.log('Returning Current User', req.currentUser);
  res.status(200);
  res.json(req.currentUser);
};

const usersRouter = express.Router();

usersRouter.route('/').get(getUsersHandler).post(addUserHandler);
usersRouter.route('/:id').put(updateUserHandler).delete(deleteUserHandler);
usersRouter
  .route('/:username')
  .get(currentUserMiddleware, getCurrentUserHandler);

module.exports = usersRouter;
