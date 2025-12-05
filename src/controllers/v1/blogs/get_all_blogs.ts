import { logger } from '@/utils/winston';
import userModel from '@/models/user';
import type { Request, Response } from 'express';
import { config } from '@/config';
import blogModel from '@/models/blog';

interface QueryType {
  status?: 'draft' | 'published';
}

const GetAllBlogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;

    const limit = parseInt(req.query.limit as string) || config.defaultResLimit;

    const offset =
      parseInt(req.query.offset as string) || config.defaultResOffset;

    const query: QueryType = {};
    const total = await blogModel.countDocuments(query);

    const user = await userModel.findById(userId).select('role').lean().exec();

    if (!user) {
      res.status(404).json({
        code: 'NotFound',
        message: 'users not Found in the data base',
        success: false,
      });
      return;
    }

    if (user?.role === 'user') {
      query.status = 'published';
    }
    const blogs = await blogModel
      .find(query)
      .select('-banner.publicId -__v')
      .populate('author', '-createdAt -updateAt')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(offset)
      .lean()
      .exec();

    res.status(200).json({
      limit,
      offset,
      total,
      blogs,
    });
  } catch (error) {
    res.status(403).json({
      code: 'serverError',
      message: 'Internal server Error',
      success: false,
      error: error,
    });
    logger.error('error while Getting the blogs', error);
  }
};

export default GetAllBlogs;
