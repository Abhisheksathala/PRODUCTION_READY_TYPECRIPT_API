// custome
import { logger } from '../../../utils/winston';
import { config } from '@/config/index';

// models
import userModel from '@/models/user';
import type { IUser } from '@/models/user';

import tokenModel from '@/models/token';

import type { Request, Response } from 'express';

import { genUserName } from '@/utils/index';
import { genrateAccessToken, genrateRefreshToken } from '@/libs/Jwt';

type userData = Pick<IUser, 'email' | 'password' | 'role'>;

const register = async (req: Request, res: Response): Promise<void> => {
  const { email, password, role } = req.body as userData;

  const emailRegex = /^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/;

  if (!email || !password) {
    res.status(400).json({
      message: 'Email and password are required',
      success: false,
    });
    return;
  }

  if (password && password.length < 8) {
    res.status(400).json({
      message: 'the password must be greater then the 8',
      success: false,
    });
  }

  if (email && !emailRegex.test(email)) {
    res.status(400).json({ message: 'Invalid email format', success: false });
    return;
  }

  if (role === 'admin' && !config.WHITELIST_ADMIN_MAIL.includes(email)) {
    res.status(403).json({
      message: 'you cannot register as an admin',
      code: 'AutherizationError',
      success: false,
    });

    logger.warn(
      `user with email ${email} tried to register as an admin but is not in the whitelist`,
    );
    return;
  }

  try {
    const userExist = await userModel.findOne({ email });
    if (userExist) {
      res.status(400).json({
        message: 'This user already exists , please login',
        success: false,
      });
      return;
    }

    const username = genUserName();
    const createNewuser = new userModel({
      username,
      email,
      password,
      role,
    });
    const createduser = await createNewuser.save();
    const accesstoken = genrateAccessToken(createNewuser._id);
    const Refreshtoken = genrateRefreshToken(createNewuser._id);

    // stor refresh token in the db
    await tokenModel.create({ token: Refreshtoken, userId: createduser._id });
    logger.info('Refresh Token created for user', {
      userdId: createduser._id,
      token: Refreshtoken,
    });

    res.cookie('refreshtoken', Refreshtoken, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: 'new user created',
      success: true,
      user: {
        username: createduser.username,
        email: createduser.email,
        role: createduser.role,
      },
      accesstoken: accesstoken,
    });
    logger.info('user registered successfully', {
      username: createduser.username,
      email: createduser.email,
      role: createduser.role,
    });
  } catch (error) {
    res.status(500).json({
      code: 'ServerErorr',
      message: 'internal server error',
      error: error,
      success: false,
    });
    logger.error('Error during user registration', {
      error: error instanceof Error ? error.message : error,
      email,
    });
  }
};

export default register;
