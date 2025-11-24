/** */

import userModel from '@/models/user';
import tokenModel from '@/models/token';
//
import { genrateAccessToken, genrateRefreshToken } from '@/libs/Jwt';
import { logger } from '../../../utils/winston';
import { config } from '@/config/index';
//
import type { IUser } from '@/models/user';
import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';

type userdata = Pick<IUser, 'email' | 'password'>;

const lgoin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body as userdata;

    const user = await userModel
      .findOne({ email })
      .select('username email password role')
      .lean()
      .exec();

    if (!user) {
      res.status(404).json({
        success: false,
        Code: 'NotFound',
        message: 'user not found plz register to login ',
      });
      return;
    }

    const ispasswordMatch = await bcrypt.compare(password, user.password);

    if (!ispasswordMatch) {
      res.status(401).json({
        code: 'password-Missmatch',
        message: 'the password u enter is wrong plx try again',
        success: 'false',
      });
      return;
    }

    const accessToken = genrateAccessToken(user._id);
    const RefreshToken = genrateRefreshToken(user._id);

    await tokenModel.create({ token: RefreshToken, userId: user._id });

    logger.info('refresh token created for user', {
      userId: user._id,
      token: RefreshToken,
    });

    res.cookie('refreshtoken', RefreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      user: {
        username: user.username,
        email: user.email,
        role: user.role,
      },
      accessToken,
    });
    logger.info(`user ${user.username} as been logged in successfully`, {
      token: accessToken,
    });
  } catch (error) {
    res.status(500).json({
      code: 'ServerErorr',
      message: 'internal server error',
      error: error,
      success: false,
    });
    logger.error('Error during user login', {
      error: error instanceof Error ? error.message : error,
    });
  }
};

export default lgoin;
