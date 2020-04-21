const { appConfig } = require('./data');
const express = require('express');

const appRouter = express.Router();

appRouter.route('/config').get((req, res) => {
  console.log('Returning App Config');
  res.status(200);
  res.json(appConfig);
});

module.exports = appRouter;
