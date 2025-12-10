// imports
import type { Response, Request } from 'express';
import blogModel from '@/models/blog';
import userModel from '@/models/user';
import commentModel from '@/models/comment';
import { logger } from '@/utils/winston';

const Delete_comment = async (req: Request, res: Response): Promise<void> => {
  const { blogId, commentId } = req.params;
  const userId = req.userId;

  if (!blogId || !userId || !commentId) {
    res.status(400).json({
      code: 'BadRequest',
      message: 'blogId, userId and commentId are required',
      success: false,
    });
    return;
  }

  try {
    // blog check
    const blog = await blogModel.findById(blogId).select('_id commentsCounts');
    if (!blog) {
      res.status(404).json({
        code: 'NotFound',
        message: 'Blog not found',
        success: false,
      });
      return;
    }

    // user check
    const user = await userModel.findById(userId).select('role').lean();
    if (!user) {
      res.status(404).json({
        code: 'NotFound',
        message: 'User not found',
        success: false,
      });
      return;
    }

    // comment check
    const comment = await commentModel
      .findById(commentId)
      .select('userId blogId');

    if (!comment) {
      res.status(404).json({
        code: 'NotFound',
        message: 'Comment not found',
        success: false,
      });
      return;
    }

    // validate comment belongs to this blog
    if (comment.blogId.toString() !== blogId.toString()) {
      res.status(403).json({
        code: 'Forbidden',
        message: 'Comment does not belong to this blog',
        success: false,
      });
      return;
    }

    // permissions → owner or admin
    const isOwner = comment.userId.toString() === userId.toString();
    const isAdmin = user.role === 'admin';

    if (!isOwner && !isAdmin) {
      res.status(403).json({
        code: 'Forbidden',
        message: 'Not allowed to delete this comment',
        success: false,
      });
      return;
    }

    // delete comment
    await commentModel.findByIdAndDelete(commentId);

    blog.commentsCounts = Math.max(0, blog.commentsCounts - 1);
    await blog.save();

    logger.info('Comment deleted', { userId, blogId });

    res.status(200).json({
      code: 'Success',
      message: 'Comment deleted successfully',
      success: true,
      commentsCounts: blog.commentsCounts,
    });
  } catch (error) {
    logger.error('Error deleting comment:', error);
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      success: false,
    });
  }
};

export default Delete_comment;

/**
 *
 *
 * completed the project which is production redy useing typescript i will win
 *
 *
 *
 */
