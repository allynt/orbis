const express = require('express');

const currentUserMiddleware = require('../authentication/middleware/currentUserMiddleware');
const { getBookmarks, setBookmarks, addBookmark } = require('./data');

const getBookmarksHandler = (req, res) => {
  console.log('Returning Bookmarks');
  const userBookmarks = getBookmarks().filter(bookmark => bookmark.owner === req.currentUser.id);

  res.status(200);
  res.json(userBookmarks);
};

const addBookmarkHandler = (req, res) => {
  console.log('Adding Bookmark');
  const bookmark = {
    ...req.body
  };

  addBookmark(bookmark);
  res.status(200);
  res.json(bookmark);
};

const deleteBookmark = (req, res) => {
  setBookmarks(getBookmarks().filter(bookmark => bookmark.id !== parseInt(req.params.id, 10)));
  res.status(200);
  res.json(getBookmarks());
};

const bookmarksRouter = express.Router();

bookmarksRouter
  .route('/')
  .get(currentUserMiddleware, getBookmarksHandler)
  .post(addBookmarkHandler);
bookmarksRouter.route('/:id').delete(deleteBookmark);

module.exports = bookmarksRouter;
