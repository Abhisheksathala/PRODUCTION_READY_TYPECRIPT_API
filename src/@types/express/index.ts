import * as express from 'express';

import { Types } from 'mongoose';
import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      userId?: Types.ObjectId;
    }
  }
}
