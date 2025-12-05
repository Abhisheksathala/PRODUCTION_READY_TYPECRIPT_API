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
import GetAllBlogs from '@/controllers/v1/blogs/get_all_blogs';
import Get_blogs_by_user from '@/controllers/v1/blogs/get_blogs_by_user';
import Get_blogs_by_slug from '@/controllers/v1/blogs/get_blog_by_slug';

// middleware
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

blogRoute.get(
  '/getallblogs',
  authenticate,
  authorize(['admin', 'user']),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 to 50'),
  query('offset')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Offset must be positive int'),
  validationError,
  GetAllBlogs,
);
//
blogRoute.get(
  '/getblogbyuserId/:userId',
  authenticate,
  authorize(['admin', 'user']),
  param('userId')
    .isMongoId()
    .withMessage('id must be the Mongooes Id Inavlied ID'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 to 50'),
  query('offset')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Offset must be positive int'),
  validationError,
  Get_blogs_by_user,
);

blogRoute.get(
  '/slug/:slug',
  authenticate,
  authorize(['admin', 'user']),
  param('slug').notEmpty().withMessage('slug is required'),
  validationError,
  Get_blogs_by_slug,
);

export default blogRoute;
