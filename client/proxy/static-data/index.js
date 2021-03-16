const express = require('express');

const staticDataRouter = express.Router();

staticDataRouter
  .route('/:authority/:namespace/:name/:version/:file')
  .get((req, res) => {
    const { authority, namespace, name, version, file } = req.params;
    const path = `${authority}/${namespace}/${name}/${version}/${file}`;
    if (file.includes('png')) {
      res.sendFile(path, { root: __dirname });
    } else {
      const data = require(`./${path}`);
      res.send(data);
    }
  });

module.exports = staticDataRouter;
