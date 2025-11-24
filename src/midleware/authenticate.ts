import jwt from 'jsonwebtoken';

const { JsonWebTokenError, TokenExpiredError } = jwt;

import { verifyAccessToken } from '@/libs/Jwt';
import type { Request, Response, NextFunction } from 'express';
import type { Types } from 'mongoose';
import { logger } from '@/utils/winston';

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    console.log(authHeader);

    if (!authHeader?.startsWith('Bearer ')) {
      res.status(401).json({
        code: 'AuthenticationError',
        message: 'Access denied , no token ',
      });
      return;
    }
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Access denied. No token provided. Please login to continue',
      });
      return;
    }

    const jwtPayload = verifyAccessToken(token) as { userId: Types.ObjectId };

    req.userId = jwtPayload.userId;

    next();
    return;
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      res.status(401).json({
        code: 'AuthenticationError',
        message:
          'Access token expired , request a  new one with reefresh token ',
      });
      return;
    }
    if (error instanceof JsonWebTokenError) {
      res.status(401).json({
        code: 'AuthenticationError',
        message: 'Access token invalid',
      });
      return;
    }
    res.status(500).json({
      code: 'ServerError',
      message: 'internal error',
      success: false,
      error: error,
    });
    logger.error('Error during authentication', error);
  }
};

export default authenticate;
