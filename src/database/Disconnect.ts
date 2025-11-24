import mongoose from 'mongoose';
import { logger } from '../utils/winston';
const clientOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
};

export const disconnectFromDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    logger.info('DISCONNECTED FROM THE DATABASE SUCCESSFULLY', {
      uri: process.env.MONGO_URI,
      options: clientOptions,
    });
  } catch (error) {
    if (error instanceof Error) {
      logger.error('Error disconnecting from database:', error.message);
      throw error;
    } else {
      logger.error('Unknown error disconnecting from database:', error);
      throw new Error('Unknown error during database disconnect');
    }
  }
};
