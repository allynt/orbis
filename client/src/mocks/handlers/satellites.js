import { rest } from 'msw';

import {
  satellites,
  satelliteScenes,
  savedSatelliteSearches,
  saveSatelliteSearch,
  // pinnedScenes,
} from 'mocks/fixtures/satellites';

const URL_PATH = '*/api/satellites/';

const getSatellites = rest.get(URL_PATH, (req, res, ctx) => {
  return res(ctx.status(200), ctx.json(satellites));
});

// const saveSatelliteSearch = rest.get(URL_PATH, (req, res, ctx) => {
//   return res(ctx.status(200), ctx.json(satellites));
// });

// const deleteSatelliteSearch = rest.get(URL_PATH, (req, res, ctx) => {
//   return res(ctx.status(200), ctx.json(satellites));
// });

// const searchSatelliteScenes = rest.get(URL_PATH, (req, res, ctx) => {
//   return res(ctx.status(200), ctx.json(satellites));
// });

// const getPinnedScenes = rest.get(URL_PATH, (req, res, ctx) => {
//   return res(ctx.status(200), ctx.json(satellites));
// });

// const pinScene = rest.get(URL_PATH, (req, res, ctx) => {
//   return res(ctx.status(200), ctx.json(satellites));
// });

// const deletePinnedScene = rest.get(URL_PATH, (req, res, ctx) => {
//   return res(ctx.status(200), ctx.json(satellites));
// });

const runQuery = rest.post(`${URL_PATH}run_query/`, (req, res, ctx) => {
  return res(ctx.status(200), ctx.json(satelliteScenes));
});

const saveImage = rest.post(
  `${URL_PATH}datasources/:customerId/:userId/`,
  (req, res, ctx) => {
    saveSatelliteSearch({ ...req.body, id: 10, owner: 1 });

    return res(ctx.status(200), ctx.json(savedSatelliteSearches));
  },
);

const handlers = [
  getSatellites,
  // saveSatelliteSearch,
  // deleteSatelliteSearch,
  // searchSatelliteScenes,
  // getPinnedScenes,
  // pinScene,
  // deletePinnedScene,
  runQuery,
  saveImage,
];

export default handlers;
