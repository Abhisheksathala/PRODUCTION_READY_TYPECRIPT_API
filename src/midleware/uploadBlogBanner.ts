import { blogModel } from '@/models/blog';
import { logger } from '@/utils/winston';

import type { Request, Response, NextFunction } from 'express';

// constants

const MAX_FILE_SIZE = 2 * 1024 * 1024; //max 2MB file

const uploadbanner = (method: 'post' | 'put') => {
  return async (req: Request, res: Response, next: NextFunction) => {
    /**
     * Upload code goes here
     */

    if (method === 'put' && !req.file) {
      next();
      return;
    }
    if (!req.file) {
      res.status(400).json({
        code: 'ValidationError',
        messgae: 'Blog Banner is requried ',
        success: false,
      });
      return;
    }
    if (req.file.size > MAX_FILE_SIZE) {
      res.status(413).json({
        code: 'validationError',
        message: 'Files Size is too long must be 2mb',
      });

      try {
        const { blogId } = req.params;

        const blog = await blogModel
          .findById(blogId)
          .select('banner_publicId')
          .exec();

        const data = await uploadToCLoudinary();
      } catch (error) {}
    }
  };
};

export default uploadbanner;
