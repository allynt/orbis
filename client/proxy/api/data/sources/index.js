const healthInfrastructure = require('./scotland-infrastructure');
const hospitalsUk = require('./hospitals-uk');
const populationInformation = require('./hourglass-population-information');
const sentinel2Rgb = require('./sentinel-2-rgb');
const stokeOnTrent = require('./stoke-on-trent');
const superSen2JapanBand = require('./super-sen2-japan-band');

module.exports = [
  healthInfrastructure,
  hospitalsUk,
  populationInformation,
  sentinel2Rgb,
  stokeOnTrent,
  superSen2JapanBand,
];
