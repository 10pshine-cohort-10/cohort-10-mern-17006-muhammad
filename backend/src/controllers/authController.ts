import type { RequestHandler } from 'express';
import * as authService from '../services/authService';
import AppError from '../utils/AppError';

export const register: RequestHandler<
  Record<string, never>,
  unknown,
  authService.RegisterInput
> = async (req, res, next) => {
  try {
    await authService.register(req.body);
    res.status(202).json({
      status: 'success',
      message: 'If registration was successful, you can now sign in.',
    });
  } catch (error) {
    next(error);
  }
};

export const login: RequestHandler<
  Record<string, never>,
  unknown,
  authService.LoginInput
> = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    res.json({ status: 'success', ...result });
  } catch (error) {
    next(error);
  }
};

export const me: RequestHandler = async (req, res, next) => {
  try {
    if (!req.user) {
      throw new AppError('Authentication required', 401);
    }
    const user = await authService.getProfile(req.user.id);
    res.json({ status: 'success', user });
  } catch (error) {
    next(error);
  }
};
