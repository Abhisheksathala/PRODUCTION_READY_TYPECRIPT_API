import { logger } from '@/utils/winston';
import userModel from '@/models/user';
import type { Request, Response } from 'express';
import { config } from '@/config';

const GETuserById = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    const user = await userModel.findById(userId).select('-__v').exec();
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

export default GETuserById;
