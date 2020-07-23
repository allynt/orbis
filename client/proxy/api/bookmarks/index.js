const express = require('express');
const multer = require('multer');
const upload = multer();

const currentUserMiddleware = require('../authentication/middleware/currentUserMiddleware');
const { getBookmarks, addBookmark, deleteBookmark } = require('./data');

const getBookmarksHandler = (req, res) => {
  console.log('Returning Bookmarks');
  const userBookmarks = getBookmarks().filter(
    bookmark => bookmark.owner === req.currentUser.id,
  );

  res.status(200);
  res.json(userBookmarks);
};

const addBookmarkHandler = (req, res) => {
  console.log('Adding Bookmark');
  const newBookmark = addBookmark(req.body, req.file);
  res.status(200);
  res.json(newBookmark);
};

const deleteBookmarkHandler = (req, res) => {
  deleteBookmark(+req.params.id);
  res.status(200);
  res.json(getBookmarks());
};

const bookmarksRouter = express.Router();
bookmarksRouter
  .route('/')
  .get(currentUserMiddleware, getBookmarksHandler)
  .post(upload.single('thumbnail'), addBookmarkHandler);
bookmarksRouter.route('/:id').delete(deleteBookmarkHandler);
bookmarksRouter.use('/media', express.static(`${__dirname}/media`));

module.exports = bookmarksRouter;
