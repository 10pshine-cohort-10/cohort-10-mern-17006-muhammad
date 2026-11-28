import type { RequestHandler } from 'express';
import Joi from 'joi';
import AppError from '../utils/AppError';

function validate(schema: Joi.ObjectSchema): RequestHandler {
  return (req, _res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      next(new AppError(error.details.map((detail) => detail.message).join(', '), 400));
      return;
    }

    req.body = value;
    next();
  };
}

export default validate;
