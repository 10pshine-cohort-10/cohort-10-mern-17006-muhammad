import type { ErrorRequestHandler } from 'express';
import logger from '../config/logger';

const errorHandler: ErrorRequestHandler = (err: unknown, req, res, _next) => {
  const errorObject = typeof err === 'object' && err !== null;
  const errorMessage =
    errorObject && 'message' in err && typeof err.message === 'string'
      ? err.message
      : 'Internal server error';
  let statusCode =
    errorObject && 'statusCode' in err && typeof err.statusCode === 'number'
      ? err.statusCode
      : 500;
  let message = errorMessage;
  const errorType =
    errorObject && 'type' in err && typeof err.type === 'string' ? err.type : undefined;

  if (errorType === 'entity.parse.failed') {
    statusCode = 400;
    message = 'Invalid JSON in request body';
  }

  if (statusCode >= 500) {
    logger.error({ err, path: req.originalUrl, method: req.method }, errorMessage);
    message = 'Internal server error';
  } else {
    logger.warn({ path: req.originalUrl, method: req.method, statusCode }, message);
  }

  res.status(statusCode).json({ status: 'error', message });
};

export default errorHandler;
