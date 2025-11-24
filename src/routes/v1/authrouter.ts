import express from 'express';
import register from '../../controllers/v1/auth/register';
import lgoin from '../../controllers/v1/auth/login';
import { body, cookie } from 'express-validator';
import validationError from '@/midleware/validationErrors';
import userModel from '@/models/user';
import bcrypt from 'bcrypt';

import refreshToken from '@/controllers/v1/auth/refreshtoken';

import logout from '@/controllers/v1/auth/logout';

import authenticate from '@/midleware/authenticate';

const authrouther = express.Router();

authrouther.post(
  '/register',
  body('email')
    .trim()
    .notEmpty()
    .withMessage('email is required')
    .isLength({ max: 50 })
    .withMessage('Email must be less then 50 char ')
    .isEmail()
    .withMessage('invalid email address'),
  // .custom(async (value) => {
  //   let userexist = await userModel.findOne({ email: value });
  //   if (userexist) {
  //   }
  // })   used for finding user

  body('password')
    .notEmpty()
    .withMessage('password is requried')
    .isLength({ min: 8, max: 20 })
    .withMessage('password must more then 8 chars and less then 20 '),
  body('role')
    .optional()
    .isString()
    .withMessage('Role must be string')
    .isIn(['admin', 'user'])
    .withMessage('Role must be either admin ore user'),
  validationError,
  register,
);
authrouther.post(
  '/login',
  body('email')
    .trim()
    .notEmpty()
    .withMessage('email is required')
    .isLength({ max: 50 })
    .withMessage('Email must be less then 50 char ')
    .isEmail()
    .withMessage('invalid email address'),
  body('password')
    .notEmpty()
    .withMessage('password is requried')
    .isLength({ min: 8, max: 20 })
    .withMessage('password must more then 8 chars and less then 20 '),
  body('role')
    .optional()
    .isString()
    .withMessage('Role must be string')
    .isIn(['admin', 'user'])
    .withMessage('Role must be either admin ore user')
    .custom(async (value, { req }) => {
      const { email } = req.body as { email: string };
      const exist = await userModel
        .findOne({ email: email })
        .select('password')
        .lean()
        .exec();

      if (!exist) {
        throw new Error('user email or passowrd is invalid');
      }

      let validate = await bcrypt.compare(value, exist.password);
      if (!validate) {
        throw new Error('password is not matching ');
      }
    }),
  validationError,
  lgoin,
);
authrouther.post(
  '/refreshToken',
  cookie('refreshtoken')
    .notEmpty()
    .withMessage('Refresh token reqired')
    .isJWT()
    .withMessage('token must be an jwt token'),
  validationError,
  refreshToken,
);

authrouther.post('/logout', authenticate, logout);

export default authrouther;
