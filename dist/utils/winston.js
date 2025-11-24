import winston from 'winston';
import { config } from '../config';
const { combine, timestamp, json, errors, align, printf, colorize } = winston.format;
const transports = [];
if (true) {
    transports.push(new winston.transports.Console({
        format: combine(colorize({ all: true }), timestamp({ format: 'YYYY-MM-DD hh:mm:ss A' }), align(), printf(({ timeStamp, level, message, ...meta }) => {
            const metaSrr = Object.keys(meta).length
                ? `\n${JSON.stringify(meta)}`
                : '';
            return `${timeStamp} [${level.toLocaleUpperCase()}]: ${message}${metaSrr}`;
        })),
    }));
}
const logger = winston.createLogger({
    level: config.LOG_LEVEL || 'info',
    format: combine(timestamp(), errors({ stack: true }), json()),
    transports,
    silent: process.env.NODE_ENV === 'test',
});
export { logger };
