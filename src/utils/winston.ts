import winston from 'winston';
import { config } from '../config';

const { combine, timestamp, json, errors, align, printf, colorize } =
  winston.format;

const transports: winston.transport[] = [];

transports.push(
  new winston.transports.Console({
    format: combine(
      colorize({ all: true }),
      timestamp({ format: 'YYYY-MM-DD hh:mm:ss A' }),
      align(),
      printf(({ timestamp, level, message, ...meta }) => {
        const metaStr = Object.keys(meta).length
          ? `\n${JSON.stringify(meta, null, 2)}`
          : '';

        return `${timestamp} [${level}]: ${message}${metaStr}`;
      }),
    ),
  }),
);

const logger = winston.createLogger({
  level: config.LOG_LEVEL || 'info',
  format: combine(timestamp(), errors({ stack: true }), json()),
  transports,
  silent: false,
});

export { logger };
