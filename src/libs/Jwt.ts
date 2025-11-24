import jwt from 'jsonwebtoken';
import { config } from '@/config/index';

import { Types } from 'mongoose';

export const genrateAccessToken = (userId: Types.ObjectId): string => {
  return jwt.sign({ userId }, config.JWT_ACCESS_SECRATE, {
    expiresIn: config.ACCESS_TOKEN_EXPIRY,
    subject: 'accessAPi',
  });
};
export const genrateRefreshToken = (userId: Types.ObjectId): string => {
  return jwt.sign({ userId }, config.JWT_REFRESH_SECRET, {
    expiresIn: config.REFRESH_TOKEN_EXPIRY,
    subject: 'refreshToken',
  });
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, config.JWT_ACCESS_SECRATE);
};
export const verifyrefreshToken = (token: string) => {
  return jwt.verify(token, config.JWT_REFRESH_SECRET);
};
