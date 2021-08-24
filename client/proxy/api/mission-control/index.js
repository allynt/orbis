const express = require('express');

const { getSavedDocuments } = require('./data');

const getSavedDocumentsHandler = (req, res) => {
  console.log('Returning Saved Documents');

  const documents = getSavedDocuments(req.params.userId);
  res.status(200).json(documents);
};

const missionControlRouter = express.Router();

missionControlRouter
  .route('/saved-documents/:userId')
  .get(getSavedDocumentsHandler);

module.exports = missionControlRouter;
