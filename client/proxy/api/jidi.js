'use strict';

const mockDb = require('./mock-db/mock-db.js');

let getJidiImages = (req, res) => {
  console.log('Getting JIDI Images Overlay data');
  return jidiEndpoint.handleRequest(req, res)
};

const jidiEndpoint = {
  handleRequest(req, res){
    let jidiRequest = req.body;
    console.log('jidiEndpoint', 'handleRequest', jidiRequest);
    if (req.query.maxY > 200000) {
      res.json(JSON.parse(mockDb.loadGeoJSON('jidi-features')));
    } else {
      req.status(500);
      res.json();
    }
  }
};

module.exports = {
  getJidiImages
};
