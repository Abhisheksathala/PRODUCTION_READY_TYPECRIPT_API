import { logger } from '@/utils/winston';

// modules

import userModelf from '@/models/user';

import type { Types } from 'mongoose';
import type { Request, Response, NextFunction } from 'express';
import userModel from '@/models/user';

export type AuthRole = 'admin' | 'user';

const authorize = (roles: AuthRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId;
    try {
      const user = await userModel
        .findById(userId)
        .select('role')
        .lean()
        .exec();

      if (!user) {
        res.status(404).json({
          code: 'NotFound',
          message: 'user Not Found',
          success: false,
        });
        return;
      }

      if (!roles.includes(user.role)) {
        res.status(403).json({
          code: 'AuthorizationError',
          message: 'Acess denied,no permisson',
          success: false,
        });
      }

      return next();
    } catch (error) {
      res.status(403).json({
        code: 'serverError',
        message: 'Internal server Error',
        success: false,
        error: error,
      });
      logger.error('error while authorizing user', error);
    }
  };
};

export default authorize;
