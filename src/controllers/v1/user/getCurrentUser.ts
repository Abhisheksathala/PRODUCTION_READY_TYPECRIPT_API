import { logger } from '@/utils/winston';

import userModel from '@/models/user';

import type { Request, Response } from 'express';

export const getCurrentUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const userId = req.userId;
  if (!userId) {
    res.status(400).json({
      code: 'MissingUserId',
      message: 'User ID is missing in request',
      success: false,
    });
    return;
  }
  try {
    const user = await userModel.findById(userId).select('-__v').lean().exec();

    if (!user) {
      res.status(404).json({
        code: 'NotFound',
        message: 'user not Found',
        success: false,
      });
      return;
    }

    res.status(403).json({
      code: 'UserFound',
      message: 'user found successfully',
      success: true,
      user: user,
    });
    return;
  } catch (error) {
    res.status(403).json({
      code: 'serverError',
      message: 'Internal server Error',
      success: false,
      error: error,
    });
    logger.error('error while getting currentuser', error);
  }
};
