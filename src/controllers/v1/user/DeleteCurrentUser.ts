import { logger } from '@/utils/winston';
import userModel from '@/models/user';
import type { Request, Response } from 'express';

const DeleteCurrentUser = async (
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
    const user = await userModel.findById(userId).select('_id').exec();

    if (!user) {
      res.status(404).json({
        code: 'NotFound',
        message: 'user not Found',
        success: false,
      });
      return;
    }

    await userModel.deleteOne({ _id: user._id });
    logger.info('A user account has een deleted', {
      userId,
    });

    res.status(200).json({
      code: 'UpdateSuccess',
      message: 'user profile updated successfully',
      success: true,
      user: user,
    });
  } catch (error) {
    res.status(403).json({
      code: 'serverError',
      message: 'Internal server Error',
      success: false,
      error: error,
    });
    logger.error('error while deleting the currentuser', error);
  }
};

export default DeleteCurrentUser;
