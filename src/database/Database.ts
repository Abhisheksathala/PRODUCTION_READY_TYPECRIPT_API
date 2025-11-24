import mongoose from 'mongoose';
import type { ConnectOptions } from 'mongoose';
import { logger } from '../utils/winston';
//
const url: string = process.env.MONGO_URI as string;
const dbName: string = 'TYPESCRIPAPI';
if (!url) throw new Error('MONGO_URI not defined');

const connectinstance = async (): Promise<void> => {
  try {
    const connect = await mongoose.connect(url, {
      dbName,
    });
    if (connect) {
      logger.info(`the server connect to the:${connect.connection.host}`);
    }
  } catch (error) {
    logger.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

export default connectinstance;
