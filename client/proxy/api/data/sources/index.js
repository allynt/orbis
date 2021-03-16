const hourglass = require('./hourglass');
const mySupplyLynk = require('./mysupplylynk');
const rice = require('./rice');
const crowdless = require('./lanterne');
const demo = require('./demo');

module.exports = [
  ...hourglass,
  ...rice,
  ...mySupplyLynk,
  ...crowdless,
  ...demo,
];
