const express = require('express');

const orbsRouter = express.Router();

orbsRouter.route('/').get((req, res) => {
  res.status(200);
  res.json([{ id: 1, name: 'Exploration', features: ['satellites'] }]);
});

module.exports = orbsRouter;
