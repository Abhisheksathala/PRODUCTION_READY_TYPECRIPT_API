import tokenModel from '@/models/token';

import { config } from '@/config';

import type { Request, Response } from 'express';
import { logger } from '@/utils/winston';

const logout = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshtoken;
    if (refreshToken) {
      await tokenModel.deleteOne({ token: refreshToken });
      logger.info('user logedout successfully ', {
        userId: req.userId,
        token: refreshToken,
      });
    }
    res.clearCookie('refreshtoken', {
      httpOnly: true,
    });
  } catch (error) {
    res.status(500).json({
      code: 'serverError',
      message: 'Internal server error',
      error: error,
      success: true,
    });
    logger.error('error during the logout process', error);
  }
};

export default logout;
