const express = require('express');
const multer = require('multer');
const upload = multer();

const currentUserMiddleware = require('../authentication/middleware/currentUserMiddleware');
const { getBookmarks, setBookmarks, addBookmark } = require('./data');

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

const deleteBookmark = (req, res) => {
  setBookmarks(
    getBookmarks().filter(
      bookmark => bookmark.id !== parseInt(req.params.id, 10),
    ),
  );
  res.status(200);
  res.json(getBookmarks());
};

const bookmarksRouter = express.Router();
bookmarksRouter
  .route('/')
  .get(currentUserMiddleware, getBookmarksHandler)
  .post(upload.single('thumbnail'), addBookmarkHandler);
bookmarksRouter.route('/:id').delete(deleteBookmark);
bookmarksRouter.use('/media', express.static(`${__dirname}/media`));

module.exports = bookmarksRouter;
