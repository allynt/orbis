const { getCurrentUser } = require('../data');

module.exports = (req, res, next) => {
  req.currentUser = getCurrentUser();
  next();
};
