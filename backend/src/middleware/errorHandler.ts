import type { ErrorRequestHandler } from 'express';
import mongoose from 'mongoose';
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
  } else if (err instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = 'Invalid id';
  } else if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((error) => error.message)
      .join(', ');
  } else if (
    errorObject &&
    'code' in err &&
    err.code === 11000
  ) {
    statusCode = 409;
    message = 'Duplicate value: that record already exists';
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
