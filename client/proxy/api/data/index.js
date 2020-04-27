const express = require('express');
const sources = require('./sources');

const allSources = {
  token: 'sdfasdfasf',
  timeout: 60,
  sources,
};

const getSources = (req, res) => {
  res.status(200);
  res.json(allSources);
};

const dataRouter = express.Router();

dataRouter.route('/sources').get(getSources);

module.exports = dataRouter;
