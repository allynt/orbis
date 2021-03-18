const express = require('express');

const staticDataRouter = express.Router();

staticDataRouter
  .route('/:authority/:namespace/:name/:version/:file')
  .get((req, res) => {
    const { authority, namespace, name, version, file } = req.params;
    const data = require(`./${authority}/${namespace}/${name}/${version}/${file}`);
    res.send(data);
  });

module.exports = staticDataRouter;
