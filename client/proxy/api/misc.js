'use strict';


let getAuthStatus = (req, res) => {
  console.log('Getting Auth Status');
  res.send(true);
};

let log = (req, res) => {
  console.log('Logging User Actions: ' + JSON.stringify(req.body.logData));
    res.send();
};

let keepAlive = (req, res) => {
  console.log('Ping to server to keep the session alive');
  res.json();
};


module.exports = {
  getAuthStatus,
  log,
  keepAlive
};
