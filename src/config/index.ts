import dotenv from 'dotenv';
dotenv.config();

import type ms from 'ms';

export const config = {
  PORT: process.env.PORT || '5000',
  MONGO_URI: process.env.MONGO_URI,
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  JWT_ACCESS_SECRATE: process.env.JWT_ACCESS_SECRATE!,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,
  ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY as ms.StringValue,
  REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY as ms.StringValue,
  WHITELIST_ADMIN_MAIL: ['abhishek@gmail.com', 'abhishekdev@gmail.com'],
  defaultResLimit: 20,
  defaultResOffset: 0,

  //  cloud keys

  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME!,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY!,
  CLOUDINARY_API_SECRATE: process.env.CLOUDINARY_API_SECRATE!,
};
