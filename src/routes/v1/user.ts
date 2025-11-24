import express from 'express';
import { body, cookie, param, query } from 'express-validator';
// mid-ware
import validationError from '@/midleware/validationErrors';
import authenticate from '@/midleware/authenticate';
import authorize from '@/midleware/authorization';

// comtroller
import { getCurrentUser } from '@/controllers/v1/user/getCurrentUser';
import UpdateCurrentUser from '@/controllers/v1/user/UpdateCurrentUser';
import DeleteCurrentUser from '@/controllers/v1/user/DeleteCurrentUser';
import GetallUsers from '@/controllers/v1/user/Getallusers';
import GETuserById from '@/controllers/v1/user/GETuserById';

// models
import userModel from '@/models/user';

const userRouter = express.Router();

userRouter.get(
  '/current',
  authenticate,
  authorize(['admin', 'user']),
  getCurrentUser,
);
userRouter.put(
  '/current-update',
  authenticate,
  authorize(['admin', 'user']),
  [
    body('username')
      .optional()
      .trim()
      .isLength({ max: 20 })
      .withMessage('Username must be less than 20 characters')
      .custom(async (val) => {
        const user = await userModel.exists({ username: val });
        if (user) {
          throw new Error('Username already taken');
        }
      }),
    body('email')
      .optional()
      .trim()
      .isEmail()
      .withMessage('Invalid email format')
      .custom(async (val) => {
        const user = await userModel.exists({ email: val });
        if (user) {
          throw new Error('Email already in use');
        }
      }),
    body('password')
      .optional()
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
    body('firstname')
      .optional()
      .trim()
      .isLength({ max: 30 })
      .withMessage('First name must be less than 30 characters'),
    body('lastname')
      .optional()
      .trim()
      .isLength({ max: 30 })
      .withMessage('Last name must be less than 30 characters'),
  ],
  validationError,
  UpdateCurrentUser,
);

userRouter.delete(
  '/current-delete',
  authenticate,
  authorize(['admin', 'user']),
  DeleteCurrentUser,
);

userRouter.get(
  '/getAllUsers',
  authenticate,
  authorize(['admin']),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 to 50'),
  query('offset')
    .optional()
    .isInt({ min: 0 })
    .withMessage('offset must be an positive integer'),
  validationError,
  GetallUsers,
);

userRouter.get(
  '/:userId',
  authenticate,
  authorize(['admin']),
  param('userId').notEmpty().isMongoId().withMessage('invalid userId'),
  GETuserById,
);

/**   body('website')
      .optional()
      .trim()
      .isURL()
      .withMessage('Website must be a valid URL'),
    body('facebook')
      .optional()
      .trim()
      .isURL()
      .withMessage('Facebook must be a valid URL'),
    body('instagram')
      .optional()
      .trim()
      .isURL()
      .withMessage('Instagram must be a valid URL'),
    body('linkedin')
      .optional()
      .trim()
      .isURL()
      .withMessage('LinkedIn must be a valid URL'),
    body('x')
      .optional()
      .trim()
      .isURL()
      .withMessage('X (Twitter) must be a valid URL'),
    body('youtube')
      .optional()
      .trim()
      .isURL()
      .withMessage('YouTube must be a valid URL'), */
export default userRouter;
