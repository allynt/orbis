const faker = require('@faker-js/faker/locale/en_GB');
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

dataRouter.route('/crowdedness').get((req, res) => {
  const { latitude, longitude, radius } = req.query;
  const radiusInDegrees = +radius * 0.00001;

  const features = Array(10)
    .fill(undefined)
    .map((_, placeId) => {
      const crowdednessScore = faker.random.number({ min: 1, max: 100 });
      let crowdednessCategory = 'very busy';
      if (crowdednessScore <= 35) crowdednessCategory = 'not busy';
      if (crowdednessScore >= 36 && crowdednessScore <= 70)
        crowdednessCategory = 'busy';

      return {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [
            +faker.address.longitude(
              +longitude + radiusInDegrees,
              +longitude - radiusInDegrees,
            ),
            +faker.address.latitude(
              +latitude + radiusInDegrees,
              +latitude - radiusInDegrees,
            ),
          ],
        },
        properties: {
          placeId,
          name: faker.company.companyName(),
          type: 'supermarket',
          crowdednessScore,
          crowdednessCategory,
          address: [
            faker.address.streetAddress(),
            faker.address.city(),
            faker.address.zipCode(),
          ].join(', '),
        },
      };
    });
  res.status(200);
  res.json({ type: 'FeatureCollection', features });
});

module.exports = dataRouter;
