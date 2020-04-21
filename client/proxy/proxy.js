const express = require('express');
const bodyParser = require('body-parser');

const appRouter = require('./api/app/routes');
const authRouter = require('./api/authentication/routes');
const bookmarksRouter = require('./api/bookmarks/routes');
const dataRouter = require('./api/data/routes');
const satellitesRouter = require('./api/satellites/routes');
const storiesRouter = require('./api/stories/routes');
const usersRouter = require('./api/users/routes');

const app = express();

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

router.use('/app', appRouter);
router.use('/authentication', authRouter);
router.use('/bookmarks', bookmarksRouter);
router.use('/data', dataRouter);
router.use('/satellites', satellitesRouter);
router.use('/stories', storiesRouter);
router.use('/users', usersRouter);

// REGISTER OUR ROUTES -------------------------------
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log(`API Proxy listening on: http://localhost:${port}/api`);
