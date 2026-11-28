import type { RequestHandler } from 'express';
import * as authService from '../services/authService';
import AppError from '../utils/AppError';

export const register: RequestHandler = async (req, res) => {
  const result = await authService.register(req.body);
  res.status(201).json({ status: 'success', ...result });
};

export const login: RequestHandler = async (req, res) => {
  const result = await authService.login(req.body);
  res.json({ status: 'success', ...result });
};

export const me: RequestHandler = async (req, res) => {
  if (!req.user) {
    throw new AppError('Authentication required', 401);
  }
  const user = await authService.getProfile(req.user.id);
  res.json({ status: 'success', user });
};
