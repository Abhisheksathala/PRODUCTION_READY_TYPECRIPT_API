import { logger } from '@/utils/winston';
import uploadToCloudinary from '@/libs/uploadToCLoudinary';
import blogModel from '@/models/blog';
import type { Request, Response, NextFunction } from 'express';
import { UploadApiErrorResponse } from 'cloudinary';

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

const uploadbanner = (method: 'post' | 'put') => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (method === 'put' && !req.file) {
      return next();
    }

    if (!req.file) {
      return res.status(400).json({
        code: 'ValidationError',
        message: 'Blog Banner is required',
        success: false,
      });
    }

    if (req.file.size > MAX_FILE_SIZE) {
      return res.status(413).json({
        code: 'ValidationError',
        message: 'File size too large. Max allowed size is 2MB',
        success: false,
      });
    }

    try {
      const { blogId } = req.params;

      const blog = await blogModel
        .findById(blogId)
        .select('banner.publicId')
        .lean()
        .exec();

      const oldPublicId = blog?.banner?.publicId?.replace('blog-api/', '');

      const data = await uploadToCloudinary(req.file.buffer, oldPublicId);

      if (!data) {
        logger.error('Cloudinary returned undefined', { blogId });
        return res.status(500).json({
          code: 'ServerError',
          message: 'Failed to upload banner',
          success: false,
        });
      }

      const newBanner = {
        publicId: data.public_id,
        url: data.secure_url,
        width: data.width,
        height: data.height,
      };

      logger.info('Blog banner updated successfully', {
        blogId,
        banner: newBanner,
      });

      req.body.banner = newBanner;
      next();
    } catch (error: UploadApiErrorResponse | any) {
      logger.error('Error uploading blog banner to cloudinary', error);
      return res.status(error.http_code).json({
        code: error.http_code < 500 ? 'validationErro' : error.name,
        message: 'Something went wrong',
        success: false,
      });
    }
  };
};

export default uploadbanner;
