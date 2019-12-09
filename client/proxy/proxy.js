'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const config = require('./api/config.js');

// configure body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = process.env.PORT || 8000; // set our port

// create our router
const router = express.Router();

// middleware to use for all requests
router.use(function(req, res, next) {
  next();
});

/* API */
// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
  res.json({ message: 'hooray! welcome to our api!' });
});

router.get('/app/config', (req, res) => config.getAppConfig(req, res));

router.get('/users/', (req, res) => config.getUsers(req, res));
router.get('/users/:username/', (req, res) => config.getCurrentUser(req, res));

router.route('/authentication/registration/').post((req, res) => config.register(req, res));
router.route('/authentication/login/').post((req, res) => config.login(req, res));
router.route('/authentication/logout/').post((req, res) => config.logout(req, res));

router.route('/authentication/password/change/').post((req, res) => config.changePassword(req, res));

router.get('/bookmarks/', (req, res) => config.getBookmarks(req, res));
router.route('/bookmarks/').post((req, res) => config.addBookmark(req, res));

// REGISTER OUR ROUTES -------------------------------
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log(`API Proxy listening on: http://localhost:${port}/api`);
