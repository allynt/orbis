const hourglass = require('./hourglass');
const mySupplyLynk = require('./mysupplylynk');
const rice = require('./rice');
const crowdless = require('./lanterne');

module.exports = [...hourglass, ...rice, ...mySupplyLynk, ...crowdless];
