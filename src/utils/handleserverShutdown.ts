import { disconnectFromDatabase } from '../database/Disconnect';
import { logger } from './winston';

const handleServerShutdown = async (): Promise<void> => {
  try {
    await disconnectFromDatabase();
    logger.warn('server SHUTDOWN');
    process.exit(0);
  } catch (error) {
    logger.error('error during server shutdown : ', error);
  }
};

export default handleServerShutdown;
