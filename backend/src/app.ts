import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import pinoHttp from 'pino-http';
import { rateLimit } from 'express-rate-limit';
import logger from './config/logger';
import errorHandler from './middleware/errorHandler';
import AppError from './utils/AppError';
import authRoutes from './routes/authRoutes';

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173' }));
app.use(express.json({ limit: '1mb' }));
app.use(
  pinoHttp({
    logger,
    customLogLevel: (req, res, err) =>
      err || res.statusCode >= 500 ? 'error' : res.statusCode >= 400 ? 'warn' : 'info',
  })
);

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

app.use(
  '/api/auth',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: true,
    legacyHeaders: false,
  }),
  authRoutes,
);

app.use((req, res, next) => next(new AppError('Route not found', 404)));
app.use(errorHandler);

export default app;
