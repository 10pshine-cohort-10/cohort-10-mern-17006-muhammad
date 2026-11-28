import mongoose from 'mongoose';
import logger from './logger';

async function connectDB(): Promise<void> {
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error('MONGODB_URI is not configured');
    }

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
    });

    mongoose.connection.on('error', (err: Error) => {
      logger.error({ err }, 'MongoDB error');
    });

    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
    });

    logger.info('MongoDB connected');
  } catch (error: unknown) {
    throw error;
  }
}

export async function disconnectDB(): Promise<void> {
  try {
    await mongoose.disconnect();
    logger.info('MongoDB disconnected');
  } catch (error: unknown) {
    throw error;
  }
}

export default connectDB;
