'use strict';

const util = require('../util.js');

let printResults = 'mapper_1585433283850837295.pdf';

let error = [{
  message: 'Error printing',
  data: [{
    dpi: 'dpi',
    bbox: [0,0,0,0],
    resolution: 100.0
  }]
}];

let print = (req, res) => {
  console.log('Print: ', req.body);
  if (req.body.title === 'error') {
    res.status(400);
    res.json(error);
  } else if (req.body.title === 'downloaderror') {
    res.send('error.pdf');
  } else {
    util.wait(5000);

    res.send(printResults);
  }
};

const downloadFile = function(req, res) {
  console.log('Print download: ', req.query);
  if (req.query.id !== 'error.pdf') {
    res.contentType('application/zip');
    res.status(200);
    res.send("NOT REALLY A ZIP FILE");
  } else {
    res.status(500);
    res.send('Print error');
  }
};

module.exports = {
  print,
  downloadFile
};
