const express = require('express');

const { getCurrentUser } = require('../authentication/data');
const { getBookmarks, setBookmarks, addBookmark } = require('./data');

const getBookmarksHandler = (req, res) => {
  console.log('Returning Bookmarks');
  const currentUser = getCurrentUser();
  const userBookmarks = getBookmarks().filter(bookmark => bookmark.owner === currentUser.id);

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
  .get(getBookmarksHandler)
  .post(addBookmarkHandler);
bookmarksRouter.route('/:id').delete(deleteBookmark);

module.exports = bookmarksRouter;
