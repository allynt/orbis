const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const data = require('./data');
const appRouter = require('./api/app/routes');
const authRouter = require('./api/authentication/routes');
const bookmarksRouter = require('./api/bookmarks/routes');
const dataRouter = require('./api/data/routes');
const satellitesRouter = require('./api/satellites/routes');
const usersRouter = require('./api/users/routes');

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
router.use('/authentication', authRouter);
router.use('/bookmarks', bookmarksRouter);
router.use('/data', dataRouter);
router.use('/satellites', satellitesRouter);
router.use('/users', usersRouter);

router.get('/stories/', (req, res) => data.getStories(req, res));
router.route('/stories/').post((req, res) => data.addStory(req, res));
router.delete('/stories/:id', (req, res) => data.deleteStory(req, res));

// REGISTER OUR ROUTES -------------------------------
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log(`API Proxy listening on: http://localhost:${port}/api`);
