const logger = require('../config/logger');

module.exports = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message;

  if (err.type === 'entity.parse.failed') {
    statusCode = 400;
    message = 'Invalid JSON in request body';
  }

  if (statusCode >= 500) {
    logger.error({ err, path: req.originalUrl, method: req.method }, err.message);
    message = 'Internal server error';
  } else {
    logger.warn({ path: req.originalUrl, method: req.method, statusCode }, message);
  }

  res.status(statusCode).json({ status: 'error', message });
};
