const appRoutes = require('./app');
const authRoutes = require('./authentication');
const bookmarksRoutes = require('./bookmarks');
const customersRoutes = require('./customers');
const dataRoutes = require('./data');
const missionControlRoutes = require('./mission-control');
const orbsRoutes = require('./orbs');
const satellitesRoutes = require('./satellites');
const storiesRoutes = require('./stories');
const usersRoutes = require('./users');

module.exports = {
  appRoutes,
  authRoutes,
  bookmarksRoutes,
  dataRoutes,
  orbsRoutes,
  satellitesRoutes,
  storiesRoutes,
  usersRoutes,
  customersRoutes,
  missionControlRoutes,
};
