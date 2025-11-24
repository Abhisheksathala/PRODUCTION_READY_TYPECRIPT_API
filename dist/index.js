import app from './app.js';
import IndexrouterV1 from './routes/v1/index.js';
import connectinstance from './database/Database.js';
import { config } from './config/index.js';
import handleServerShutdown from './utils/handleserverShutdown.js';
(async () => {
    try {
        await connectinstance();
        app.use('/api/v1/', IndexrouterV1);
        app.listen(config.PORT || 4000, () => {
            console.log(`THE SERVER IS CONNECT TO THE PORT http://localhost:${config.PORT || 4000}`);
        });
    }
    catch (error) {
        console.log('FILED TO START THE SERVER ', error);
        process.exit(1);
    }
})();
process.on('SIGTERM', handleServerShutdown);
process.on('SIGINT', handleServerShutdown);
