const express = require('express');
const fs = require('fs');
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
  const thumbnailBuffer = req.file.buffer;
  const fileName = `${req.body.title.split(/\s/).join('-').toLowerCase()}.png`;
  const dirPath = `${__dirname}/media/${req.body.owner}`;
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
  fs.createWriteStream(`${dirPath}/${fileName}`).write(thumbnailBuffer);
  const bookmark = {
    ...req.body,
    thumbnail: `http://localhost:8000/api/bookmarks/media/${req.body.owner}/${fileName}`,
  };
  addBookmark(bookmark);
  res.status(200);
  res.json(bookmark);
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
