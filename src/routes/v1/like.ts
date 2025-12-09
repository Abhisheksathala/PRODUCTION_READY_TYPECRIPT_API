import express from 'express';
// mid-ware
import validationError from '@/midleware/validationErrors';
import authenticate from '@/midleware/authenticate';
import authorize from '@/midleware/authorization';

// comtrollers
import likeBlogs from '@/controllers/v1/Likes/likeBlogs';

const likesRouet = express.Router();

likesRouet.post(
  '/blog/:blogId',
  authenticate,
  authorize(['admin', 'user']),
  likeBlogs,
);
likesRouet.put('');
