import { logger } from '@/utils/winston';
import userModel from '@/models/user';
import type { Request, Response } from 'express';
import { config } from '@/config';
import blogModel from '@/models/blog';

const Get_blogs_by_slug = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.userId;
    const { slug } = req.params;

    const query = {};

    // First, check if the current user exists
    const user = await userModel.findById(userId).select('role').lean().exec();

    if (!user) {
      res.status(404).json({
        code: 'NotFound',
        message: 'User not found in the database',
        success: false,
      });
      return;
    }
    const blogs = await blogModel
      .findOne({ slug })
      .select('-banner.publicId -__v')
      .populate('author', '-createdAt -updateAt')
      .lean()
      .exec();

    if (!blogs) {
      res.status(404).json({
        code: 'NotFound',
        message: 'Blog not Found',
        success: false,
      });
      return;
    }

    // Set query status based on user role
    if (user.role === 'user' && blogs.status === 'draft') {
      res.status(403).json({
        code: 'AuthorizationError',
        message: 'access denied',
      });
      logger.warn('A user tried to accss a draft blog', {
        userId,
        blogs,
      });
      return;
    }

    // Get total count for pagination
    const total = await blogModel.countDocuments({
      author: userId,
      ...query,
    });

    // Send success response
    res.status(200).json({
      success: true,
      total,
      blogs,
    });
  } catch (error) {
    logger.error('Error while getting blogs by slug:', error);

    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      success: false,
      error: process.env.NODE_ENV === 'development' ? error : undefined,
    });
  }
};

export default Get_blogs_by_slug;
