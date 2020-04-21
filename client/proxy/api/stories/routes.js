const express = require('express');
const { addStory, deleteStory, getStories } = require('./data');
const { getCurrentUser } = require('../authentication/data');

const getStoriesHandler = (req, res) => {
  console.log('Returning Stories');
  const currentUser = getCurrentUser();
  const userStories = getStories().filter(story => story.owner === currentUser.id);

  res.status(200);
  res.json(userStories);
};

const addStoryHandler = (req, res) => {
  console.log('Adding Story');
  const story = {
    ...req.body
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
  .get(getStoriesHandler)
  .post(addStoryHandler);
storiesRouter.route('/:id').delete(deleteStoryHandler);

module.exports = storiesRouter;
