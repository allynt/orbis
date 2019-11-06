'use strict';


const PROJECTIONS = [{
  "code": "EPSG:27700",
  "displayName": "British National Grid"
  }, {
  "code": "EPSG:4258",
  "displayName": "ETRS89"
  }, {
  "code": "EPSG:4326",
  "displayName": "WGS84"
  }, {
  "code": "EPSG:3857",
  "displayName": "Web Mercator"
  }
];


let getProjections = (req, res) => {
  console.log('Getting Projections');
  res.json(PROJECTIONS);
};


module.exports = {
  getProjections
};
