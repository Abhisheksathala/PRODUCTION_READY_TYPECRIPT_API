import tokenModel from '@/models/token';
import { genrateAccessToken, verifyrefreshToken } from '@/libs/Jwt';
import { logger } from '../../../utils/winston';

import type { Request, Response } from 'express';
import { Types } from 'mongoose';

import jwt from 'jsonwebtoken';
const { JsonWebTokenError, TokenExpiredError } = jwt;

const refreshToken = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshtoken as string;

  try {
    const tokenExist = await tokenModel.exists({ token: refreshToken });
    if (!tokenExist) {
      res.status(401).json({
        code: 'AUthenticated error',
        message: 'invalid refresh token',
      });
      return;
    }
    // verify reshertoken

    const jwtpaylod = verifyrefreshToken(refreshToken) as {
      userId: Types.ObjectId;
    };

    const accesstoken = genrateAccessToken(jwtpaylod.userId);

    res.status(200).json({
      accesstoken,
    });
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      res.status(400).json({
        code: 'AuthanticationError',
        message: 'Refresh token expired,please login again ',
      });
      return;
    }
    if (error instanceof JsonWebTokenError) {
      res.status(401).json({
        code: 'AuthanticationError',
        message: 'Invalid refresh token',
      });
    }
    res.status(500).json({
      code: 'ServerError',
      message: 'internal server error',
      error: error,
    });
  }
};

export default refreshToken;
