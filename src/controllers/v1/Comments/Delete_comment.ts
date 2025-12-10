// types
import type { Response, Request } from 'express';
import blogModel, { Iblog } from '@/models/blog';
import userModel from '@/models/user';
import commentModel, { Icomment } from '@/models/comment';
// custom modules
import { logger } from '@/utils/winston';

const Delete_comment = async (req: Request, res: Response): Promise<void> => {
  const { blogId } = req.params;
  const userId = req.userId;
  const { commetId } = req.params;

  if (!blogId || !userId) {
    res.status(400).json({
      code: 'BadRequest',
      message: 'blogId and userId are required',
      success: false,
    });
    return;
  }
  try {
    const blog = await blogModel
      .findById(blogId)
      .select('_id commentsCounts')
      .exec();
    if (!blog) {
      res.status(404).json({
        code: 'NotFound',
        message: 'Blog not found',
        success: false,
      });
      return;
    }
    const user = await userModel.findById(userId).select('role').lean().exec();
    if (!user) {
      res.status(404).json({
        code: 'NOT FOUND',
        message:
          'THE USER UR SEACRCHN DOS NOT EXIST BRO BE A GOOD BOY AND SEND CORRECT ID"s ',
        success: false,
      });
      return;
    }

    const comment = await commentModel
      .findById(commetId)
      .select('userId blogId')
      .exec();

    if (blogId.toString() !== comment?.blogId.toString()) {
      return;
    }
    if (userId.toString() !== comment?.userId.toString()) {
      return;
    }

    await commentModel.findByIdAndDelete(commetId);
    blog.commentsCounts--;
    blog.save();

    logger.info('Blog comment added', { userId, blogId });
    res.status(200).json({
      code: 'Success',
      message: 'comment added successfully',
      success: true,
      commentsCounts: blog.commentsCounts + 1,
    });
  } catch (error) {
    logger.error('Error commet on blog  blog:', error);
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      success: false,
    });
  }
};

export default Delete_comment;
