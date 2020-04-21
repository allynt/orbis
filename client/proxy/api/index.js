const appRoutes = require('./app/routes');
const authRoutes = require('./authentication/routes');
const bookmarksRoutes = require('./bookmarks/routes');
const dataRoutes = require('./data/routes');
const satellitesRoutes = require('./satellites/routes');
const storiesRoutes = require('./stories/routes');
const usersRoutes = require('./users/routes');

module.exports = {
  appRoutes,
  authRoutes,
  bookmarksRoutes,
  dataRoutes,
  satellitesRoutes,
  storiesRoutes,
  usersRoutes
};
