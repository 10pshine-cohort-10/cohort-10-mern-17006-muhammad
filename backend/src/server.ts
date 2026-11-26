import 'dotenv/config';
import app from './app';
import logger from './config/logger';

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT);

server.on('error', (error) => {
  logger.fatal({ err: error }, `Failed to start server on port ${PORT}`);
  process.exit(1);
});

server.on('listening', () => logger.info(`Server running on port ${PORT}`));

process.on('unhandledRejection', (reason: unknown) => {
  logger.fatal({ err: reason }, 'Unhandled promise rejection');
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  logger.fatal({ err }, 'Uncaught exception');
  process.exit(1);
});
