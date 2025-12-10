import type { Response, Request } from 'express';
import blogModel from '@/models/blog';
import userModel from '@/models/user';
import commentModel from '@/models/comment';
import { logger } from '@/utils/winston';

const getComments = async (req: Request, res: Response): Promise<void> => {
  const { blogId } = req.params;
  const userId = req.userId;

  // Input validation
  if (!blogId) {
    res.status(400).json({
      code: 'BAD_REQUEST',
      message: 'Blog ID is required',
      success: false,
    });
    return;
  }

  if (!userId) {
    res.status(401).json({
      code: 'UNAUTHORIZED',
      message: 'Authentication required',
      success: false,
    });
    return;
  }

  try {
    // Check if blog exists (minimal projection for performance)
    const blog = await blogModel
      .findById(blogId)
      .select('_id title')
      .lean()
      .exec();

    if (!blog) {
      res.status(404).json({
        code: 'NOT_FOUND',
        message: 'Blog not found',
        success: false,
      });
      return;
    }

    // Optional: Verify user exists and has access
    const user = await userModel.findById(userId).select('_id').lean().exec();
    if (!user) {
      res.status(401).json({
        code: 'UNAUTHORIZED',
        message: 'User not found',
        success: false,
      });
      return;
    }

    // Get comments with pagination
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const [comments, totalComments] = await Promise.all([
      commentModel
        .find({ blogId })
        .select('content author createdAt updatedAt')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      commentModel.countDocuments({ blogId }).exec(),
    ]);

    res.status(200).json({
      code: 'SUCCESS',
      message: 'Comments retrieved successfully',
      success: true,
      data: {
        comments,
        pagination: {
          page,
          limit,
          total: totalComments,
          totalPages: Math.ceil(totalComments / limit),
          hasNext: skip + comments.length < totalComments,
          hasPrev: page > 1,
        },
      },
    });

    logger.info('Comments fetched successfully', {
      userId,
      blogId,
      count: comments.length,
    });
  } catch (error) {
    logger.error('Error fetching comments:', error);

    res.status(500).json({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred',
      success: false,
    });
  }
};

export default getComments;
