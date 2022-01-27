import { rest } from 'msw';

import {
  addBookmark,
  deleteBookmark,
  getBookmarks,
} from 'mocks/fixtures/bookmarks';

const URL_PATH = '*/api/bookmarks/';

const getBookmarksHandler = rest.get(URL_PATH, (req, res, ctx) => {
  const ownerId = req.headers.get('authorization').split(' ')[1];

  const bookmarks = getBookmarks().filter(
    bookmark => bookmark.owner === ownerId,
  );

  return res(ctx.status(200), ctx.json(bookmarks));
});

const addBookmarkHandler = rest.post(URL_PATH, (req, res, ctx) => {
  let bookmark = {};
  for (let [key, value] of req.body) {
    bookmark[key] = value;
  }

  const newBookmark = addBookmark(bookmark);

  return res(ctx.status(200), ctx.json(newBookmark));
});

const deleteBookmarkHandler = rest.delete(`${URL_PATH}:id`, (req, res, ctx) => {
  deleteBookmark(+req.params.id);

  return res(ctx.status(200), ctx.json(getBookmarks()));
});

const handlers = [
  getBookmarksHandler,
  addBookmarkHandler,
  deleteBookmarkHandler,
];

export default handlers;
