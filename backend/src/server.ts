import 'dotenv/config';
import app from './app';
import connectDB from './config/db';
import logger from './config/logger';

const PORT = process.env.PORT || 5000;

(async () => {
  await connectDB();

  const server = app.listen(PORT);

  server.on('error', (error) => {
    logger.fatal({ err: error }, `Failed to start server on port ${PORT}`);
    process.exit(1);
  });

  server.on('listening', () => logger.info(`Server running on port ${PORT}`));
})().catch((error: unknown) => {
  logger.fatal({ err: error }, 'Failed to start server');
  process.exit(1);
});

process.on('unhandledRejection', (reason: unknown) => {
  logger.fatal({ err: reason }, 'Unhandled promise rejection');
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  logger.fatal({ err }, 'Uncaught exception');
  process.exit(1);
});
