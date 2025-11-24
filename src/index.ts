import app from './app';
import IndexrouterV1 from './routes/v1/index';
import connectinstance from './database/Database';
// custom imports

import { config } from './config/index';
import handleServerShutdown from './utils/handleserverShutdown';
import { logger } from './utils/winston';

(async () => {
  try {
    await connectinstance();

    app.use('/api/v1/', IndexrouterV1);
    app.listen(config.PORT || 4000, () => {
      logger.info(
        `THE SERVER IS CONNECT TO THE PORT http://localhost:${config.PORT || 4000}`,
      );
    });
  } catch (error) {
    logger.error('FILED TO START THE SERVER ', error);
    process.exit(1);
  }
})();

process.on('SIGTERM', handleServerShutdown);
process.on('SIGINT', handleServerShutdown);
