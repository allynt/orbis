const appRoutes = require('./app');
const authRoutes = require('./authentication');
const bookmarksRoutes = require('./bookmarks');
const dataRoutes = require('./data');
const satellitesRoutes = require('./satellites');
const storiesRoutes = require('./stories');
const usersRoutes = require('./users');

module.exports = {
  appRoutes,
  authRoutes,
  bookmarksRoutes,
  dataRoutes,
  satellitesRoutes,
  storiesRoutes,
  usersRoutes
};
