const bodyParser = require('body-parser');
const express = require('express');

const routes = require('./api');
const staticDataRouter = require('./static-data');

const app = express();

// configure body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = process.env.PORT || 8000; // set our port

// create our router
const router = express.Router();

/* API */
// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function (req, res) {
  res.json({ message: 'hooray! welcome to our api!' });
});

router.use('/app', routes.appRoutes);
router.use('/authentication', routes.authRoutes);
router.use('/bookmarks', routes.bookmarksRoutes);
router.use('/data', routes.dataRoutes);
router.use('/orbs', routes.orbsRoutes);
router.use('/satellites', routes.satellitesRoutes);
router.use('/stories', routes.storiesRoutes);
router.use('/users', routes.usersRoutes);
router.use('/customers', routes.customersRoutes);
router.use('/mission-control', routes.missionControlRoutes);

// REGISTER OUR ROUTES -------------------------------
app.use('/api', router);
app.use('/static-data', staticDataRouter);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log(`API Proxy listening on: http://localhost:${port}`);
