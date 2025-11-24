import cors, { CorsOptionsDelegate, CorsOptions } from 'cors';
import { Request } from 'express';
import { logger } from './winston';

const configureCors = () => {
  const corsOptionsDelegate: CorsOptionsDelegate<Request> = (req, callback) => {
    const allowedOrigins = ['http://localhost:5173'];

    const origin = req.header('Origin');
    let corsOptions: CorsOptions;

    if (!origin || allowedOrigins.includes(origin)) {
      corsOptions = {
        origin: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Accept-Version'],
        exposedHeaders: ['X-Total-Count', 'Content-Range'],
        credentials: true,
        preflightContinue: false,
        maxAge: 600,
        optionsSuccessStatus: 204,
      };
    } else {
      corsOptions = { origin: false };
      logger.warn(`CORES ERROR:${origin} is not allowed by CORS`);
    }

    callback(null, corsOptions);
  };

  return cors(corsOptionsDelegate);
};

export { configureCors };
