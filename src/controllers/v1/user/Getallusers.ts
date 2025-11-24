import { logger } from '@/utils/winston';
import userModel from '@/models/user';
import type { Request, Response } from 'express';
import { config } from '@/config';

const GetallUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const limit = parseInt(req.query.limit as string) || config.defaultResLimit;

    const offset =
      parseInt(req.query.offset as string) || config.defaultResOffset;

    const total = await userModel.countDocuments();

    const users = await userModel
      .find({})
      .select('-__v')
      .limit(limit)
      .skip(offset)
      .lean()
      .exec();

    if (!users) {
      res.status(404).json({
        code: 'NotFound',
        message: 'users not Found in the data base',
        success: false,
      });
      return;
    }

    res.status(200).json({
      limit,
      offset,
      total,
      users,
    });
  } catch (error) {
    res.status(403).json({
      code: 'serverError',
      message: 'Internal server Error',
      success: false,
      error: error,
    });
    logger.error('error while Getting the users', error);
  }
};

export default GetallUsers;
