// node modules
import express from 'express';
import { body, cookie, param, query } from 'express-validator';

// "multer"
import multer from 'multer';

// mid-ware
import validationError from '@/midleware/validationErrors';
import authenticate from '@/midleware/authenticate';
import authorize from '@/midleware/authorization';

// imports

import { create_blog } from '@/controllers/v1/blogs/create_blog';
import uploadbanner from '@/midleware/uploadBlogBanner';

const upload = multer();

const blogRoute = express.Router();

blogRoute.post(
  '/create-blog',
  authenticate,
  authorize(['admin']),
  upload.single('banner_image'),
  uploadbanner('post'),
  body('title').trim().notEmpty().withMessage('string should not be empty '),
  body('content').trim().notEmpty().withMessage('content should not be empty'),
  body('status')
    .optional()
    .isIn(['darft', 'published'])
    .withMessage('Staus should be draft or published only'),
  validationError,
  create_blog,
);

export default blogRoute;
