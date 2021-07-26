const express = require('express');

const { getOrbs } = require('./data');

const orbsRouter = express.Router();

const getOrbsHandler = (req, res) => {
  res.status(200);
  res.json(getOrbs());
};

orbsRouter.route('/').get(getOrbsHandler);

module.exports = orbsRouter;
