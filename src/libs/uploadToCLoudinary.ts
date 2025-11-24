import { v2 as cloudinary } from 'cloudinary';
import { config } from '../config/index';
import { logger } from '@/utils/winston';
import { UploadApiResponse } from 'cloudinary';

cloudinary.config({
  cloud_name: config.CLOUDINARY_CLOUD_NAME,
  api_key: config.CLOUDINARY_API_KEY,
  api_secret: config.CLOUDINARY_API_SECRATE,
});

const uploadToCloudinary = (
  buffer: Buffer,
  publicId?: string,
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: 'blog-api',
          allowed_formats: ['png', 'jpg', 'webp'],
          resource_type: 'image',
          public_id: publicId,
          transformation: { quality: 'auto' },
        },
        (error, result) => {
          if (error) {
            logger.error('Error uploading image to Cloudinary:', error);
            return reject(error);
          }
          if (!result) {
            return reject(new Error('No result returned from Cloudinary'));
          }
          resolve(result);
        },
      )
      .end(buffer);
  });
};

export default uploadToCloudinary;
