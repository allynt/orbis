const express = require('express');
const { satellites, satelliteScenes } = require('./data');
let { savedSatelliteSearches, pinnedScenes } = require('./data');

const getSatellites = (req, res) => {
  console.log('Returning Satellites');
  res.status(200);
  res.json(satellites);
};

const getSatelliteSearches = (req, res) => {
  res.status(200);
  res.json(savedSatelliteSearches);
};

const saveSatelliteSearch = (req, res) => {
  const searches = [...savedSatelliteSearches, req.body];
  res.status(200);
  res.json(searches);
};

const deleteSatelliteSearch = (req, res) => {
  savedSatelliteSearches = savedSatelliteSearches.filter(sat => sat.id !== parseInt(req.params.id, 10));
  res.sendStatus(200);
};

const searchSatelliteScenes = (req, res) => {
  console.log('Returning search results');
  res.status(200);
  res.json(satelliteScenes);
};

const getPinnedScenes = (req, res) => {
  console.log('Returning Pinned Scenes');
  res.status(200);
  res.json(pinnedScenes);
};

const pinScene = (req, res) => {
  pinnedScenes = [...pinnedScenes, req.body];
  res.status(200);
  res.json(pinnedScenes[pinnedScenes.length - 1]);
};

const deletePinnedScene = (req, res) => {
  pinnedScenes = pinnedScenes.filter(scene => scene.id !== req.params.id);
  res.sendStatus(200);
};

const satellitesRouter = express.Router();

satellitesRouter.route('/').get(getSatellites);
satellitesRouter.route('/run_query').post(searchSatelliteScenes);
satellitesRouter
  .route('/results')
  .get(getPinnedScenes)
  .post(pinScene);
satellitesRouter.route('/results/:id').delete(deletePinnedScene);
satellitesRouter
  .route('/searches')
  .get(getSatelliteSearches)
  .post(saveSatelliteSearch);
satellitesRouter.route('/searches/:id').delete(deleteSatelliteSearch);

module.exports = satellitesRouter;
