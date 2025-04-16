const logger = require('../utils/logger.utils');

module.exports = (req, res, next) => {
  logger.logRequest(req);
  
  // Override res.end to log responses
  const originalEnd = res.end;
  res.end = function(chunk, encoding) {
    logger.logResponse(res);
    originalEnd.call(this, chunk, encoding);
  };
  
  next();
};