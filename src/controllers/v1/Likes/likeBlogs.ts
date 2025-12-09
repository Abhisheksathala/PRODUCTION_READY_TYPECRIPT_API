// types
import type { Response, Request } from 'express';
import blogModel, { Iblog } from '@/models/blog';

// custom modules
import { logger } from '@/utils/winston';

// model LikeModel
import LikeModel from '@/models/Likes';

const likeBlogs = async (req: Request, res: Response): Promise<void> => {
  const { blogId } = req.params;
  const userId = req.userId;

  if (!blogId || !userId) {
    res.status(400).json({
      code: 'BadRequest',
      message: 'blogId and userId are required',
      success: false,
    });
    return;
  }

  try {
    // Check if blog exists
    const blog = await blogModel.findById(blogId).select('likesCount').exec();

    if (!blog) {
      res.status(404).json({
        code: 'NotFound',
        message: 'Blog not found',
        success: false,
      });
      return;
    }

    // Check if user already liked
    const existingLike = await LikeModel.findOne({
      blogId: blog._id,
      userId,
    })
      .lean()
      .exec();

    if (existingLike) {
      res.status(400).json({
        code: 'BadRequest',
        message: 'You already liked this blog',
        success: false,
      });
      return;
    }

    // Create like record
    await LikeModel.create({
      blogId: blog._id,
      userId,
    });

    // Update blog's like count
    await blogModel.findByIdAndUpdate(
      blogId,
      { $inc: { likesCount: 1 } },
      { new: true },
    );

    logger.info('Blog Liked', { userId, blogId });

    res.status(200).json({
      code: 'Success',
      message: 'Blog liked successfully',
      success: true,
      likesCount: blog.likesCount + 1,
    });
  } catch (error) {
    logger.error('Error liking blog:', error);
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      success: false,
    });
  }
};

export default likeBlogs;
