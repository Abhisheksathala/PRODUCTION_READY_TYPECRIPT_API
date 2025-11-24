import dotenv from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import helmet from 'helmet';
import { configureCors } from './utils/configureCors';
import limiter from './utils/express_rate_limiter';


// roue import
import authrouther from './routes/v1/authrouter.js';
import userRouter from './routes/v1/user';
import blogRoute from './routes/v1/blogRoutes';

dotenv.config();
const app = express();

app.use(configureCors());
app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  compression({
    threshold: 1024,
  }),
);
app.use(helmet());
app.use(limiter);

// route management
app.use('/api/v1/auth', authrouther);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/blog', blogRoute);

export default app;
