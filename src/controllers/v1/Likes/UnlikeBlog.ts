// types
import type { Response, Request } from 'express';
import blogModel, { Iblog } from '@/models/blog';

// custom modules
import { logger } from '@/utils/winston';

// model LikeModel
import LikeModel from '@/models/Likes';

const unlikeBLog = async (req: Request, res: Response): Promise<void> => {
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
    const blogExists = await blogModel.findById(blogId);
    if (!blogExists) {
      res.status(404).json({
        code: 'NotFound',
        message: 'Blog not found',
        success: false,
      });
      return;
    }

    // Find the existing like
    const existingLike = await LikeModel.findOne({
      userId,
      blogId,
    })
      .lean()
      .exec();

    if (!existingLike) {
      res.status(404).json({
        code: 'NotFound',
        message: 'Like Not Found',
        success: false,
      });
      return;
    }

    // Delete the like and update blog likes count in a transaction
    const session = await LikeModel.startSession();
    await session.withTransaction(async () => {
      // Delete the like
      await LikeModel.deleteOne({ _id: existingLike._id }).session(session);

      // Update blog likes count (decrement by 1)
      await blogModel.findByIdAndUpdate(
        blogId,
        { $inc: { likesCount: -1 } },
        { session, new: true },
      );
    });
    session.endSession();

    // Get updated blog to get the current likes count
    const updatedBlog = await blogModel.findById(blogId).lean();

    res.status(200).json({
      code: 'Success',
      message: 'Blog unliked successfully',
      success: true,
      likesCount: updatedBlog?.likesCount || 0,
    });
  } catch (error) {
    logger.error('Error unliking blog:', error);
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      success: false,
    });
  }
};

export default unlikeBLog;
