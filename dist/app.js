import dotenv from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import helmet from 'helmet';
import { configureCors } from './utils/configureCors.js';
import limiter from './utils/express_rate_limiter.js';
dotenv.config();
const app = express();
app.use(configureCors());
app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compression({
    threshold: 1024,
}));
app.use(helmet());
app.use(limiter);
export default app;
