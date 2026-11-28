import type { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import AppError from '../utils/AppError';

declare global {
  namespace Express {
    interface Request {
      user?: { id: string };
    }
  }
}

const auth: RequestHandler = (req, _res, next) => {
  const [scheme, token] = (req.headers.authorization || '').split(' ');
  if (scheme !== 'Bearer' || !token) {
    next(new AppError('Authentication required', 401));
    return;
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    next(new Error('JWT_SECRET is not configured'));
    return;
  }

  try {
    const payload = jwt.verify(token, secret);
    if (typeof payload === 'string' || typeof payload.sub !== 'string') {
      next(new AppError('Invalid or expired token', 401));
      return;
    }
    req.user = { id: payload.sub };
    next();
  } catch {
    next(new AppError('Invalid or expired token', 401));
  }
};

export default auth;
