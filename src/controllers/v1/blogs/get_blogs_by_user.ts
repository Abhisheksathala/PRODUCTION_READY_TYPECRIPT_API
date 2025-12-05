import { logger } from '@/utils/winston';
import userModel from '@/models/user';
import type { Request, Response } from 'express';
import { config } from '@/config';
import blogModel from '@/models/blog';

interface QueryType {
  status?: 'draft' | 'published';
}

const Get_blogs_by_user = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { userId } = req.params;
    const getCurrentuserId = req.userId;

    const limit = parseInt(req.query.limit as string) || config.defaultResLimit;
    const offset =
      parseInt(req.query.offset as string) || config.defaultResOffset;

    const query: QueryType = {};

    // First, check if the current user exists
    const currentuser = await userModel
      .findById(getCurrentuserId)
      .select('role')
      .lean()
      .exec();

    if (!currentuser) {
      res.status(404).json({
        code: 'NotFound',
        message: 'User not found in the database',
        success: false,
      });
      return;
    }

    // Set query status based on user role
    if (currentuser.role === 'user') {
      query.status = 'published';
    }

    // Get total count for pagination
    const total = await blogModel.countDocuments({
      author: userId,
      ...query,
    });

    // Fetch blogs with pagination and population
    const blogs = await blogModel
      .find({ author: userId, ...query })
      .select('-banner.publicId -__v')
      .populate('author', '-createdAt -updateAt')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(offset)
      .lean()
      .exec();

    // Send success response
    res.status(200).json({
      success: true,
      limit,
      offset,
      total,
      blogs,
    });
  } catch (error) {
    logger.error('Error while getting blogs by userId:', error);

    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      success: false,
      error: process.env.NODE_ENV === 'development' ? error : undefined,
    });
  }
};

export default Get_blogs_by_user;
