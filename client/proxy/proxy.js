const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const data = require('./data');
const appRouter = require('./api/app/routes');

// configure body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = process.env.PORT || 8000; // set our port

// create our router
const router = express.Router();

// middleware to use for all requests
app.all('*', function(req, res, next) {
  next();
});

/* API */
// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
  res.json({ message: 'hooray! welcome to our api!' });
});

// router.get('/app/config', (req, res) => config.getAppConfig(req, res));
router.use('/app', appRouter);

router.get('/users/', (req, res) => data.getUsers(req, res));
router.get('/users/:username/', (req, res) => data.getCurrentUser(req, res));

router.get('/satellites/', (req, res) => data.getSatellites(req, res));
router.route('/satellites/run_query/').post((req, res) => data.searchSatelliteScenes(req, res));
router.get('/satellites/results/', (req, res) => data.getPinnedScenes(req, res));
router.route('/satellites/results/').post((req, res) => data.pinScene(req, res));
router.delete('/satellites/results/:id', (req, res) => data.deletePinnedScene(req, res));
router.get('/satellites/searches/', (req, res) => data.getSatelliteSearches(req, res));
router.route('/satellites/searches/').post((req, res) => data.saveSatelliteSearch(req, res));
router.delete('/satellites/searches/:id', (req, res) => data.deleteSatelliteSearch(req, res));

router.route('/authentication/registration/').post((req, res) => data.register(req, res));
router.route('/authentication/login/').post((req, res) => data.login(req, res));
router.route('/authentication/logout/').post((req, res) => data.logout(req, res));

router.route('/authentication/password/change/').post((req, res) => data.changePassword(req, res));

router.get('/bookmarks/', (req, res) => data.getBookmarks(req, res));
router.route('/bookmarks/').post((req, res) => data.addBookmark(req, res));
router.delete('/bookmarks/:id', (req, res) => data.deleteBookmark(req, res));

router.get('/stories/', (req, res) => data.getStories(req, res));
router.route('/stories/').post((req, res) => data.addStory(req, res));
router.delete('/stories/:id', (req, res) => data.deleteStory(req, res));

router.get('/data/sources/', (req, res) => data.getSources(req, res));

// REGISTER OUR ROUTES -------------------------------
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log(`API Proxy listening on: http://localhost:${port}/api`);
