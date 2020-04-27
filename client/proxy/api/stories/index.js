const express = require('express');
const currentUserMiddleware = require('../authentication/middleware/currentUserMiddleware');
const { addStory, deleteStory, getStories } = require('./data');

const getStoriesHandler = (req, res) => {
  console.log('Returning Stories');
  const userStories = getStories().filter(story => story.owner === req.currentUser.id);

  res.status(200);
  res.json(userStories);
};

const addStoryHandler = (req, res) => {
  console.log('Adding Story');
  const story = {
    ...req.body,
  };
  addStory(story);
  res.status(200);
  res.json(story);
};

const deleteStoryHandler = (req, res) => {
  deleteStory(req.params.id);
  res.sendStatus(200);
};

const storiesRouter = express.Router();

storiesRouter
  .route('/')
  .get(currentUserMiddleware, getStoriesHandler)
  .post(addStoryHandler);
storiesRouter.route('/:id').delete(deleteStoryHandler);

module.exports = storiesRouter;
